import client from "./chromaClient.js";

import chunkText from "./chunkText.js";

import generateEmbedding from "./generateEmbeddings.js";

const embedResume = async (userId, resumeText) => {
  // chunk resume
  const chunks = chunkText(resumeText);

  // create collection
  const collection = await client.getOrCreateCollection({
    name: "resumes",
  });

  // generate embeddings
  const vectors = [];

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    vectors.push(embedding);
  }

  // store embeddings
  await collection.add({
    ids: chunks.map((_, index) => `${userId}-${index}`),

    documents: chunks,

    embeddings: vectors,

    metadatas: chunks.map(() => ({
      userId,
    })),
  });

  console.log("Resume embeddings stored");
};

export default embedResume;
