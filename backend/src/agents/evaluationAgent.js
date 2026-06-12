import groqModel from "../services/ai/groqModel.js";

const evaluateAnswer = async (question, answer) => {
  const prompt = `
You are a senior software engineering interviewer.

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer.

Return ONLY valid JSON.

{
  "technicalScore": 0,
  "depthScore": 0,
  "communicationScore": 0,
  "strengths": [],
  "weaknesses": [],
  "improvement": ""
}
`;

  const response = await groqModel.invoke(prompt);

  return JSON.parse(response.content);
};

export default evaluateAnswer;
