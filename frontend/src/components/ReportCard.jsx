import React from "react";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

const ReportCard = ({ title, items = [], type = "strengths" }) => {
  const isStrengths = type === "strengths";
  const Icon = isStrengths ? CheckCircle2 : AlertTriangle;
  const iconColor = isStrengths ? "text-emerald-400" : "text-amber-400";
  const bgColor = isStrengths
    ? "bg-emerald-500/10 border-emerald-500/20"
    : "bg-amber-500/10 border-amber-500/20";

  return (
    <div className={`bg-dark-900/40 border ${bgColor} rounded-2xl p-6`}>
      <div className="flex items-center space-x-3 mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="text-sm font-semibold text-white capitalize">{title}</h3>
      </div>

      <ul className="space-y-2">
        {items && items.length > 0 ? (
          items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-2 text-xs text-slate-300"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isStrengths ? "bg-emerald-400" : "bg-amber-400"}`}
              />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-slate-500 italic">
            No {type} identified
          </li>
        )}
      </ul>
    </div>
  );
};

export default ReportCard;
