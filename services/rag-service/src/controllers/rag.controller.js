const extractionService = require("../services/extraction.service");
const chunkService = require("../services/chunk.service");
const embeddingService = require("../services/embedding.service");
const retrievalService = require("../services/retrieval.service");
const DocumentChunk = require("../models/DocumentChunk");

const processDocument = async (req, res) => {
  try {
    const { fileId, fileUrl, fileName, mimeType, userId } = req.body;

    if (!fileId || !fileUrl || !fileName || !mimeType || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    console.log(`Processing file: ${fileName} (${mimeType})`);

    // 1. Text extraction
    const extractedText = await extractionService.extractText(fileUrl, mimeType);
    if (!extractedText || !extractedText.trim()) {
      return res.status(200).json({
        success: true,
        message: "File contains no extractable text",
      });
    }

    // 2. Text chunking
    const chunks = chunkService.chunkText(extractedText);
    console.log(`Split text into ${chunks.length} chunks.`);

    // 3. Generate embeddings & save chunks
    const chunkPromises = chunks.map(async (text, index) => {
      const embedding = await embeddingService.generateEmbedding(text);
      return {
        fileId,
        userId,
        fileName,
        chunkIndex: index,
        text,
        embedding,
      };
    });

    const chunkRecords = await Promise.all(chunkPromises);

    // Clean up existing chunks for this file if any
    await DocumentChunk.deleteMany({ fileId });

    // Bulk insert chunks
    await DocumentChunk.insertMany(chunkRecords);

    console.log(`Successfully stored vector embeddings for ${fileName}`);

    return res.status(201).json({
      success: true,
      message: "Document indexed successfully",
      chunksCount: chunkRecords.length,
    });
  } catch (error) {
    console.error("Document processing failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process document for RAG search",
      error: error.message,
    });
  }
};

const queryDocument = async (req, res) => {
  try {
    const { query, userId, fileIds } = req.body;

    if (!query || !userId || !fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing query, userId, or fileIds list",
      });
    }

    console.log(`Querying RAG: "${query}" for user ${userId} across ${fileIds.length} files`);

    // 1. Generate query embedding
    const queryEmbedding = await embeddingService.generateEmbedding(query);

    // 2. Retrieve relevant chunks
    const relevantChunks = await retrievalService.retrieveRelevantChunks(
      userId,
      fileIds,
      queryEmbedding,
      5 // limit
    );

    // 3. Construct context
    const context = relevantChunks
      .map((chunk, index) => `[Source: ${chunk.fileName}] (Chunk ${index + 1}):\n${chunk.text}`)
      .join("\n\n");

    return res.status(200).json({
      success: true,
      context,
      chunks: relevantChunks.map(c => ({
        fileName: c.fileName,
        text: c.text,
        score: c.score,
      })),
    });
  } catch (error) {
    console.error("RAG query failed:", error);
    return res.status(500).json({
      success: false,
      message: "RAG retrieval query failed",
      error: error.message,
    });
  }
};

const deleteDocumentChunks = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "fileId parameter is required",
      });
    }

    console.log(`Deleting all chunks for file: ${fileId}`);
    const deleteResult = await DocumentChunk.deleteMany({ fileId });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted document chunks`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Delete chunks failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document chunks",
      error: error.message,
    });
  }
};

module.exports = {
  processDocument,
  queryDocument,
  deleteDocumentChunks,
};
