import client from "./chromaClient.js";
import generateEmbedding from "./generateEmbeddings.js";
const retrieveResumeContext = async (userId, query) => {
  const collection = await client.getCollection({
    name: "resumes",
  });

  const queryEmbedding = await generateEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 3,
  });

  const filteredDocs = [];

  if (results.documents?.length > 0) {
    const docs = results.documents[0];
    const metadata = results.metadatas[0];

    docs.forEach((doc, index) => {
      if (metadata[index].userId === userId) {
        filteredDocs.push(doc);
      }
    });
  }

  return filteredDocs.join("\n");
};

export default retrieveResumeContext;
