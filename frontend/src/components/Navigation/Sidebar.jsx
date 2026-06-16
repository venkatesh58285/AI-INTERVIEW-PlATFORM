import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  PlayCircle, 
  History, 
  BarChart3 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Upload Resume', path: '/upload', icon: UploadCloud },
    { name: 'Start Interview', path: '/interview', icon: PlayCircle },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-dark-950 border-r border-dark-800/80 flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Menu
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/10 to-violet-500/5 border-l-2 border-indigo-500 text-indigo-400 shadow-[inset_4px_0_12px_rgba(99,102,241,0.05)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-900/40 border-l-2 border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="px-4 py-3 bg-dark-900/30 border border-dark-800/50 rounded-2xl">
        <div className="text-xs text-slate-400 font-medium">Orchestration</div>
        <div className="text-[10px] text-slate-500 mt-1">Multi-Agent LangGraph</div>
      </div>
    </aside>
  );
};

export default Sidebar;
