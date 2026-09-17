import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  Award,
  ArrowRight,
  Layers
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AssignedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        // Professor courses
        const assigned = (data || []).filter(
          (c) => c.faculty.toLowerCase().includes('robert') || c.facultyId === 'user_faculty_01'
        );
        setCourses(assigned.length > 0 ? assigned : data || []);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving faculty curriculum assignments..." />;
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assigned Faculty Courses</h1>
          <p className="page-description">
            Lecture subjects, classroom logistics, and enrollment capacities for Fall 2026
          </p>
        </div>

        <Link to="/faculty/enter-results">
          <Button variant="primary" icon={Award}>
            Grade Entry Desk
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course._id || course.code} className="card-elevated flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                    {course.code}
                  </span>
                  <Badge variant="success" size="sm">
                    {course.enrolledCount || 0} / {course.capacity} Enrolled
                  </Badge>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {course.credits || 3} Credits
                </span>
              </div>

              <h3 className="text-base font-bold text-primary mb-2">{course.name}</h3>
              <p className="text-xs text-muted mb-4">
                {course.description || 'Instructional syllabus and practical hands-on laboratories.'}
              </p>

              <div className="space-y-2 text-xs text-secondary border-t pt-3">
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
                    <MapPin size={14} /> Classroom / Lab:
                  </span>
                  <span className="font-semibold text-primary">{course.room}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted">Prerequisites:</span>
                  <span className="font-semibold text-primary">
                    {course.prerequisites?.join(', ') || 'None'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4 flex items-center justify-between">
              <Link to={`/faculty/students?course=${course.code}`}>
                <Button variant="secondary" size="sm" icon={Users}>
                  Student Roster
                </Button>
              </Link>
              <Link to="/faculty/enter-results">
                <Button variant="primary" size="sm" iconRight={ArrowRight}>
                  Grade Students
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssignedCourses;
