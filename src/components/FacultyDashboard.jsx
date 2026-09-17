import React from 'react';
import { CheckCircle, LogOut, ShieldCheck, Mail, Calendar } from 'lucide-react';

export default function FacultyDashboard({ user, onLogout }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'F'}
          </div>
          <div>
            <div className="user-name">{user?.email}</div>
            <div className="user-email">Faculty Member • Authorized Status</div>
          </div>
        </div>

        <button onClick={onLogout} className="btn-logout" title="Log Out">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="faculty-hero-card">
        <div className="success-icon-badge">
          <CheckCircle size={38} />
        </div>

        <h2 className="faculty-welcome-title">Faculty Authentication Successful</h2>
        <p className="faculty-welcome-text">
          Welcome! You have successfully logged into the College Event Budget Management System.
        </p>

        <div className="info-box">
          <div className="info-item">
            <span className="info-label">Account Status:</span>
            <span className="info-val" style={{ color: 'var(--faculty-accent)' }}>
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Authorized Faculty
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Faculty Email:</span>
            <span className="info-val">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Session Status:</span>
            <span className="info-val">Active (Authenticated)</span>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Phase 1 Complete. Event management and budget features will be available in future releases.
        </div>
      </div>
    </div>
  );
}
