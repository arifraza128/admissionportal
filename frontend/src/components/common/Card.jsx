import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  footer,
  variant = 'default',
  className = '',
  bodyClassName = '',
}) => {
  const variantClasses = {
    default: 'card',
    elevated: 'card card-elevated',
    glass: 'card card-glass',
  };

  return (
    <div className={`${variantClasses[variant] || 'card'} ${className}`}>
      {(title || subtitle || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-header-action">{action}</div>}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
