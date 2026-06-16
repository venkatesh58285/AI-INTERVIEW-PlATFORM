# AI Interview Platform

A full-stack AI-powered mock interview platform that conducts technical interviews using multiple AI agents. Features resume-based questions (RAG), system design, HR behavioral rounds, and DSA coding challenges with real-time AI evaluation, voice input/output, and detailed performance analytics.

## Features

- **Multi-Round Interviews**: Resume-based, System Design, HR & Behavioral, DSA & Coding
- **AI Evaluation**: Real-time scoring on Technical, Depth, and Communication (0-10)
- **Voice Mode**: Browser-native speech-to-text (speak answers) and text-to-speech (hear questions)
- **RAG Pipeline**: Resume parsing + embedding + semantic retrieval for personalized questions
- **DSA Round**: AI-generated coding problems with LeetCode & Codeforces links
- **Analytics Dashboard**: Vertical bar charts comparing scores across interview types
- **Report Generation**: AI-generated strengths, weaknesses, and learning roadmap
- **JWT Authentication**: Secure user registration and login

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router 7 |
| Backend | Node.js, Express 5, Mongoose |
| AI/LLM | Groq (Llama 3.3 70B), LangChain |
| Embeddings | Xenova/all-MiniLM-L6-v2 (local, no API cost) |
| Database | MongoDB Atlas |
| Voice | Web Speech API (browser-native) |
| PDF Parsing | pdf-parse v2 |

## Folder Structure

```
ai-interview-platform/
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── resumeAgent.js         # RAG-based resume questions
│   │   │   ├── systemDesignAgent.js    # System design questions
│   │   │   ├── hrAgent.js             # HR behavioral questions
│   │   │   ├── dsaAgent.js            # DSA problems with links
│   │   │   ├── evaluationAgent.js     # Answer scoring (0-10)
│   │   │   └── reportAgent.js         # Final report generation
│   │   ├── config/
│   │   │   ├── db.js                  # MongoDB connection
│   │   │   └── multer.js             # File upload config
│   │   ├── controllers/
│   │   │   ├── authController.js      # Register/Login
│   │   │   ├── interviewController.js # Interview CRUD + AI orchestration
│   │   │   ├── resumeController.js    # PDF upload + embedding
│   │   │   └── testController.js      # RAG test endpoint
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT verification
│   │   │   ├── aysncHandler.js        # Async error wrapper
│   │   │   └── errorMiddleware.js     # Global error handler
│   │   ├── models/
│   │   │   ├── User.js               # User schema
│   │   │   ├── Interview.js          # Interview + interactions schema
│   │   │   └── Embedding.js          # Vector embeddings schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── interviewRoutes.js
│   │   │   ├── resumeRoutes.js
│   │   │   └── testRoutes.js
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   └── groqModel.js       # Groq LLM singleton
│   │   │   └── rag/
│   │   │       ├── chunkText.js       # Text chunking
│   │   │       ├── embedResume.js     # Store embeddings in MongoDB
│   │   │       ├── generateEmbeddings.js  # Local embedding model
│   │   │       └── retriveResumeContext.js # Cosine similarity search
│   │   ├── utils/
│   │   │   └── generateToken.js       # JWT token generation
│   │   └── server.js                  # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── render.yaml                    # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Route/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── AnalyticsCard.jsx
│   │   │   ├── AnswerBox.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ReportCard.jsx
│   │   │   ├── ResumeUploader.jsx
│   │   │   └── ScoreCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Auth state management
│   │   │   └── InterviewContext.jsx   # Interview session state
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useForm.js
│   │   │   ├── useInterview.js
│   │   │   └── useLocalStorage.js
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx          # Vertical bar charts by type
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Interview.jsx          # Type selection + voice + DSA
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Report.jsx
│   │   │   └── ResumeUpload.jsx
│   │   ├── routes/
│   │   │   └── index.jsx
│   │   ├── services/
│   │   │   └── api.js                 # Axios instance with interceptors
│   │   ├── utils/
│   │   │   ├── errorHandler.js
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                  # Tailwind + custom theme
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitattributes
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
# Clone
git clone https://github.com/your-username/ai-interview-platform.git
cd ai-interview-platform

# Backend
cd backend
npm install
cp .env.example .env   # Fill in your credentials
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```

**frontend/.env** (optional for local dev)
```
VITE_API_URL=http://localhost:5000/api
```

### Run Locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deployment

### Backend → Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo, set root directory to `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables (MONGO_URI, JWT_SECRET, GROQ_API_KEY, FRONTEND_URL, NODE_ENV=production)

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Import GitHub repo
2. Set root directory to `frontend`
3. Framework: Vite
4. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Live Links

| Service | URL |
|---------|-----|
| Frontend | https://ai-interview-pl-atform.vercel.app |
| Backend API | https://ai-interview-platform-cske.onrender.com |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/resume/upload | Upload resume PDF |
| POST | /api/interview/start | Start interview (type + question count) |
| POST | /api/interview/answer | Submit answer, get evaluation |
| POST | /api/interview/end | End interview, generate report |
| GET | /api/interview/history | Get completed interviews |
| GET | /api/interview/analytics | Get analytics by type |
| GET | /api/interview/:id | Get specific interview |

## How It Works

1. **Upload Resume** → PDF parsed → text chunked → embeddings generated locally → stored in MongoDB
2. **Select Interview Type** → Resume / System Design / HR / DSA
3. **Choose Question Count** → 3 to 10 questions
4. **Answer Questions** → Type or speak (voice input) → AI evaluates in real-time
5. **View Evaluation** → Scores + suggestions shown after each answer
6. **Complete Round** → Go back to select another type or end session
7. **Generate Report** → AI-powered strengths, weaknesses, roadmap

## License

MIT
