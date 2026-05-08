// ─────────────────────────────────────────────
// AI Clinical Scribe Controller
// POST /api/clinical-note/analyze
//
// Takes unstructured doctor notes, uses Gemini
// to extract structured medical data, and updates
// the PatientMedicalSnapshot in the database.
// ─────────────────────────────────────────────
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prisma = require("../prisma/client");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The structured prompt template for Gemini
const SYSTEM_PROMPT = `You are a clinical NLP engine for a Bangladesh Electronic Health Record system.

TASK: Parse the doctor's unstructured clinical note and extract structured medical data.

Return ONLY a valid JSON object with these fields (include only fields that the note mentions):

{
  "has_asthma": boolean,
  "has_tuberculosis": boolean,
  "has_hiv": boolean,
  "has_jaundice": boolean,
  "has_anemia": boolean,
  "has_diabetes": boolean,
  "smoking_status": "NEVER" | "FORMER" | "CURRENT",
  "alcohol_status": "NEVER" | "FORMER" | "CURRENT",
  "chews_betel_leaf": "NEVER" | "FORMER" | "CURRENT",
  "uses_cannabis": "NEVER" | "FORMER" | "CURRENT",
  "chronic_diseases_add": ["string"],
  "genetic_diseases_add": ["string"],
  "major_surgeries_add": ["string"],
  "drug_history_add": ["string"],
  "allergies_add": ["string"]
}

RULES:
1. Only include fields explicitly mentioned or implied in the note.
2. For array fields, use the "_add" suffix — these will be APPENDED to existing arrays.
3. "quit smoking" → smoking_status: "FORMER"
4. "patient smokes" → smoking_status: "CURRENT"
5. "peanut allergy" → allergies_add: ["Peanuts"]
6. "added amlodipine 5mg" → drug_history_add: ["Amlodipine 5mg"]
7. "chews paan/jorda" → chews_betel_leaf: "CURRENT"
8. Understand Bangla medical terms if used.
9. Return ONLY the JSON object, no markdown, no explanation.`;

async function analyzeClinicalNote(req, res) {
  try {
    const { patient_urn, text } = req.body;
    const doctor_bmdc = req.user.id;

    if (!patient_urn || !text) {
      return res.status(400).json({ error: "patient_urn and text are required" });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: "Clinical note too long (max 5000 chars)" });
    }

    // 1. Fetch existing snapshot
    const snapshot = await prisma.patientMedicalSnapshot.findUnique({
      where: { patient_urn },
    });

    if (!snapshot) {
      return res.status(404).json({ error: "Patient medical snapshot not found" });
    }

    // 2. Call Gemini to parse the clinical note
    // Using gemini-2.5-flash — best balance of quality and free-tier availability
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `${SYSTEM_PROMPT}\n\nDOCTOR'S CLINICAL NOTE:\n"${text}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 3. Parse the JSON from Gemini's response
    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Gemini JSON parse error:", responseText);
      return res.status(422).json({
        error: "AI could not parse the clinical note. Please rephrase.",
        raw_response: responseText,
      });
    }

    // 4. Build the Prisma update payload
    const updateData = {};

    // Boolean fields
    const boolFields = [
      "has_asthma", "has_tuberculosis", "has_hiv",
      "has_jaundice", "has_anemia", "has_diabetes",
    ];
    for (const field of boolFields) {
      if (typeof parsed[field] === "boolean") {
        updateData[field] = parsed[field];
      }
    }

    // Lifestyle enum fields
    const lifestyleFields = [
      "smoking_status", "alcohol_status",
      "chews_betel_leaf", "uses_cannabis",
    ];
    const validStatuses = ["NEVER", "FORMER", "CURRENT"];
    for (const field of lifestyleFields) {
      if (parsed[field] && validStatuses.includes(parsed[field])) {
        updateData[field] = parsed[field];
      }
    }

    // Array fields — APPEND to existing arrays (deduplicated)
    const arrayFields = [
      "chronic_diseases", "genetic_diseases",
      "major_surgeries", "drug_history", "allergies",
    ];
    for (const field of arrayFields) {
      const addKey = `${field}_add`;
      if (Array.isArray(parsed[addKey]) && parsed[addKey].length > 0) {
        const existing = Array.isArray(snapshot[field]) ? snapshot[field] : [];
        const merged = [...new Set([...existing, ...parsed[addKey]])];
        updateData[field] = merged;
      }
    }

    // Set audit trail
    updateData.last_updated_by = doctor_bmdc;

    // 5. Execute the database UPDATE
    const updated = await prisma.patientMedicalSnapshot.update({
      where: { patient_urn },
      data: updateData,
    });

    // 6. Log the scribe action
    await prisma.accessLog.create({
      data: {
        patient_urn,
        doctor_bmdc,
        event: "SCRIBE_UPDATED",
        ip_address: req.ip,
      },
    });

    res.json({
      message: "Medical snapshot updated successfully",
      ai_extracted: parsed,
      fields_updated: Object.keys(updateData).filter((k) => k !== "last_updated_by"),
      updated_snapshot: updated,
    });
  } catch (err) {
    console.error("AI Scribe error:", err.message || err);
    const msg = err.message || "";
    if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({ error: "AI service quota exceeded. The free-tier limit has been reached. Please try again later or contact the administrator to upgrade the API key." });
    }
    if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid")) {
      return res.status(503).json({ error: "AI service is temporarily unavailable. The API key needs to be renewed by the administrator." });
    }
    if (msg.includes("400") || msg.includes("INVALID_ARGUMENT")) {
      return res.status(400).json({ error: "AI could not process the clinical note. Please try rephrasing." });
    }
    res.status(500).json({ error: "AI Scribe analysis failed. Please try again shortly." });
  }
}

module.exports = { analyzeClinicalNote };
