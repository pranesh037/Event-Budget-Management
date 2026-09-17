import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Mail, LogOut, CheckCircle2, AlertCircle, Shield, ListFilter } from 'lucide-react';

export default function AdminDashboard({ user, token, onLogout }) {
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingList, setFetchingList] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Fetch registered faculty list on load
  const fetchFacultyList = async () => {
    try {
      const response = await fetch('/api/admin/faculty-list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFacultyList(data.faculty || []);
      }
    } catch (err) {
      console.error('Error fetching faculty list:', err);
    } finally {
      setFetchingList(false);
    }
  };

  useEffect(() => {
    fetchFacultyList();
  }, [token]);

  const validateEmail = (email) => {
    if (!email.trim()) {
      setEmailError('Faculty Email ID is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!validateEmail(facultyEmail)) return;

    setLoading(true);

    try {
      const response = await fetch('/api/admin/add-faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: facultyEmail })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatusMessage({
          type: 'error',
          text: data.message || 'Failed to add faculty member.'
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: data.message
        });
        setFacultyEmail('');
        fetchFacultyList(); // Refresh list
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Network error. Unable to add faculty member.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Admin Dashboard Header */}
      <div className="dashboard-header">
        <div className="user-info">
          <div className="avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div className="user-name">{user?.name || 'Administrator'}</div>
            <div className="user-email">{user?.email} • Admin Account</div>
          </div>
        </div>

        <button onClick={onLogout} className="btn-logout" title="Log Out">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Add Faculty Form Section */}
        <div className="section-card">
          <div className="section-title-wrapper">
            <UserPlus size={22} className="section-icon" />
            <div>
              <h3 className="section-title">Add Faculty</h3>
              <p className="section-desc">Authorize faculty email for system login access</p>
            </div>
          </div>

          {statusMessage.text && (
            <div className={`alert-box ${statusMessage.type}`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={18} className="alert-icon" />
              ) : (
                <AlertCircle size={18} className="alert-icon" />
              )}
              <div>{statusMessage.text}</div>
            </div>
          )}

          <form onSubmit={handleAddFaculty} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="faculty-email-input">Faculty Email ID</label>
              <div className="input-wrapper">
                <span className="input-icon"><Mail size={18} /></span>
                <input
                  id="faculty-email-input"
                  type="email"
                  className="form-input"
                  placeholder="faculty@example.com"
                  value={facultyEmail}
                  onChange={(e) => {
                    setFacultyEmail(e.target.value);
                    if (emailError) setEmailError('');
                    if (statusMessage.text) setStatusMessage({ type: '', text: '' });
                  }}
                  autoComplete="off"
                />
              </div>
              {emailError && <div className="field-error">{emailError}</div>}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Note: Added faculty can log in using default password <code>kongu@123</code>.
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Adding Faculty...' : (
                <>
                  <UserCheck size={18} /> Add Faculty
                </>
              )}
            </button>
          </form>
        </div>

        {/* Authorized Faculty List Section */}
        <div className="section-card">
          <div className="section-title-wrapper">
            <ListFilter size={22} className="section-icon" />
            <div>
              <h3 className="section-title">Authorized Faculty ({facultyList.length})</h3>
              <p className="section-desc">Faculty members permitted to log in</p>
            </div>
          </div>

          {fetchingList ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Loading authorized faculty list...
            </div>
          ) : facultyList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', border: '1px dashed var(--bg-card-border)', borderRadius: 'var(--radius-md)' }}>
              <Shield size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
              <div>No faculty emails added yet.</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Use the form on the left to authorize faculty members.
              </div>
            </div>
          ) : (
            <div className="faculty-table-container">
              <table className="faculty-table">
                <thead>
                  <tr>
                    <th>Email ID</th>
                    <th>Status</th>
                    <th>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyList.map((f) => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: '600' }}>{f.email}</td>
                      <td>
                        <span className="status-tag">
                          <CheckCircle2 size={12} /> Authorized
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(f.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
