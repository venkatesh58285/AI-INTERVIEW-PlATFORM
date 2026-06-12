import groqModel from "../services/ai/groqModel.js";
import retrieveResumeContext from "../services/rag/retriveResumeContext.js";

const generateResumeQuestion = async (userId, previousQuestions) => {
  const context = await retrieveResumeContext(userId, "projects and skills");
  const prompt = `

    You are a technical interviewer.

Resume Context:

${context}

Previously Asked Questions:

${previousQuestions.join("\n")}

Generate ONE NEW question.

Do not repeat any previous question.

`;
  const response = await groqModel.invoke(prompt);
  return response.content;
};

export default generateResumeQuestion;
