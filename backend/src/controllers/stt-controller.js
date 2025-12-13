const { transcribeAudio } = require("../services/stt-service.js");
const { deleteFile } = require("../utils/cleanup.js");

module.exports.handleSTT = async (req, res) => {
  try {
    const filePath = req.file.path;

    const text = await transcribeAudio(filePath);

    deleteFile(filePath);

    res.json({ text });
  } catch (err) {
    console.error('STT Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: "Speech-to-text failed", details: err.message });
  }
};

