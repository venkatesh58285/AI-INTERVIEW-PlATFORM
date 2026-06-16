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

// Test endpoint
router.get("/test", (req, res) => {
  res.status(200).json({ success: true, message: "Test endpoint working" });
});

router.post("/start", protect, startInterview);
router.post("/answer", protect, submitAnswer);
router.post("/end", protect, endInterview);
router.get("/history", protect, getInterviewHistory);
router.get("/analytics", protect, getAnalytics);
router.get("/:id", protect, getInterviewById);

export default router;
