// ─────────────────────────────────────────────
// Bilingual Dictionary — English / বাংলা
// Complete i18n for all EHR UI strings
// ─────────────────────────────────────────────

const dictionary = {
  // ── Brand & Nav ──
  appName:            { en: "MediBridge",            bn: "মেডিব্রিজ" },
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
  backToHome:         { en: "Back to Home",               bn: "হোমে ফিরে যান" },
  backToOtp:          { en: "Back to Consent Gate",       bn: "সম্মতি গেটে ফিরে যান" },
  newPatient:         { en: "New Patient",                bn: "নতুন রোগী" },

  // ── Landing Page ──
  landingSubtitle:    { en: "Consent-First Electronic Health Records for Bangladesh", bn: "বাংলাদেশের জন্য সুরক্ষিত ডিজিটাল স্বাস্থ্য রেকর্ড" },
  doctorPortalDesc:   { en: "Access patient records with OTP consent verification.", bn: "ওটিপি যাচাইকরণের মাধ্যমে রোগীর তথ্য দেখুন।" },
  patientPortalDesc:  { en: "View your medical records, immunizations, and prescriptions securely.", bn: "আপনার চিকিৎসা সংক্রান্ত সকল রেকর্ড নিরাপদে দেখুন।" },
  loginWithBmdc:      { en: "Login with BMDC Number",     bn: "বিএমডিসি নম্বর দিয়ে লগইন" },
  loginWithUrn:       { en: "Login or Register",           bn: "লগইন অথবা নিবন্ধন করুন" },
  trustOtp:           { en: "OTP Verification",            bn: "ওটিপি যাচাই" },
  trustAi:            { en: "AI Assistant",                bn: "এআই অ্যাসিস্ট্যান্ট" },
  trustAudit:         { en: "Audit Trail",                 bn: "অডিট ট্রেইল" },

  // ── Login & Auth ──
  bmdcNumber:         { en: "BMDC Number",                bn: "বিএমডিসি নম্বর" },
  password:           { en: "Password",                   bn: "পাসওয়ার্ড" },
  loginBtn:           { en: "Login",                      bn: "লগইন" },
  loggingIn:          { en: "Logging in...",               bn: "লগইন হচ্ছে..." },
  loginFailed:        { en: "Login failed",                bn: "লগইন ব্যর্থ" },
  register:           { en: "Register",                   bn: "নিবন্ধন" },
  registrationFailed: { en: "Registration failed",        bn: "নিবন্ধন ব্যর্থ" },
  demoHint:           { en: "Demo Login",                  bn: "ডেমো লগইন" },
  doctorLoginDesc:    { en: "Login with your BMDC registration number", bn: "আপনার BMDC রেজিস্ট্রেশন নম্বর দিয়ে লগইন করুন" },

  // ── OTP Gate ──
  consentGate:        { en: "Consent Verification",        bn: "সম্মতি যাচাইকরণ" },
  otpStep1Desc:       { en: "Enter the patient's Unique Registration Number to request access", bn: "অ্যাক্সেস অনুরোধ করতে রোগীর ইউনিক রেজিস্ট্রেশন নম্বর লিখুন" },
  otpStep2Desc:       { en: "Enter the OTP sent to the patient's mobile to unlock records", bn: "রেকর্ড আনলক করতে রোগীর মোবাইলে পাঠানো ওটিপি লিখুন" },
  enterUrn:           { en: "Enter URN",                   bn: "ইউআরএন লিখুন" },
  verifyOtp:          { en: "Verify OTP",                  bn: "ওটিপি যাচাই" },
  requestOtp:         { en: "Request Consent OTP",         bn: "সম্মতি ওটিপি অনুরোধ" },
  sendingOtp:         { en: "Sending OTP...",               bn: "ওটিপি পাঠানো হচ্ছে..." },
  enterOtpCode:       { en: "OTP Code",                    bn: "ওটিপি কোড" },
  verifying:          { en: "Verifying...",                 bn: "যাচাই হচ্ছে..." },
  verifyAndAccess:    { en: "Verify & Access Records",     bn: "যাচাই করুন ও রেকর্ড দেখুন" },
  tryDifferentPatient:{ en: "← Try a different patient",   bn: "← ভিন্ন রোগী চেষ্টা করুন" },
  otpRequestFailed:   { en: "Failed to send OTP",          bn: "ওটিপি পাঠানো ব্যর্থ" },
  otpVerifyFailed:    { en: "OTP verification failed",     bn: "ওটিপি যাচাই ব্যর্থ" },

  // ── Patient Portal ──
  myHealthRecords:    { en: "My Health Records",           bn: "আমার স্বাস্থ্য রেকর্ড" },

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
  upload:             { en: "Upload",                     bn: "আপলোড" },
  uploadReport:       { en: "Upload Report",              bn: "রিপোর্ট আপলোড করুন" },
  reportTitle:        { en: "Report Title",               bn: "রিপোর্টের শিরোনাম" },
  reportType:         { en: "Report Type",                bn: "রিপোর্টের ধরন" },
  selectFile:         { en: "Select File (PDF or Image)", bn: "ফাইল নির্বাচন করুন (পিডিএফ বা ছবি)" },
  clickToBrowse:      { en: "Click to browse",            bn: "ব্রাউজ করতে ক্লিক করুন" },
  uploading:          { en: "Uploading...",               bn: "আপলোড হচ্ছে..." },
  fileTooLarge:       { en: "File is too large (max 7MB).", bn: "ফাইলটি খুব বড় (সর্বোচ্চ ৭এমবি)।" },
  uploadFailed:       { en: "Failed to upload report.",   bn: "রিপোর্ট আপলোড ব্যর্থ হয়েছে।" },
  noReports:          { en: "No reports uploaded",        bn: "কোনো রিপোর্ট আপলোড হয়নি" },

  // ── Prescriptions / Treatment History ──
  prescriptions:      { en: "Prescriptions",              bn: "প্রেসক্রিপশন" },
  prescribedBy:       { en: "Prescribed by",              bn: "লিখেছেন" },
  dateIssued:         { en: "Date Issued",                bn: "তারিখ" },
  treatmentHistory:   { en: "Treatment History",          bn: "চিকিৎসার ইতিহাস" },
  diagnosis:          { en: "Diagnosis",                  bn: "রোগনির্ণয়" },
  medications:        { en: "Medications",                bn: "ওষুধপত্র" },
  followUp:           { en: "Follow-up",                  bn: "ফলো-আপ" },
  noPrescriptions:    { en: "No treatment records yet",   bn: "কোনো চিকিৎসার রেকর্ড নেই" },
  clinicalNotes:      { en: "Notes",                      bn: "নোট" },

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
