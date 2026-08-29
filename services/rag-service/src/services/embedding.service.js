
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateEmbedding = async (text) => {
  try {
    if (!text || !text.trim()) {
      throw new Error("Text content is empty");
    }

    const result = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
      config: {
        outputDimensionality: 768,
      },
    });

    const embedding = result.embeddings?.[0]?.values;

    if (!embedding || embedding.length === 0) {
      throw new Error("Invalid embedding response");
    }

    return embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    throw error;
  }
};

module.exports = {
  generateEmbedding,
};