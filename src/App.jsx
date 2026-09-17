import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminRegister from './components/AdminRegister';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import FacultyLogin from './components/FacultyLogin';
import FacultyDashboard from './components/FacultyDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('admin-register'); // Default start view
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('budget_token') || '');
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Auto-restore login session if token exists
  useEffect(() => {
    const savedUserStr = localStorage.getItem('budget_user');
    const savedToken = localStorage.getItem('budget_token');
    if (savedToken && savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        setCurrentUser(parsedUser);
        setToken(savedToken);
        if (parsedUser.role === 'admin') {
          setCurrentView('admin-dashboard');
        } else if (parsedUser.role === 'faculty') {
          setCurrentView('faculty-dashboard');
        }
      } catch (err) {
        localStorage.removeItem('budget_token');
        localStorage.removeItem('budget_user');
      }
    }
  }, []);

  const handleAdminRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setCurrentView('admin-login');
  };

  const handleLoginSuccess = (userData, userToken) => {
    setCurrentUser(userData);
    setToken(userToken);
    if (userData.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else if (userData.role === 'faculty') {
      setCurrentView('faculty-dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('budget_token');
    localStorage.removeItem('budget_user');
    setCurrentUser(null);
    setToken('');
    setCurrentView('admin-login');
  };

  // Guard protected views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin-register':
        return (
          <AdminRegister
            onNavigateToLogin={() => setCurrentView('admin-login')}
            onRegisterSuccess={handleAdminRegisterSuccess}
          />
        );

      case 'admin-login':
        return (
          <AdminLogin
            initialEmail={registeredEmail}
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentView('admin-register')}
          />
        );

      case 'admin-dashboard':
        if (!currentUser || currentUser.role !== 'admin') {
          return (
            <AdminLogin
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => setCurrentView('admin-register')}
            />
          );
        }
        return (
          <AdminDashboard
            user={currentUser}
            token={token}
            onLogout={handleLogout}
          />
        );

      case 'faculty-login':
        return (
          <FacultyLogin
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case 'faculty-dashboard':
        if (!currentUser || currentUser.role !== 'faculty') {
          return <FacultyLogin onLoginSuccess={handleLoginSuccess} />;
        }
        return (
          <FacultyDashboard
            user={currentUser}
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <AdminRegister
            onNavigateToLogin={() => setCurrentView('admin-login')}
            onRegisterSuccess={handleAdminRegisterSuccess}
          />
        );
    }
  };

  return (
    <div>
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="page-container">
        {renderCurrentView()}
      </main>
    </div>
  );
}
