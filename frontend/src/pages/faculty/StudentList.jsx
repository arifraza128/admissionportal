import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  ArrowLeft,
  Mail,
  Award,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_FACULTY_STUDENTS } from '../../services/mockData';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentList = () => {
  const [searchParams] = useSearchParams();
  const courseCode = searchParams.get('course') || 'CS301';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In real backend or mock data
    const usersStr = localStorage.getItem('apex_mock_faculty_students');
    if (usersStr) {
      setStudents(JSON.parse(usersStr));
    } else {
      setStudents(MOCK_FACULTY_STUDENTS);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving student enrollment rosters..." />;
  }

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/faculty/courses" className="btn-icon">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              Course Roster: {courseCode}
            </h1>
            <p className="page-description">
              Enrolled students attendance, midterm marks, and academic status
            </p>
          </div>
        </div>

        <Link to="/faculty/enter-results">
          <Button variant="primary" icon={Award}>
            Enter / Update Results
          </Button>
        </Link>
      </div>

      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="input-with-icon flex-1 min-w-[260px]">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search enrolled students by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card title={`Enrolled Students (${filtered.length})`}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name & Email</th>
                <th>Attendance</th>
                <th>Midterm Marks</th>
                <th>Current Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stu) => (
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
                    <span className="font-semibold text-primary">{stu.marks || 88} / 100</span>
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                      {stu.grade || 'A'}
                    </span>
                  </td>
                  <td>
                    <Badge variant="success" size="sm">
                      {stu.status || 'ENROLLED'}
                    </Badge>
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

export default StudentList;
