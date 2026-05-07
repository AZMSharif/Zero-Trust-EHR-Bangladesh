// ─────────────────────────────────────────────
// OTP Controller — Consent-First Access Control
// ─────────────────────────────────────────────
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../prisma/client");

async function requestOtp(req, res) {
  try {
    const { patient_urn } = req.body;
    const doctor_bmdc = req.user.id;
    if (!patient_urn) return res.status(400).json({ error: "patient_urn is required" });

    const patient = await prisma.patient.findUnique({
      where: { patient_urn },
      select: { patient_urn: true, full_name: true, mobile_number: true },
    });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otp_hash = await bcrypt.hash(otp, 10);

    await prisma.otpSession.create({
      data: {
        patient_urn, doctor_bmdc, otp_hash,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await prisma.accessLog.create({
      data: { patient_urn, doctor_bmdc, event: "OTP_REQUESTED", ip_address: req.ip },
    });

    console.log(`📱 OTP for ${patient_urn}: ${otp}`);

    res.json({
      message: "OTP sent to patient's mobile",
      patient_name: patient.full_name,
      mobile_masked: patient.mobile_number.replace(/.(?=.{4})/g, "*"),
      demo_otp: otp, // Always return OTP for MVP demonstration
    });
  } catch (err) {
    console.error("OTP request error:", err);
    res.status(500).json({ error: "Failed to generate OTP" });
  }
}

async function verifyOtp(req, res) {
  try {
    const { patient_urn, otp } = req.body;
    const doctor_bmdc = req.user.id;
    if (!patient_urn || !otp) return res.status(400).json({ error: "patient_urn and otp required" });

    const sessions = await prisma.otpSession.findMany({
      where: { patient_urn, doctor_bmdc, is_used: false, expires_at: { gt: new Date() } },
      orderBy: { created_at: "desc" },
      take: 1,
    });

    if (!sessions.length) {
      await prisma.accessLog.create({ data: { patient_urn, doctor_bmdc, event: "OTP_EXPIRED", ip_address: req.ip } });
      return res.status(400).json({ error: "No valid OTP found" });
    }

    const session = sessions[0];
    const valid = await bcrypt.compare(otp, session.otp_hash);
    if (!valid) {
      await prisma.accessLog.create({ data: { patient_urn, doctor_bmdc, event: "OTP_FAILED", ip_address: req.ip } });
      return res.status(401).json({ error: "Invalid OTP" });
    }

    await prisma.otpSession.update({ where: { id: session.id }, data: { is_used: true } });

    const grant = await prisma.accessGrant.upsert({
      where: { patient_urn_doctor_bmdc: { patient_urn, doctor_bmdc } },
      update: { granted_at: new Date(), expires_at: new Date(Date.now() + 2 * 3600000), is_revoked: false },
      create: { patient_urn, doctor_bmdc, expires_at: new Date(Date.now() + 2 * 3600000) },
    });

    await prisma.accessLog.create({ data: { patient_urn, doctor_bmdc, event: "OTP_VERIFIED", ip_address: req.ip } });

    res.json({ message: "Access granted", grant: { patient_urn: grant.patient_urn, expires_at: grant.expires_at } });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
}

module.exports = { requestOtp, verifyOtp };
