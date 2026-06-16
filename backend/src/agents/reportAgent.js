import getGroqModel from "../services/ai/groqModel.js";

const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  return cleaned.trim();
};

const generateReport = async (interactions) => {
  const prompt = `
You are a senior interviewer.

Interview Data:

${JSON.stringify(interactions)}

Generate a final report.

Return ONLY valid JSON with no extra text, no markdown, no code fences.

{
  "strengths":[""],
  "weaknesses":[""],
  "roadmap":""
}
`;

  const groqModel = getGroqModel();
  const response = await groqModel.invoke(prompt);

  try {
    return JSON.parse(cleanJsonResponse(response.content));
  } catch {
    return {
      strengths: [],
      weaknesses: [],
      roadmap: "Unable to generate roadmap",
    };
  }
};

export default generateReport;
