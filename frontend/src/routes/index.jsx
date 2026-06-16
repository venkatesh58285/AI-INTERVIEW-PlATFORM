import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/Route/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Import Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ResumeUpload from '../pages/ResumeUpload';
import Interview from '../pages/Interview';
import Report from '../pages/Report';
import History from '../pages/History';
import Analytics from '../pages/Analytics';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard/App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<ResumeUpload />} />
        <Route path="interview" element={<Interview />} />
        <Route path="report" element={<Report />} />
        <Route path="history" element={<History />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
