import Embedding from "../../models/Embedding.js";
import chunkText from "./chunkText.js";
import generateEmbedding from "./generateEmbeddings.js";

const embedResume = async (userId, resumeText) => {
  // Remove old embeddings for this user
  await Embedding.deleteMany({ userId });

  // Chunk resume
  const chunks = chunkText(resumeText);

  // Generate embeddings and store in MongoDB
  const docs = [];
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);
    docs.push({ userId, chunk, embedding });
  }

  await Embedding.insertMany(docs);
  console.log(`Resume embeddings stored: ${docs.length} chunks`);
};

export default embedResume;
