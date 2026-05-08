// ─────────────────────────────────────────────
// Database Seed Script
// Seeds doctors and patients with real demo data
// Run: node prisma/seed.js
// ─────────────────────────────────────────────
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  const hash = (pw) => bcrypt.hashSync(pw, 12);

  // ── DOCTORS ──
  const doctor1 = await prisma.doctor.upsert({
    where: { bmdc_number: "A-56789" },
    update: {},
    create: {
      bmdc_number: "A-56789",
      password_hash: hash("doctor123"),
      full_name: "Dr. Farhan Ahmed",
      specialty: "General Practice",
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { bmdc_number: "A-12345" },
    update: {},
    create: {
      bmdc_number: "A-12345",
      password_hash: hash("doctor123"),
      full_name: "Dr. Nusrat Jahan",
      specialty: "Dermatology",
    },
  });

  console.log("✅ Doctors created:", doctor1.full_name, "|", doctor2.full_name);

  // ── PATIENT 1: Abdullah ibne Tayeb Tamur ──
  const p1 = await prisma.patient.upsert({
    where: { nid_or_birth_cert: "2000567890123" },
    update: {},
    create: {
      nid_or_birth_cert: "2000567890123",
      mobile_number: "+8801711111001",
      password_hash: hash("patient123"),
      full_name: "Abdullah ibne Tayeb Tamur",
      dob: new Date("2000-03-10"),
      blood_group: "B_POS",
    },
  });

  await prisma.patientMedicalSnapshot.upsert({
    where: { patient_urn: p1.patient_urn },
    update: {},
    create: {
      patient_urn: p1.patient_urn,
      has_asthma: false,
      has_tuberculosis: false,
      has_hiv: false,
      has_jaundice: false,
      has_anemia: false,
      has_diabetes: false,
      smoking_status: "NEVER",
      alcohol_status: "NEVER",
      chews_betel_leaf: "NEVER",
      uses_cannabis: "NEVER",
      chronic_diseases: ["Dry Skin / Eczema"],
      genetic_diseases: [],
      major_surgeries: [],
      drug_history: [],
      allergies: [],
      last_updated_by: "A-12345",
    },
  });

  // Immunizations for Patient 1
  await prisma.immunization.createMany({
    data: [
      { patient_urn: p1.patient_urn, vaccine_name: "BCG", dose_number: 1, date_administered: new Date("2000-03-15"), status: "COMPLETED" },
      { patient_urn: p1.patient_urn, vaccine_name: "COVID-19 (Moderna)", dose_number: 2, date_administered: new Date("2022-08-20"), status: "COMPLETED" },
      { patient_urn: p1.patient_urn, vaccine_name: "Hepatitis B", dose_number: 3, date_administered: new Date("2000-09-10"), status: "COMPLETED" },
      { patient_urn: p1.patient_urn, vaccine_name: "Td Booster", dose_number: 1, date_administered: null, status: "PENDING" },
    ],
    skipDuplicates: true,
  });

  // Prescriptions for Patient 1
  const p1RxExists = await prisma.prescription.findFirst({ where: { patient_urn: p1.patient_urn } });
  if (!p1RxExists) {
    await prisma.prescription.create({
      data: {
        patient_urn: p1.patient_urn,
        doctor_bmdc: "A-12345",
        medications_json: [
          { name: "Cetirizine", dose: "10mg", frequency: "OD", duration: "14 days", notes: "At bedtime" },
          { name: "Mometasone Cream", dose: "0.1%", frequency: "BD", duration: "7 days", notes: "Apply on affected areas" },
        ],
        diagnosis: "Atopic Dermatitis (Eczema) — Acute Flare",
        clinical_notes: "Patient presented with itchy, erythematous patches on forearms and neck. History of dry skin since childhood. Advised to use emollients regularly and avoid harsh soaps.",
        follow_up_date: new Date(new Date().setDate(new Date().getDate() + 14)),
        date_issued: new Date("2024-11-20"),
      },
    });
  }

  console.log("✅ Patient 1:", p1.full_name, "| URN:", p1.patient_urn);

  // ── PATIENT 2: Mizanul Haque ──
  const p2 = await prisma.patient.upsert({
    where: { nid_or_birth_cert: "2000678901234" },
    update: {},
    create: {
      nid_or_birth_cert: "2000678901234",
      mobile_number: "+8801711111002",
      password_hash: hash("patient123"),
      full_name: "Mizanul Haque",
      dob: new Date("2000-07-22"),
      blood_group: "A_POS",
    },
  });

  await prisma.patientMedicalSnapshot.upsert({
    where: { patient_urn: p2.patient_urn },
    update: {},
    create: {
      patient_urn: p2.patient_urn,
      has_asthma: false,
      has_tuberculosis: false,
      has_hiv: false,
      has_jaundice: false,
      has_anemia: false,
      has_diabetes: false,
      smoking_status: "NEVER",
      alcohol_status: "NEVER",
      chews_betel_leaf: "NEVER",
      uses_cannabis: "NEVER",
      chronic_diseases: [],
      genetic_diseases: [],
      major_surgeries: [],
      drug_history: [],
      allergies: [],
    },
  });

  await prisma.immunization.createMany({
    data: [
      { patient_urn: p2.patient_urn, vaccine_name: "BCG", dose_number: 1, date_administered: new Date("2000-07-28"), status: "COMPLETED" },
      { patient_urn: p2.patient_urn, vaccine_name: "COVID-19 (Pfizer)", dose_number: 2, date_administered: new Date("2022-06-15"), status: "COMPLETED" },
      { patient_urn: p2.patient_urn, vaccine_name: "Hepatitis B", dose_number: 3, date_administered: null, status: "PENDING" },
    ],
    skipDuplicates: true,
  });

  // Prescriptions for Patient 2
  const p2RxExists = await prisma.prescription.findFirst({ where: { patient_urn: p2.patient_urn } });
  if (!p2RxExists) {
    await prisma.prescription.create({
      data: {
        patient_urn: p2.patient_urn,
        doctor_bmdc: "A-56789",
        medications_json: [
          { name: "Amoxicillin", dose: "500mg", frequency: "TID", duration: "5 days", notes: "After meals" },
          { name: "Dextromethorphan Syrup", dose: "10ml", frequency: "TID", duration: "5 days", notes: "If cough persists" },
        ],
        diagnosis: "Acute Upper Respiratory Tract Infection",
        clinical_notes: "Patient complains of sore throat, dry cough, and mild fever for 2 days. No chest findings on auscultation. Advised warm fluids and rest.",
        date_issued: new Date("2025-02-10"),
      },
    });
  }

  console.log("✅ Patient 2:", p2.full_name, "| URN:", p2.patient_urn);

  // ── PATIENT 3: Abu Zahed Mohammed Sharif ──
  const p3 = await prisma.patient.upsert({
    where: { nid_or_birth_cert: "2001789012345" },
    update: {},
    create: {
      nid_or_birth_cert: "2001789012345",
      mobile_number: "+8801711111003",
      password_hash: hash("patient123"),
      full_name: "Abu Zahed Mohammed Sharif",
      dob: new Date("2001-05-14"),
      blood_group: "O_POS",
    },
  });

  await prisma.patientMedicalSnapshot.upsert({
    where: { patient_urn: p3.patient_urn },
    update: {},
    create: {
      patient_urn: p3.patient_urn,
      has_asthma: false,
      has_tuberculosis: false,
      has_hiv: false,
      has_jaundice: false,
      has_anemia: false,
      has_diabetes: false,
      smoking_status: "NEVER",
      alcohol_status: "NEVER",
      chews_betel_leaf: "NEVER",
      uses_cannabis: "NEVER",
      chronic_diseases: [],
      genetic_diseases: [],
      major_surgeries: [],
      drug_history: [],
      allergies: [],
    },
  });

  await prisma.immunization.createMany({
    data: [
      { patient_urn: p3.patient_urn, vaccine_name: "BCG", dose_number: 1, date_administered: new Date("2001-05-20"), status: "COMPLETED" },
      { patient_urn: p3.patient_urn, vaccine_name: "COVID-19 (Sinopharm)", dose_number: 2, date_administered: new Date("2022-04-10"), status: "COMPLETED" },
      { patient_urn: p3.patient_urn, vaccine_name: "Td Booster", dose_number: 1, date_administered: null, status: "OVERDUE" },
    ],
    skipDuplicates: true,
  });

  // Add a sample prescription for Patient 3 from Doctor 1
  await prisma.prescription.create({
    data: {
      patient_urn: p3.patient_urn,
      doctor_bmdc: "A-56789",
      medications_json: [
        { name: "Paracetamol", dose: "500mg", frequency: "TID", duration: "5 days", notes: "After meals" },
        { name: "Vitamin D3", dose: "2000IU", frequency: "OD", duration: "30 days", notes: "" },
      ],
      diagnosis: "Seasonal Flu + Vitamin D Deficiency",
      clinical_notes: "Patient presented with fever and body aches for 3 days. Vitamin D level low.",
    },
  });

  console.log("✅ Patient 3:", p3.full_name, "| URN:", p3.patient_urn);

  console.log("\n🎉 Seed complete!");
  console.log("\n── Login Credentials ──");
  console.log("Doctors:  BMDC A-56789 / A-12345  |  Password: doctor123");
  console.log("Patients: Use URN printed above    |  Password: patient123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
