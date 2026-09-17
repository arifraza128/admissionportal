import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { admissionService } from '../../services/admissionService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
    return <LoadingSpinner fullPage text="Retrieving admission dossiers..." />;
  }

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      app.status === statusFilter ||
      (statusFilter === 'PENDING' && (app.status === 'PENDING' || app.status === 'UNDER_REVIEW'));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admission Applications Queue</h1>
          <p className="page-description">
            Search, filter, and inspect submitted candidate dossiers for Fall 2026 intake
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="tabs-nav" style={{ marginBottom: 0 }}>
            <div
              className={`tab-item ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All Dossiers ({applications.length})
            </div>
            <div
              className={`tab-item ${statusFilter === 'PENDING' ? 'active' : ''}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              Pending / Under Review
            </div>
            <div
              className={`tab-item ${statusFilter === 'APPROVED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('APPROVED')}
            >
              Approved
            </div>
            <div
              className={`tab-item ${statusFilter === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setStatusFilter('REJECTED')}
            >
              Rejected
            </div>
          </div>

          <div className="input-with-icon min-w-[280px]">
            <Search size={18} className="input-icon-left" />
            <input
              type="text"
              className="form-input"
              placeholder="Search candidate name, email, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Card>
        {filteredApps.length === 0 ? (
          <EmptyState
            title="No applications found"
            description="No student applications match the selected filter criteria."
          />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Applicant Details</th>
                  <th>Degree Program</th>
                  <th>High School GPA</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="font-bold text-primary">{app.applicantName}</div>
                      <div className="text-xs text-muted">{app.email} • {app.phone}</div>
                    </td>
                    <td>
                      <div className="text-sm font-semibold text-primary">{app.program}</div>
                      <div className="text-xs text-muted">{app.term}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-primary">{app.gpaScore}</div>
                      <div className="text-xs text-muted">{app.highSchool}</div>
                    </td>
                    <td>
                      <span className="text-xs text-secondary">{formatDate(app.submissionDate)}</span>
                    </td>
                    <td>
                      <Badge status={app.status} size="sm" />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/officer/applications/${app._id}`}>
                        <Button variant="primary" size="sm" iconRight={ArrowRight}>
                          Review Dossier
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationList;
