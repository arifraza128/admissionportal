import React, { useState, useEffect } from 'react';
import {
  Award,
  Save,
  CheckCircle2,
  BookOpen,
  User,
  Sparkles,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { resultService } from '../../services/resultService';
import { courseService } from '../../services/courseService';
import { MOCK_FACULTY_STUDENTS } from '../../services/mockData';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const calculateLetter = (marks) => {
  const m = Number(marks);
  if (isNaN(m)) return 'F';
  if (m >= 93) return 'A+';
  if (m >= 88) return 'A';
  if (m >= 83) return 'A-';
  if (m >= 78) return 'B+';
  if (m >= 73) return 'B';
  if (m >= 68) return 'B-';
  if (m >= 63) return 'C+';
  if (m >= 58) return 'C';
  if (m >= 50) return 'D';
  return 'F';
};

const calculateGP = (grade) => {
  const map = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D': 1.0,
    'F': 0.0,
  };
  return map[grade] || 0.0;
};

const EnterResults = () => {
  const { showSuccess, showError } = useToast();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const cData = await courseService.getCourses();
        setCourses(cData || []);

        const savedStudents = localStorage.getItem('apex_mock_faculty_students');
        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        } else {
          setStudents(MOCK_FACULTY_STUDENTS);
        }
      } catch (err) {
        console.error('Failed to init grading desk:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleMarksChange = (studentId, marksValue) => {
    const marks = Math.min(100, Math.max(0, Number(marksValue) || 0));
    const grade = calculateLetter(marks);

    setStudents((prev) =>
      prev.map((s) =>
        s._id === studentId || s.studentId === studentId
          ? { ...s, marks, grade }
          : s
      )
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === studentId || s.studentId === studentId
          ? { ...s, remarks }
          : s
      )
    );
  };

  const handleSaveGrades = async () => {
    setSaving(true);
    try {
      // Submit results for each student via results API
      for (const stu of students) {
        await resultService.createResult({
          studentId: stu._id || stu.studentId,
          studentName: stu.name,
          courseCode: selectedCourse,
          courseName: selectedCourse === 'CS301' ? 'Advanced Data Structures & Algorithms' : 'Database Management Systems',
          faculty: 'Dr. Robert Oppen',
          semester: 'Fall 2026',
          credits: 4,
          marks: stu.marks,
          grade: stu.grade,
          gradePoint: calculateGP(stu.grade),
          remarks: stu.remarks || 'Final semester grade confirmed.',
        });
      }

      localStorage.setItem('apex_mock_faculty_students', JSON.stringify(students));
      showSuccess('Grades Published', `Final results for ${selectedCourse} submitted successfully.`);
    } catch (err) {
      showError('Save Failed', 'Could not record examination results.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Opening faculty grade management terminal..." />;
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Grade & Results Entry Terminal</h1>
          <p className="page-description">
            Evaluate enrolled student performances, calculate grade points, and publish academic records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="form-select text-xs py-2 font-bold"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="CS301">CS301 - Advanced Data Structures</option>
            <option value="CS305">CS305 - Database Management Systems</option>
            <option value="CS450">CS450 - Cloud Computing & DevOps</option>
          </select>

          <Button
            variant="primary"
            isLoading={saving}
            icon={Save}
            onClick={handleSaveGrades}
          >
            Publish Final Results
          </Button>
        </div>
      </div>

      {/* Spreadsheet Card */}
      <Card
        title={`Grading Roster: ${selectedCourse}`}
        subtitle={`Editing ${students.length} student grade sheets • Changes save directly to official records`}
      >
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Attendance</th>
                <th style={{ width: 140 }}>Marks (0-100)</th>
                <th>Letter Grade</th>
                <th>Grade Point</th>
                <th>Evaluator Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu._id || stu.studentId}>
                  <td>
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-800">
                      {stu.studentId}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-primary">{stu.name}</div>
                    <div className="text-xs text-muted">{stu.email}</div>
                  </td>
                  <td>
                    <span className="font-bold text-emerald-700">{stu.attendance}</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="form-input text-sm font-bold"
                      style={{ width: 100, padding: '0.4rem 0.6rem' }}
                      value={stu.marks || 0}
                      onChange={(e) => handleMarksChange(stu._id || stu.studentId, e.target.value)}
                    />
                  </td>
                  <td>
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900">
                      {stu.grade || 'A'}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-700">
                      {calculateGP(stu.grade || 'A').toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input text-xs"
                      placeholder="e.g. Outstanding lab work"
                      value={stu.remarks || ''}
                      onChange={(e) => handleRemarksChange(stu._id || stu.studentId, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EnterResults;
