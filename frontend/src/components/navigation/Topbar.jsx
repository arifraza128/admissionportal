import React from 'react';
import { Menu, Bell, Shield, LogOut, User as UserIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Badge from '../common/Badge';

const Topbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const role = (user?.role || 'STUDENT').toUpperCase();

  const getRoleBadgeVariant = () => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'ADMISSION_OFFICER': return 'warning';
      case 'FACULTY': return 'info';
      default: return 'success';
    }
  };

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-toggle btn-icon"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Portal System
          </span>
          <h2 className="text-sm font-bold text-primary" style={{ margin: 0 }}>
            {role === 'STUDENT' && 'Student Academic Workspace'}
            {role === 'ADMISSION_OFFICER' && 'Admissions & Evaluation Desk'}
            {role === 'FACULTY' && 'Faculty Course & Grading Console'}
            {role === 'ADMIN' && 'University System Administration'}
          </h2>
        </div>
      </div>

      <div className="topbar-right">
        <Badge variant={getRoleBadgeVariant()} size="md">
          {role.replace('_', ' ')}
        </Badge>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block" style={{ display: 'none' }}>
            <div className="text-sm font-bold text-primary">{user?.name}</div>
            <div className="text-xs text-muted">{user?.email}</div>
          </div>

          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
