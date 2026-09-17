import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  ArrowRight,
  TrendingUp,
  FolderCheck,
  Search
} from 'lucide-react';
import { admissionService } from '../../services/admissionService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const OfficerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await admissionService.getApplications();
        setApplications(data || []);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Loading admissions intelligence dashboard..." />;
  }

  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW').length;
  const approved = applications.filter((a) => a.status === 'APPROVED').length;
  const rejected = applications.filter((a) => a.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admissions & Evaluation Desk</h1>
          <p className="page-description">
            Evaluate incoming undergraduate candidates, inspect credentials, and manage admission decisions
          </p>
        </div>

        <Link to="/officer/applications">
          <Button variant="primary" icon={FileText}>
            Open Review Queue ({pending})
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card stat-card">
          <div>
            <div className="stat-label">Total Applications</div>
            <div className="stat-value">{total}</div>
            <div className="stat-change text-muted">
              Fall 2026 Intake
            </div>
          </div>
          <div className="stat-icon">
            <FileText size={24} />
          </div>
        </div>

        <div className="card stat-card stat-warning">
          <div>
            <div className="stat-label">Pending Evaluation</div>
            <div className="stat-value">{pending}</div>
            <div className="stat-change text-amber-600">
              Needs Action
            </div>
          </div>
          <div className="stat-icon icon-warning">
            <Clock size={24} />
          </div>
        </div>

        <div className="card stat-card stat-success">
          <div>
            <div className="stat-label">Admitted Students</div>
            <div className="stat-value">{approved}</div>
            <div className="stat-change text-emerald-600">
              <TrendingUp size={14} /> {total > 0 ? Math.round((approved / total) * 100) : 0}% Acceptance
            </div>
          </div>
          <div className="stat-icon icon-success">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="card stat-card stat-danger">
          <div>
            <div className="stat-label">Declined Applications</div>
            <div className="stat-value">{rejected}</div>
            <div className="stat-change text-rose-600">
              Prerequisite shortfalls
            </div>
          </div>
          <div className="stat-icon icon-danger">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Applications Review Queue */}
      <Card
        title="Pending Admission Queue"
        subtitle="Prioritized submissions awaiting committee decision"
        action={
          <Link to="/officer/applications" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View All Applications <ArrowRight size={14} />
          </Link>
        }
      >
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Program Applied</th>
                <th>GPA / SAT</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Review</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app._id}>
                  <td>
                    <div className="font-bold text-primary">{app.applicantName}</div>
                    <div className="text-xs text-muted">{app.email}</div>
                  </td>
                  <td>
                    <div className="text-sm font-semibold text-primary">{app.program}</div>
                    <div className="text-xs text-muted">{app.term}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-primary">{app.gpaScore}</div>
                    <div className="text-xs text-muted">SAT: {app.satScore || 'N/A'}</div>
                  </td>
                  <td>
                    <span className="text-xs text-secondary">{formatDate(app.submissionDate)}</span>
                  </td>
                  <td>
                    <Badge status={app.status} size="sm" />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/officer/applications/${app._id}`}>
                      <Button variant="outline" size="sm" iconRight={ArrowRight}>
                        Evaluate
                      </Button>
                    </Link>
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

export default OfficerDashboard;
