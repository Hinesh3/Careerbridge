import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/management.css';

const EMPTY_FORM = {
  title: '', companyName: '', description: '',
  location: '', type: 'Job', salary: '', requirements: ''
};

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditJob(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditJob(job);
    setForm({
      title: job.title,
      companyName: job.companyName,
      description: job.description,
      location: job.location,
      type: job.type,
      salary: job.salary || '',
      requirements: (job.requirements || []).join(', ')
    });
    setFormError('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    const payload = {
      ...form,
      requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean)
    };
    try {
      if (editJob) {
        await axios.put(`/api/jobs/${editJob._id}`, payload);
      } else {
        await axios.post('/api/jobs', payload);
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/jobs/${id}`);
      setDeleteConfirm(null);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-page">
      <div className="management-topbar">
        <div>
          <h1 className="page-title">Job Management</h1>
          <p className="page-subtitle">{jobs.length} listings in total</p>
        </div>
        <button className="btn-add-primary" onClick={openAdd}>+ Add New Job</button>
      </div>

      {/* Search Bar */}
      <div className="mgmt-search-wrap">
        <span className="mgmt-search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mgmt-search-input"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="mgmt-loading">
          {[1,2,3,4,5].map(i => <div key={i} className="table-skeleton-row"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mgmt-empty">
          <div>📭</div>
          <p>{searchTerm ? 'No jobs match your search.' : 'No jobs posted yet.'}</p>
          {!searchTerm && <button className="btn-add-primary" onClick={openAdd}>Post First Job</button>}
        </div>
      ) : (
        <div className="mgmt-table-wrap">
          <table className="mgmt-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job._id}>
                  <td>
                    <div className="td-title">{job.title}</div>
                    <div className="td-sub">{(job.requirements || []).slice(0,2).join(', ')}</div>
                  </td>
                  <td>
                    <div className="td-company">
                      <div className="td-company-avatar">{job.companyName.charAt(0)}</div>
                      {job.companyName}
                    </div>
                  </td>
                  <td className="td-location">{job.location}</td>
                  <td>
                    <span className={`type-badge ${job.type === 'Internship' ? 'internship' : 'job'}`}>
                      {job.type}
                    </span>
                  </td>
                  <td className="td-salary">{job.salary || '—'}</td>
                  <td className="td-date">{new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn-edit" onClick={() => openEdit(job)}>✏️ Edit</button>
                      <button className="btn-delete" onClick={() => setDeleteConfirm(job)}>🗑️ Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box large">
            <div className="modal-header">
              <h3>{editJob ? 'Edit Job' : 'Post New Job'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {formError && <div className="modal-error">{formError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-form-grid">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input name="title" value={form.title} onChange={handleFormChange}
                    placeholder="e.g. Frontend Developer" required />
                </div>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input name="companyName" value={form.companyName} onChange={handleFormChange}
                    placeholder="e.g. TechNova Inc." required />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input name="location" value={form.location} onChange={handleFormChange}
                    placeholder="e.g. Bangalore, India / Remote" required />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={form.type} onChange={handleFormChange} required>
                    <option value="Job">Job</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary / Stipend</label>
                  <input name="salary" value={form.salary} onChange={handleFormChange}
                    placeholder="e.g. ₹6-10 LPA or ₹15,000/month" />
                </div>
                <div className="form-group">
                  <label>Requirements (comma separated)</label>
                  <input name="requirements" value={form.requirements} onChange={handleFormChange}
                    placeholder="React, Node.js, CSS..." />
                </div>
              </div>
              <div className="form-group full">
                <label>Job Description *</label>
                <textarea name="description" value={form.description} onChange={handleFormChange}
                  rows="4" placeholder="Describe the role, responsibilities, and what you're looking for..." required />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-modal-submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : editJob ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal-box small">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="confirm-body">
              <div className="confirm-icon">🗑️</div>
              <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>?</p>
              <p className="confirm-warn">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-modal-delete" onClick={() => handleDelete(deleteConfirm._id)}>Delete Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
