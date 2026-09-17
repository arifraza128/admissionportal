import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Sparkles, BookCheck, Users2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated, user } = useAuth();

  // If already authenticated, redirect to the appropriate role dashboard
  if (isAuthenticated && user) {
    const role = (user.role || '').toUpperCase();
    if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (role === 'FACULTY') return <Navigate to="/faculty/dashboard" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'ADMISSION_OFFICER') return <Navigate to="/officer/dashboard" replace />;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-hero-section">
        <div className="flex items-center gap-3">
          <div className="brand-logo-icon" style={{ width: 42, height: 42 }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#ffffff', margin: 0 }}>
              Apex University
            </h1>
            <p className="text-xs text-slate-400">Academic & Admission Systems</p>
          </div>
        </div>

        <div className="auth-hero-content">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30"
            style={{ width: 'fit-content' }}
          >
            <Sparkles size={14} />
            <span>MERN Production-Style Architecture</span>
          </div>

          <h2 className="auth-hero-title">
            Empowering Higher Education Excellence
          </h2>

          <p className="auth-hero-desc">
            Seamlessly navigate admission applications, verified document reviews,
            real-time prerequisite-guarded course registration, and faculty grading.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8" style={{ marginTop: '2rem' }}>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <ShieldCheck className="text-blue-400" size={24} />
              <div>
                <div className="text-sm font-bold text-white">Role Guarded</div>
                <div className="text-xs text-slate-400">JWT Authenticated</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
              <BookCheck className="text-emerald-400" size={24} />
              <div>
                <div className="text-sm font-bold text-white">Live Catalog</div>
                <div className="text-xs text-slate-400">Prerequisite Checks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} Apex University Institute of Technology. All rights reserved.
        </div>
      </div>

      <div className="auth-form-section">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
