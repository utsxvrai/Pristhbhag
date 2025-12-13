const dotenv = require("dotenv");
dotenv.config({ path: "C:/Users/acer/Desktop/Pristhbhag/backend/.env" });

const { transcribeAudio } = require("./src/services/stt-service.js");

// Test with the audio file in services directory
const audioFilePath = "./src/services/audio.mp3";

console.log("=== Testing STT Service ===");
console.log("Audio file path:", audioFilePath);
console.log("");

transcribeAudio(audioFilePath)
  .then((text) => {
    console.log("");
    console.log("=== Transcription Result ===");
    console.log("Text:", text);
    console.log("");
    console.log("✓ Test successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("");
    console.error("=== Test Failed ===");
    console.error("Error:", error.message);
    console.error("");
    process.exit(1);
  });
