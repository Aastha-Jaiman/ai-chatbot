const express = require("express");

const {
  getMessages,
  createMessage,
} = require("../controllers/message.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.get("/:conversationId", getMessages);

router.post("/:conversationId", createMessage);

module.exports = router;