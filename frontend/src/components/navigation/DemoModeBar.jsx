import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, UserCheck, ShieldAlert, BookOpenCheck, School } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const DemoModeBar = () => {
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const currentRole = (user?.role || 'STUDENT').toUpperCase();

  const handleSwitch = (role, targetRoute) => {
    switchDemoRole(role);
    navigate(targetRoute);
  };

  return (
    <div className="demo-mode-bar">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-yellow-400" style={{ color: '#fbbf24' }} />
        <span className="font-semibold text-xs text-slate-200">
          Role Switcher:
        </span>
      </div>

      <div className="demo-pills">
        <button
          className={`demo-pill ${currentRole === 'STUDENT' ? 'active' : ''}`}
          onClick={() => handleSwitch('STUDENT', '/student/dashboard')}
        >
          <School size={12} style={{ display: 'inline', marginRight: 4 }} />
          Student Portal
        </button>

        <button
          className={`demo-pill ${currentRole === 'ADMISSION_OFFICER' ? 'active' : ''}`}
          onClick={() => handleSwitch('ADMISSION_OFFICER', '/officer/dashboard')}
        >
          <UserCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
          Admission Officer
        </button>

        <button
          className={`demo-pill ${currentRole === 'FACULTY' ? 'active' : ''}`}
          onClick={() => handleSwitch('FACULTY', '/faculty/dashboard')}
        >
          <BookOpenCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
          Faculty Portal
        </button>

        <button
          className={`demo-pill ${currentRole === 'ADMIN' ? 'active' : ''}`}
          onClick={() => handleSwitch('ADMIN', '/admin/dashboard')}
        >
          <ShieldAlert size={12} style={{ display: 'inline', marginRight: 4 }} />
          Admin Console
        </button>
      </div>
    </div>
  );
};

export default DemoModeBar;
