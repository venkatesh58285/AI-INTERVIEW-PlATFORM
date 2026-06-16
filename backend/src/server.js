import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import testRoutes from "./routes/testRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
    ].filter(Boolean);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all in case of misconfiguration
  },
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("AI Interview Platform API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/test", testRoutes);
app.use("/api/interview", interviewRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
