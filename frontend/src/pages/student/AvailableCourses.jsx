import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  BookmarkPlus,
  ArrowRight
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Loading university course catalog..." />;
  }

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
          <h1 className="page-title">University Course Catalog</h1>
          <p className="page-description">
            Explore curriculum subjects, faculty assignments, schedule timings, and prerequisite criteria
          </p>
        </div>

        <Link to="/student/course-registration">
          <Button variant="primary" icon={BookmarkPlus}>
            Go to Course Registration
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="input-with-icon flex-1 min-w-[260px]">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by course code, title, or professor..."
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

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Try modifying your search keywords or department filter."
        />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const isFull = (course.availableSeats || 0) <= 0;
            return (
              <Card key={course._id || course.code} className="card-elevated flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                        {course.code}
                      </span>
                      <Badge variant={isFull ? 'warning' : 'success'} size="sm">
                        {isFull ? 'FULL / WAITLIST' : `${course.availableSeats} Seats Left`}
                      </Badge>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                      {course.credits || 3} Credits
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-primary mb-1">{course.name}</h3>
                  <p className="text-xs text-muted mb-4 line-clamp-2">
                    {course.description || 'Comprehensive curriculum with theory and hands-on laboratory sessions.'}
                  </p>

                  <div className="space-y-2 text-xs text-secondary border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted flex items-center gap-1.5">
                        <User size={14} /> Faculty:
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
                        <MapPin size={14} /> Location:
                      </span>
                      <span className="font-semibold text-primary">{course.room || 'Hall A-101'}</span>
                    </div>

                    <div className="flex items-start justify-between pt-1">
                      <span className="text-muted">Prerequisites:</span>
                      <span className="font-semibold text-right text-primary max-w-[60%]">
                        {course.prerequisites && course.prerequisites.length > 0
                          ? course.prerequisites.join(', ')
                          : 'None (Direct Entry)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted">Capacity:</span>
                      <span className="font-semibold text-primary">
                        {course.enrolledCount || 0} / {course.capacity} Enrolled
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted">
                    Status: <strong className="text-primary">{course.registrationStatus || 'OPEN'}</strong>
                  </span>
                  <Link to={`/student/course-registration`}>
                    <Button variant="outline" size="sm" iconRight={ArrowRight}>
                      Register Course
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableCourses;
