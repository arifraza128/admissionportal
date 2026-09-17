import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div
        className="w-20 h-20 rounded-2xl bg-blue-100 text-primary flex items-center justify-center mb-6"
        style={{ width: 80, height: 80, margin: '0 auto 1.5rem', background: '#dbeafe', color: '#2563eb' }}
      >
        <HelpCircle size={44} />
      </div>
      <h1 className="text-4xl font-extrabold text-primary mb-2">404 - Page Not Found</h1>
      <p className="text-muted text-sm max-w-md mx-auto mb-6">
        The requested university portal destination could not be located. It may have been moved, renamed, or you might not possess the appropriate role permissions.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
