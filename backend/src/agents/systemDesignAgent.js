import getGroqModel from "../services/ai/groqModel.js";

const generateSystemDesignQuestion = async (previousQuestions = []) => {
  const prompt = `
You are a senior system design interviewer at a top tech company.

Previously Asked Questions:
${previousQuestions.join("\n")}

Generate ONE NEW system design interview question.

Focus on topics like:
- Designing scalable distributed systems
- Database design and trade-offs (SQL vs NoSQL)
- Caching strategies (Redis, CDN)
- Message queues and event-driven architecture
- Load balancing and horizontal scaling
- Microservices vs monolith trade-offs
- API design (REST, GraphQL, gRPC)
- Rate limiting and throttling
- High availability and fault tolerance

Do not repeat any previous question. Return ONLY the question text.
`;

  const groqModel = getGroqModel();
  const response = await groqModel.invoke(prompt);
  return response.content;
};

export default generateSystemDesignQuestion;
