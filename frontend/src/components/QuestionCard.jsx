import React from "react";
import { HelpCircle } from "lucide-react";

const QuestionCard = ({ question, questionNumber, totalQuestions }) => {
  return (
    <div className="w-full bg-dark-900/40 border border-dark-800 rounded-3xl p-8 shadow-lg backdrop-blur-xl animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Question {questionNumber} of {totalQuestions}
            </div>
            <div className="w-32 h-1 bg-dark-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-lg font-semibold text-white leading-relaxed">
            {question}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
