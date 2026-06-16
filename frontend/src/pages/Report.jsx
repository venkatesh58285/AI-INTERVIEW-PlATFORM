import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ArrowLeft 
} from 'lucide-react';

const Report = () => {
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get('id');
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      if (!interviewId) {
        setError('No interview ID provided.');
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/interview/${interviewId}`);
        setInterview(response.data.interview);
      } catch (err) {
        setError('Failed to fetch interview report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <span className="text-sm text-slate-500">Compiling Report Analytics...</span>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Error</h2>
        <p className="text-slate-400 text-sm">{error || 'Interview report not found.'}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-dark-900 border border-dark-800 rounded-xl text-xs text-indigo-400 font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { overallReport, interactions } = interview;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-dark-900/60 border border-dark-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Interview Assessment</h1>
          <p className="text-slate-400 mt-0.5 text-xs">
            Session ID: {interviewId.toUpperCase()} • Completed on {new Date(interview.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* overall report not ready */}
      {!overallReport ? (
        <div className="p-8 bg-dark-900/40 border border-dark-800 rounded-3xl text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Evaluation Pending</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            This interview session didn't finalize completely or was closed prematurely. Generate the summary report by clicking end.
          </p>
        </div>
      ) : (
        <>
          {/* Circular Score Rings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-md">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Technical Score</span>
              <div className="w-24 h-24 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-dark-800" strokeWidth="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-indigo-500" strokeWidth="8" fill="transparent"
                    strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (overallReport.overallTechnicalScore || 0)) / 10} />
                </svg>
                <span className="absolute text-xl font-bold text-slate-100">{overallReport.overallTechnicalScore || 0}/10</span>
              </div>
            </div>

            <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-md">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Depth of Response</span>
              <div className="w-24 h-24 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-dark-800" strokeWidth="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-violet-500" strokeWidth="8" fill="transparent"
                    strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (overallReport.overallDepthScore || 0)) / 10} />
                </svg>
                <span className="absolute text-xl font-bold text-slate-100">{overallReport.overallDepthScore || 0}/10</span>
              </div>
            </div>

            <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-md">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Communication Skill</span>
              <div className="w-24 h-24 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-dark-800" strokeWidth="8" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-emerald-500" strokeWidth="8" fill="transparent"
                    strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (overallReport.overallCommunicationScore || 0)) / 10} />
                </svg>
                <span className="absolute text-xl font-bold text-slate-100">{overallReport.overallCommunicationScore || 0}/10</span>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="bg-dark-900/30 border border-dark-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identified Strengths</span>
              </div>
              <ul className="space-y-3">
                {overallReport.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
                {(!overallReport.strengths || overallReport.strengths.length === 0) && (
                  <span className="text-xs text-slate-500 block italic">No specific strengths listed.</span>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-dark-900/30 border border-dark-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-xs text-amber-500 font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </div>
              <ul className="space-y-3">
                {overallReport.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
                {(!overallReport.weaknesses || overallReport.weaknesses.length === 0) && (
                  <span className="text-xs text-slate-500 block italic">No explicit weaknesses listed.</span>
                )}
              </ul>
            </div>
          </div>

          {/* Custom AI Roadmap */}
          <div className="bg-dark-900/40 border border-dark-800 p-8 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Personalized Learning & Skill Roadmap</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-mono bg-dark-950 p-4 border border-dark-850 rounded-2xl">
              {overallReport.roadmap || 'No learning roadmap could be compiled.'}
            </p>
          </div>
        </>
      )}

      {/* Individual Question Walkthrough */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-dark-800 pb-3">Session Log Details</h2>
        <div className="space-y-6">
          {interactions.map((interaction, idx) => (
            <div key={interaction._id || idx} className="bg-dark-900/20 border border-dark-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 bg-dark-900/40 border-b border-dark-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold uppercase">Question {idx + 1}</span>
                <span className="text-[10px] bg-dark-950 px-2 py-0.5 border border-dark-850 rounded text-slate-500">
                  {idx < 3 ? 'Resume Tech Node' : 'HR Behavioral Node'}
                </span>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Question */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-indigo-400 uppercase">Question</div>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed">{interaction.question}</p>
                </div>

                {/* Answer */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-violet-400 uppercase">Answer Submitted</div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-dark-950/40 p-3 rounded-xl border border-dark-850">{interaction.answer || 'No answer recorded.'}</p>
                </div>

                {/* Question level evaluation */}
                {interaction.evaluation && (
                  <div className="p-4 bg-dark-900/30 border border-dark-800 rounded-2xl space-y-3 mt-4">
                    <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Node Evaluation breakdown</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="py-2 bg-dark-950/40 border border-dark-850 rounded-xl">
                        <div className="text-[9px] text-slate-500">Technical</div>
                        <div className="text-xs font-bold text-slate-300">{interaction.evaluation.technicalScore}/10</div>
                      </div>
                      <div className="py-2 bg-dark-950/40 border border-dark-850 rounded-xl">
                        <div className="text-[9px] text-slate-500">Depth</div>
                        <div className="text-xs font-bold text-slate-300">{interaction.evaluation.depthScore}/10</div>
                      </div>
                      <div className="py-2 bg-dark-950/40 border border-dark-850 rounded-xl">
                        <div className="text-[9px] text-slate-500">Communication</div>
                        <div className="text-xs font-bold text-slate-300">{interaction.evaluation.communicationScore}/10</div>
                      </div>
                    </div>

                    {interaction.evaluation.improvement && (
                      <div className="text-[11px] text-slate-400 leading-relaxed border-t border-dark-850 pt-2.5">
                        <span className="font-semibold text-slate-300">Target Area for Improvement:</span> {interaction.evaluation.improvement}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
