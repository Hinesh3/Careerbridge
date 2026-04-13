import React from 'react';
import '../styles/jobs.css';

const typeColors = {
  Job: { bg: '#EFF6FF', color: '#2563EB', border: '#2563EB' },
  Internship: { bg: '#F0FDF4', color: '#16A34A', border: '#16A34A' }
};

const statusColors = {
  Pending: { bg: '#FEF9C3', color: '#854D0E' },
  'Under Review': { bg: '#EFF6FF', color: '#1D4ED8' },
  Hired: { bg: '#F0FDF4', color: '#15803D' },
  Rejected: { bg: '#FEF2F2', color: '#DC2626' }
};

export const JobCard = ({ job, onApply, appliedJobIds = [] }) => {
  const colors = typeColors[job.type] || typeColors.Job;
  const hasApplied = appliedJobIds.includes(job._id);

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-avatar">
          {job.companyName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.companyName}</p>
        </div>
        <span
          className="job-type-badge"
          style={{
            backgroundColor: colors.bg,
            color: colors.color,
            border: `1px solid ${colors.border}`
          }}
        >
          {job.type}
        </span>
      </div>

      <div className="job-card-details">
        <span className="job-detail-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {job.location}
        </span>
        {job.salary && job.salary !== 'Not disclosed' && (
          <span className="job-detail-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            {job.salary}
          </span>
        )}
      </div>

      <p className="job-description">{job.description.substring(0, 120)}...</p>

      {job.requirements && job.requirements.length > 0 && (
        <div className="job-requirements">
          {job.requirements.slice(0, 3).map((req, idx) => (
            <span key={idx} className="req-tag">{req}</span>
          ))}
          {job.requirements.length > 3 && (
            <span className="req-tag req-more">+{job.requirements.length - 3}</span>
          )}
        </div>
      )}

      <button
        className={`btn-apply ${hasApplied ? 'applied' : ''}`}
        onClick={() => !hasApplied && onApply(job)}
        disabled={hasApplied}
      >
        {hasApplied ? '✓ Applied' : 'Apply Now'}
      </button>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const colors = statusColors[status] || statusColors.Pending;
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: colors.bg, color: colors.color }}
    >
      {status}
    </span>
  );
};

export default JobCard;
