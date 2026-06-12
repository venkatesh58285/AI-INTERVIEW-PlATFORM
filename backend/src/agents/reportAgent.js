import groqModel from "../services/ai/groqModel.js";

const generateReport = async (
  interactions
) => {

  const prompt = `
You are a senior interviewer.

Interview Data:

${JSON.stringify(interactions)}

Generate a final report.

Return ONLY valid JSON.

{
  "strengths":[""],
  "weaknesses":[""],
  "roadmap":""
}
`;

  const response =
    await groqModel.invoke(prompt);

  try {

    return JSON.parse(
      response.content
    );

  } catch {

    return {
      strengths: [],
      weaknesses: [],
      roadmap:
        "Unable to generate roadmap",
    };

  }

};

export default generateReport;