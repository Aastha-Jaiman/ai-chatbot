const conversationService = require("../services/conversation.service");

const createConversation = async (req, res) => {
  try {
    const conversation =
      await conversationService.createConversation(
        req.user.userId,
        req.body.title
      );

    return res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations =
      await conversationService.getConversations(
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get conversations",
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const conversation =
      await conversationService.getConversation(
        req.user.userId,
        req.params.id
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get conversation",
    });
  }
};

const renameConversation = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const conversation =
      await conversationService.renameConversation(
        req.user.userId,
        req.params.id,
        title
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Rename conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to rename conversation",
    });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const conversation =
      await conversationService.deleteConversation(
        req.user.userId,
        req.params.id
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};

const togglePinConversation = async (req, res) => {
  try {
    const conversation =
      await conversationService.togglePinConversation(
        req.user.userId,
        req.params.id
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Toggle pin conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to toggle pin conversation",
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  togglePinConversation,
};