import React from "react";
import { TrendingUp } from "lucide-react";

const ScoreCard = ({
  label,
  score,
  maxScore = 10,
  icon: Icon = TrendingUp,
  color = "indigo",
}) => {
  const percentage = (score / maxScore) * 100;
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-500",
      text: "text-indigo-400",
      light: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    violet: {
      bg: "bg-violet-500",
      text: "text-violet-400",
      light: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    emerald: {
      bg: "bg-emerald-500",
      text: "text-emerald-400",
      light: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <div className={`bg-dark-900/40 border ${colors.border} p-6 rounded-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center border ${colors.border}`}
        >
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-bold text-white">
            {score.toFixed(1)}
          </span>
          <span className="text-sm text-slate-400">/ {maxScore}</span>
        </div>

        <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bg} transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="text-xs text-slate-500">
          {percentage.toFixed(0)}% achieved
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
