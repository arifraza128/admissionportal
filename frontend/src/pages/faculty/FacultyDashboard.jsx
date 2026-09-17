import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Award,
  Calendar,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { courseService } from '../../services/courseService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        // Filter or show assigned courses
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load faculty courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Loading faculty academic workspace..." />;
  }

  const assignedCourses = courses.filter(
    (c) => c.faculty.toLowerCase().includes('robert') || c.facultyId === 'user_faculty_01'
  );

  const totalStudents = assignedCourses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Faculty Workspace
            </span>
            <span className="text-muted">•</span>
            <span className="text-xs text-muted">Department of Computer Science</span>
          </div>
          <h1 className="page-title">Welcome, {user?.name || 'Professor'}!</h1>
          <p className="page-description">
            Manage your assigned courses, enrolled student rosters, and publish semester examination results
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/faculty/enter-results">
            <Button variant="primary" icon={Award}>
              Enter / Update Results
            </Button>
          </Link>
          <Link to="/faculty/courses">
            <Button variant="secondary" icon={BookOpen}>
              My Assigned Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card stat-card stat-accent">
          <div>
            <div className="stat-label">Assigned Courses</div>
            <div className="stat-value">{assignedCourses.length}</div>
            <div className="stat-change text-muted">
              Fall 2026 Term
            </div>
          </div>
          <div className="stat-icon icon-accent">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="card stat-card stat-success">
          <div>
            <div className="stat-label">Enrolled Students</div>
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-change text-emerald-600">
              Across all sections
            </div>
          </div>
          <div className="stat-icon icon-success">
            <Users size={24} />
          </div>
        </div>

        <div className="card stat-card stat-warning">
          <div>
            <div className="stat-label">Grading Status</div>
            <div className="stat-value text-xl font-bold" style={{ fontSize: '1.4rem' }}>
              In Progress
            </div>
            <div className="stat-change text-amber-600">
              Midterm finalized
            </div>
          </div>
          <div className="stat-icon icon-warning">
            <Award size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Weekly Lectures</div>
            <div className="stat-value">{assignedCourses.length * 2}</div>
            <div className="stat-change text-muted">
              Schedule active
            </div>
          </div>
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {/* Assigned Courses Cards */}
      <Card
        title="Assigned Lecture Courses"
        subtitle="Current active cohorts under your instruction"
        action={
          <Link to="/faculty/courses" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Manage All Courses <ArrowRight size={14} />
          </Link>
        }
      >
        <div className="grid grid-cols-3 gap-6">
          {assignedCourses.map((course) => (
            <div
              key={course._id || course.code}
              className="p-4 rounded-xl border border-color bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {course.code}
                  </span>
                  <Badge variant="success" size="sm">
                    {course.enrolledCount} Students
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-primary mb-1">{course.name}</h3>
                <p className="text-xs text-muted mb-3">
                  {course.day} • {course.startTime} - {course.endTime} • {course.room}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <Link
                  to={`/faculty/students?course=${course.code}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View Roster
                </Link>
                <Link to="/faculty/enter-results">
                  <Button variant="outline" size="sm">
                    Enter Grades
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FacultyDashboard;
