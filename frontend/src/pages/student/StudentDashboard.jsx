import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  BookmarkCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { registrationService } from '../../services/registrationService';
import { admissionService } from '../../services/admissionService';
import { resultService } from '../../services/resultService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { calculateCGPA, formatDate } from '../../utils/formatters';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appData, regData, resData] = await Promise.all([
          admissionService.getMyApplication().catch(() => null),
          registrationService.getMyRegistrations().catch(() => []),
          resultService.getResults().catch(() => []),
        ]);
        setApplication(appData);
        setRegistrations(regData || []);
        setResults(resData || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Loading your student academic workspace..." />;
  }

  const enrolledRegistrations = registrations.filter((r) => r.status === 'ENROLLED');
  const totalEnrolledCredits = enrolledRegistrations.reduce(
    (sum, r) => sum + (r.course?.credits || 3),
    0
  );
  const cgpa = calculateCGPA(results);
  const isAdmissionApproved = application?.status === 'APPROVED';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Student Portal
            </span>
            <span className="text-muted">•</span>
            <span className="text-xs text-muted">ID: {user?.studentId || 'STU-2026-8801'}</span>
          </div>
          <h1 className="page-title">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="page-description">
            Computer Science & Engineering • Fall 2026 Academic Term
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/student/course-registration">
            <Button variant="primary" icon={BookmarkCheck}>
              Register Courses
            </Button>
          </Link>
          <Link to="/student/timetable">
            <Button variant="secondary" icon={Calendar}>
              My Timetable
            </Button>
          </Link>
        </div>
      </div>

      {/* Admission Status Banner */}
      {application && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between flex-wrap gap-4 border ${
            isAdmissionApproved
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : application.status === 'REJECTED'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {isAdmissionApproved ? (
              <div className="stat-icon icon-success" style={{ width: 40, height: 40 }}>
                <CheckCircle2 size={22} />
              </div>
            ) : (
              <div className="stat-icon icon-warning" style={{ width: 40, height: 40 }}>
                <Clock size={22} />
              </div>
            )}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider">
                Admission Application #{application._id?.slice(-6)}
              </div>
              <div className="font-bold text-sm">
                Status:{' '}
                <Badge status={application.status} size="sm" className="ml-1" />
                {' — '}
                {isAdmissionApproved
                  ? 'Admission confirmed! You have full access to course registration.'
                  : application.status === 'UNDER_REVIEW'
                  ? 'Your submitted documents are currently under evaluation.'
                  : 'Application received and awaiting department review.'}
              </div>
            </div>
          </div>

          <Link to="/student/my-application">
            <Button variant="outline" size="sm" iconRight={ArrowRight}>
              Track Application
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card stat-card stat-accent">
          <div>
            <div className="stat-label">Cumulative GPA</div>
            <div className="stat-value">{cgpa}</div>
            <div className="stat-change text-emerald-600">
              <TrendingUp size={14} /> Top 5% in Cohort
            </div>
          </div>
          <div className="stat-icon icon-accent">
            <Award size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Enrolled Courses</div>
            <div className="stat-value">{enrolledRegistrations.length}</div>
            <div className="stat-change text-muted">
              {totalEnrolledCredits} Total Credits
            </div>
          </div>
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="card stat-card stat-success">
          <div>
            <div className="stat-label">Weekly Classes</div>
            <div className="stat-value">{enrolledRegistrations.length * 2}</div>
            <div className="stat-change text-emerald-600">
              Mon - Fri Schedule
            </div>
          </div>
          <div className="stat-icon icon-success">
            <Calendar size={24} />
          </div>
        </div>

        <div className="card stat-card stat-warning">
          <div>
            <div className="stat-label">Academic Standing</div>
            <div className="stat-value text-xl font-bold" style={{ fontSize: '1.4rem' }}>
              Dean's List
            </div>
            <div className="stat-change text-amber-600">
              Honors Division
            </div>
          </div>
          <div className="stat-icon icon-warning">
            <Sparkles size={24} />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Link to="/student/course-registration" className="card card-elevated p-4 flex items-center gap-3">
          <div className="stat-icon" style={{ width: 44, height: 44 }}>
            <BookmarkCheck size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-primary">Course Registration</div>
            <div className="text-xs text-muted">Select & register subjects</div>
          </div>
        </Link>

        <Link to="/student/timetable" className="card card-elevated p-4 flex items-center gap-3">
          <div className="stat-icon icon-accent" style={{ width: 44, height: 44 }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-primary">Class Timetable</div>
            <div className="text-xs text-muted">Weekly schedule matrix</div>
          </div>
        </Link>

        <Link to="/student/results" className="card card-elevated p-4 flex items-center gap-3">
          <div className="stat-icon icon-success" style={{ width: 44, height: 44 }}>
            <Award size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-primary">Academic Results</div>
            <div className="text-xs text-muted">Grades & transcript</div>
          </div>
        </Link>

        <Link to="/student/upload-documents" className="card card-elevated p-4 flex items-center gap-3">
          <div className="stat-icon icon-warning" style={{ width: 44, height: 44 }}>
            <UploadCloud size={22} />
          </div>
          <div>
            <div className="font-bold text-sm text-primary">Document Center</div>
            <div className="text-xs text-muted">Transcripts & certificates</div>
          </div>
        </Link>
      </div>

      {/* Current Enrolled Courses & Schedule Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card
            title="Current Term Courses"
            subtitle={`${enrolledRegistrations.length} subjects registered for Fall 2026`}
            action={
              <Link to="/student/my-courses" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                View Details <ArrowRight size={14} />
              </Link>
            }
          >
            {enrolledRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted text-sm mb-3">No courses registered yet for this term.</p>
                <Link to="/student/course-registration">
                  <Button size="sm" variant="primary">Browse & Register Courses</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enrolledRegistrations.map((reg) => {
                  const course = reg.course;
                  return (
                    <div
                      key={reg._id}
                      className="p-3 rounded-lg border border-color hover:bg-slate-50 transition-colors flex items-center justify-between"
                      style={{ padding: '0.875rem 1rem' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                          {course?.code}
                        </span>
                        <div>
                          <div className="font-bold text-sm text-primary">{course?.name}</div>
                          <div className="text-xs text-muted">
                            Instructor: {course?.faculty} • {course?.credits} Credits • {course?.room}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-secondary">
                          {course?.day}
                        </div>
                        <div className="text-xs text-muted">
                          {course?.startTime} - {course?.endTime}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Academic Profile Snippet */}
        <div>
          <Card title="Academic Summary" subtitle="Department & Standing">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted">Student ID</span>
                <span className="font-semibold text-primary">{user?.studentId || 'STU-2026-8801'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted">Degree</span>
                <span className="font-semibold text-primary">B.Sc. Computer Science</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted">Academic Advisor</span>
                <span className="font-semibold text-primary">Dr. Robert Oppen</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted">Current Term</span>
                <span className="font-semibold text-primary">Fall 2026</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted">Max Credit Limit</span>
                <span className="font-semibold text-primary">18 Credits (Used: {totalEnrolledCredits})</span>
              </div>

              <div className="pt-2">
                <Link to="/student/profile">
                  <Button variant="secondary" size="sm" className="w-full" style={{ width: '100%' }}>
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
