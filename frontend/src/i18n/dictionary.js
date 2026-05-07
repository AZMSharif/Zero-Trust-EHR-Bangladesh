// ─────────────────────────────────────────────
// Bilingual Dictionary — English / বাংলা
// Complete i18n for all EHR UI strings
// ─────────────────────────────────────────────

const dictionary = {
  // ── Navigation & General ──
  appName:            { en: "Zero-Trust EHR",            bn: "জিরো-ট্রাস্ট ই-এইচ-আর" },
  doctorPortal:       { en: "Doctor Portal",              bn: "ডাক্তার পোর্টাল" },
  patientPortal:      { en: "Patient Portal",             bn: "রোগী পোর্টাল" },
  dashboard:          { en: "Dashboard",                  bn: "ড্যাশবোর্ড" },
  logout:             { en: "Logout",                     bn: "লগ আউট" },
  language:           { en: "বাংলা",                      bn: "English" },
  loading:            { en: "Loading...",                  bn: "লোড হচ্ছে..." },
  save:               { en: "Save",                       bn: "সংরক্ষণ" },
  cancel:             { en: "Cancel",                     bn: "বাতিল" },
  submit:             { en: "Submit",                     bn: "জমা দিন" },
  accessExpires:      { en: "Access expires at",          bn: "অ্যাক্সেস মেয়াদ শেষ" },

  // ── Patient Info ──
  patientSnapshot:    { en: "Patient Snapshot",           bn: "রোগীর সারসংক্ষেপ" },
  demographics:       { en: "Demographics",               bn: "জনসংখ্যাতত্ত্ব" },
  fullName:           { en: "Full Name",                  bn: "পূর্ণ নাম" },
  dateOfBirth:        { en: "Date of Birth",              bn: "জন্ম তারিখ" },
  bloodGroup:         { en: "Blood Group",                bn: "রক্তের গ্রুপ" },
  mobileNumber:       { en: "Mobile",                     bn: "মোবাইল" },
  nidBirthCert:       { en: "NID / Birth Certificate",    bn: "এনআইডি / জন্ম সনদ" },
  patientURN:         { en: "Patient URN",                bn: "রোগীর ইউআরএন" },
  age:                { en: "Age",                        bn: "বয়স" },
  years:              { en: "years",                      bn: "বছর" },

  // ── Medical Conditions ──
  medicalConditions:  { en: "Medical Conditions",         bn: "চিকিৎসা অবস্থা" },
  asthma:             { en: "Asthma",                     bn: "হাঁপানি" },
  tuberculosis:       { en: "Tuberculosis (TB)",          bn: "যক্ষ্মা (টিবি)" },
  hiv:                { en: "HIV",                        bn: "এইচআইভি" },
  jaundice:           { en: "Jaundice / Hepatitis",       bn: "জন্ডিস / হেপাটাইটিস" },
  anemia:             { en: "Anemia",                     bn: "রক্তশূন্যতা" },
  diabetes:           { en: "Diabetes",                   bn: "ডায়াবেটিস" },
  active:             { en: "Active",                     bn: "সক্রিয়" },
  inactive:           { en: "Inactive",                   bn: "নিষ্ক্রিয়" },

  // ── Lifestyle ──
  lifestyle:          { en: "Lifestyle",                  bn: "জীবনযাত্রা" },
  smoking:            { en: "Smoking",                    bn: "ধূমপান" },
  alcohol:            { en: "Alcohol",                    bn: "মদ্যপান" },
  betelLeaf:          { en: "Betel Leaf / Jarda",         bn: "পান / জর্দা" },
  cannabis:           { en: "Cannabis",                   bn: "গাঁজা" },
  statusNever:        { en: "Never",                      bn: "কখনো না" },
  statusFormer:       { en: "Former",                     bn: "পূর্বে" },
  statusCurrent:      { en: "Current",                    bn: "বর্তমানে" },

  // ── Clinical History ──
  clinicalHistory:    { en: "Clinical History",           bn: "ক্লিনিক্যাল ইতিহাস" },
  chronicDiseases:    { en: "Chronic Diseases",           bn: "দীর্ঘস্থায়ী রোগ" },
  geneticDiseases:    { en: "Genetic Diseases",           bn: "বংশগত রোগ" },
  majorSurgeries:     { en: "Major Surgeries",            bn: "প্রধান সার্জারি" },
  drugHistory:        { en: "Drug History",               bn: "ওষুধের ইতিহাস" },
  allergies:          { en: "Allergies",                  bn: "অ্যালার্জি" },
  noRecords:          { en: "No records",                 bn: "কোনো তথ্য নেই" },

  // ── Immunizations ──
  immunizations:      { en: "Immunizations",              bn: "টিকাদান" },
  vaccine:            { en: "Vaccine",                    bn: "টিকা" },
  dose:               { en: "Dose",                       bn: "ডোজ" },
  dateAdministered:   { en: "Date",                       bn: "তারিখ" },
  status:             { en: "Status",                     bn: "অবস্থা" },
  completed:          { en: "Completed",                  bn: "সম্পন্ন" },
  pending:            { en: "Pending",                    bn: "বাকি আছে" },
  overdue:            { en: "Overdue",                    bn: "বিলম্বিত" },

  // ── Test Reports ──
  recentReports:      { en: "Recent Test Reports",        bn: "সাম্প্রতিক পরীক্ষার রিপোর্ট" },
  uploadedAt:         { en: "Uploaded",                   bn: "আপলোডের তারিখ" },
  download:           { en: "Download",                   bn: "ডাউনলোড" },
  noReports:          { en: "No reports uploaded",        bn: "কোনো রিপোর্ট আপলোড হয়নি" },

  // ── Prescriptions ──
  prescriptions:      { en: "Prescriptions",              bn: "প্রেসক্রিপশন" },
  prescribedBy:       { en: "Prescribed by",              bn: "লিখেছেন" },
  dateIssued:         { en: "Date Issued",                bn: "তারিখ" },

  // ── AI Scribe ──
  aiScribe:           { en: "AI Clinical Scribe",         bn: "এআই ক্লিনিক্যাল স্ক্রাইব" },
  aiScribeDesc:       { en: "Type clinical notes in natural language. AI will parse and update the medical record automatically.", bn: "প্রাকৃতিক ভাষায় ক্লিনিক্যাল নোট লিখুন। এআই স্বয়ংক্রিয়ভাবে মেডিক্যাল রেকর্ড আপডেট করবে।" },
  aiPlaceholder:      { en: "e.g., Patient quit smoking, has peanut allergy, added amlodipine 5mg...", bn: "যেমন: রোগী ধূমপান ছেড়েছে, বাদাম এলার্জি আছে, অ্যামলোডিপিন ৫মিগ্রা যোগ করা হয়েছে..." },
  analyze:            { en: "🧠 Analyze & Update",        bn: "🧠 বিশ্লেষণ ও আপডেট" },
  analyzing:          { en: "AI is analyzing...",         bn: "এআই বিশ্লেষণ করছে..." },
  aiSuccess:          { en: "Record updated successfully", bn: "রেকর্ড সফলভাবে আপডেট হয়েছে" },
  fieldsUpdated:      { en: "Fields updated",             bn: "আপডেটকৃত ক্ষেত্র" },

  // ── Alerts ──
  alertAllergy:       { en: "⚠️ ALLERGY ALERT",           bn: "⚠️ অ্যালার্জি সতর্কতা" },
  alertHIV:           { en: "🔴 HIV POSITIVE",             bn: "🔴 এইচআইভি পজিটিভ" },
  alertTB:            { en: "🟠 ACTIVE TUBERCULOSIS",      bn: "🟠 সক্রিয় যক্ষ্মা" },
  alertSevere:        { en: "Critical conditions detected", bn: "গুরুতর অবস্থা সনাক্ত হয়েছে" },

  // ── Blood Groups ──
  A_POS: { en: "A+", bn: "এ+" }, A_NEG: { en: "A-", bn: "এ-" },
  B_POS: { en: "B+", bn: "বি+" }, B_NEG: { en: "B-", bn: "বি-" },
  AB_POS: { en: "AB+", bn: "এবি+" }, AB_NEG: { en: "AB-", bn: "এবি-" },
  O_POS: { en: "O+", bn: "ও+" }, O_NEG: { en: "O-", bn: "ও-" },

  // ── Report Types ──
  BLOOD_CBC:          { en: "Blood CBC",                  bn: "রক্ত সিবিসি" },
  BLOOD_BIOCHEMISTRY: { en: "Biochemistry",               bn: "বায়োকেমিস্ট্রি" },
  URINE_ROUTINE:      { en: "Urine Routine",              bn: "ইউরিন রুটিন" },
  STOOL_ROUTINE:      { en: "Stool Routine",              bn: "স্টুল রুটিন" },
  XRAY:               { en: "X-Ray",                      bn: "এক্স-রে" },
  ECG:                { en: "ECG",                        bn: "ইসিজি" },
  ULTRASOUND:         { en: "Ultrasound",                 bn: "আল্ট্রাসাউন্ড" },
  CT_SCAN:            { en: "CT Scan",                    bn: "সিটি স্ক্যান" },
  MRI:                { en: "MRI",                        bn: "এমআরআই" },
  PATHOLOGY:          { en: "Pathology",                  bn: "প্যাথলজি" },
  MICROBIOLOGY:       { en: "Microbiology",               bn: "মাইক্রোবায়োলজি" },
  OTHER:              { en: "Other",                      bn: "অন্যান্য" },
};

export default dictionary;
