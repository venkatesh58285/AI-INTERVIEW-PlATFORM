import React from "react";

const AnalyticsCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendDirection = "up",
}) => {
  const isPositive = trendDirection === "up";

  return (
    <div className="bg-dark-900/40 border border-dark-800 rounded-2xl p-6 hover:border-dark-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        {trend && (
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-lg ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {isPositive ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          {subtitle && (
            <span className="text-xs text-slate-500">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
