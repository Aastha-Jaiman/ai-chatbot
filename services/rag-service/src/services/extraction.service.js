const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractText = async (fileUrl, mimeType) => {
  try {
    console.log(`Downloading file from: ${fileUrl}`);
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract extension from fileUrl to handle cases with incorrect/generic mimeTypes
    let extension = "";
    try {
      const urlObj = new URL(fileUrl);
      extension = path.extname(urlObj.pathname).toLowerCase();
    } catch (e) {
      extension = path.extname(fileUrl).toLowerCase();
    }

    const isPdf = mimeType === "application/pdf" || extension === ".pdf";
    const isDocx = mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || extension === ".docx";
    const isDoc = mimeType === "application/msword" || extension === ".doc";
    const isText = mimeType.startsWith("text/") || [".txt", ".csv", ".json", ".md", ".xml"].includes(extension);
    const isImage = mimeType.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp", ".gif", ".heic", ".heif"].includes(extension);

    if (isPdf) {
      console.log("Parsing PDF...");
      const data = await pdfParse(buffer);
      return data.text;
    } else if (isDocx) {
      console.log("Parsing DOCX...");
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else if (isDoc) {
      console.log("Attempting parsing of legacy .doc file using mammoth...");
      try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      } catch (err) {
        throw new Error("Parsing legacy .doc file failed. Legacy binary .doc format is not supported. Please save the file as .docx and upload it.");
      }
    } else if (isText) {
      console.log("Parsing text file...");
      return buffer.toString("utf-8");
    } else if (isImage) {
      console.log("Parsing image using Gemini...");
      const base64Data = buffer.toString("base64");
      // Use clean type fallback
      const cleanMimeType = mimeType.startsWith("image/") ? mimeType : "image/jpeg";
const geminiResponse = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: cleanMimeType,
            data: base64Data,
          },
        },
        {
          text: "Extract all text from this image as plain text. Do not add conversational text, notes, markdown formatting, or code blocks. Return only the extracted text.",
        },
      ],
    },
  ],
});

return geminiResponse.text || "";
    } else {
      // Fallback: decode as string
      return buffer.toString("utf-8");
    }
  } catch (error) {
    console.error("Text extraction failed:", error);
    throw error;
  }
};

module.exports = {
  extractText,
};

