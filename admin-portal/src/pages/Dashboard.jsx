import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.css';

const StatCard = ({ icon, label, value, color, subLabel }) => (
  <div className="stat-card" style={{ '--card-color': color }}>
    <div className="stat-card-icon" style={{ background: `${color}18`, color }}>
      {icon}
    </div>
    <div className="stat-card-body">
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
      {subLabel && <div className="stat-sub">{subLabel}</div>}
    </div>
    <div className="stat-card-bar" style={{ background: color }}></div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{today}</p>
        </div>
        <div className="dashboard-topbar-actions">
          <a href="/jobs" className="btn-topbar">+ Add Job</a>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="stats-grid">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="stat-card-skeleton">
              <div className="sk-icon"></div>
              <div className="sk-lines">
                <div className="sk-line big"></div>
                <div className="sk-line small"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          <StatCard icon="👥" label="Total Users" value={stats?.totalUsers} color="#2563EB" subLabel="Registered users" />
          <StatCard icon="💼" label="Total Jobs" value={stats?.totalJobs} color="#0EA5E9" subLabel="Active listings" />
          <StatCard icon="📋" label="Applications" value={stats?.totalApplications} color="#8B5CF6" subLabel="All time" />
          <StatCard icon="⏳" label="Pending" value={stats?.pendingApplications} color="#F59E0B" subLabel="Awaiting review" />
          <StatCard icon="🎉" label="Hired" value={stats?.hiredApplications} color="#22C55E" subLabel="Successful placements" />
          <StatCard icon="📌" label="Internships" value={stats?.totalInternships} color="#F97316" subLabel="Internship listings" />
          <StatCard icon="🗂️" label="Job Listings" value={stats?.totalJobListings} color="#EC4899" subLabel="Full-time roles" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="quick-actions-grid">
          <a href="/jobs" className="quick-action-card">
            <div className="qa-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>💼</div>
            <div>
              <div className="qa-title">Manage Jobs</div>
              <div className="qa-sub">Add, edit or delete job listings</div>
            </div>
            <span className="qa-arrow">→</span>
          </a>
          <a href="/applications" className="quick-action-card">
            <div className="qa-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}>📋</div>
            <div>
              <div className="qa-title">Review Applications</div>
              <div className="qa-sub">Update application statuses</div>
            </div>
            <span className="qa-arrow">→</span>
          </a>
          <a href="/users" className="quick-action-card">
            <div className="qa-icon" style={{ background: '#FFF7ED', color: '#EA580C' }}>👥</div>
            <div>
              <div className="qa-title">View Users</div>
              <div className="qa-sub">Browse all registered users</div>
            </div>
            <span className="qa-arrow">→</span>
          </a>
        </div>
      </div>

      {/* Summary Bar */}
      {stats && !loading && (
        <div className="summary-bar-section">
          <h2 className="section-heading">Application Status Overview</h2>
          <div className="summary-bar-card">
            <div className="bar-labels">
              <span>Pending</span>
              <span>Under Review</span>
              <span>Hired</span>
              <span>Rejected</span>
            </div>
            <div className="stacked-bar">
              {stats.totalApplications > 0 && <>
                <div className="bar-segment pending"
                  style={{ width: `${Math.round((stats.pendingApplications / stats.totalApplications) * 100)}%` }}
                  title={`Pending: ${stats.pendingApplications}`}
                ></div>
                <div className="bar-segment review"
                  style={{ width: `${Math.round(((stats.totalApplications - stats.pendingApplications - stats.hiredApplications) / stats.totalApplications) * 100)}%` }}
                ></div>
                <div className="bar-segment hired"
                  style={{ width: `${Math.round((stats.hiredApplications / stats.totalApplications) * 100)}%` }}
                  title={`Hired: ${stats.hiredApplications}`}
                ></div>
              </>}
            </div>
            <p className="bar-total">Total: <strong>{stats.totalApplications}</strong> applications</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
