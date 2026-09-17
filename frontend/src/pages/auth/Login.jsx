import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Button from '../../components/common/Button';

const Login = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: 'arif@example.com',
    password: 'password123',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await login(formData);
      showSuccess('Welcome back!', `Signed in successfully as ${user.name}`);

      const role = (user.role || '').toUpperCase();
      switch (role) {
        case 'STUDENT':
          navigate('/student/dashboard');
          break;
        case 'FACULTY':
          navigate('/faculty/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'ADMISSION_OFFICER':
          navigate('/officer/dashboard');
          break;
        default:
          navigate('/student/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials or server unavailable.';
      setError(msg);
      showError('Authentication Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="text-left mb-6">
        <h2 className="auth-card-title">Sign in to Portal</h2>
        <p className="auth-card-subtitle">
          Enter your academic credentials or select a quick-demo profile
        </p>
      </div>

      {/* Quick Demo Fill Buttons */}
      <div className="mb-4">
        <div className="flex items-center gap-1 text-xs font-semibold text-muted mb-2">
          <Sparkles size={14} className="text-amber-500" />
          <span>Quick Login Demo Profiles:</span>
        </div>
        <div className="quick-login-grid">
          <button
            type="button"
            className="quick-login-btn"
            onClick={() => handleQuickFill('arif@example.com', 'password123')}
          >
            🎓 Student
            <span>arif@example.com</span>
          </button>
          <button
            type="button"
            className="quick-login-btn"
            onClick={() => handleQuickFill('officer@example.com', 'password123')}
          >
            📋 Admission Officer
            <span>officer@example.com</span>
          </button>
          <button
            type="button"
            className="quick-login-btn"
            onClick={() => handleQuickFill('faculty@example.com', 'password123')}
          >
            🔬 Faculty
            <span>faculty@example.com</span>
          </button>
          <button
            type="button"
            className="quick-login-btn"
            onClick={() => handleQuickFill('admin@example.com', 'password123')}
          >
            🛡️ Administrator
            <span>admin@example.com</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ padding: '0.75rem 1rem' }}>
          <AlertCircle size={18} className="alert-icon" />
          <div className="text-xs">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div className="input-with-icon">
            <Mail size={18} className="input-icon-left" />
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="e.g. arif@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="input-with-icon">
            <Lock size={18} className="input-icon-left" />
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          style={{ width: '100%', marginTop: '0.5rem' }}
          isLoading={isLoading}
          icon={LogIn}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-secondary">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
