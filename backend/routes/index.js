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

module.exports = router;
