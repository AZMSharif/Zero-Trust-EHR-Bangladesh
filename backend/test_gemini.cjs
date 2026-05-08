// Quick test of the Gemini API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function test() {
  console.log("Key present:", !!process.env.GEMINI_API_KEY);
  console.log("Key starts with:", process.env.GEMINI_API_KEY?.substring(0, 10));
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  try {
    const result = await model.generateContent("Return only this JSON: {\"test\": true}");
    console.log("SUCCESS:", result.response.text());
  } catch (err) {
    console.error("FAILED:", err.message);
    console.error("Status:", err.status);
    console.error("Details:", JSON.stringify(err.errorDetails, null, 2));
  }
}

test();
