import {
  startInterview,
  submitAnswer,
  endInterview,
  getInterviewHistory,
  getInterviewById,
  getAnalytics
} from "../controllers/interviewController.js";
import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/start", protect, startInterview);
router.post("/answer", protect, submitAnswer);
router.post("/end", protect, endInterview);
router.get("/history", protect, getInterviewHistory);
router.get("/:id", protect, getInterviewById);
router.get("/analytics", protect, getAnalytics);

export default router;
