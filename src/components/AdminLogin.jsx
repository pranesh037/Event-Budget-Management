import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, initialEmail = '' }) {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Admin Email ID is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
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

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.message || 'Invalid Admin credentials.');
      } else {
        // Save auth state & token
        localStorage.setItem('budget_token', data.token);
        localStorage.setItem('budget_user', JSON.stringify(data.user));
        onLoginSuccess(data.user, data.token);
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
          <ShieldCheck size={14} /> Admin Portal
        </span>
        <h2 className="card-title">Admin Login</h2>
        <p className="card-subtitle">Access college event budget management dashboard</p>
      </div>

      {serverError && (
        <div className="alert-box error">
          <AlertCircle size={18} className="alert-icon" />
          <div>{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Admin Email ID */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-login-email">Admin Email ID</label>
          <div className="input-wrapper">
            <span className="input-icon"><Mail size={18} /></span>
            <input
              id="admin-login-email"
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
          <label className="form-label" htmlFor="admin-login-password">Password</label>
          <div className="input-wrapper">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              id="admin-login-password"
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

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Authenticating...' : (
            <>
              Login to Admin Dashboard <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
