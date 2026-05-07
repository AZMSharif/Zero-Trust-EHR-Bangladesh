// ─────────────────────────────────────────────
// Auth Controller
// Doctor login (BMDC + password)
// Patient registration (NID/Birth Cert) & login
// ─────────────────────────────────────────────
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const { signToken } = require("../middleware/auth");

// ── Doctor Login ──
async function doctorLogin(req, res) {
  try {
    const { bmdc_number, password } = req.body;

    if (!bmdc_number || !password) {
      return res.status(400).json({ error: "BMDC number and password are required" });
    }

    const doctor = await prisma.doctor.findUnique({ where: { bmdc_number } });
    if (!doctor) {
      return res.status(401).json({ error: "Invalid BMDC number or password" });
    }

    const valid = await bcrypt.compare(password, doctor.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid BMDC number or password" });
    }

    const token = signToken({ id: doctor.bmdc_number, role: "doctor", name: doctor.full_name });

    res.json({
      token,
      doctor: {
        bmdc_number: doctor.bmdc_number,
        full_name: doctor.full_name,
        specialty: doctor.specialty,
      },
    });
  } catch (err) {
    console.error("Doctor login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
}

// ── Patient Registration ──
async function patientRegister(req, res) {
  try {
    const { nid_or_birth_cert, mobile_number, password, full_name, dob, blood_group } = req.body;

    if (!nid_or_birth_cert || !mobile_number || !password || !full_name || !dob || !blood_group) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for existing patient
    const existing = await prisma.patient.findUnique({ where: { nid_or_birth_cert } });
    if (existing) {
      return res.status(409).json({ error: "Patient with this NID/Birth Certificate already exists" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    // Create patient + empty medical snapshot in a transaction
    const patient = await prisma.$transaction(async (tx) => {
      const p = await tx.patient.create({
        data: {
          nid_or_birth_cert,
          mobile_number,
          password_hash,
          full_name,
          dob: new Date(dob),
          blood_group,
        },
      });

      // Auto-create empty medical snapshot
      await tx.patientMedicalSnapshot.create({
        data: { patient_urn: p.patient_urn },
      });

      return p;
    });

    const token = signToken({ id: patient.patient_urn, role: "patient", name: patient.full_name });

    res.status(201).json({
      token,
      patient: {
        patient_urn: patient.patient_urn,
        full_name: patient.full_name,
        blood_group: patient.blood_group,
      },
    });
  } catch (err) {
    console.error("Patient registration error:", err);
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Mobile number or NID already registered" });
    }
    res.status(500).json({ error: "Registration failed" });
  }
}

// ── Patient Login ──
async function patientLogin(req, res) {
  try {
    const { patient_urn, password } = req.body;

    if (!patient_urn || !password) {
      return res.status(400).json({ error: "Patient URN and password are required" });
    }

    const patient = await prisma.patient.findUnique({ where: { patient_urn } });
    if (!patient) {
      return res.status(401).json({ error: "Invalid URN or password" });
    }

    const valid = await bcrypt.compare(password, patient.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid URN or password" });
    }

    const token = signToken({ id: patient.patient_urn, role: "patient", name: patient.full_name });

    res.json({
      token,
      patient: {
        patient_urn: patient.patient_urn,
        full_name: patient.full_name,
        blood_group: patient.blood_group,
      },
    });
  } catch (err) {
    console.error("Patient login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
}

module.exports = { doctorLogin, patientRegister, patientLogin };
