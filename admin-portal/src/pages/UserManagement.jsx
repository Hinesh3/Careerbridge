import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/management.css';

const API = 'http://localhost:5000';

const statusColors = {
  'Pending': { bg: '#FEF9C3', color: '#854D0E' },
  'Under Review': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Hired': { bg: '#F0FDF4', color: '#15803D' },
  'Rejected': { bg: '#FEF2F2', color: '#DC2626' }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewProfile, setViewProfile] = useState(null);      // { user, applications }
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full profile + applications for a user
  const openProfile = async (user) => {
    setProfileLoading(true);
    setViewProfile({ user, applications: [] });
    try {
      const res = await axios.get(`/api/admin/users/${user._id}`);
      setViewProfile(res.data);   // { user, applications }
    } catch (err) {
      console.error(err);
      setViewProfile({ user, applications: [] });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setDeleteConfirm(null);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const roleColors = {
    student: { bg: '#EFF6FF', color: '#2563EB' },
    professional: { bg: '#FFF7ED', color: '#EA580C' }
  };

  const filtered = users.filter(u => {
    const matchRole = filterRole === 'All' || u.role === filterRole;
    const matchSearch = !searchTerm ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const studentCount = users.filter(u => u.role === 'student').length;
  const profCount = users.filter(u => u.role === 'professional').length;

  return (
    <div className="management-page">
      <div className="management-topbar">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
        <button className="btn-refresh" onClick={fetchUsers}>↺ Refresh</button>
      </div>

      {/* Mini Stats */}
      <div className="user-mini-stats">
        <div className="user-mini-stat">
          <span className="mini-stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>🎓</span>
          <div>
            <div className="mini-stat-value">{studentCount}</div>
            <div className="mini-stat-label">Students</div>
          </div>
        </div>
        <div className="user-mini-stat">
          <span className="mini-stat-icon" style={{ background: '#FFF7ED', color: '#EA580C' }}>💼</span>
          <div>
            <div className="mini-stat-value">{profCount}</div>
            <div className="mini-stat-label">Professionals</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mgmt-filters-row">
        <div className="mgmt-search-wrap">
          <span className="mgmt-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mgmt-search-input"
          />
        </div>
        <div className="role-filter-tabs">
          {['All', 'student', 'professional'].map(r => (
            <button
              key={r}
              className={`role-filter-tab ${filterRole === r ? 'active' : ''}`}
              onClick={() => setFilterRole(r)}
            >
              {r === 'All' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="mgmt-loading">
          {[1,2,3,4,5].map(i => <div key={i} className="table-skeleton-row"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mgmt-empty">
          <div>👥</div>
          <p>No users found.</p>
        </div>
      ) : (
        <div className="mgmt-table-wrap">
          <table className="mgmt-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Skills</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const rc = roleColors[user.role] || roleColors.student;
                return (
                  <tr key={user._id}>
                    <td>
                      <div className="td-user">
                        <div className="td-user-avatar" style={{ background: rc.bg, color: rc.color }}>
                          {user.profilePicture
                            ? <img src={`${API}${user.profilePicture}`} alt={user.name} className="td-avatar-img" />
                            : user.name.charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <div className="td-title">{user.name}</div>
                          <div className="td-sub">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="role-chip" style={{ background: rc.bg, color: rc.color }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="skills-chips">
                        {(user.skills || []).slice(0,3).map((s, i) => (
                          <span key={i} className="skill-chip">{s}</span>
                        ))}
                        {(user.skills || []).length > 3 && (
                          <span className="skill-chip more">+{user.skills.length - 3}</span>
                        )}
                        {(user.skills || []).length === 0 && <span className="td-sub">—</span>}
                      </div>
                    </td>
                    <td className="td-date">{user.phone || '—'}</td>
                    <td className="td-date">{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="td-actions">
                        <button className="btn-view-profile" onClick={() => openProfile(user)}>
                          👁 View
                        </button>
                        <button className="btn-delete" onClick={() => setDeleteConfirm(user)}>
                          🗑️ Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Full Profile Modal */}
      {viewProfile && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewProfile(null)}>
          <div className="modal-box profile-modal">
            <div className="modal-header">
              <h3>User Profile</h3>
              <button className="modal-close" onClick={() => setViewProfile(null)}>✕</button>
            </div>

            <div className="profile-modal-body">
              {/* Header */}
              <div className="profile-modal-hero">
                <div className="profile-modal-avatar" style={{
                  background: (roleColors[viewProfile.user?.role] || roleColors.student).bg,
                  color: (roleColors[viewProfile.user?.role] || roleColors.student).color
                }}>
                  {viewProfile.user?.profilePicture
                    ? <img src={`${API}${viewProfile.user.profilePicture}`} alt={viewProfile.user?.name} className="profile-modal-avatar-img" />
                    : viewProfile.user?.name?.charAt(0).toUpperCase()
                  }
                </div>
                <div className="profile-modal-info">
                  <h2>{viewProfile.user?.name}</h2>
                  <p className="profile-modal-email">{viewProfile.user?.email}</p>
                  <div className="profile-modal-badges">
                    <span className="role-chip" style={{
                      background: (roleColors[viewProfile.user?.role] || roleColors.student).bg,
                      color: (roleColors[viewProfile.user?.role] || roleColors.student).color
                    }}>
                      {viewProfile.user?.role === 'student' ? '🎓' : '💼'} {viewProfile.user?.role}
                    </span>
                    {viewProfile.user?.phone && <span className="profile-modal-phone">📞 {viewProfile.user.phone}</span>}
                  </div>
                </div>
              </div>
              {profileLoading && <div style={{textAlign:'center',padding:'12px',color:'var(--text-light)',fontSize:'0.85rem'}}>Loading details...</div>}

              {/* Bio */}
              {viewProfile.user?.bio && (
                <div className="profile-modal-section">
                  <h4 className="profile-modal-section-title">About</h4>
                  <p className="profile-modal-bio">{viewProfile.user.bio}</p>
                </div>
              )}

              {/* Skills */}
              {(viewProfile.user?.skills || []).length > 0 && (
                <div className="profile-modal-section">
                  <h4 className="profile-modal-section-title">Skills</h4>
                  <div className="profile-modal-skills">
                    {viewProfile.user.skills.map((s, i) => (
                      <span key={i} className="skill-chip">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {(viewProfile.user?.education || []).length > 0 && (
                <div className="profile-modal-section">
                  <h4 className="profile-modal-section-title">Education</h4>
                  <div className="profile-modal-entries">
                    {viewProfile.user.education.map((edu, i) => (
                      <div key={i} className="profile-modal-entry">
                        <div className="entry-icon">🎓</div>
                        <div>
                          <div className="entry-title">{edu.degree}</div>
                          <div className="entry-sub">{edu.institution}{edu.year ? ` · ${edu.year}` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {(viewProfile.user?.experience || []).length > 0 && (
                <div className="profile-modal-section">
                  <h4 className="profile-modal-section-title">Experience</h4>
                  <div className="profile-modal-entries">
                    {viewProfile.user.experience.map((exp, i) => (
                      <div key={i} className="profile-modal-entry">
                        <div className="entry-icon">💼</div>
                        <div>
                          <div className="entry-title">{exp.position} <span className="entry-at">at</span> {exp.company}</div>
                          {exp.duration && <div className="entry-sub">{exp.duration}</div>}
                          {exp.description && <div className="entry-desc">{exp.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {(viewProfile.applications || []).length > 0 && (
                <div className="profile-modal-section">
                  <h4 className="profile-modal-section-title">Applications ({viewProfile.applications.length})</h4>
                  <div className="profile-modal-apps">
                    {viewProfile.applications.map((app, i) => {
                      const sc = statusColors[app.status] || statusColors['Pending'];
                      return (
                        <div key={i} className="profile-modal-app-item">
                          <div>
                            <div className="profile-modal-app-title">{app.jobId?.title || 'Job Unavailable'}</div>
                            <div className="profile-modal-app-company">{app.jobId?.companyName} · {app.jobId?.type}</div>
                          </div>
                          <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {app.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!viewProfile.user?.bio && (viewProfile.user?.skills || []).length === 0 &&
               (viewProfile.user?.education || []).length === 0 && (viewProfile.user?.experience || []).length === 0 && (
                <div className="profile-modal-empty">
                  <p>This user has not completed their profile yet.</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <span className="profile-modal-joined">Joined {formatDate(viewProfile.user?.createdAt)}</span>
              <button className="btn-modal-cancel" onClick={() => setViewProfile(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal-box small">
            <div className="modal-header">
              <h3>Remove User</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="confirm-body">
              <div className="confirm-icon">⚠️</div>
              <p>Remove <strong>{deleteConfirm.name}</strong> from CareerBridge?</p>
              <p className="confirm-warn">This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-modal-delete" onClick={() => handleDelete(deleteConfirm._id)}>Remove User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
