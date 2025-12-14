const dotenv = require("dotenv");
dotenv.config();

const { evaluateAnswer } = require("./src/services/evaluation-service");

async function test() {
  const question = "What is the difference between Promise.all() and Promise.allSettled()?";
  const answer = "Promise.all fails if one promise fails. Promise.allSettled waits for all of them.";

  console.log("Testing Gemini Evaluation...");
  try {
    const result = await evaluateAnswer(question, answer);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
