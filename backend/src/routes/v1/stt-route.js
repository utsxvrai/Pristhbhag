const express = require("express");
const multer = require("multer");
const { handleSTT } = require("../../controllers/stt-controller");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/speech-to-text", upload.single("file"), handleSTT);

module.exports = router;
