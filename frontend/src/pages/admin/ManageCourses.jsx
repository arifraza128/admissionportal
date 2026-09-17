import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Layers
} from 'lucide-react';
import { courseService } from '../../services/courseService';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageCourses = () => {
  const { showSuccess, showError } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Course Modal
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    faculty: 'Dr. Robert Oppen',
    capacity: 40,
    credits: 3,
    prerequisites: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Hall B-204',
    department: 'Computer Science',
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      code: '',
      name: '',
      faculty: 'Dr. Robert Oppen',
      capacity: 40,
      credits: 3,
      prerequisites: '',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      room: 'Hall B-204',
      department: 'Computer Science',
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      faculty: course.faculty,
      capacity: course.capacity,
      credits: course.credits || 3,
      prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(', ') : (course.prerequisites || ''),
      day: course.day,
      startTime: course.startTime,
      endTime: course.endTime,
      room: course.room || 'Room 101',
      department: course.department || 'Computer Science',
      description: course.description || '',
    });
    setShowModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      showError('Validation Error', 'Please specify course code and title.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        credits: Number(formData.credits),
        prerequisites: formData.prerequisites
          ? formData.prerequisites.split(',').map((p) => p.trim()).filter(Boolean)
          : [],
      };

      if (editingCourse) {
        await courseService.updateCourse(editingCourse._id, payload);
        showSuccess('Course Updated', `${payload.code} updated successfully.`);
      } else {
        await courseService.createCourse(payload);
        showSuccess('Course Created', `${payload.code} added to official curriculum.`);
      }
      setShowModal(false);
      await fetchCourses();
    } catch (err) {
      showError('Save Failed', 'Could not save course information.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await courseService.deleteCourse(deleteId);
      showSuccess('Course Deleted', 'Course removed from the university catalog.');
      setDeleteId(null);
      await fetchCourses();
    } catch (err) {
      showError('Delete Failed', 'Could not delete course.');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading curriculum management system..." />;
  }

  const filtered = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Curriculum & Course Management</h1>
          <p className="page-description">
            Define subject codes, prerequisites, lecture capacities, and timetable time slots
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add New Course
        </Button>
      </div>

      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="input-with-icon flex-1 min-w-[260px]">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by course code, title, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card title={`Active Catalog Courses (${filtered.length})`}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                <th>Capacity & Seats</th>
                <th>Schedule Slot</th>
                <th>Prerequisites</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr key={course._id || course.code}>
                  <td>
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {course.code}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-primary">{course.name}</div>
                    <div className="text-xs text-muted">{course.credits || 3} Credits • {course.department}</div>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-primary">{course.faculty}</span>
                  </td>
                  <td>
                    <span className="font-bold text-primary">{course.enrolledCount || 0} / {course.capacity}</span>
                    <span className="text-xs text-muted block">({course.availableSeats || 0} Open)</span>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-secondary">
                      {course.day} • {course.startTime} - {course.endTime}
                    </span>
                    <span className="text-[11px] text-muted block">{course.room}</span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-700">
                      {course.prerequisites && course.prerequisites.length > 0
                        ? course.prerequisites.join(', ')
                        : 'None'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Edit2}
                        onClick={() => handleOpenEdit(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger-outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteId(course._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Course Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCourse ? `Edit Course: ${editingCourse.code}` : 'Create New Course'}
        subtitle="Configure academic credits, capacity limits, and schedule slot"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveCourse}
              isLoading={saving}
            >
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="code">
                Course Code *
              </label>
              <input
                id="code"
                type="text"
                required
                className="form-input"
                placeholder="e.g. CS410"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Course Title *
              </label>
              <input
                id="name"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Neural Networks & AI"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="faculty">
                Assigned Faculty *
              </label>
              <input
                id="faculty"
                type="text"
                required
                className="form-input"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="department">
                Department
              </label>
              <input
                id="department"
                type="text"
                className="form-input"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="capacity">
                Student Capacity *
              </label>
              <input
                id="capacity"
                type="number"
                required
                className="form-input"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="credits">
                Credits *
              </label>
              <input
                id="credits"
                type="number"
                required
                className="form-input"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="day">
                Lecture Day *
              </label>
              <select
                id="day"
                className="form-select"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="startTime">
                Time Slot *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  className="form-input"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
                <span>to</span>
                <input
                  type="time"
                  className="form-input"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="room">
                Classroom / Lab *
              </label>
              <input
                id="room"
                type="text"
                className="form-input"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prereqs">
                Prerequisites (comma-separated)
              </label>
              <input
                id="prereqs"
                type="text"
                className="form-input"
                placeholder="e.g. CS201, CS202"
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Curriculum Course"
        message="Are you sure you want to delete this course from the university catalog? Active registrations will be affected."
        confirmText="Delete Course"
      />
    </div>
  );
};

export default ManageCourses;
