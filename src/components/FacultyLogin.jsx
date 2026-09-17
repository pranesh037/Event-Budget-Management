import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function FacultyLogin({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Faculty Email ID (Username) is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid faculty email address.';
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
      const response = await fetch('/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerError(data.message || 'Faculty login rejected.');
      } else {
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
        <span className="role-badge faculty">
          <UserCheck size={14} /> Faculty Portal
        </span>
        <h2 className="card-title">Faculty Login</h2>
        <p className="card-subtitle">Log in using your authorized email and default password</p>
      </div>

      {serverError && (
        <div className="alert-box error">
          <AlertCircle size={20} className="alert-icon" />
          <div>{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Faculty Username (Email ID) */}
        <div className="form-group">
          <label className="form-label" htmlFor="faculty-username">Username (Email ID)</label>
          <div className="input-wrapper">
            <span className="input-icon"><Mail size={18} /></span>
            <input
              id="faculty-username"
              type="email"
              name="email"
              className="form-input"
              placeholder="faculty@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label" htmlFor="faculty-password">Password</label>
          <div className="input-wrapper">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              id="faculty-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-input"
              placeholder="kongu@123"
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
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Default password: <code>kongu@123</code>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Verifying Faculty Credentials...' : (
            <>
              Faculty Login <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="card-footer">
        Need authorization? Contact your system Admin to add your faculty email.
      </div>
    </div>
  );
}
