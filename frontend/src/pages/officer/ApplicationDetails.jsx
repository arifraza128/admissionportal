import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Download
} from 'lucide-react';
import { admissionService } from '../../services/admissionService';
import { documentService } from '../../services/documentService';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decision Modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appData, docsData] = await Promise.all([
          admissionService.getApplicationById(id),
          documentService.getDocuments(),
        ]);
        setApplication(appData);
        setDocuments(docsData || []);
      } catch (err) {
        console.error('Failed to load application details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const updated = await admissionService.approveApplication(id, {
        reviewerNotes: reviewerNotes || 'Application meets all university admissions criteria. Approved.',
        reviewedBy: 'Eleanor Vance',
      });
      setApplication(updated);
      setShowApproveModal(false);
      showSuccess('Application Approved', `${application.applicantName} is approved for enrollment.`);
    } catch (err) {
      showError('Approval Failed', err.response?.data?.message || 'Could not approve application.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reviewerNotes) {
      showError('Reason Required', 'Please provide notes/reason for declining this application.');
      return;
    }
    setIsProcessing(true);
    try {
      const updated = await admissionService.rejectApplication(id, {
        reviewerNotes,
        reviewedBy: 'Eleanor Vance',
      });
      setApplication(updated);
      setShowRejectModal(false);
      showSuccess('Application Rejected', `Application for ${application.applicantName} marked as rejected.`);
    } catch (err) {
      showError('Rejection Failed', err.response?.data?.message || 'Could not reject application.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving candidate portfolio..." />;
  }

  if (!application) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-primary">Application Dossier Not Found</h2>
        <Link to="/officer/applications" className="text-primary underline mt-2 block">
          Return to applications queue
        </Link>
      </div>
    );
  }

  const isApproved = application.status === 'APPROVED';
  const isRejected = application.status === 'REJECTED';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button and page title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/officer/applications" className="btn-icon">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="page-title" style={{ margin: 0 }}>
                {application.applicantName}
              </h1>
              <Badge status={application.status} size="md" />
            </div>
            <p className="page-description">
              Application ID: #{application._id} • Submitted on {formatDate(application.submissionDate)}
            </p>
          </div>
        </div>

        {/* Action Decision Buttons */}
        <div className="flex items-center gap-2">
          {!isApproved && (
            <Button
              variant="success"
              icon={CheckCircle2}
              onClick={() => {
                setReviewerNotes(application.reviewerNotes || '');
                setShowApproveModal(true);
              }}
            >
              Approve Admission
            </Button>
          )}

          {!isRejected && (
            <Button
              variant="danger-outline"
              icon={XCircle}
              onClick={() => {
                setReviewerNotes(application.reviewerNotes || '');
                setShowRejectModal(true);
              }}
            >
              Reject Application
            </Button>
          )}
        </div>
      </div>

      {/* Reviewer Note Banner if already reviewed */}
      {application.reviewerNotes && (
        <div className={`alert ${isApproved ? 'alert-success' : isRejected ? 'alert-danger' : 'alert-info'}`}>
          <MessageSquare size={20} className="alert-icon" />
          <div>
            <div className="alert-title">Admissions Committee Determination:</div>
            <div className="text-sm">{application.reviewerNotes}</div>
            {application.reviewedBy && (
              <div className="text-xs mt-1 opacity-75">
                Evaluator: {application.reviewedBy} • {formatDate(application.reviewDate)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2-Column Applicant Details & Document Inspection */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: Details */}
        <div className="col-span-2 space-y-6">
          <Card title="Candidate Academic Dossier">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-muted">Intended Degree Program</span>
                <div className="font-bold text-primary mt-0.5">{application.program}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-muted">Intake Term</span>
                <div className="font-bold text-primary mt-0.5">{application.term}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-muted">High School / Prior Institution</span>
                <div className="font-semibold text-primary mt-0.5">{application.highSchool}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-muted">Cumulative GPA / Score</span>
                <div className="font-semibold text-primary mt-0.5">{application.gpaScore}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-muted">Standardized SAT / ACT</span>
                <div className="font-semibold text-primary mt-0.5">{application.satScore || 'Not Submitted'}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs text-muted">Applicant Email & Phone</span>
                <div className="font-semibold text-primary mt-0.5">{application.email} • {application.phone}</div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Statement of Purpose (SOP)
              </h4>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-secondary leading-relaxed">
                {application.statementOfPurpose || 'No personal essay provided.'}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Supporting Documents Review */}
        <div className="col-span-1">
          <Card title="Submitted Documents" subtitle="Verified credentials list">
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="p-3 rounded-lg border border-color bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={18} className="text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-primary truncate">
                        {doc.fileName}
                      </div>
                      <div className="text-[10px] text-muted">
                        {doc.documentType} • {doc.fileSize}
                      </div>
                    </div>
                  </div>

                  <Badge variant="success" size="sm">
                    Verified
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve University Admission"
        subtitle={`Confirm undergraduate acceptance for ${application.applicantName}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleApprove}
              isLoading={isProcessing}
              icon={CheckCircle2}
            >
              Confirm & Issue Admission
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary">
            Approving this application will grant the student official access to the course
            registration system and generate their student record.
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="approveNotes">
              Committee Review Notes (Optional)
            </label>
            <textarea
              id="approveNotes"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Approved with Honors Scholarship consideration..."
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Decline Admission Application"
        subtitle={`Specify grounds for rejection for ${application.applicantName}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={isProcessing}
              icon={XCircle}
            >
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-secondary">
            Please document the specific prerequisite shortfalls or academic grounds for
            declining this candidate.
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="rejectNotes">
              Rejection Reason & Feedback *
            </label>
            <textarea
              id="rejectNotes"
              className="form-textarea"
              rows={3}
              required
              placeholder="e.g. Does not satisfy minimum grade requirements in Mathematics..."
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApplicationDetails;
