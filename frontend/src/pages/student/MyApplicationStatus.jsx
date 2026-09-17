import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  UserCheck,
  Calendar,
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { admissionService } from '../../services/admissionService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const MyApplicationStatus = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const data = await admissionService.getMyApplication();
        setApplication(data);
      } catch (err) {
        console.error('Failed to load application:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving admission records..." />;
  }

  if (!application) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <FileText size={48} className="mx-auto text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-primary">No Admission Application Found</h2>
        <p className="text-muted text-sm mt-1 mb-6">
          You have not submitted an admission application for the current academic session yet.
        </p>
        <Link to="/student/admission-apply">
          <Button variant="primary" icon={FileText}>
            Start New Application
          </Button>
        </Link>
      </div>
    );
  }

  const isApproved = application.status === 'APPROVED';
  const isRejected = application.status === 'REJECTED';
  const isUnderReview = application.status === 'UNDER_REVIEW';

  const milestones = [
    { title: 'Application Submitted', desc: formatDate(application.submissionDate), done: true },
    { title: 'Document Verification', desc: 'Credentials Verified', done: true },
    { title: 'Faculty & Department Review', desc: 'Admissions Committee', done: isApproved || isRejected || isUnderReview },
    { title: 'Final Decision', desc: application.status, done: isApproved || isRejected },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admission Application Tracker</h1>
          <p className="page-description">
            Real-time status of your university admission dossier
          </p>
        </div>
      </div>

      {/* Decision Card */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`stat-icon ${
                isApproved
                  ? 'icon-success'
                  : isRejected
                  ? 'icon-danger'
                  : 'icon-warning'
              }`}
              style={{ width: 56, height: 56 }}
            >
              {isApproved && <CheckCircle2 size={32} />}
              {isRejected && <XCircle size={32} />}
              {!isApproved && !isRejected && <Clock size={32} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-primary">
                  {application.program}
                </h2>
                <Badge status={application.status} size="lg" />
              </div>
              <p className="text-xs text-muted mt-1">
                Application ID: #{application._id} • Term: {application.term} • Submitted {formatDate(application.submissionDate)}
              </p>
            </div>
          </div>

          {isApproved && (
            <Link to="/student/course-registration">
              <Button variant="success" iconRight={ArrowRight}>
                Proceed to Course Registration
              </Button>
            </Link>
          )}
        </div>

        {/* Milestone Tracker */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-primary mb-4">Milestone Progress</h3>
          <div className="grid grid-cols-4 gap-2">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-center ${
                  m.done
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold mb-1">{m.title}</div>
                <div className="text-xs font-medium opacity-80">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviewer Feedback Note */}
        {application.reviewerNotes && (
          <div className={`alert ${isApproved ? 'alert-success' : isRejected ? 'alert-danger' : 'alert-info'}`}>
            <UserCheck className="alert-icon" size={20} />
            <div>
              <div className="alert-title">Admissions Committee Notes:</div>
              <div className="text-sm">{application.reviewerNotes}</div>
              {application.reviewedBy && (
                <div className="text-xs mt-1 opacity-75">
                  Reviewed by: {application.reviewedBy} on {formatDate(application.reviewDate)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applicant Summary Details */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-muted">Applicant Name</div>
            <div className="font-semibold text-primary">{application.applicantName}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-muted">Applicant Email</div>
            <div className="font-semibold text-primary">{application.email}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-muted">Previous High School / College</div>
            <div className="font-semibold text-primary">{application.highSchool}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-muted">GPA / Standardized Evaluation</div>
            <div className="font-semibold text-primary">{application.gpaScore} (SAT: {application.satScore || 'N/A'})</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MyApplicationStatus;
