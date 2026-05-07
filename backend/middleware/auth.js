// ─────────────────────────────────────────────
// JWT + AccessGrant Middleware
// Validates doctor/patient tokens and enforces
// the 2-hour consent window for doctor access.
// ─────────────────────────────────────────────
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// ── Authenticate any user (Doctor or Patient) ──
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role: 'doctor' | 'patient' }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── Doctor-only middleware ──
function doctorOnly(req, res, next) {
  if (req.user?.role !== "doctor") {
    return res.status(403).json({ error: "Access restricted to doctors" });
  }
  next();
}

// ── Patient-only middleware ──
function patientOnly(req, res, next) {
  if (req.user?.role !== "patient") {
    return res.status(403).json({ error: "Access restricted to patients" });
  }
  next();
}

// ── Verify Active Access Grant (Doctor → Patient) ──
// Checks that the doctor has a valid, non-expired, non-revoked grant
// for the specified patient. Must be called AFTER authenticate + doctorOnly.
async function verifyAccessGrant(req, res, next) {
  const doctor_bmdc = req.user.id;
  const patient_urn = req.params.patient_urn || req.body.patient_urn;

  if (!patient_urn) {
    return res.status(400).json({ error: "patient_urn is required" });
  }

  try {
    const grant = await prisma.accessGrant.findUnique({
      where: {
        patient_urn_doctor_bmdc: { patient_urn, doctor_bmdc },
      },
    });

    if (!grant || grant.is_revoked || new Date() > grant.expires_at) {
      return res.status(403).json({
        error: "No active access grant. Please request OTP from patient.",
        code: "ACCESS_GRANT_EXPIRED",
      });
    }

    req.grant = grant;
    next();
  } catch (err) {
    console.error("AccessGrant check failed:", err);
    return res.status(500).json({ error: "Failed to verify access grant" });
  }
}

// ── Generate JWT ──
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
}

module.exports = {
  authenticate,
  doctorOnly,
  patientOnly,
  verifyAccessGrant,
  signToken,
  JWT_SECRET,
};
