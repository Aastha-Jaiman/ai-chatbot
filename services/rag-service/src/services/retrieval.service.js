const DocumentChunk = require("../models/DocumentChunk");

const calculateCosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const retrieveRelevantChunks = async (userId, fileIds, queryEmbedding, limit = 5) => {
  try {
    const fileObjectIds = fileIds.map(id => {
      try {
        return new (require("mongoose").Types.ObjectId)(id);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    if (fileObjectIds.length === 0) return [];

    console.log("RAG attempting MongoDB Atlas Vector Search...");
    try {
      const results = await DocumentChunk.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: limit,
            filter: {
              fileId: { $in: fileObjectIds },
              userId: new (require("mongoose").Types.ObjectId)(userId)
            }
          }
        }
      ]);

      if (results && results.length > 0) {
        console.log(`Vector search succeeded. Returned ${results.length} chunks.`);
        return results;
      }
    } catch (vectorSearchError) {
      console.warn(
        "MongoDB Atlas Vector Search failed or index not found. Falling back to in-memory cosine similarity search.",
        vectorSearchError.message
      );
    }

    // Fallback: fetch chunks from database and compute cosine similarity in-memory
    console.log("Running in-memory similarity fallback query...");
    const chunks = await DocumentChunk.find({
      fileId: { $in: fileObjectIds },
      userId: new (require("mongoose").Types.ObjectId)(userId)
    }).select("fileId fileName text embedding");

    if (!chunks || chunks.length === 0) {
      console.log("No chunks found in database for files:", fileIds);
      return [];
    }

    console.log(`Evaluating similarity on ${chunks.length} total database chunks...`);
    const scoredChunks = chunks.map(chunk => {
      const score = calculateCosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        _id: chunk._id,
        fileId: chunk.fileId,
        fileName: chunk.fileName,
        text: chunk.text,
        score: score
      };
    });

    // Sort by score descending and return top K
    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, limit);
  } catch (error) {
    console.error("Retrieval failed:", error);
    throw error;
  }
};

module.exports = {
  retrieveRelevantChunks,
};
