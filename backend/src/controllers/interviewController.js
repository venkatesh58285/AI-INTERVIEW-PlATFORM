import generateResumeQuestion from "../agents/resumeAgent.js";
import generateSystemDesignQuestion from "../agents/systemDesignAgent.js";
import generateHRQuestion from "../agents/hrAgent.js";
import generateDSAQuestion from "../agents/dsaAgent.js";
import asyncHandler from "../middleware/aysncHandler.js";
import Interview from "../models/Interview.js";
import evaluateAnswer from "../agents/evaluationAgent.js";
import generateReport from "../agents/reportAgent.js";

// Helper: generate next question based on interview type
async function generateNextQuestion(interviewType, userId, previousQuestions) {
  switch (interviewType) {
    case "system_design":
      return await generateSystemDesignQuestion(previousQuestions);
    case "hr":
      return await generateHRQuestion(previousQuestions);
    case "dsa": {
      const dsaProblem = await generateDSAQuestion(previousQuestions);
      // Return the full JSON stringified so frontend can parse it
      return JSON.stringify(dsaProblem);
    }
    case "resume":
    default:
      return await generateResumeQuestion(userId, previousQuestions);
  }
}

export const startInterview = asyncHandler(async (req, res) => {
  const { interviewType = "resume", totalQuestions = 6 } = req.body;

  const validTypes = ["resume", "system_design", "hr", "dsa"];
  if (!validTypes.includes(interviewType)) {
    res.status(400);
    throw new Error("Invalid interview type. Must be: resume, system_design, hr, or dsa");
  }

  const clampedQuestions = Math.min(10, Math.max(3, Number(totalQuestions) || 6));

  // Check for existing active interview of this type
  let interview = await Interview.findOne({
    user: req.user._id,
    status: "active",
    interviewType,
  });

  if (!interview) {
    const question = await generateNextQuestion(interviewType, req.user._id.toString(), []);

    interview = await Interview.create({
      user: req.user._id,
      interviewType,
      totalQuestions: clampedQuestions,
      interactions: [{ question }],
    });
  }

  const latestQuestion = interview.interactions[interview.interactions.length - 1];

  res.status(200).json({
    success: true,
    interviewId: interview._id,
    interviewType: interview.interviewType,
    totalQuestions: interview.totalQuestions,
    question: latestQuestion.question,
  });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { interviewId, answer } = req.body;

  if (!interviewId || !answer) {
    res.status(400);
    throw new Error("interviewId and answer are required");
  }

  const interview = await Interview.findById(interviewId);

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

  if (interview.status === "completed") {
    res.status(400);
    throw new Error("Interview is already completed");
  }

  const currentInteraction = interview.interactions[interview.interactions.length - 1];

  if (!currentInteraction || !currentInteraction.question) {
    res.status(400);
    throw new Error("No pending question to answer");
  }

  // Evaluate the answer
  let evaluation;
  try {
    evaluation = await evaluateAnswer(currentInteraction.question, answer);
  } catch (err) {
    console.error("Evaluation error:", err.message);
    evaluation = {
      technicalScore: 5,
      depthScore: 5,
      communicationScore: 5,
      strengths: ["Answer provided"],
      weaknesses: ["Evaluation processing issue"],
      improvement: "Please try again.",
    };
  }

  // Save answer and evaluation
  currentInteraction.answer = answer;
  currentInteraction.evaluation = evaluation;

  const answeredCount = interview.interactions.filter((i) => i.answer).length;
  const isLastQuestion = answeredCount >= interview.totalQuestions;

  if (isLastQuestion) {
    // Save evaluation first
    await interview.save();

    // Generate report with delay to avoid rate limit
    let report;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      report = await generateReport(
        interview.interactions.filter((i) => i.answer && i.evaluation)
      );
    } catch (err) {
      console.error("Report generation failed:", err.message);
      report = { strengths: [], weaknesses: [], roadmap: "Report generation encountered an issue." };
    }

    const answered = interview.interactions.filter((i) => i.evaluation);
    const total = answered.length;
    const techScore = answered.reduce((s, i) => s + (i.evaluation.technicalScore || 0), 0);
    const depthScore = answered.reduce((s, i) => s + (i.evaluation.depthScore || 0), 0);
    const commScore = answered.reduce((s, i) => s + (i.evaluation.communicationScore || 0), 0);

    interview.status = "completed";
    interview.overallReport = {
      overallTechnicalScore: total ? techScore / total : 0,
      overallDepthScore: total ? depthScore / total : 0,
      overallCommunicationScore: total ? commScore / total : 0,
      strengths: report.strengths || [],
      weaknesses: report.weaknesses || [],
      roadmap: report.roadmap || "",
    };

    await interview.save();

    return res.status(200).json({
      success: true,
      evaluation,
      completed: true,
      report: interview.overallReport,
    });
  }

  // Generate next question
  const previousQuestions = interview.interactions.map((i) => i.question);
  let nextQuestion;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    nextQuestion = await generateNextQuestion(
      interview.interviewType,
      req.user._id.toString(),
      previousQuestions
    );
  } catch (err) {
    console.error("Next question generation failed:", err.message);
    nextQuestion = "Tell me more about your experience with the topic discussed.";
  }

  interview.interactions.push({ question: nextQuestion });
  await interview.save();

  res.status(200).json({
    success: true,
    evaluation,
    nextQuestion,
  });
});

