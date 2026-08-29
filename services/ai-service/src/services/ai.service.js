const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateResponse = async (
  history = [],
  currentMessage,
  attachments = [],
  context = ""
) => {
  try {
    // --------------------------------
    // 1. Normalize current message
    // --------------------------------

    let messageText = "";

    if (typeof currentMessage === "string") {
      messageText = currentMessage;
    } else if (
      currentMessage &&
      typeof currentMessage === "object"
    ) {
      messageText =
        currentMessage.content ||
        currentMessage.message ||
        currentMessage.text ||
        "";
    }

    // --------------------------------
    // 2. Validate message
    // --------------------------------

    if (!messageText.trim() && attachments.length === 0) {
      throw new Error("Message or attachments are required");
    }

    // --------------------------------
    // 3. System instruction
    // --------------------------------

    const systemMessages = Array.isArray(history)
      ? history.filter(
          (message) => message.role === "system"
        )
      : [];

    let systemInstruction =
      systemMessages.length > 0
        ? systemMessages
            .map((message) => message.content || "")
            .join("\n")
        : "You are a helpful, friendly, and expert AI assistant. Provide clear, accurate and useful answers.";

    if (context) {
      systemInstruction += `\n\n[Retrieved Document Context]\nUse the following context parsed from the uploaded document(s) to answer the user's question. Answer accurately and directly using this context. If the answer cannot be found in the context, use your general knowledge but clearly state that the answer was not found in the uploaded documents:\n\n${context}`;
    }

    // --------------------------------
    // 4. Convert history to Gemini format
    // --------------------------------

    const chatMessages = Array.isArray(history)
      ? history
          .filter(
            (message) =>
              message.role === "user" ||
              message.role === "assistant" ||
              message.role === "model"
          )
          .map((message) => {
            const content =
              typeof message.content === "string"
                ? message.content
                : "";

            return {
              role:
                message.role === "assistant" ||
                message.role === "model"
                  ? "model"
                  : "user",

              parts: [
                {
                  text: content,
                },
              ],
            };
          })
          .filter(
            (message) =>
              message.parts[0].text.trim()
          )
      : [];

    // --------------------------------
    // 5. Add current user message and attachments
    // --------------------------------

    const parts = [];
    if (messageText.trim()) {
      parts.push({
        text: messageText.trim(),
      });
    }

    if (Array.isArray(attachments) && attachments.length > 0) {
      for (const attachment of attachments) {
        const mimeType = attachment.type || "";
        const isSupportedByGemini =
          mimeType.startsWith("image/") ||
          mimeType.startsWith("audio/") ||
          mimeType.startsWith("video/") ||
          mimeType.startsWith("text/") ||
          mimeType === "application/pdf";

        if (!isSupportedByGemini) {
          console.log(`AI Service: Skipping direct file upload to Gemini for RAG-only attachment: ${attachment.name || attachment.url} (${mimeType})`);
          continue;
        }

        try {
          console.log(`AI Service fetching attachment: ${attachment.url}`);
          const res = await fetch(attachment.url);
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString("base64");
            parts.push({
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            });
          } else {
            console.error(`Failed to fetch attachment from ${attachment.url}: ${res.statusText}`);
          }
        } catch (fetchError) {
          console.error(`Error loading attachment from ${attachment.url}:`, fetchError.message);
        }
      }
    }

    chatMessages.push({
      role: "user",
      parts,
    });

    // --------------------------------
    // 6. Debug
    // --------------------------------

    console.log(
      "Gemini Request:",
      JSON.stringify(
        chatMessages,
        null,
        2
      )
    );

    // --------------------------------
    // 7. Gemini API
    // --------------------------------

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: chatMessages,

        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      });

    // --------------------------------
    // 8. Get AI response
    // --------------------------------

    const generatedText = response.text;

    if (!generatedText) {
      throw new Error(
        "No response generated by Gemini"
      );
    }

    return generatedText;
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error
    );

    throw error;
  }
};

module.exports = {
  generateResponse,
};