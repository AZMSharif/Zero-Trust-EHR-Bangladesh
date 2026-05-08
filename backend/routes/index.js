// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { authenticate, doctorOnly, patientOnly, verifyAccessGrant } = require("../middleware/auth");
const { doctorLogin, patientRegister, patientLogin } = require("../controllers/auth.controller");
const { requestOtp, verifyOtp } = require("../controllers/otp.controller");
const { analyzeClinicalNote } = require("../controllers/ai-scribe.controller");
const prisma = require("../prisma/client");

// ── Auth Routes ──
router.post("/auth/doctor/login", doctorLogin);
router.post("/auth/patient/register", patientRegister);
router.post("/auth/patient/login", patientLogin);

// ── OTP Routes (Doctor only) ──
router.post("/otp/request", authenticate, doctorOnly, requestOtp);
router.post("/otp/verify", authenticate, doctorOnly, verifyOtp);

// ── AI Scribe (Doctor only + active grant) ──
router.post("/clinical-note/analyze", authenticate, doctorOnly, analyzeClinicalNote);

// ── Patient Data Routes (Doctor with grant) ──
router.get("/patient/:patient_urn/snapshot", authenticate, doctorOnly, verifyAccessGrant, async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_urn: req.params.patient_urn },
      include: {
        medical_snapshot: true,
        immunizations: { orderBy: { created_at: "desc" } },
        test_reports: { orderBy: { uploaded_at: "desc" }, take: 10 },
        prescriptions: { orderBy: { date_issued: "desc" }, take: 5, include: { doctor: { select: { full_name: true, specialty: true } } } },
      },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    await prisma.accessLog.create({
      data: { patient_urn: req.params.patient_urn, doctor_bmdc: req.user.id, event: "RECORD_VIEWED", ip_address: req.ip },
    });

    const { password_hash, ...safe } = patient;
    res.json(safe);
  } catch (err) {
    console.error("Snapshot fetch error:", err);
    res.status(500).json({ error: "Failed to fetch patient data" });
  }
});

// ── Patient's own dashboard (Patient only) ──
router.get("/my/dashboard", authenticate, patientOnly, async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { patient_urn: req.user.id },
      include: {
        medical_snapshot: true,
        immunizations: { orderBy: { created_at: "desc" } },
        test_reports: { orderBy: { uploaded_at: "desc" }, take: 10 },
        prescriptions: { orderBy: { date_issued: "desc" }, take: 5, include: { doctor: { select: { full_name: true, specialty: true } } } },
      },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    const { password_hash, ...safe } = patient;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

// ── Upload Report (Both Patient and Doctor) ──
router.post("/patient/:patient_urn/report", authenticate, async (req, res) => {
  try {
    const { patient_urn } = req.params;
    const { file_name, file_data, report_type, test_date } = req.body;

    if (!file_name || !file_data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Role-based access control
    if (req.user.role === "patient") {
      if (req.user.id !== patient_urn) {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } else if (req.user.role === "doctor") {
      // Check access grant
      const grant = await prisma.accessGrant.findFirst({
        where: {
          patient_urn,
          doctor_bmdc: req.user.id,
          is_revoked: false,
          expires_at: { gt: new Date() },
        },
      });
      if (!grant) {
        return res.status(403).json({ error: "Active access grant required" });
      }
    } else {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    // Calculate approximate size in KB from Base64 string
    const sizeInBytes = Math.ceil((file_data.length * 3) / 4);
    const file_size_kb = Math.round(sizeInBytes / 1024);

    const reportData = {
      patient_urn,
      file_url: file_data,
      file_name,
      report_type: report_type || "OTHER",
      file_size_kb,
    };

    if (test_date) {
      reportData.uploaded_at = new Date(test_date);
    }

    const report = await prisma.testReport.create({
      data: reportData,
    });

    res.json({ message: "Report uploaded successfully", report });
  } catch (error) {
    console.error("Report upload error:", error);
    res.status(500).json({ error: "Failed to upload report" });
  }
});

// DELETE /api/patient/:patient_urn/report/:report_id
// Delete a patient's report
router.delete("/patient/:patient_urn/report/:report_id", authenticate, async (req, res) => {
  try {
    const { patient_urn, report_id } = req.params;

    // Role-based access control
    if (req.user.role === "patient") {
      if (req.user.id !== patient_urn) {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } else if (req.user.role === "doctor") {
      // Check access grant
      const grant = await prisma.accessGrant.findFirst({
        where: {
          patient_urn,
          doctor_bmdc: req.user.id,
          is_revoked: false,
          expires_at: { gt: new Date() },
        },
      });
      if (!grant) {
        return res.status(403).json({ error: "Active access grant required" });
      }
    } else {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    // Verify report exists and belongs to the patient
    const report = await prisma.testReport.findFirst({
      where: {
        id: report_id,
        patient_urn: patient_urn
      }
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    await prisma.testReport.delete({
      where: {
        id: report_id
      }
    });

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Report deletion error:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

module.exports = router;
