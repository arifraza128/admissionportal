import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Button from '../../components/common/Button';

const Register = () => {
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const user = await register(payload);
      showSuccess('Account Created!', `Welcome to Apex University, ${user.name}`);

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
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      showError('Registration Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="text-left mb-6">
        <h2 className="auth-card-title">Create an Account</h2>
        <p className="auth-card-subtitle">
          Join the university academic portal and admissions ecosystem
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ padding: '0.75rem 1rem' }}>
          <AlertCircle size={18} className="alert-icon" />
          <div className="text-xs">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <div className="input-with-icon">
            <User size={18} className="input-icon-left" />
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-input"
              placeholder="e.g. Arif Raza"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Academic / Personal Email
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
          <label className="form-label" htmlFor="role">
            Account Role
          </label>
          <select
            id="role"
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty Member</option>
            <option value="ADMISSION_OFFICER">Admission Officer</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                placeholder="Min 6 chars"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon-left" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="form-input"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          style={{ width: '100%', marginTop: '0.75rem' }}
          isLoading={isLoading}
          icon={UserPlus}
        >
          Register Account
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-secondary">
        Already registered?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
};

export default Register;
