import { pipeline } from "@xenova/transformers";

// load embedding model
const extractor = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2",
);

const generateEmbedding = async (text) => {
  const output = await extractor(text, {
    pooling: "mean",

    normalize: true,
  });

  return Array.from(output.data);
};

export default generateEmbedding;
