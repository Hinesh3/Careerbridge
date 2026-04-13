import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StatusBadge } from '../components/JobCard';
import '../styles/applications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications/user');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const statuses = ['All', 'Pending', 'Under Review', 'Hired', 'Rejected'];
  const filtered = filterStatus === 'All'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === 'All' ? applications.length : applications.filter(a => a.status === s).length;
    return acc;
  }, {});

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>My Applications</h1>
        <p>Track the status of all your job and internship applications</p>
      </div>

      {/* Summary Cards */}
      <div className="app-summary-grid">
        <div className="app-summary-card total">
          <div className="summary-icon">📋</div>
          <div className="summary-count">{applications.length}</div>
          <div className="summary-label">Total Applied</div>
        </div>
        <div className="app-summary-card pending">
          <div className="summary-icon">⏳</div>
          <div className="summary-count">{counts['Pending'] || 0}</div>
          <div className="summary-label">Pending</div>
        </div>
        <div className="app-summary-card review">
          <div className="summary-icon">🔍</div>
          <div className="summary-count">{counts['Under Review'] || 0}</div>
          <div className="summary-label">Under Review</div>
        </div>
        <div className="app-summary-card hired">
          <div className="summary-icon">🎉</div>
          <div className="summary-count">{counts['Hired'] || 0}</div>
          <div className="summary-label">Hired</div>
        </div>
        <div className="app-summary-card rejected">
          <div className="summary-icon">❌</div>
          <div className="summary-count">{counts['Rejected'] || 0}</div>
          <div className="summary-label">Rejected</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="app-filter-tabs">
        {statuses.map(s => (
          <button
            key={s}
            className={`app-filter-tab ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s} {counts[s] > 0 && <span className="tab-count">{counts[s]}</span>}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="loading-state">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-app-card">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-applications">
          <div className="empty-icon">📂</div>
          <h3>{filterStatus === 'All' ? "You haven't applied yet" : `No ${filterStatus} applications`}</h3>
          <p>
            {filterStatus === 'All'
              ? 'Start exploring jobs and internships and submit your first application!'
              : 'Check back later or apply for more opportunities.'
            }
          </p>
          {filterStatus === 'All' && (
            <a href="/jobs" className="btn-go-jobs">Browse Opportunities</a>
          )}
        </div>
      ) : (
        <div className="applications-list">
          {filtered.map((app) => (
            <div key={app._id} className="application-card">
              <div className="app-card-left">
                <div className="app-company-avatar">
                  {app.jobId?.companyName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="app-info">
                  <h3 className="app-job-title">{app.jobId?.title || 'Job Unavailable'}</h3>
                  <p className="app-company">{app.jobId?.companyName || '—'}</p>
                  <div className="app-meta">
                    {app.jobId?.location && (
                      <span className="app-meta-item">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {app.jobId.location}
                      </span>
                    )}
                    {app.jobId?.type && (
                      <span className={`app-type-tag ${app.jobId.type === 'Internship' ? 'internship' : 'job'}`}>
                        {app.jobId.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="app-card-right">
                <StatusBadge status={app.status} />
                <p className="app-date">Applied {formatDate(app.createdAt)}</p>
                {app.coverLetter && (
                  <details className="app-cover-letter">
                    <summary>View Cover Letter</summary>
                    <p>{app.coverLetter}</p>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
