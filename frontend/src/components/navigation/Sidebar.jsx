import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Upload,
  Clock,
  BookOpen,
  Calendar,
  Award,
  User,
  Users,
  CheckSquare,
  BarChart3,
  Layers,
  LogOut,
  FolderCheck,
  ShieldCheck,
  BookmarkPlus
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const role = (user?.role || 'STUDENT').toUpperCase();

  // Navigation schema per role
  const getNavItems = () => {
    switch (role) {
      case 'STUDENT':
        return [
          {
            section: 'Admission',
            items: [
              { to: '/student/admission-apply', label: 'Apply for Admission', icon: FileText },
              { to: '/student/upload-documents', label: 'Upload Documents', icon: Upload },
              { to: '/student/my-application', label: 'Application Status', icon: Clock },
            ],
          },
          {
            section: 'Academics & Registration',
            items: [
              { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { to: '/student/courses', label: 'Available Courses', icon: BookOpen },
              { to: '/student/course-registration', label: 'Course Registration', icon: BookmarkPlus },
              { to: '/student/my-courses', label: 'My Courses', icon: Layers },
              { to: '/student/timetable', label: 'My Timetable', icon: Calendar },
              { to: '/student/results', label: 'Academic Results', icon: Award },
            ],
          },
          {
            section: 'Account',
            items: [
              { to: '/student/profile', label: 'Student Profile', icon: User },
            ],
          },
        ];

      case 'ADMISSION_OFFICER':
        return [
          {
            section: 'Admissions Office',
            items: [
              { to: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { to: '/officer/applications', label: 'Application Queue', icon: FileText },
              { to: '/officer/documents', label: 'Document Review', icon: FolderCheck },
            ],
          },
        ];

      case 'FACULTY':
        return [
          {
            section: 'Faculty Management',
            items: [
              { to: '/faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { to: '/faculty/courses', label: 'Assigned Courses', icon: BookOpen },
              { to: '/faculty/enter-results', label: 'Enter / Update Results', icon: Award },
            ],
          },
        ];

      case 'ADMIN':
        return [
          {
            section: 'Administration',
            items: [
              { to: '/admin/dashboard', label: 'System Overview', icon: LayoutDashboard },
              { to: '/admin/users', label: 'Manage Users', icon: Users },
              { to: '/admin/courses', label: 'Manage Courses', icon: BookOpen },
              { to: '/admin/faculty', label: 'Manage Faculty', icon: CheckSquare },
              { to: '/admin/timetable', label: 'Master Timetable', icon: Calendar },
              { to: '/admin/reports', label: 'System Reports', icon: BarChart3 },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navSections = getNavItems();

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo-icon">
          <GraduationCap size={22} />
        </div>
        <div className="brand-info">
          <span className="brand-name">Apex University</span>
          <span className="brand-sub">Academic Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div key={idx} className="nav-section">
            <div className="nav-section-title">{section.section}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon className="nav-item-icon" size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="user-avatar">
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'AU'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role-badge">{role.replace('_', ' ')}</div>
          </div>
          <button
            onClick={logout}
            className="btn-icon"
            title="Logout"
            style={{ color: '#ef4444' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
