import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/management.css';

const STATUS_OPTIONS = ['Under Review', 'Hired', 'Rejected', 'Pending'];

const statusColors = {
  'Pending': { bg: '#FEF9C3', color: '#854D0E', border: '#FDE047' },
  'Under Review': { bg: '#EFF6FF', color: '#1D4ED8', border: '#93C5FD' },
  'Hired': { bg: '#F0FDF4', color: '#15803D', border: '#86EFAC' },
  'Rejected': { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5' }
};

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/applications/all');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      const res = await axios.put('/api/applications/status', { applicationId, status });
      setApplications(prev =>
        prev.map(a => a._id === applicationId ? { ...a, status: res.data.status } : a)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const allStatuses = ['All', 'Pending', 'Under Review', 'Hired', 'Rejected'];

  const filtered = applications.filter(app => {
    const matchStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchSearch = !searchTerm ||
      app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobId?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const counts = allStatuses.reduce((acc, s) => {
    acc[s] = s === 'All' ? applications.length : applications.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <div className="management-page">
      <div className="management-topbar">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle">{applications.length} total applications</p>
        </div>
        <button className="btn-refresh" onClick={fetchApplications}>↺ Refresh</button>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-filter-tabs">
        {allStatuses.map(s => (
          <button
            key={s}
            className={`status-tab ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
            style={filterStatus === s && s !== 'All' ? {
              background: statusColors[s]?.bg,
              color: statusColors[s]?.color,
              borderColor: statusColors[s]?.border
            } : {}}
          >
            {s} <span className="tab-badge">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mgmt-search-wrap">
        <span className="mgmt-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by candidate name, job title, or company..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mgmt-search-input"
        />
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="mgmt-loading">
          {[1,2,3,4,5].map(i => <div key={i} className="table-skeleton-row"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mgmt-empty">
          <div>📭</div>
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="mgmt-table-wrap">
          <table className="mgmt-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Applied For</th>
                <th>Company</th>
                <th>Type</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => {
                const sColors = statusColors[app.status] || statusColors.Pending;
                return (
                  <tr key={app._id} className="app-table-row">
                    <td>
                      <div className="td-user">
                        <div className="td-user-avatar">
                          {app.userId?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="td-title">{app.userId?.name || 'Unknown'}</div>
                          <div className="td-sub">{app.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="td-title">{app.jobId?.title || '—'}</div>
                      <div className="td-sub">{app.jobId?.location}</div>
                    </td>
                    <td>
                      <div className="td-company">
                        <div className="td-company-avatar">
                          {app.jobId?.companyName?.charAt(0) || '?'}
                        </div>
                        {app.jobId?.companyName || '—'}
                      </div>
                    </td>
                    <td>
                      <span className={`type-badge ${app.jobId?.type === 'Internship' ? 'internship' : 'job'}`}>
                        {app.jobId?.type || '—'}
                      </span>
                    </td>
                    <td className="td-date">{formatDate(app.createdAt)}</td>
                    <td>
                      <span
                        className="app-status-chip"
                        style={{ background: sColors.bg, color: sColors.color, border: `1px solid ${sColors.border}` }}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={app.status}
                        onChange={e => updateStatus(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                        className="status-select"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updatingId === app._id && <span className="updating-spinner"></span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
