require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Judges Demo Data...\n");
  const hash = (pw) => bcrypt.hashSync(pw, 12);

  // ── PERFECT DOCTOR ──
  const doc = await prisma.doctor.upsert({
    where: { bmdc_number: "A-99999" },
    update: {},
    create: {
      bmdc_number: "A-99999",
      password_hash: hash("doctor123"),
      full_name: "Prof. Dr. Rubina Yasmin",
      specialty: "Senior Consultant, Obstetrics & Gynecology",
    },
  });
  console.log("✅ Doctor created:", doc.full_name, "| BMDC:", doc.bmdc_number);

  // ── PROPER FEMALE PATIENT ──
  const pat = await prisma.patient.upsert({
    where: { nid_or_birth_cert: "1995567890123" },
    update: {},
    create: {
      nid_or_birth_cert: "1995567890123",
      mobile_number: "+8801722222004",
      password_hash: hash("patient123"),
      full_name: "Nusrat Jahan Fariha",
      dob: new Date("1995-10-15"),
      blood_group: "O_POS",
      profile_image_url: "https://ui-avatars.com/api/?name=Nusrat+Jahan+Fariha&background=random&color=fff&size=200"
    },
  });

  await prisma.patientMedicalSnapshot.upsert({
    where: { patient_urn: pat.patient_urn },
    update: {},
    create: {
      patient_urn: pat.patient_urn,
      has_anemia: true,
      has_asthma: false,
      has_tuberculosis: false,
      has_hiv: false,
      has_jaundice: false,
      has_diabetes: false,
      smoking_status: "NEVER",
      alcohol_status: "NEVER",
      chews_betel_leaf: "NEVER",
      uses_cannabis: "NEVER",
      chronic_diseases: ["PCOS (Polycystic Ovary Syndrome)"],
      genetic_diseases: [],
      major_surgeries: ["Appendectomy (2015)"],
      drug_history: [],
      allergies: ["Penicillin"],
      last_updated_by: doc.bmdc_number,
    },
  });

  // Immunizations
  await prisma.immunization.createMany({
    data: [
      { patient_urn: pat.patient_urn, vaccine_name: "TT (Tetanus Toxoid)", dose_number: 1, date_administered: new Date("2020-01-15"), status: "COMPLETED" },
      { patient_urn: pat.patient_urn, vaccine_name: "TT (Tetanus Toxoid)", dose_number: 2, date_administered: new Date("2020-02-15"), status: "COMPLETED" },
      { patient_urn: pat.patient_urn, vaccine_name: "COVID-19 (AstraZeneca)", dose_number: 2, date_administered: new Date("2021-08-20"), status: "COMPLETED" },
      { patient_urn: pat.patient_urn, vaccine_name: "HPV Vaccine", dose_number: 1, date_administered: new Date("2024-05-10"), status: "COMPLETED" },
    ],
    skipDuplicates: true,
  });

  // Add Impressive Prescriptions (Cases)
  // Check if prescriptions already exist for this patient to prevent duplication on multiple runs
  const existingRx = await prisma.prescription.findFirst({
    where: { patient_urn: pat.patient_urn }
  });

  if (!existingRx) {
    // Case 1: Initial Presentation (PCOS)
    await prisma.prescription.create({
      data: {
        patient_urn: pat.patient_urn,
        doctor_bmdc: doc.bmdc_number,
        medications_json: [
          { name: "Metformin", dose: "500mg", frequency: "BD", duration: "3 months", notes: "After meals" },
          { name: "Folic Acid", dose: "5mg", frequency: "OD", duration: "3 months", notes: "Continue daily" },
          { name: "Iron Polymaltose", dose: "1 tab", frequency: "OD", duration: "1 month", notes: "For anemia, take after lunch" },
        ],
        diagnosis: "Polycystic Ovary Syndrome (PCOS) with Mild Iron Deficiency Anemia",
        clinical_notes: "Patient came with complaints of irregular menstrual cycles and slight weight gain over the last 6 months. Complains of generalized weakness. Ultrasound shows bulky ovaries with multiple small follicles. CBC indicates Hb: 10.2 g/dL. Advised weight reduction and lifestyle modifications. Prescribed Metformin to improve insulin sensitivity and Iron supplements for anemia.",
        follow_up_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        date_issued: new Date("2024-01-10"),
      },
    });

    // Case 2: Acute condition
    await prisma.prescription.create({
      data: {
        patient_urn: pat.patient_urn,
        doctor_bmdc: doc.bmdc_number,
        medications_json: [
          { name: "Cefuroxime", dose: "500mg", frequency: "BD", duration: "7 days", notes: "After meals" },
          { name: "Flavoxate HCl", dose: "200mg", frequency: "TID", duration: "5 days", notes: "Take for bladder spasms" },
          { name: "Paracetamol", dose: "500mg", frequency: "SOS", duration: "As needed", notes: "If fever > 100 F" },
        ],
        diagnosis: "Acute Urinary Tract Infection (UTI)",
        clinical_notes: "Patient reported dysuria, increased frequency of urination, and lower abdominal pain for 2 days. No history of flank pain. Urine R/E shows 15-20 pus cells/HPF. Advised to drink plenty of water and maintain hygiene. Prescribed antibiotics and antispasmodics.",
        date_issued: new Date("2024-10-05"),
      },
    });
  }

  console.log("✅ Patient created:", pat.full_name, "| URN:", pat.patient_urn);
  console.log("\n🎉 Judges Demo Seed complete!");
  console.log("\n── Demo Login Credentials ──");
  console.log(`Doctor:  BMDC ${doc.bmdc_number} | Password: doctor123`);
  console.log(`Patient: URN ${pat.patient_urn} | Password: patient123 | Mobile: ${pat.mobile_number}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
