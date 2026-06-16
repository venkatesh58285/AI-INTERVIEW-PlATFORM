import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [activeInterviewId, setActiveInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [finalReport, setFinalReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interviewType, setInterviewType] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(6);

  const startOrResumeInterview = async (type = 'resume', numQuestions = 6) => {
    setLoading(true);
    setError(null);
    setCompleted(false);
    setLastEvaluation(null);
    setFinalReport(null);
    try {
      const response = await api.post('/interview/start', {
        interviewType: type,
        totalQuestions: numQuestions,
      });
      const { interviewId, question, interviewType: iType, totalQuestions: tq } = response.data;
      setActiveInterviewId(interviewId);
      setCurrentQuestion(question);
      setInterviewType(iType);
      setTotalQuestions(tq);
      return { success: true, question };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to start interview session.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const submitCandidateAnswer = async (answer) => {
    if (!activeInterviewId) {
      setError('No active interview session.');
      return { success: false };
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/interview/answer', {
        interviewId: activeInterviewId,
        answer,
      });

      const { evaluation, completed: isCompleted, nextQuestion, report } = response.data;
      setLastEvaluation(evaluation);

      if (isCompleted) {
        setCompleted(true);
        setFinalReport(report);
      }

      return { success: true, completed: isCompleted, nextQuestion, evaluation, report };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit answer.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const forceEndInterview = async () => {
    if (!activeInterviewId) return { success: false };
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/interview/end', {
        interviewId: activeInterviewId,
      });
      const { report } = response.data;
      setCompleted(true);
      setFinalReport(report);
      return { success: true, report };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to end interview.';
      setError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const advanceToNextQuestion = (nextQuestion) => {
    setCurrentQuestion(nextQuestion);
    setLastEvaluation(null);
  };

  return (
    <InterviewContext.Provider
      value={{
        activeInterviewId,
        currentQuestion,
        lastEvaluation,
        completed,
        finalReport,
        loading,
        error,
        interviewType,
        totalQuestions,
        startOrResumeInterview,
        submitCandidateAnswer,
        forceEndInterview,
        advanceToNextQuestion,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => useContext(InterviewContext);
export default InterviewContext;
