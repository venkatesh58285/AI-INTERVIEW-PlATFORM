import generateReport from "../../agents/reportAgent.js";

const reportNode = async (state) => {
  // Extract all interactions that have an evaluation
  const answeredInteractions = state.interactions.filter(
    (item) => item.evaluation
  );

  const total = answeredInteractions.length;

  const technicalScore = answeredInteractions.reduce(
    (sum, item) => sum + (item.evaluation.technicalScore || 0),
    0,
  );

  const depthScore = answeredInteractions.reduce(
    (sum, item) => sum + (item.evaluation.depthScore || 0),
    0,
  );

  const communicationScore = answeredInteractions.reduce(
    (sum, item) => sum + (item.evaluation.communicationScore || 0),
    0,
  );

  let llmReport;
  try {
    // Small delay to avoid Groq rate limit after evaluation call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    llmReport = await generateReport(answeredInteractions);
  } catch (err) {
    console.error("Report generation failed:", err.message);
    llmReport = {
      strengths: [],
      weaknesses: [],
      roadmap: "Report generation failed. Please check interview history for details.",
    };
  }

  const finalReport = {
    overallTechnicalScore: total ? technicalScore / total : 0,
    overallDepthScore: total ? depthScore / total : 0,
    overallCommunicationScore: total ? communicationScore / total : 0,
    strengths: llmReport.strengths || [],
    weaknesses: llmReport.weaknesses || [],
    roadmap: llmReport.roadmap || "",
  };

  return {
    ...state,
    report: finalReport,
    completed: true,
  };
};

export default reportNode;