export const endInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.body;
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

  const answeredQuestions = interview.interactions.filter((i) => i.answer && i.evaluation);
  const total = answeredQuestions.length;

  if (total === 0) {
    interview.status = "completed";
    interview.overallReport = {
      overallTechnicalScore: 0,
      overallDepthScore: 0,
      overallCommunicationScore: 0,
      strengths: [],
      weaknesses: [],
      roadmap: "No answers were submitted.",
    };
    await interview.save();
    return res.status(200).json({ success: true, report: interview.overallReport });
  }

  let report;
  try {
    report = await generateReport(answeredQuestions);
  } catch {
    report = { strengths: [], weaknesses: [], roadmap: "Report generation failed." };
  }

  const techScore = answeredQuestions.reduce((s, i) => s + (i.evaluation.technicalScore || 0), 0);
  const depthScore = answeredQuestions.reduce((s, i) => s + (i.evaluation.depthScore || 0), 0);
  const commScore = answeredQuestions.reduce((s, i) => s + (i.evaluation.communicationScore || 0), 0);

  interview.status = "completed";
  interview.overallReport = {
    overallTechnicalScore: total ? techScore / total : 0,
    overallDepthScore: total ? depthScore / total : 0,
    overallCommunicationScore: total ? commScore / total : 0,
    strengths: report.strengths || [],
    weaknesses: report.weaknesses || [],
    roadmap: report.roadmap || "",
  };

  await interview.save();
  res.status(200).json({ success: true, report: interview.overallReport });
});

export const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id,
    status: "completed",
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, interviews });
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }
  res.status(200).json({ success: true, interview });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id,
    status: "completed",
  });

  if (!interviews.length) {
    return res.status(200).json({ success: true, analytics: null });
  }

  // Group by interview type
  const byType = { resume: [], system_design: [], hr: [], dsa: [] };
  interviews.forEach((iv) => {
    const type = iv.interviewType || "resume";
    if (byType[type]) byType[type].push(iv);
  });

  const computeTypeStats = (list) => {
    if (!list.length) return null;
    let tech = 0, depth = 0, comm = 0;
    list.forEach((iv) => {
      tech += iv.overallReport?.overallTechnicalScore || 0;
      depth += iv.overallReport?.overallDepthScore || 0;
      comm += iv.overallReport?.overallCommunicationScore || 0;
    });
    return {
      count: list.length,
      avgTechnicalScore: tech / list.length,
      avgDepthScore: depth / list.length,
      avgCommunicationScore: comm / list.length,
    };
  };

  let strengths = [];
  let weaknesses = [];
  interviews.forEach((iv) => {
    strengths.push(...(iv.overallReport?.strengths || []));
    weaknesses.push(...(iv.overallReport?.weaknesses || []));
  });

  res.status(200).json({
    success: true,
    analytics: {
      totalInterviews: interviews.length,
      byType: {
        resume: computeTypeStats(byType.resume),
        system_design: computeTypeStats(byType.system_design),
        hr: computeTypeStats(byType.hr),
      },
      strengths,
      weaknesses,
    },
  });
});
