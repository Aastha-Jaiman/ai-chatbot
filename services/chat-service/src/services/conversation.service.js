const Conversation = require("../models/Conversation");

const createConversation = async (userId, title) => {
  const conversation = await Conversation.create({
    userId,
    title: title?.trim() || "New Chat",
  });

  return conversation;
};

const getConversations = async (userId) => {
  const conversations = await Conversation.find({
    userId,
  }).sort({
    updatedAt: -1,
  });

  return conversations;
};

const getConversation = async (
  userId,
  conversationId
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  return conversation;
};

const renameConversation = async (
  userId,
  conversationId,
  title
) => {
  const conversation =
    await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        userId,
      },
      {
        title: title.trim(),
      },
      {
        new: true,
      }
    );

  return conversation;
};

const deleteConversation = async (
  userId,
  conversationId
) => {
  const conversation =
    await Conversation.findOneAndDelete({
      _id: conversationId,
      userId,
    });

  return conversation;
};

const togglePinConversation = async (
  userId,
  conversationId
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    return null;
  }

  conversation.isPinned = !conversation.isPinned;
  await conversation.save();

  return conversation;
};

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  togglePinConversation,
};