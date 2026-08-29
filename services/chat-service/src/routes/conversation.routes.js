const express = require("express");

const {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  togglePinConversation,
} = require("../controllers/conversation.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", createConversation);

router.get("/", getConversations);

router.get("/:id", getConversation);

router.patch("/:id", renameConversation);

router.patch("/:id/pin", togglePinConversation);

router.delete("/:id", deleteConversation);

module.exports = router;