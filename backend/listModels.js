require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
    // This fetches the actual list assigned to your API Key
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("--- Available Models ---");
    data.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`✅ Use this: ${m.name.replace('models/', '')}`);
      }
    });
  } catch (e) {
    console.error("Discovery failed:", e);
  }
}

list();