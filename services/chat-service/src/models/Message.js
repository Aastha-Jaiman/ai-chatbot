const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    attachments: [
      {
        fileId: {
          type: String,
        },

        name: {
          type: String,
        },

        url: {
          type: String,
        },

        type: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

module.exports = Message;