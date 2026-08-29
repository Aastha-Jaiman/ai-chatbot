const express = require("express");
const {
  generateAIResponse,
} = require("../controllers/ai.controller");

const router = express.Router();

router.post("/generate", generateAIResponse);

module.exports = router;