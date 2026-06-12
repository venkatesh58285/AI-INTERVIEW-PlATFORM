import groqModel from "../services/ai/groqModel.js";

const generateHRQuestion = async (previousQuestions = []) => {
  const prompt = `

You are an HR interviewer.

Previously Asked Questions:

${previousQuestions.join("\n")}

Generate ONE HR interview question.

Focus on:

- Teamwork
- Leadership
- Communication
- Conflict Resolution
- Problem Solving

Do not repeat previous questions.

`;

  const response = await groqModel.invoke(prompt);

  return response.content;
};

export default generateHRQuestion;
