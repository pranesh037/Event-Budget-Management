import React from 'react';
import { Building2, ShieldCheck, UserPlus, UserCheck, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, currentUser, onLogout }) {
  return (
    <header className="navbar">
      <div className="brand-container" onClick={() => setCurrentView('admin-login')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <Building2 size={22} />
        </div>
        <div>
          <h1 className="brand-title">Event Budget Portal</h1>
          <div className="brand-subtitle">College Management System</div>
        </div>
      </div>

      <nav className="nav-links">
        {currentUser ? (
          <>
            <button
              className={`nav-btn ${currentView.includes('dashboard') ? 'active' : ''}`}
              onClick={() => {
                if (currentUser.role === 'admin') setCurrentView('admin-dashboard');
                else setCurrentView('faculty-dashboard');
              }}
            >
              <LayoutDashboard size={16} />
              {currentUser.role === 'admin' ? 'Admin Dashboard' : 'Faculty Dashboard'}
            </button>
            <button className="nav-btn" onClick={onLogout}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={`nav-btn ${currentView === 'admin-register' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin-register')}
            >
              <UserPlus size={16} /> Admin Create Account
            </button>

            <button
              className={`nav-btn ${currentView === 'admin-login' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin-login')}
            >
              <ShieldCheck size={16} /> Admin Login
            </button>

            <button
              className={`nav-btn nav-btn-primary ${currentView === 'faculty-login' ? 'active' : ''}`}
              onClick={() => setCurrentView('faculty-login')}
            >
              <UserCheck size={16} /> Faculty Login
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
