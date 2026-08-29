const {
  generateResponse,
} = require("../services/ai.service");

const generateAIResponse = async (req, res) => {
  try {
    const {
      history = [],
      message,
      attachments = [],
      context = "",
    } = req.body || {};

    console.log(
      "AI Request Body:",
      JSON.stringify(req.body, null, 2)
    );

    if (!message && attachments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message or attachments are required",
      });
    }

    const response = await generateResponse(
      history,
      message,
      attachments,
      context
    );

    return res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(
      "AI generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
      error: error.message,
    });
  }
};

module.exports = {
  generateAIResponse,
};