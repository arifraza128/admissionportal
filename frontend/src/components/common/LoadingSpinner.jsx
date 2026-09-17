import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({
  size = 32,
  text = 'Loading...',
  fullPage = false,
  className = '',
}) => {
  if (fullPage) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center"
        style={{ minHeight: '60vh', padding: '3rem' }}
      >
        <Loader2 size={size} className="animate-spin text-primary" style={{ color: 'var(--primary)' }} />
        {text && <p className="text-sm font-semibold text-muted">{text}</p>}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-2 p-6 text-muted ${className}`}>
      <Loader2 size={size} className="animate-spin" style={{ color: 'var(--primary)' }} />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
