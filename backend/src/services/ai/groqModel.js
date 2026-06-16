import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

let groqModel = null;

const getGroqModel = () => {
  if (!groqModel) {
    groqModel = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      maxRetries: 3,
    });
  }
  return groqModel;
};

export default getGroqModel;
