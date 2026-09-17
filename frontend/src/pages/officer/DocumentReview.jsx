import React, { useState, useEffect } from 'react';
import {
  FolderCheck,
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Download
} from 'lucide-react';
import { documentService } from '../../services/documentService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const DocumentReview = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getDocuments();
        setDocuments(data || []);
      } catch (err) {
        console.error('Failed to load documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Accessing central document repository..." />;
  }

  const filtered = documents.filter(
    (d) =>
      d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Candidate Document Verification</h1>
          <p className="page-description">
            Audit and inspect submitted transcripts, test reports, and identity certificates
          </p>
        </div>
      </div>

      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="input-with-icon flex-1 min-w-[260px]">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Search documents by file name or document type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card title="Submitted Credentials Archive" subtitle={`${filtered.length} verified records`}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Document File</th>
                <th>Category</th>
                <th>File Size</th>
                <th>Uploaded Date</th>
                <th>Verification Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-primary" />
                      <span className="font-bold text-primary">{doc.fileName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-semibold text-secondary">{doc.documentType}</span>
                  </td>
                  <td>
                    <span className="text-xs text-muted">{doc.fileSize}</span>
                  </td>
                  <td>
                    <span className="text-xs text-secondary">{formatDate(doc.uploadedAt)}</span>
                  </td>
                  <td>
                    <Badge variant="success" size="sm">
                      {doc.status || 'VERIFIED'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Download}
                      onClick={() => alert(`Viewing document: ${doc.fileName}`)}
                    >
                      Inspect
                    </Button>
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

export default DocumentReview;
