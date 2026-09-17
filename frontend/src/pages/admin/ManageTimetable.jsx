import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { courseService } from '../../services/courseService';
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
];

const ManageTimetable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        setCourses(data || []);
      } catch (err) {
        console.error('Failed to load courses for master timetable:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Assembling master university timetable matrix..." />;
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Master University Timetable</h1>
          <p className="page-description">
            Global view of classroom allocations, lecture schedules, and room utilization
          </p>
        </div>
      </div>

      <div className="timetable-grid-wrapper">
        <div className="timetable-grid">
          <div className="timetable-header-cell">Time Slot</div>
          {DAYS.map((day) => (
            <div key={day} className="timetable-header-cell">
              {day}
            </div>
          ))}

          {TIME_SLOTS.map((time) => (
            <React.Fragment key={time}>
              <div className="timetable-time-cell">{time}</div>

              {DAYS.map((day) => {
                const slotCourses = courses.filter(
                  (c) => c.day === day && c.startTime === time
                );

                return (
                  <div
                    key={`${day}_${time}`}
                    className={`timetable-slot ${slotCourses.length > 0 ? 'has-course' : ''}`}
                  >
                    {slotCourses.map((c) => (
                      <div key={c._id || c.code} className="timetable-course-card">
                        <div>
                          <span className="timetable-course-code">{c.code}</span>
                          <div className="timetable-course-name">{c.name}</div>
                          <div className="text-[10px] text-muted">{c.faculty}</div>
                        </div>
                        <div className="timetable-course-room">
                          <MapPin size={12} />
                          <span>{c.room}</span>
                        </div>
                      </div>
                    ))}
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

export default ManageTimetable;
