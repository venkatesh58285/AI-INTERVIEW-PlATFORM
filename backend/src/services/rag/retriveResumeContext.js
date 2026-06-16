import Embedding from "../../models/Embedding.js";
import generateEmbedding from "./generateEmbeddings.js";

// Cosine similarity between two vectors
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

const retrieveResumeContext = async (userId, query) => {
  const userEmbeddings = await Embedding.find({ userId });

  if (!userEmbeddings.length) return "";

  const queryEmbedding = await generateEmbedding(query);

  // Rank chunks by similarity
  const scored = userEmbeddings.map((doc) => ({
    chunk: doc.chunk,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Return top 3 most relevant chunks
  return scored.slice(0, 3).map((s) => s.chunk).join("\n");
};

export default retrieveResumeContext;
