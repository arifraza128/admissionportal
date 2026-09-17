import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Server,
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { courseService } from '../../services/courseService';
import { admissionService } from '../../services/admissionService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 4,
    coursesCount: 6,
    applicationsCount: 4,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, courses, apps] = await Promise.all([
          adminService.getUsers(),
          courseService.getCourses(),
          admissionService.getApplications(),
        ]);
        setStats({
          usersCount: (users || []).length,
          coursesCount: (courses || []).length,
          applicationsCount: (apps || []).length,
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Connecting to university administration center..." />;
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">University System Administration</h1>
          <p className="page-description">
            Central governance console for academic curricula, user accounts, and infrastructure monitoring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/courses">
            <Button variant="primary" icon={BookOpen}>
              Manage Courses
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="secondary" icon={Users}>
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card stat-card stat-accent">
          <div>
            <div className="stat-label">Active Users</div>
            <div className="stat-value">{stats.usersCount}</div>
            <div className="stat-change text-emerald-600">
              4 Roles Configured
            </div>
          </div>
          <div className="stat-icon icon-accent">
            <Users size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Catalog Courses</div>
            <div className="stat-value">{stats.coursesCount}</div>
            <div className="stat-change text-muted">
              Fall 2026 Term
            </div>
          </div>
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="card stat-card stat-success">
          <div>
            <div className="stat-label">System Health</div>
            <div className="stat-value text-xl font-bold" style={{ fontSize: '1.4rem' }}>
              Operational
            </div>
            <div className="stat-change text-emerald-600">
              <CheckCircle2 size={14} /> 99.98% Uptime
            </div>
          </div>
          <div className="stat-icon icon-success">
            <Server size={24} />
          </div>
        </div>

        <div className="card stat-card stat-warning">
          <div>
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{stats.applicationsCount}</div>
            <div className="stat-change text-amber-600">
              In Admissions Pipeline
            </div>
          </div>
          <div className="stat-icon icon-warning">
            <FileText size={24} />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Link to="/admin/users" className="card card-elevated p-5 flex items-start gap-4">
          <div className="stat-icon" style={{ width: 48, height: 48 }}>
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-base text-primary">Manage Users & Roles</h3>
            <p className="text-xs text-muted mt-1">
              Create and manage Student, Faculty, Officer, and Admin credentials
            </p>
          </div>
        </Link>

        <Link to="/admin/courses" className="card card-elevated p-5 flex items-start gap-4">
          <div className="stat-icon icon-accent" style={{ width: 48, height: 48 }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-base text-primary">Curriculum & Courses</h3>
            <p className="text-xs text-muted mt-1">
              Add new subjects, configure prerequisites, seat limits, and schedule slots
            </p>
          </div>
        </Link>

        <Link to="/admin/reports" className="card card-elevated p-5 flex items-start gap-4">
          <div className="stat-icon icon-success" style={{ width: 48, height: 48 }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-bold text-base text-primary">System Reports & Analytics</h3>
            <p className="text-xs text-muted mt-1">
              Enrollment capacity utilization, admission conversion rates, and academic metrics
            </p>
          </div>
        </Link>
      </div>

      {/* Recent System Activity Logs */}
      <Card title="System Activity & Audit Log" subtitle="Recent administrative and academic operations">
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg border border-color flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono px-2 py-0.5 rounded bg-slate-100 font-bold">AUTH</span>
              <span className="text-primary font-semibold">User Arif Raza signed in with role STUDENT</span>
            </div>
            <span className="text-muted">Just now</span>
          </div>

          <div className="p-3 rounded-lg border border-color flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">REG</span>
              <span className="text-primary font-semibold">Seat registered for CS301 (Algorithms) - Capacity 38/45</span>
            </div>
            <span className="text-muted">10 mins ago</span>
          </div>

          <div className="p-3 rounded-lg border border-color flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">ADM</span>
              <span className="text-primary font-semibold">Admission application app_001 approved by Officer Eleanor Vance</span>
            </div>
            <span className="text-muted">1 hour ago</span>
          </div>

          <div className="p-3 rounded-lg border border-color flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">SYS</span>
              <span className="text-primary font-semibold">Master Timetable room allocations synced across all departments</span>
            </div>
            <span className="text-muted">2 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
