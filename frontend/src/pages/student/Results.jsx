import React, { useState, useEffect } from 'react';
import {
  Award,
  TrendingUp,
  Download,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import { resultService } from '../../services/resultService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { calculateCGPA, getGradePoint } from '../../utils/formatters';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await resultService.getResults();
        setResults(data || []);
      } catch (err) {
        console.error('Failed to load academic results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving official academic transcript records..." />;
  }

  const cgpa = calculateCGPA(results);
  const totalEarnedCredits = results.reduce((sum, r) => sum + (r.credits || 3), 0);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Academic Results & Grade Transcript</h1>
          <p className="page-description">
            Official semester grade evaluations, cumulative GPA calculation, and faculty remarks
          </p>
        </div>

        <Button
          variant="secondary"
          icon={Download}
          onClick={() => window.print()}
        >
          Download Official Transcript (PDF)
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card stat-card stat-accent">
          <div>
            <div className="stat-label">Cumulative GPA (CGPA)</div>
            <div className="stat-value">{cgpa}</div>
            <div className="stat-change text-emerald-600">
              <TrendingUp size={14} /> Out of 4.00 Scale
            </div>
          </div>
          <div className="stat-icon icon-accent">
            <Award size={24} />
          </div>
        </div>

        <div className="card stat-card stat-success">
          <div>
            <div className="stat-label">Total Earned Credits</div>
            <div className="stat-value">{totalEarnedCredits}</div>
            <div className="stat-change text-emerald-600">
              100% Completed
            </div>
          </div>
          <div className="stat-icon icon-success">
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Graded Courses</div>
            <div className="stat-value">{results.length}</div>
            <div className="stat-change text-muted">
              Published Records
            </div>
          </div>
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="card stat-card stat-warning">
          <div>
            <div className="stat-label">Academic Honors</div>
            <div className="stat-value text-xl font-bold" style={{ fontSize: '1.35rem' }}>
              First Class
            </div>
            <div className="stat-change text-amber-600">
              Distinction Candidate
            </div>
          </div>
          <div className="stat-icon icon-warning">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <Card
        title="Published Academic Grades"
        subtitle="End-of-term evaluated subjects"
      >
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Marks / 100</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Instructor Remarks</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res._id || res.courseCode}>
                  <td>
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">
                      {res.courseCode}
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-primary">{res.courseName}</div>
                    <div className="text-xs text-muted">Faculty: {res.faculty}</div>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-secondary">{res.semester}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-primary">{res.credits}</span>
                  </td>
                  <td>
                    <span className="font-bold text-primary">{res.marks}%</span>
                  </td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                      {res.grade}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-700">{res.gradePoint?.toFixed(1) || getGradePoint(res.grade).toFixed(1)}</span>
                  </td>
                  <td>
                    <span className="text-xs text-secondary">{res.remarks || 'Completed'}</span>
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

export default Results;
