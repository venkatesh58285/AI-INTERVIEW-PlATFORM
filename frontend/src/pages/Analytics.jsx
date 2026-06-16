import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  BarChart3, CheckCircle, AlertCircle, TrendingUp, AlertTriangle, FileText, Cpu, Users
} from 'lucide-react';

const TYPE_CONFIG = {
  resume: { label: 'Resume Based', color: '#6366f1', icon: FileText },
  system_design: { label: 'System Design', color: '#8b5cf6', icon: Cpu },
  hr: { label: 'HR & Behavioral', color: '#10b981', icon: Users },
  dsa: { label: 'DSA & Coding', color: '#f59e0b', icon: BarChart3 },
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/interview/analytics');
        setAnalytics(response.data.analytics);
      } catch (err) {
        setError('Failed to fetch analytics details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <span className="text-sm text-slate-500">Compiling Analytics Data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Error</h2>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20 bg-dark-900/40 border border-dark-800 rounded-3xl max-w-4xl mx-auto">
        <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white">No Analytics Available</h3>
        <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
          Complete at least one interview session to populate performance metrics.
        </p>
      </div>
    );
  }

  const { totalInterviews, byType, strengths = [], weaknesses = [] } = analytics;
  const uniqueStrengths = [...new Set(strengths)].slice(0, 5);
  const uniqueWeaknesses = [...new Set(weaknesses)].slice(0, 5);

  // Build vertical bar chart data
  const typeEntries = Object.entries(byType || {}).filter(([, v]) => v !== null);
  const categories = ['Technical', 'Depth', 'Communication'];

  // SVG Vertical Bar Chart
  const VerticalBarChart = () => {
    if (typeEntries.length === 0) return <p className="text-xs text-slate-500 italic">No data yet.</p>;

    const barWidth = 36;
    const groupGap = 50;
    const barGap = 6;
    const chartHeight = 200;
    const maxVal = 10;
    const groupWidth = typeEntries.length * (barWidth + barGap);
    const totalWidth = categories.length * (groupWidth + groupGap);

    return (
      <div className="overflow-x-auto">
        <svg width={Math.max(totalWidth + 80, 400)} height={chartHeight + 80} className="mx-auto">
          {/* Y-axis labels */}
          {[0, 2, 4, 6, 8, 10].map((val) => {
            const y = chartHeight - (val / maxVal) * chartHeight + 20;
            return (
              <g key={val}>
                <text x="25" y={y + 4} className="text-[10px]" fill="#64748b" textAnchor="end">{val}</text>
                <line x1="35" y1={y} x2={totalWidth + 60} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4" />
              </g>
            );
          })}

          {/* Bars */}
          {categories.map((cat, catIdx) => {
            const groupX = 45 + catIdx * (groupWidth + groupGap);
            return (
              <g key={cat}>
                {/* Category label */}
                <text
                  x={groupX + groupWidth / 2}
                  y={chartHeight + 45}
                  textAnchor="middle"
                  fill="#94a3b8"
                  className="text-[11px]"
                  fontWeight="600"
                >
                  {cat}
                </text>

                {/* Bars for each type */}
                {typeEntries.map(([type, stats], typeIdx) => {
                  const val = cat === 'Technical' ? stats.avgTechnicalScore :
                              cat === 'Depth' ? stats.avgDepthScore : stats.avgCommunicationScore;
                  const barHeight = (val / maxVal) * chartHeight;
                  const x = groupX + typeIdx * (barWidth + barGap);
                  const y = chartHeight - barHeight + 20;
                  const config = TYPE_CONFIG[type];

                  return (
                    <g key={`${cat}-${type}`}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={config?.color || '#475569'}
                        rx="4"
                        className="transition-all duration-700"
                        opacity="0.85"
                      />
                      {/* Value label on top */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 6}
                        textAnchor="middle"
                        fill="#e2e8f0"
                        className="text-[9px]"
                        fontWeight="bold"
                      >
                        {Math.round(val * 10) / 10}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          {typeEntries.map(([type]) => {
            const config = TYPE_CONFIG[type];
            return (
              <div key={type} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: config?.color || '#475569' }} />
                <span className="text-xs text-slate-400">{config?.label || type}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Capability Analytics</h1>
        <p className="text-slate-400 mt-1 text-sm">Performance breakdown across interview types.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-2xl">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total Interviews</div>
          <div className="text-3xl font-bold mt-2 text-white">{totalInterviews}</div>
        </div>
        {typeEntries.map(([type, stats]) => {
          const config = TYPE_CONFIG[type];
          const Icon = config?.icon || BarChart3;
          return (
            <div key={type} className="bg-dark-900/40 border border-dark-800 p-6 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: config?.color }} />
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{config?.label}</div>
              </div>
              <div className="text-2xl font-bold text-white">{stats.count} sessions</div>
            </div>
          );
        })}
      </div>

      {/* Vertical Bar Chart */}
      <div className="bg-dark-900/40 border border-dark-800 p-8 rounded-3xl shadow-lg space-y-6">
        <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Score Comparison by Interview Type</span>
        </div>
        <VerticalBarChart />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-dark-900/30 border border-dark-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Top Strengths</span>
          </div>
          {uniqueStrengths.length === 0 ? (
            <span className="text-xs text-slate-500 italic block">No strengths reported yet.</span>
          ) : (
            <ul className="space-y-3">
              {uniqueStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 bg-dark-950/40 border border-dark-800 p-3 rounded-xl">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-dark-900/30 border border-dark-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center space-x-2 text-xs text-amber-500 font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Areas for Improvement</span>
          </div>
          {uniqueWeaknesses.length === 0 ? (
            <span className="text-xs text-slate-500 italic block">No weaknesses reported yet.</span>
          ) : (
            <ul className="space-y-3">
              {uniqueWeaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 bg-dark-950/40 border border-dark-800 p-3 rounded-xl">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
