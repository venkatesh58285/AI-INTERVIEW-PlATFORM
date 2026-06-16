import getGroqModel from "../services/ai/groqModel.js";

const cleanJsonResponse = (text) => {
  // Strip markdown code fences like ```json ... ``` or ``` ... ```
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  return cleaned.trim();
};

const evaluateAnswer = async (question, answer) => {
  const prompt = `
You are a senior software engineering interviewer.

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer. Score each category from 0 to 10.

Return ONLY valid JSON with no extra text, no markdown, no code fences.

{
  "technicalScore": 0,
  "depthScore": 0,
  "communicationScore": 0,
  "strengths": [],
  "weaknesses": [],
  "improvement": ""
}
`;

  const groqModel = getGroqModel();
  const response = await groqModel.invoke(prompt);

  try {
    return JSON.parse(cleanJsonResponse(response.content));
  } catch {
    return {
      technicalScore: 5,
      depthScore: 5,
      communicationScore: 5,
      strengths: ["Answer provided"],
      weaknesses: ["Could not parse detailed evaluation"],
      improvement: "Try to provide more structured answers.",
    };
  }
};

export default evaluateAnswer;
