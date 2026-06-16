import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Play, 
  Upload, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  ArrowRight,
  ClipboardList 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/interview/history');
        const list = response.data.interviews || [];
        setHistory(list);

        const total = list.length;
        let sum = 0;
        list.forEach((item) => {
          const report = item.overallReport;
          if (report) {
            const tech = report.overallTechnicalScore || 0;
            const depth = report.overallDepthScore || 0;
            const comm = report.overallCommunicationScore || 0;
            sum += (tech + depth + comm) / 3;
          }
        });

        setStats({
          total,
          avgScore: total ? Math.round(sum / total * 10) / 10 : 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        console.error('Error response:', error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Stats Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Hello, {user?.name || 'Developer'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Welcome to your interview and capability analytics workspace.
          </p>
        </div>
      </div>

      {/* Warning if no resume */}
      {!user?.resumeURI && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-amber-400 font-semibold text-sm">Resume Profile Required</h4>
            <p className="text-xs text-slate-400 mt-1">
              You haven't uploaded a resume yet. To generate context-aware technical interview questions tailored to your skills and projects, please upload your resume PDF.
            </p>
            <Link 
              to="/upload" 
              className="inline-flex items-center space-x-1.5 text-xs text-indigo-400 font-semibold mt-3 hover:text-indigo-300 transition-colors"
            >
              <span>Upload Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <ClipboardList className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Interviews</div>
            <div className="text-2xl font-bold mt-1 text-white">{stats.total}</div>
          </div>
        </div>

        <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
            <Award className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Average Capability Score</div>
            <div className="text-2xl font-bold mt-1 text-white">{stats.avgScore}/10</div>
          </div>
        </div>

        <div className="bg-dark-900/40 border border-dark-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status</div>
            <div className="text-sm font-semibold mt-2 text-emerald-400">Ready for Interview</div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions Card */}
        <div className="lg:col-span-1 bg-gradient-to-b from-dark-900/50 to-dark-900/30 border border-dark-800 p-8 rounded-3xl flex flex-col justify-between h-[320px] shadow-lg">
          <div>
            <h3 className="text-lg font-bold text-white">Start Interviewing</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Initiate a 6-question simulation. First 3 questions are generated by the **Resume Agent** based on your projects, and the next 3 questions are generated by the **HR Agent** assessing behavioral competence.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/interview')}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Session</span>
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="w-full py-3 px-4 rounded-xl bg-dark-950 border border-dark-800 hover:border-slate-700 text-slate-300 text-sm font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Update Resume</span>
            </button>
          </div>
        </div>

        {/* Recent Interviews Card */}
        <div className="lg:col-span-2 bg-dark-900/40 border border-dark-800 p-8 rounded-3xl shadow-lg flex flex-col justify-between min-h-[320px]">
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Recent Sessions</h3>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-dark-800 rounded-2xl bg-dark-950/10">
                <ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <span className="text-xs text-slate-500">No completed interviews yet.</span>
              </div>
            ) : (
              <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2">
                {history.slice(0, 3).map((item) => {
                  const score = item.overallReport 
                    ? Math.round((item.overallReport.overallTechnicalScore + item.overallReport.overallDepthScore + item.overallReport.overallCommunicationScore) / 3 * 10) / 10
                    : 0;
                  return (
                    <div 
                      key={item._id} 
                      className="p-4 bg-dark-950/40 border border-dark-850 hover:border-dark-750 rounded-2xl flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10">
                          <Calendar className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-300">
                            Session: {item._id.substring(item._id.length - 8).toUpperCase()}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Overall Score</div>
                          <div className="text-sm font-bold text-slate-200">{score ? `${score}/10` : 'Pending'}</div>
                        </div>
                        <button
                          onClick={() => navigate(`/report?id=${item._id}`)}
                          className="p-2 rounded-lg bg-dark-900 border border-dark-800 text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {history.length > 3 && (
            <div className="text-right mt-4">
              <Link 
                to="/history" 
                className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 transition-colors inline-flex items-center space-x-1"
              >
                <span>View all history</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
