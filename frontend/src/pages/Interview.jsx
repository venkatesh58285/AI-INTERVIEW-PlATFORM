import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { useAuth } from '../context/AuthContext';
import { 
  Play, Send, CheckCircle, HelpCircle, TrendingUp, 
  ShieldAlert, ArrowRight, FileText, Users, Cpu, CheckCircle2,
  Volume2, Mic, MicOff, Code, ExternalLink
} from 'lucide-react';

const INTERVIEW_TYPES = [
  { id: 'resume', label: 'Resume Based', description: 'Questions from your resume, projects & skills', icon: FileText, color: 'indigo' },
  { id: 'system_design', label: 'System Design', description: 'Scalable systems, databases, architecture', icon: Cpu, color: 'violet' },
  { id: 'hr', label: 'HR & Behavioral', description: 'Leadership, teamwork, conflict resolution', icon: Users, color: 'emerald' },
  { id: 'dsa', label: 'DSA & Coding', description: 'Data structures, algorithms, LeetCode problems', icon: Code, color: 'amber' },
];

// --- Voice Helpers ---
const speakText = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};

const Interview = () => {
  const { user } = useAuth();
  const {
    activeInterviewId, currentQuestion, lastEvaluation, completed,
    loading, error, totalQuestions, interviewType,
    startOrResumeInterview, submitCandidateAnswer, forceEndInterview, advanceToNextQuestion,
  } = useInterview();

  const [answer, setAnswer] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [pendingNextQuestion, setPendingNextQuestion] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCount, setSelectedCount] = useState(5);
  const [step, setStep] = useState('select_type');
  const [completedTypes, setCompletedTypes] = useState([]);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.resumeURI) navigate('/upload');
  }, [user, navigate]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setAnswer(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setAnswer('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Parse DSA question (it's JSON stringified)
  const parseDSAQuestion = (q) => {
    try { return JSON.parse(q); } catch { return null; }
  };

  const handleTypeSelect = (type) => { setSelectedType(type); setStep('select_count'); };

  const handleStart = async () => {
    const res = await startOrResumeInterview(selectedType, selectedCount);
    if (res.success) {
      setSessionStarted(true);
      setStep('running');
      setAnswer('');
      setAnsweredCount(0);
      setAwaitingNext(false);
      setPendingNextQuestion('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
    const res = await submitCandidateAnswer(answer);
    if (res.success) {
      setAnsweredCount((prev) => prev + 1);
      setAwaitingNext(true);
      setPendingNextQuestion(res.completed ? '' : (res.nextQuestion || ''));
    }
  };

  const handleNextQuestion = () => {
    advanceToNextQuestion(pendingNextQuestion);
    setAnswer('');
    setAwaitingNext(false);
    setPendingNextQuestion('');
  };

  const handleRoundComplete = () => {
    setCompletedTypes((prev) => [...new Set([...prev, interviewType])]);
    setSessionStarted(false);
    setStep('select_type');
    setAwaitingNext(false);
    setAnswer('');
    setAnsweredCount(0);
    setPendingNextQuestion('');
  };

  const handleEndAndReport = async () => {
    const res = await forceEndInterview();
    if (res.success) navigate(`/report?id=${activeInterviewId}`);
  };

  // Step 1: Select type
  if (step === 'select_type' && !sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Choose Interview Type</h1>
          <p className="text-slate-400 text-sm">Select the category you want to practice</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {INTERVIEW_TYPES.map((type) => {
            const Icon = type.icon;
            const isCompleted = completedTypes.includes(type.id);
            const colorMap = {
              indigo: 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500/60',
              violet: 'border-violet-500/30 bg-violet-500/5 hover:border-violet-500/60',
              emerald: 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60',
              amber: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60',
            };
            const iconMap = { indigo: 'text-indigo-400', violet: 'text-violet-400', emerald: 'text-emerald-400', amber: 'text-amber-400' };
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`relative p-5 rounded-2xl border-2 ${colorMap[type.color]} transition-all duration-300 text-left space-y-3 cursor-pointer`}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-dark-950/60 flex items-center justify-center border border-dark-800">
                  <Icon className={`w-5 h-5 ${iconMap[type.color]}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{type.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{type.description}</p>
                  {isCompleted && <p className="text-[11px] text-emerald-400 mt-1 font-semibold">✓ Completed</p>}
                </div>
              </button>
            );
          })}
        </div>
        {completedTypes.length > 0 && (
          <div className="text-center pt-4 space-y-3">
            <p className="text-xs text-slate-500">{completedTypes.length} of 4 rounds completed</p>
            <button onClick={() => navigate('/history')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm inline-flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>View Reports & History</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Select count
  if (step === 'select_count' && !sessionStarted) {
    const typeInfo = INTERVIEW_TYPES.find((t) => t.id === selectedType);
    return (
      <div className="max-w-lg mx-auto py-12 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-extrabold text-white">{typeInfo?.label}</h1>
          <p className="text-slate-400 text-sm">How many questions?</p>
        </div>
        <div className="bg-dark-900/40 border border-dark-800 p-8 rounded-3xl space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Questions</span>
              <span className="text-white font-bold text-lg">{selectedCount}</span>
            </div>
            <input type="range" min="3" max="10" value={selectedCount} onChange={(e) => setSelectedCount(Number(e.target.value))} className="w-full h-2 bg-dark-800 rounded-full appearance-none cursor-pointer accent-indigo-500" />
            <div className="flex justify-between text-xs text-slate-500"><span>3 min</span><span>10 max</span></div>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => setStep('select_type')} className="flex-1 py-3 rounded-xl bg-dark-950 border border-dark-800 text-slate-400 text-sm font-medium">Back</button>
            <button onClick={handleStart} disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center space-x-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Play className="w-4 h-4 fill-current" /><span>Start</span></>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Running
  const qTotal = totalQuestions || 6;
  const typeLabel = INTERVIEW_TYPES.find((t) => t.id === interviewType)?.label || 'Interview';
  const isDSA = interviewType === 'dsa';
  const dsaData = isDSA ? parseDSAQuestion(currentQuestion) : null;
  const displayQuestion = isDSA && dsaData ? dsaData.description : currentQuestion;
  const speakableQuestion = isDSA && dsaData ? `${dsaData.title}. ${dsaData.description}` : currentQuestion;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Sidebar */}
      <div className="lg:col-span-4 bg-dark-900/30 border border-dark-800 p-6 rounded-3xl flex flex-col justify-between h-fit space-y-8">
        <div className="space-y-6">
          <div>
            <div className="text-xs text-indigo-400 font-semibold uppercase tracking-widest">{typeLabel}</div>
            <h2 className="text-xl font-bold mt-1 text-white">Q {Math.min(answeredCount + (awaitingNext ? 0 : 1), qTotal)} / {qTotal}</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400"><span>Progress</span><span>{Math.round((answeredCount / qTotal) * 100)}%</span></div>
            <div className="w-full h-2 bg-dark-950 rounded-full overflow-hidden border border-dark-800">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500" style={{ width: `${(answeredCount / qTotal) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-dark-800/60">
          <button onClick={handleEndAndReport} disabled={loading || completed} className="w-full py-2.5 rounded-xl bg-dark-950 border border-dark-800 hover:border-red-500/20 hover:bg-red-500/5 text-slate-400 hover:text-red-400 text-xs font-medium transition-all disabled:opacity-50">
            End Interview & Generate Report
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="lg:col-span-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" /><span>{error}</span>
          </div>
        )}

        {/* Question Panel */}
        <div className="bg-dark-900/40 border border-dark-800 p-8 rounded-3xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold tracking-wider uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>Question {Math.min(answeredCount + (awaitingNext ? 0 : 1), qTotal)}</span>
            </div>
            {/* Voice: Hear Question */}
            <button
              onClick={() => handleSpeak(speakableQuestion)}
              className={`p-2 rounded-lg border transition-all ${isSpeaking ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-dark-950/60 border-dark-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30'}`}
              title={isSpeaking ? "Stop speaking" : "Listen to question"}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* DSA specific display */}
          {isDSA && dsaData ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-white">{dsaData.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  dsaData.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  dsaData.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>{dsaData.difficulty}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dsaData.topics?.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-dark-950/60 border border-dark-800 rounded text-slate-400">{t}</span>
                ))}
              </div>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{dsaData.description}</p>
              <div className="flex space-x-3 pt-2">
                {dsaData.leetcodeUrl && (
                  <a href={dsaData.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /><span>LeetCode</span>
                  </a>
                )}
                {dsaData.codeforcesUrl && (
                  <a href={dsaData.codeforcesUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /><span>Codeforces</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-lg text-slate-100 font-medium leading-relaxed">{displayQuestion || 'Loading...'}</p>
          )}
        </div>

        {/* Answer Box */}
        {!awaitingNext && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-dark-900/40 border border-dark-800 rounded-3xl p-6 shadow-lg flex flex-col space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider">
                  {isDSA ? 'Describe Your Approach' : 'Your Answer'}
                </span>
                <div className="flex items-center space-x-3">
                  <span>{answer.length} chars</span>
                  {/* Voice: Speak Answer */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2 rounded-lg border transition-all ${isListening ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse' : 'bg-dark-950/60 border-dark-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30'}`}
                    title={isListening ? "Stop recording" : "Speak your answer"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {isListening && (
                <div className="flex items-center space-x-2 text-xs text-red-400 animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Listening... speak now</span>
                </div>
              )}
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full h-44 bg-dark-950 border border-dark-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl p-4 resize-none outline-none text-slate-300 text-sm transition-all"
                placeholder={isDSA ? "Explain your approach: time/space complexity, data structures used, algorithm steps..." : "Provide a detailed answer..."}
                required
                disabled={loading}
              />
              <div className="flex justify-end">
                <button type="submit" disabled={loading || !answer.trim()} className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                  {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Evaluating...</span></>) : (<><Send className="w-4 h-4" /><span>Submit Answer</span></>)}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Evaluation */}
        {awaitingNext && lastEvaluation && (
          <div className="bg-dark-900/20 border border-dark-800 p-6 rounded-3xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                <TrendingUp className="w-4 h-4" /><span>AI Evaluation</span>
              </div>
              {/* Voice: Hear Feedback */}
              <button
                onClick={() => handleSpeak(`Technical score ${lastEvaluation.technicalScore} out of 10. Depth score ${lastEvaluation.depthScore} out of 10. Communication score ${lastEvaluation.communicationScore} out of 10. ${lastEvaluation.improvement || ''}`)}
                className="p-2 rounded-lg bg-dark-950/60 border border-dark-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                title="Listen to feedback"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl text-center">
                <div className="text-[10px] text-slate-500">Technical</div>
                <div className="text-sm font-bold text-slate-200">{lastEvaluation.technicalScore}/10</div>
              </div>
              <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl text-center">
                <div className="text-[10px] text-slate-500">Depth</div>
                <div className="text-sm font-bold text-slate-200">{lastEvaluation.depthScore}/10</div>
              </div>
              <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl text-center">
                <div className="text-[10px] text-slate-500">Communication</div>
                <div className="text-sm font-bold text-slate-200">{lastEvaluation.communicationScore}/10</div>
              </div>
            </div>
            {lastEvaluation.improvement && (
              <div className="text-xs text-slate-400"><span className="font-semibold text-slate-300">Suggestion:</span> {lastEvaluation.improvement}</div>
            )}
            <div className="pt-4 border-t border-dark-800/50">
              {completed ? (
                <button onClick={handleRoundComplete} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" /><span>Round Complete — Choose Next</span>
                </button>
              ) : (
                <button onClick={handleNextQuestion} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm flex items-center justify-center space-x-2">
                  <ArrowRight className="w-4 h-4" /><span>Next Question</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;
