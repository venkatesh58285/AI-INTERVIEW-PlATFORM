import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';
import Sidebar from '../components/Navigation/Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-dark-950 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
