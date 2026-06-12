import generateResumeQuestion from "../agents/resumeAgent.js";
import asyncHandler from "../middleware/aysncHandler.js";
import Interview from "../models/interview.js";
import evaluateAnswer from "../agents/evaluationAgent.js";
import generateReport from "../agents/reportAgent.js";
import runGraph from "../langgraph/graph.js";

export const startInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    user: req.user._id,
    status: "active",
  });
  if (!interview) {
    const question = await generateResumeQuestion(req.user._id.toString());

    interview = await Interview.create({
      user: req.user._id,
      interactions: [
        {
          question,
        },
      ],
    });
  }
  const latestQuestion =
    interview.interactions[interview.interactions.length - 1];

  res.status(200).json({
    success: true,
    interviewId: interview._id,
    question: latestQuestion.question,
  });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { interviewId, answer } = req.body;

  const interview = await Interview.findById(interviewId);

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

  const currentInteraction =
    interview.interactions[interview.interactions.length - 1];

  const evaluation = await evaluateAnswer(currentInteraction.question, answer);

  currentInteraction.answer = answer;

  currentInteraction.evaluation = evaluation;

  const answeredQuestions = interview.interactions.filter(
    (item) => item.answer,
  ).length;

  const state = {
    userId: req.user._id.toString(),

    questionCount: answeredQuestions,

    interactions: interview.interactions,
  };

  const updatedState = await runGraph(state);
  if (updatedState.completed) {
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      success: true,

      evaluation,

      completed: true,

      message: "Interview completed. Generate report.",
    });
  }

  const nextQuestion = updatedState.question;

  interview.interactions.push({
    question: nextQuestion,
  });

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

  const answeredQuestions = interview.interactions.filter(
    (item) => item.answer,
  );

  const total = answeredQuestions.length;

  const technicalScore = answeredQuestions.reduce(
    (sum, item) => sum + item.evaluation.technicalScore,
    0,
  );

  const depthScore = answeredQuestions.reduce(
    (sum, item) => sum + item.evaluation.depthScore,
    0,
  );

  const communicationScore = answeredQuestions.reduce(
    (sum, item) => sum + item.evaluation.communicationScore,
    0,
  );

  const report = await generateReport(answeredQuestions);

  interview.status = "completed";

  interview.overallReport = {
    overallTechnicalScore: total ? technicalScore / total : 0,

    overallDepthScore: total ? depthScore / total : 0,

    overallCommunicationScore: total ? communicationScore / total : 0,

    strengths: report.strengths,

    weaknesses: report.weaknesses,

    roadmap: report.roadmap,
  };

  await interview.save();

  res.status(200).json({
    success: true,

    report: interview.overallReport,
  });
});

export const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id,
    status: "completed",
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    interviews,
  });
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);

    throw new Error("Interview not found");
  }

  res.status(200).json({
    success: true,
    interview,
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id,
    status: "completed",
  });

  if (!interviews.length) {
    return res.status(200).json({
      success: true,
      analytics: null,
    });
  }

  let totalTechnical = 0;
  let totalDepth = 0;
  let totalCommunication = 0;

  let strengths = [];
  let weaknesses = [];

  interviews.forEach((interview) => {
    totalTechnical += interview.overallReport?.overallTechnicalScore || 0;

    totalDepth += interview.overallReport?.overallDepthScore || 0;

    totalCommunication +=
      interview.overallReport?.overallCommunicationScore || 0;

    strengths.push(...(interview.overallReport?.strengths || []));

    weaknesses.push(...(interview.overallReport?.weaknesses || []));
  });

  res.status(200).json({
    success: true,

    analytics: {
      totalInterviews: interviews.length,

      avgTechnicalScore: totalTechnical / interviews.length,

      avgDepthScore: totalDepth / interviews.length,

      avgCommunicationScore: totalCommunication / interviews.length,

      strengths,

      weaknesses,
    },
  });
});
