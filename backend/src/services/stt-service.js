const dotenv = require("dotenv");
dotenv.config({ path: "C:/Users/acer/Desktop/Pristhbhag/backend/.env" });

const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
const fs = require("fs");

console.log("API Key loaded:", process.env.ELEVENLABS_API_KEY ? "✓ Yes" : "✗ No");
if (!process.env.ELEVENLABS_API_KEY) {
  console.error("ERROR: ELEVENLABS_API_KEY not found in .env file");
}

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

async function transcribeAudio(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log("Reading audio file...");
    const audioBuffer = fs.readFileSync(filePath);
    const audioBlob = new Blob([audioBuffer], { type: "audio/mp3" });

    console.log("Starting transcription...");
    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      modelId: "scribe_v1",
      tagAudioEvents: false,
      languageCode: "en",
      diarize: false
    });

    console.log("Transcription successful!");
    console.log("Text:", transcription.text);

    return transcription.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
}

module.exports = { transcribeAudio };
