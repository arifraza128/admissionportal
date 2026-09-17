import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  X
} from 'lucide-react';

const StatusBanner = ({
  status, // 'ENROLLED', 'WAITLISTED', 'REJECTED', 'INFO', 'SUCCESS'
  title,
  message,
  reason,
  onDismiss,
  className = '',
}) => {
  if (!status && !message && !reason) return null;

  let alertType = 'info';
  let Icon = Info;
  let defaultTitle = title;

  const normalizedStatus = (status || '').toUpperCase();

  if (normalizedStatus === 'ENROLLED' || normalizedStatus === 'SUCCESS') {
    alertType = 'success';
    Icon = CheckCircle2;
    defaultTitle = title || 'Course Registration Successful';
  } else if (normalizedStatus === 'WAITLISTED') {
    alertType = 'warning';
    Icon = AlertTriangle;
    defaultTitle = title || 'Waitlist Confirmation';
  } else if (normalizedStatus === 'REJECTED' || normalizedStatus === 'ERROR' || normalizedStatus === 'FAILED') {
    alertType = 'danger';
    Icon = XCircle;
    defaultTitle = title || 'Registration Not Allowed';
  }

  const displayMessage = message || reason;

  return (
    <div className={`alert alert-${alertType} animate-fade-in ${className}`}>
      <Icon className="alert-icon" size={20} />
      <div className="flex-1">
        {defaultTitle && <div className="alert-title">{defaultTitle}</div>}
        <div className="text-sm">{displayMessage}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="btn-icon"
          style={{ padding: 4, margin: -4 }}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default StatusBanner;
