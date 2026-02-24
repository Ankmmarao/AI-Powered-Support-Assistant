const { GoogleGenerativeAI } = require("@google/generative-ai");
const docs = require("../docs.json");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateReply(contextMessages, userMessage) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const docsText = docs
    .map(d => `Title: ${d.title}\nContent: ${d.content}`)
    .join("\n\n");

  const prompt = `
You are an AI Support Assistant.

STRICT RULES:
1. Answer ONLY using DOCUMENTATION below.
2. If answer not found, respond EXACTLY:
   "Sorry, I don’t have information about that."
3. Do NOT use outside knowledge.
4. Do NOT guess.

DOCUMENTATION:
${docsText}

CHAT HISTORY:
${contextMessages}

USER QUESTION:
${userMessage}

Answer:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return {
      reply: text,
      tokensUsed: response.usageMetadata?.totalTokenCount || 0
    };
  } catch (error) {
    throw new Error("Gemini API failure");
  }
}

module.exports = { generateReply };
