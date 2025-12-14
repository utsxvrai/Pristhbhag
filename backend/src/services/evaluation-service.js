const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function evaluateAnswer(questionText, userAnswer) {
  const prompt = `
You are a senior backend interviewer.

Evaluate the answer strictly.

Rules:
- Interview-level
- Penalize wrong confidence
- No extra assumptions

Question:
${questionText}

Answer:
${userAnswer}

Return ONLY valid JSON:
{
  "isCorrect": boolean,
  "score": number,
  "missingConcepts": string[],
  "incorrectStatements": string[],
  "feedback": string,
  "idealShortAnswer": string
}

Keep feedback concise (max 3 sentences).
`;

  try {
    // ⏱️ Fail-fast timeout (6 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = response.candidates[0].content.parts[0].text;

    const parsed = JSON.parse(text);

    // 🔒 Safety clamps
    parsed.score = Math.max(0, Math.min(parsed.score, 10));

    return parsed;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("AI evaluation timed out");
    }

    console.error("Gemini evaluation failed:", error.message);

    // 🔁 Graceful fallback (NEVER crash UX)
    return {
      isCorrect: false,
      score: 0,
      missingConcepts: [],
      incorrectStatements: [],
      feedback: "Evaluation could not be completed. Please try again.",
      idealShortAnswer: "",
    };
  }
}

module.exports = { evaluateAnswer };
