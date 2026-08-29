const messageService = require("../services/message.service");

const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages(
      req.user.userId,
      req.params.conversationId
    );

    if (messages === null) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get messages",
    });
  }
};

const createMessage = async (req, res) => {
  try {
    const { role, content, attachments } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!["user", "assistant", "system"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message role",
      });
    }

    if (!content?.trim() && !attachments?.length) {
      return res.status(400).json({
        success: false,
        message: "Message content or attachment is required",
      });
    }

    // 1. Create the user's message
    const userMessage = await messageService.createMessage(
      req.user.userId,
      req.params.conversationId,
      {
        role,
        content,
        attachments,
      }
    );

    if (!userMessage) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    let assistantMessage = null;

    // 2. If it's a user message, trigger the AI response
    if (role === "user") {
      try {
        // Fetch conversation history
        const messagesHistory = await messageService.getMessages(
          req.user.userId,
          req.params.conversationId
        );

        // Filter and map to simple role/content objects (excluding the newly created user message)
        const historyPayload = messagesHistory
          .filter((msg) => msg._id.toString() !== userMessage._id.toString())
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // Find all unique fileIds in the conversation attachments
        const fileIds = [];
        messagesHistory.forEach(msg => {
          if (msg.attachments && msg.attachments.length > 0) {
            msg.attachments.forEach(att => {
              if (att.fileId && !fileIds.includes(att.fileId)) {
                fileIds.push(att.fileId);
              }
            });
          }
        });

        // Retrieve context using RAG if files are present
        let ragContext = "";
        if (fileIds.length > 0 && content && content.trim()) {
          try {
            console.log(`Querying RAG service for fileIds: ${fileIds}`);
            const ragServiceUrl = process.env.RAG_SERVICE_URL || "http://localhost:4005";
            const ragResponse = await fetch(`${ragServiceUrl}/rag/query`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: content,
                userId: req.user.userId,
                fileIds: fileIds,
              }),
            });

            if (ragResponse.ok) {
              const ragData = await ragResponse.json();
              if (ragData.success && ragData.context) {
                ragContext = ragData.context;
                console.log(`Successfully retrieved RAG context of length: ${ragContext.length}`);
              }
            } else {
              console.error("RAG query failed:", ragResponse.statusText);
            }
          } catch (ragError) {
            console.error("Failed to fetch context from RAG service:", ragError.message);
          }
        }

        // Call the AI Service
        const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:4003";
        const aiResponse = await fetch(`${aiServiceUrl}/ai/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            history: historyPayload,
            message: content,
            attachments: userMessage.attachments,
            context: ragContext,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          if (aiData.success && aiData.response) {
            // Save the AI response as an assistant message
            assistantMessage = await messageService.createMessage(
              req.user.userId,
              req.params.conversationId,
              {
                role: "assistant",
                content: aiData.response,
              }
            );
          }
        } else {
          console.error("AI service error response:", aiResponse.statusText);
        }
      } catch (aiError) {
        console.error("Failed to generate AI response:", aiError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: userMessage,
      reply: assistantMessage,
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create message",
    });
  }
};

module.exports = {
  getMessages,
  createMessage,
};