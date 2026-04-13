import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/profile.css';

const API = 'http://localhost:5000';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', bio: '',
    skills: '', education: [], experience: []
  });
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', year: '' });
  const [newExp, setNewExp] = useState({ company: '', position: '', duration: '', description: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        const u = res.data;
        setForm({
          name: u.name || '',
          phone: u.phone || '',
          bio: u.bio || '',
          skills: (u.skills || []).join(', '),
          education: u.education || [],
          experience: u.experience || []
        });
        if (u.profilePicture) setPreviewPic(`${API}${u.profilePicture}`);
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  const calcStrength = () => {
    let score = 0;
    if (form.name) score += 20;
    if (form.phone) score += 10;
    if (form.bio) score += 10;
    if (form.skills.trim()) score += 20;
    if (form.education.length > 0) score += 20;
    if (form.experience.length > 0) score += 15;
    if (previewPic) score += 5;
    return Math.min(score, 100);
  };

  const strength = calcStrength();
  const getStrengthLabel = (s) => {
    if (s < 30) return { label: 'Beginner', color: '#EF4444' };
    if (s < 60) return { label: 'Intermediate', color: '#F97316' };
    if (s < 80) return { label: 'Good', color: '#EAB308' };
    return { label: 'Excellent', color: '#22C55E' };
  };
  const { label: strengthLabel, color: strengthColor } = getStrengthLabel(strength);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const addEducation = () => {
    if (!newEdu.institution || !newEdu.degree) return;
    setForm(prev => ({ ...prev, education: [...prev.education, newEdu] }));
    setNewEdu({ institution: '', degree: '', year: '' });
  };

  const removeEducation = (idx) =>
    setForm(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));

  const addExperience = () => {
    if (!newExp.company || !newExp.position) return;
    setForm(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
    setNewExp({ company: '', position: '', duration: '', description: '' });
  };

  const removeExperience = (idx) =>
    setForm(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('phone', form.phone);
      data.append('bio', form.bio);
      data.append('skills', JSON.stringify(form.skills.split(',').map(s => s.trim()).filter(Boolean)));
      data.append('education', JSON.stringify(form.education));
      data.append('experience', JSON.stringify(form.experience));
      if (profilePic) data.append('profilePicture', profilePic);

      const res = await axios.put('/api/auth/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ ...user, ...res.data });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header-banner">
        <h1>My Profile</h1>
        <p>Keep your profile up to date to get better job matches</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-wrap">
              {previewPic
                ? <img src={previewPic} alt="Profile" className="avatar-img" />
                : <div className="avatar-placeholder">{form.name.charAt(0).toUpperCase() || 'U'}</div>
              }
              <label className="avatar-edit-btn" htmlFor="profilePicInput">✏️</label>
              <input id="profilePicInput" type="file" accept="image/*" hidden onChange={handleImageChange} />
            </div>
            <h3 className="sidebar-name">{form.name || user?.name}</h3>
            <p className="sidebar-role">{user?.role === 'student' ? '🎓 Student' : '💼 Professional'}</p>
            <p className="sidebar-email">{user?.email}</p>
          </div>

          {/* Strength Indicator */}
          <div className="strength-card">
            <div className="strength-header">
              <span>Profile Strength</span>
              <span className="strength-percent" style={{ color: strengthColor }}>{strength}%</span>
            </div>
            <div className="strength-bar-bg">
              <div
                className="strength-bar-fill"
                style={{ width: `${strength}%`, backgroundColor: strengthColor }}
              ></div>
            </div>
            <div className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</div>
            <div className="strength-tips">
              {!form.phone && <div className="strength-tip">+ Add phone number</div>}
              {!form.bio && <div className="strength-tip">+ Add a bio</div>}
              {!form.skills.trim() && <div className="strength-tip">+ Add your skills</div>}
              {form.education.length === 0 && <div className="strength-tip">+ Add education</div>}
              {form.experience.length === 0 && <div className="strength-tip">+ Add experience</div>}
            </div>
          </div>
        </aside>

        {/* Main Form */}
        <main className="profile-main">
          {message.text && (
            <div className={`profile-message ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="profile-section">
              <h2 className="section-title">Basic Information</h2>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={form.phone} placeholder="+91 9876543210"
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea rows="3" value={form.bio} placeholder="Tell recruiters about yourself..."
                  onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>

            {/* Skills */}
            <div className="profile-section">
              <h2 className="section-title">Skills</h2>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input type="text" value={form.skills}
                  placeholder="React, Node.js, MongoDB, Python..."
                  onChange={e => setForm({ ...form, skills: e.target.value })} />
              </div>
              {form.skills.trim() && (
                <div className="skills-preview">
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} className="skill-tag">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div className="profile-section">
              <h2 className="section-title">Education</h2>
              {form.education.map((edu, idx) => (
                <div key={idx} className="entry-card">
                  <div>
                    <strong>{edu.degree}</strong>
                    <p>{edu.institution} {edu.year && `· ${edu.year}`}</p>
                  </div>
                  <button type="button" className="btn-remove" onClick={() => removeEducation(idx)}>✕</button>
                </div>
              ))}
              <div className="add-entry-form">
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Institution</label>
                    <input type="text" value={newEdu.institution} placeholder="University name"
                      onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input type="text" value={newEdu.degree} placeholder="B.Tech, MBA..."
                      onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input type="text" value={newEdu.year} placeholder="2024"
                      onChange={e => setNewEdu({ ...newEdu, year: e.target.value })} />
                  </div>
                </div>
                <button type="button" className="btn-add-entry" onClick={addEducation}>+ Add Education</button>
              </div>
            </div>

            {/* Experience */}
            <div className="profile-section">
              <h2 className="section-title">Experience</h2>
              {form.experience.map((exp, idx) => (
                <div key={idx} className="entry-card">
                  <div>
                    <strong>{exp.position}</strong> at <strong>{exp.company}</strong>
                    {exp.duration && <p>{exp.duration}</p>}
                    {exp.description && <p className="entry-desc">{exp.description}</p>}
                  </div>
                  <button type="button" className="btn-remove" onClick={() => removeExperience(idx)}>✕</button>
                </div>
              ))}
              <div className="add-entry-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" value={newExp.company} placeholder="Company name"
                      onChange={e => setNewExp({ ...newExp, company: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input type="text" value={newExp.position} placeholder="Software Engineer"
                      onChange={e => setNewExp({ ...newExp, position: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input type="text" value={newExp.duration} placeholder="Jan 2023 - Jun 2023"
                      onChange={e => setNewExp({ ...newExp, duration: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input type="text" value={newExp.description} placeholder="Brief description"
                      onChange={e => setNewExp({ ...newExp, description: e.target.value })} />
                  </div>
                </div>
                <button type="button" className="btn-add-entry" onClick={addExperience}>+ Add Experience</button>
              </div>
            </div>

            <button type="submit" className="btn-save-profile" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;
