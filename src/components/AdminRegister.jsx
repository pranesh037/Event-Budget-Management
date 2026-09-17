import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminRegister({ onNavigateToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Admin Name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Admin Email ID is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setServerSuccess('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.message || 'Failed to create Admin account.');
      } else {
        setServerSuccess(data.message);
        setTimeout(() => {
          onRegisterSuccess ? onRegisterSuccess(formData.email) : onNavigateToLogin();
        }, 1500);
      }
    } catch (err) {
      setServerError('Network error. Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="card-header">
        <span className="role-badge admin">
          <UserPlus size={14} /> Admin Portal
        </span>
        <h2 className="card-title">Create Admin Account</h2>
        <p className="card-subtitle">Setup administrator credentials for budget system</p>
      </div>

      {serverError && (
        <div className="alert-box error">
          <AlertCircle size={18} className="alert-icon" />
          <div>{serverError}</div>
        </div>
      )}

      {serverSuccess && (
        <div className="alert-box success">
          <CheckCircle2 size={18} className="alert-icon" />
          <div>{serverSuccess}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Admin Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-name">Admin Name</label>
          <div className="input-wrapper">
            <span className="input-icon"><User size={18} /></span>
            <input
              id="admin-name"
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Dr. A. Kumar"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>

        {/* Admin Email ID */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-email">Admin Email ID</label>
          <div className="input-wrapper">
            <span className="input-icon"><Mail size={18} /></span>
            <input
              id="admin-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="admin@kongu.edu"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-password">Password</label>
          <div className="input-wrapper">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-confirm-password">Confirm Password</label>
          <div className="input-wrapper">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              id="admin-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="card-footer">
        Already have an Admin account?{' '}
        <span className="card-footer-link" onClick={onNavigateToLogin}>
          Log In here
        </span>
      </div>
    </div>
  );
}
