import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Award, ChevronRight, ClipboardList, AlertTriangle } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/interview/history');
        setHistory(response.data.interviews || []);
      } catch (err) {
        setError('Failed to load interview history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <span className="text-sm text-slate-500">Retrieving History Log...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Interview History</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Review all your completed technical evaluations, scores, and historical summaries.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-20 bg-dark-900/40 border border-dark-800 rounded-3xl shadow">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No Evaluations Found</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            Once you complete an AI Interview Session, your evaluation logs and learning roadmap will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-dark-900/40 border border-dark-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-850 bg-dark-900/80">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Interview ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tech Score</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Depth</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Comm Score</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-850">
                {history.map((item) => {
                  const tech = item.overallReport?.overallTechnicalScore || 0;
                  const depth = item.overallReport?.overallDepthScore || 0;
                  const comm = item.overallReport?.overallCommunicationScore || 0;
                  
                  return (
                    <tr key={item._id} className="hover:bg-dark-900/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2.5">
                          <Calendar className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs text-slate-300">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
                        {item._id.substring(item._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-200">{tech ? `${tech}/10` : '—'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-200">{depth ? `${depth}/10` : '—'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-200">{comm ? `${comm}/10` : '—'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${
                          item.interviewType === 'system_design' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                          item.interviewType === 'hr' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                        }`}>
                          {item.interviewType === 'system_design' ? 'System Design' : item.interviewType === 'hr' ? 'HR' : 'Resume'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/report?id=${item._id}`)}
                          className="inline-flex items-center space-x-1 py-1.5 px-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-all"
                        >
                          <span>Report</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
