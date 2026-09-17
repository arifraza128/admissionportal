import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  BookOpen,
  User,
  Clock,
  MapPin,
  Trash2,
  Calendar,
  BookmarkPlus,
  FileCheck
} from 'lucide-react';
import { registrationService } from '../../services/registrationService';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const MyCourses = () => {
  const { showSuccess, showError } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropId, setDropId] = useState(null);
  const [isDropping, setIsDropping] = useState(false);

  const fetchMyCourses = async () => {
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data || []);
    } catch (err) {
      console.error('Failed to load registered courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleDropConfirm = async () => {
    if (!dropId) return;
    setIsDropping(true);
    try {
      await registrationService.dropRegistration(dropId);
      showSuccess('Course Dropped', 'The subject was dropped successfully.');
      setDropId(null);
      await fetchMyCourses();
    } catch (err) {
      showError('Action Failed', 'Could not drop course registration.');
    } finally {
      setIsDropping(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving your enrolled subjects..." />;
  }

  const enrolledCourses = registrations.filter((r) => r.status === 'ENROLLED');
  const waitlistedCourses = registrations.filter((r) => r.status === 'WAITLISTED');

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Registered Courses</h1>
          <p className="page-description">
            View course syllabus details, classroom locations, instructor contacts, and drop registrations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/student/course-registration">
            <Button variant="primary" icon={BookmarkPlus}>
              Register More Courses
            </Button>
          </Link>
          <Link to="/student/timetable">
            <Button variant="secondary" icon={Calendar}>
              View Timetable Matrix
            </Button>
          </Link>
        </div>
      </div>

      {enrolledCourses.length === 0 && waitlistedCourses.length === 0 ? (
        <EmptyState
          title="No registered courses"
          description="You are not currently enrolled in any courses for the Fall 2026 semester."
          actionText="Open Course Registration"
          onAction={() => window.location.href = '/student/course-registration'}
        />
      ) : (
        <div className="space-y-6">
          {/* Enrolled Courses Section */}
          <div>
            <h2 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
              <FileCheck size={18} className="text-emerald-500" />
              Active Enrolled Subjects ({enrolledCourses.length})
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {enrolledCourses.map((reg) => {
                const course = reg.course || {};
                return (
                  <Card key={reg._id} className="card-elevated flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                            {course.code}
                          </span>
                          <Badge variant="success" size="sm">
                            ENROLLED
                          </Badge>
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {course.credits || 3} Credits
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-primary mb-2">{course.name}</h3>
                      <p className="text-xs text-muted mb-4">
                        {course.description || 'Comprehensive university lectures, laboratory sessions, and project work.'}
                      </p>

                      <div className="space-y-2 text-xs text-secondary border-t pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted flex items-center gap-1.5">
                            <User size={14} /> Professor:
                          </span>
                          <span className="font-semibold text-primary">{course.faculty}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted flex items-center gap-1.5">
                            <Clock size={14} /> Schedule:
                          </span>
                          <span className="font-semibold text-primary">
                            {course.day} • {course.startTime} - {course.endTime}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-muted flex items-center gap-1.5">
                            <MapPin size={14} /> Classroom:
                          </span>
                          <span className="font-semibold text-primary">{course.room || 'Room 101'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted">Term: Fall 2026</span>
                      <Button
                        variant="danger-outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDropId(reg._id)}
                      >
                        Drop Subject
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Waitlisted Courses Section */}
          {waitlistedCourses.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                Waitlisted Subjects ({waitlistedCourses.length})
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {waitlistedCourses.map((reg) => {
                  const course = reg.course || {};
                  return (
                    <Card key={reg._id} className="card-elevated border-amber-200 bg-amber-50/30">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900">
                          {course.code}
                        </span>
                        <Badge variant="warning" size="sm">
                          WAITLISTED
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-primary mb-1">{course.name}</h3>
                      <p className="text-xs text-muted mb-3">
                        Capacity reached. You will be automatically enrolled if a registered student drops.
                      </p>
                      <div className="border-t pt-3 flex items-center justify-between">
                        <span className="text-xs text-muted">Instructor: {course.faculty}</span>
                        <Button
                          variant="danger-outline"
                          size="sm"
                          onClick={() => setDropId(reg._id)}
                        >
                          Cancel Waitlist
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!dropId}
        onClose={() => setDropId(null)}
        onConfirm={handleDropConfirm}
        title="Drop Enrolled Course"
        message="Are you sure you want to drop this subject? You will lose your reserved classroom seat."
        confirmText="Confirm Drop"
        isLoading={isDropping}
      />
    </div>
  );
};

export default MyCourses;
