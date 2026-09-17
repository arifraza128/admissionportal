import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

const ToastItem = ({ toast, onClose }) => {
  const { id, title, message, type } = toast;

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} style={{ color: 'var(--success)' }} />,
    error: <AlertCircle className="text-rose-500" size={20} style={{ color: 'var(--danger)' }} />,
    warning: <AlertTriangle className="text-amber-500" size={20} style={{ color: 'var(--warning)' }} />,
    info: <Info className="text-blue-500" size={20} style={{ color: 'var(--info)' }} />,
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type] || icons.info}
      <div className="flex-1">
        <div className="toast-title">{title}</div>
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="btn-icon"
        style={{ padding: 2, margin: -4 }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const Toast = ({ toasts = [], onClose }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
