import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  Download,
  CheckCircle2,
  Info
} from 'lucide-react';
import { timetableService } from '../../services/timetableService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '09:00',
  '10:30',
  '11:00',
  '12:30',
  '13:00',
  '14:30',
  '16:00',
];

const Timetable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const data = await timetableService.getTimetable();
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load timetable:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Building your weekly schedule grid..." />;
  }

  // Detect any potential scheduling conflicts
  const conflicts = [];
  const scheduleMap = {};

  courses.forEach((course) => {
    const key = `${course.day}_${course.startTime}`;
    if (!scheduleMap[key]) {
      scheduleMap[key] = [];
    }
    scheduleMap[key].push(course);
    if (scheduleMap[key].length > 1) {
      conflicts.push({
        day: course.day,
        time: course.startTime,
        courses: scheduleMap[key],
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Weekly Class Schedule & Timetable</h1>
          <p className="page-description">
            Interactive weekly schedule matrix for Fall 2026 registered subjects
          </p>
        </div>

        <Button
          variant="secondary"
          icon={Download}
          onClick={() => window.print()}
        >
          Print Schedule
        </Button>
      </div>

      {/* Conflict Warning Callout */}
      {conflicts.length > 0 ? (
        <div className="alert alert-danger">
          <AlertTriangle size={20} className="alert-icon" />
          <div>
            <div className="alert-title">Timetable Conflict Detected!</div>
            <div className="text-sm">
              You have overlapping courses scheduled at the same time:
              {conflicts.map((c, i) => (
                <div key={i} className="font-semibold mt-1">
                  • {c.day} at {c.time}: {c.courses.map((x) => `${x.name} (${x.code})`).join(' vs ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-success" style={{ padding: '0.75rem 1.25rem' }}>
          <CheckCircle2 size={18} className="alert-icon" />
          <div className="text-sm font-medium">
            No schedule conflicts detected. All registered class slots are fully synchronized.
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="timetable-grid-wrapper">
        <div className="timetable-grid">
          {/* Top Left Empty Cell */}
          <div className="timetable-header-cell">Time Slot</div>

          {/* Day Headers */}
          {DAYS.map((day) => (
            <div key={day} className="timetable-header-cell">
              {day}
            </div>
          ))}

          {/* Time Slot Rows */}
          {TIME_SLOTS.map((time) => (
            <React.Fragment key={time}>
              {/* Time Column */}
              <div className="timetable-time-cell">{time}</div>

              {/* Day Cells */}
              {DAYS.map((day) => {
                const cellCourses = courses.filter(
                  (c) => c.day === day && c.startTime === time
                );

                const hasCourse = cellCourses.length > 0;
                const hasConflict = cellCourses.length > 1;

                return (
                  <div
                    key={`${day}_${time}`}
                    className={`timetable-slot ${hasCourse ? 'has-course' : ''} ${
                      hasConflict ? 'border-rose-400 bg-rose-50' : ''
                    }`}
                  >
                    {hasCourse ? (
                      cellCourses.map((c) => (
                        <div key={c._id || c.code} className="timetable-course-card">
                          <div>
                            <span className="timetable-course-code">{c.code}</span>
                            <div className="timetable-course-name">{c.name}</div>
                          </div>
                          <div className="timetable-course-room">
                            <MapPin size={12} />
                            <span>{c.room || 'Room 101'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-300 select-none">-</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
