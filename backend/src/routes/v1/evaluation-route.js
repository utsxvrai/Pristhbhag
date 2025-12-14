const express = require("express");
const { evaluate } = require("../../controllers/evaluation-controller");

const router = express.Router();

router.post("/evaluate", evaluate);

module.exports = router;
