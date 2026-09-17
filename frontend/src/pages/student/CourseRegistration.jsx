import React, { useState, useEffect } from 'react';
import {
  BookmarkPlus,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Trash2,
  Search,
  Filter,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import { registrationService } from '../../services/registrationService';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatusBanner from '../../components/common/StatusBanner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseRegistration = () => {
  const { showSuccess, showError, showWarning } = useToast();

  const [courses, setCourses] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [dropId, setDropId] = useState(null);
  const [isDropping, setIsDropping] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Authoritative Backend Response Banner State
  const [backendFeedback, setBackendFeedback] = useState(null);

  const loadData = async () => {
    try {
      const [coursesData, regsData] = await Promise.all([
        courseService.getCourses(),
        registrationService.getMyRegistrations(),
      ]);
      setCourses(coursesData || []);
      setMyRegistrations(regsData || []);
    } catch (err) {
      console.error('Failed to load course registration data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (course) => {
    setRegisteringId(course._id);
    setBackendFeedback(null);

    try {
      // Direct call to authoritative backend endpoint POST /registrations
      const response = await registrationService.registerCourse(course._id);
      
      const responseStatus = (response.status || '').toUpperCase();

      if (responseStatus === 'ENROLLED' || responseStatus === 'SUCCESS') {
        setBackendFeedback({
          status: 'ENROLLED',
          title: 'Registration Successful',
          message: response.message || `Successfully registered for ${course.name} (${course.code}).`,
        });
        showSuccess('Enrolled!', response.message || `Registered for ${course.code}`);
      } else if (responseStatus === 'WAITLISTED') {
        setBackendFeedback({
          status: 'WAITLISTED',
          title: 'Waitlist Notification',
          message: response.message || 'Course capacity reached. Student added to waitlist.',
        });
        showWarning('Waitlisted', response.message || 'Added to waitlist');
      } else if (responseStatus === 'REJECTED') {
        setBackendFeedback({
          status: 'REJECTED',
          title: 'Registration Rejected by Academic System',
          reason: response.reason || 'Registration conditions not satisfied.',
        });
        showError('Registration Rejected', response.reason);
      }

      // Refresh registration and course state
      await loadData();
    } catch (err) {
      const errResponse = err.response?.data;
      const reasonMsg = errResponse?.reason || errResponse?.message || 'Server error during registration.';
      setBackendFeedback({
        status: 'REJECTED',
        title: 'Registration Failed',
        reason: reasonMsg,
      });
      showError('Registration Failed', reasonMsg);
    } finally {
      setRegisteringId(null);
    }
  };

  const handleDropConfirm = async () => {
    if (!dropId) return;
    setIsDropping(true);
    try {
      await registrationService.dropRegistration(dropId);
      showSuccess('Course Dropped', 'Course was removed from your enrolled schedule.');
      setDropId(null);
      await loadData();
    } catch (err) {
      showError('Drop Failed', 'Could not drop the registered course.');
    } finally {
      setIsDropping(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Initializing Course Registration Desk..." />;
  }

  const registeredCourseIds = new Set(
    myRegistrations.map((r) => r.courseId || r.course?._id)
  );

  const totalCredits = myRegistrations
    .filter((r) => r.status === 'ENROLLED')
    .reduce((sum, r) => sum + (r.course?.credits || 3), 0);

  const departments = ['ALL', ...new Set(courses.map((c) => c.department).filter(Boolean))];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Registration Hub</h1>
          <p className="page-description">
            Live catalog with authoritative prerequisite, capacity, and timetable conflict verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted uppercase font-bold">Credits Enrolled</div>
            <div className="text-base font-extrabold text-primary">{totalCredits} / 18 Max</div>
          </div>
        </div>
      </div>

      {/* Authoritative Feedback Banner */}
      {backendFeedback && (
        <StatusBanner
          status={backendFeedback.status}
          title={backendFeedback.title}
          message={backendFeedback.message}
          reason={backendFeedback.reason}
          onDismiss={() => setBackendFeedback(null)}
        />
      )}

      {/* Search and Filters */}
      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="input-with-icon flex-1 min-w-[260px]">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by code (e.g. CS301), subject, or professor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-muted" />
          <span className="text-xs font-semibold text-muted">Department:</span>
          <select
            className="form-select text-xs py-2"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Available Courses Table */}
      <Card
        title="Available Courses for Registration"
        subtitle="Click Register to validate prerequisites and reserve your seat with the server"
      >
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name & Prerequisites</th>
                <th>Faculty</th>
                <th>Capacity / Seats</th>
                <th>Schedule & Room</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => {
                const isRegistered = registeredCourseIds.has(course._id);
                const isRegistering = registeringId === course._id;
                const isFull = (course.availableSeats || 0) <= 0;

                const existingReg = myRegistrations.find(
                  (r) => r.courseId === course._id || r.course?._id === course._id
                );

                return (
                  <tr key={course._id || course.code}>
                    <td>
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {course.code}
                      </span>
                      <div className="text-xs text-muted mt-1">{course.credits || 3} Credits</div>
                    </td>

                    <td>
                      <div className="font-bold text-primary">{course.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Prerequisites:{' '}
                        {course.prerequisites && course.prerequisites.length > 0 ? (
                          <span className="font-semibold text-slate-700">
                            {course.prerequisites.join(', ')}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium">None</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="text-sm font-semibold text-primary">{course.faculty}</div>
                      <div className="text-xs text-muted">{course.department}</div>
                    </td>

                    <td>
                      <div className="text-sm font-bold">
                        {course.enrolledCount || 0} / {course.capacity}
                      </div>
                      <div className="text-xs font-semibold text-muted">
                        {isFull ? (
                          <span className="text-amber-600">0 Available (Waitlist)</span>
                        ) : (
                          <span className="text-emerald-600">{course.availableSeats} Available</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="text-sm font-semibold text-secondary">
                        {course.day}
                      </div>
                      <div className="text-xs text-muted">
                        {course.startTime} - {course.endTime} • {course.room}
                      </div>
                    </td>

                    <td>
                      {isRegistered ? (
                        <Badge
                          variant={existingReg?.status === 'WAITLISTED' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {existingReg?.status || 'ENROLLED'}
                        </Badge>
                      ) : isFull ? (
                        <Badge variant="warning" size="sm">
                          CAPACITY FULL
                        </Badge>
                      ) : (
                        <Badge variant="info" size="sm">
                          OPEN
                        </Badge>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {isRegistered ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled
                        >
                          ✓ Registered
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={isRegistering}
                          disabled={registeringId !== null}
                          onClick={() => handleRegister(course)}
                          icon={BookmarkPlus}
                        >
                          Register
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Currently Registered Courses Drawer / List */}
      <Card
        title="Your Registered Courses for Fall 2026"
        subtitle={`${myRegistrations.length} registered subjects (${totalCredits} Credits)`}
      >
        {myRegistrations.length === 0 ? (
          <div className="text-center py-6 text-muted text-sm">
            You have not registered for any courses yet. Select courses from the list above.
          </div>
        ) : (
          <div className="space-y-3">
            {myRegistrations.map((reg) => {
              const course = reg.course || {};
              const isWaitlisted = reg.status === 'WAITLISTED';

              return (
                <div
                  key={reg._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-color bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {course.code || 'CRS'}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-primary flex items-center gap-2">
                        {course.name}
                        <Badge variant={isWaitlisted ? 'warning' : 'success'} size="sm">
                          {reg.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted">
                        {course.faculty} • {course.credits || 3} Credits • {course.day} ({course.startTime} - {course.endTime}) • {course.room}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="danger-outline"
                    size="sm"
                    icon={Trash2}
                    onClick={() => setDropId(reg._id)}
                  >
                    Drop Course
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Drop Course Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!dropId}
        onClose={() => setDropId(null)}
        onConfirm={handleDropConfirm}
        title="Drop Course Registration"
        message="Are you sure you want to drop this course? Your seat will be released immediately to other students or waitlisted applicants."
        confirmText="Drop Course"
        isLoading={isDropping}
      />
    </div>
  );
};

export default CourseRegistration;
