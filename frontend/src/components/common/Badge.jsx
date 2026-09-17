import React from 'react';
import { getStatusBadgeVariant } from '../../utils/formatters';

const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const badgeVariant = variant || (status ? getStatusBadgeVariant(status) : 'neutral');
  const sizeClass = size === 'sm' ? 'text-xs py-0.5 px-2' : '';

  return (
    <span className={`badge badge-${badgeVariant} ${sizeClass} ${className}`}>
      {showDot && <span className="badge-dot" />}
      {children || status}
    </span>
  );
};

export default Badge;
