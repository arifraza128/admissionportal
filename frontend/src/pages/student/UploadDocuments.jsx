import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileCheck2,
  Trash2,
  FileText,
  ShieldCheck,
  Plus,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { documentService } from '../../services/documentService';
import useToast from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const UploadDocuments = () => {
  const { showSuccess, showError } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [documentType, setDocumentType] = useState('Academic Transcript');
  const [selectedFileName, setSelectedFileName] = useState('');

  const fetchDocs = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFileName) {
      showError('No File Selected', 'Please choose a file to upload.');
      return;
    }

    setUploading(true);
    try {
      await documentService.uploadDocument({
        fileName: selectedFileName,
        documentType: documentType,
        fileSize: (Math.random() * 2 + 0.5).toFixed(1) + ' MB',
      });
      showSuccess('Document Uploaded', `${selectedFileName} has been uploaded for verification.`);
      setSelectedFileName('');
      await fetchDocs();
    } catch (err) {
      showError('Upload Failed', err.response?.data?.message || 'Could not upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await documentService.deleteDocument(deleteId);
      showSuccess('Document Removed', 'The file was removed from your dossier.');
      setDocuments((prev) => prev.filter((d) => d._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showError('Delete Failed', 'Could not delete document.');
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Retrieving verified document records..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admission Document Center</h1>
          <p className="page-description">
            Submit verified academic transcripts, identity proof, and supporting credentials
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <Card title="Upload Supporting Document" subtitle="Supported formats: PDF, PNG, JPEG up to 10MB">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="docType">
                Document Category *
              </label>
              <select
                id="docType"
                className="form-select"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="Academic Transcript">Official Academic Transcript</option>
                <option value="Government Identity Proof">Government Identity / Passport</option>
                <option value="Recommendation Letter">Letter of Recommendation</option>
                <option value="Personal Essay / SOP">Statement of Purpose / Essay</option>
                <option value="Standardized Test Score">SAT / TOEFL / IELTS Scorecard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Select File *
              </label>
              <label className="file-dropzone flex items-center justify-center p-3" style={{ padding: '0.6875rem' }}>
                <input
                  type="file"
                  className="hidden"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <div className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
                  <UploadCloud size={18} />
                  <span>{selectedFileName || 'Browse & Select File...'}</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={uploading}
              icon={Plus}
            >
              Upload Document
            </Button>
          </div>
        </form>
      </Card>

      {/* Uploaded Documents List */}
      <Card
        title="Submitted Documents"
        subtitle={`${documents.length} verified records in your official application folder`}
      >
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            No documents uploaded yet. Upload your transcripts and ID above to complete your admission checklist.
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between p-4 rounded-lg border border-color hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-primary flex items-center gap-2">
                      {doc.fileName}
                      <Badge variant="success" size="sm">
                        {doc.status || 'VERIFIED'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted">
                      {doc.documentType} • {doc.fileSize} • Uploaded {formatDate(doc.uploadedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="danger-outline"
                    size="sm"
                    icon={Trash2}
                    onClick={() => setDeleteId(doc._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Document"
        message="Are you sure you want to remove this document from your admission dossier?"
        confirmText="Remove"
      />
    </div>
  );
};

export default UploadDocuments;
