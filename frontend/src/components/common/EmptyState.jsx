import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display here.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div
        className="mx-auto mb-4 flex items-center justify-center rounded-full bg-slate-100 text-slate-400"
        style={{ width: 64, height: 64, margin: '0 auto 1rem' }}
      >
        <Icon size={32} />
      </div>
      <h3 className="font-bold text-lg text-primary">{title}</h3>
      <p className="text-muted text-sm max-w-sm mx-auto mt-1 mb-6" style={{ margin: '0.25rem auto 1.5rem' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
