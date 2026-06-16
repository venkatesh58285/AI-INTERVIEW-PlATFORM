import React, { useState } from "react";
import { Send, AlertCircle } from "lucide-react";

const AnswerBox = ({
  onSubmit,
  loading,
  placeholder = "Type your answer here...",
}) => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!answer.trim()) {
      setError("Answer cannot be empty");
      return;
    }

    if (answer.trim().length < 10) {
      setError("Answer must be at least 10 characters");
      return;
    }

    onSubmit(answer);
    setAnswer("");
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-dark-900/40 border border-dark-800 rounded-2xl p-4 focus-within:border-indigo-500/50 transition-colors">
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError("");
            }}
            placeholder={placeholder}
            disabled={loading}
            rows={6}
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none resize-none text-sm leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {answer.length} / 500 characters
          </div>
          <button
            type="submit"
            disabled={loading || !answer.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>{loading ? "Submitting..." : "Submit Answer"}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerBox;
