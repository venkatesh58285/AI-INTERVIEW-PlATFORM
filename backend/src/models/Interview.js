import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  answer: {
    type: String,
    default: "",
  },

  evaluation: {
    technicalScore: Number,
    depthScore: Number,
    communicationScore: Number,

    strengths: [String],

    weaknesses: [String],

    improvement: String,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    interviewType: {
      type: String,
      enum: ["resume", "system_design", "hr", "dsa"],
      default: "resume",
    },

    totalQuestions: {
      type: Number,
      default: 6,
      min: 3,
      max: 10,
    },

    currentRound: {
      type: String,
      default: "resume",
    },

    interactions: [interactionSchema],
    overallReport: {
      overallTechnicalScore: Number,
      overallDepthScore: Number,
      overallCommunicationScore: Number,

      strengths: [String],

      weaknesses: [String],

      roadmap: String,
    },
  },
  {
    timestamps: true,
  },
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
