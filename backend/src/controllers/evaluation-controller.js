const { evaluateAnswer } = require("../services/evaluation-service");

module.exports.evaluate = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Missing 'question' or 'answer' in request body" });
    }

    const evaluation = await evaluateAnswer(question, answer);
    
    res.json(evaluation);
  } catch (err) {
    console.error('Evaluation Error:', err.message);
    res.status(500).json({ error: "Evaluation failed", details: err.message });
  }
};
