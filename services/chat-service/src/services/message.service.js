const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const getMessages = async (
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

  const messages = await Message.find({
    conversationId,
  }).sort({
    createdAt: 1,
  });

  return messages;
};

const createMessage = async (
  userId,
  conversationId,
  messageData
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    return null;
  }

  const message = await Message.create({
    conversationId,
    role: messageData.role,
    content: messageData.content || "",
    attachments: messageData.attachments || [],
  });

  await Conversation.findByIdAndUpdate(
    conversationId,
    {
      updatedAt: new Date(),
    }
  );

  return message;
};

module.exports = {
  getMessages,
  createMessage,
};