import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Cpu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-dark-950/80 backdrop-blur-md border-b border-dark-800/80 px-6 py-4 flex items-center justify-between">
      {/* Brand logo */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse-slow">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-wider text-slate-100 bg-clip-text">
          Antigravity AI Interview
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 bg-dark-900/60 border border-dark-800 px-3 py-1.5 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <User className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">{user.name}</span>
          </div>
        )}
        
        <button
          onClick={logout}
          className="p-2 rounded-xl bg-dark-900/60 border border-dark-800 hover:border-red-500/40 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all duration-200"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
