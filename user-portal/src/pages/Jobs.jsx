import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { JobCard } from '../components/JobCard';
import '../styles/jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('All');
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [applyModal, setApplyModal] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchJobs();
    fetchUserApplications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (type !== 'All') params.type = type;
      const res = await axios.get('/api/jobs', { params });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const res = await axios.get('/api/applications/user');
      setAppliedJobIds(res.data.map(app => app.jobId?._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = (job) => {
    setApplyModal(job);
    setCoverLetter('');
    setApplyMessage('');
  };

  const submitApplication = async () => {
    setApplyLoading(true);
    try {
      await axios.post('/api/applications/apply', {
        jobId: applyModal._id,
        coverLetter
      });
      setAppliedJobIds(prev => [...prev, applyModal._id]);
      setApplyMessage('success');
      setTimeout(() => setApplyModal(null), 1500);
    } catch (err) {
      setApplyMessage(err.response?.data?.message || 'Application failed');
    } finally {
      setApplyLoading(false);
    }
  };

  const filterTypes = ['All', 'Job', 'Internship'];

  return (
    <div className="jobs-page">
      {/* Search Header */}
      <div className="jobs-header">
        <div className="jobs-header-content">
          <h1>Find Your Opportunity</h1>
          <p>Explore job and internship listings tailored for you</p>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-inputs">
              <div className="search-input-wrap">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search job titles or companies..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="search-input-wrap">
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input
                  type="text"
                  placeholder="Location..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-search">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div className="jobs-content">
        {/* Filters */}
        <div className="filter-row">
          <span className="filter-label">Filter by:</span>
          <div className="filter-tabs">
            {filterTypes.map(t => (
              <button
                key={t}
                className={`filter-tab ${type === t ? 'active' : ''}`}
                onClick={() => { setType(t); }}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="results-count">{jobs.length} listing{jobs.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No listings found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn-reset" onClick={() => { setSearch(''); setLocation(''); setType('All'); fetchJobs(); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.filter(job => type === 'All' || job.type === type).map(job => (
              <JobCard
                key={job._id}
                job={job}
                onApply={handleApply}
                appliedJobIds={appliedJobIds}
              />
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setApplyModal(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>Apply for Position</h3>
              <button className="modal-close" onClick={() => setApplyModal(null)}>✕</button>
            </div>
            <div className="modal-job-info">
              <strong>{applyModal.title}</strong>
              <span>{applyModal.companyName} · {applyModal.location}</span>
            </div>
            <div className="modal-body">
              <label>Cover Letter (optional)</label>
              <textarea
                rows="5"
                placeholder="Tell us why you're a great fit for this role..."
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
              ></textarea>
            </div>
            {applyMessage === 'success' ? (
              <div className="apply-success">
                <span>🎉</span> Application submitted successfully!
              </div>
            ) : applyMessage ? (
              <div className="apply-error">{applyMessage}</div>
            ) : null}
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setApplyModal(null)}>Cancel</button>
              <button
                className="btn-submit-apply"
                onClick={submitApplication}
                disabled={applyLoading}
              >
                {applyLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
