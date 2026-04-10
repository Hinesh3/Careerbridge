import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', form);
      if (res.data.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      login(res.data, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">
            <img src="/logo.png" alt="CareerBridge" className="admin-logo-img" />
          </div>
          <h1>Admin Portal</h1>
          <p>Sign in with your administrator credentials</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label>Email Address</label>
            <div className="admin-input-wrap">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="admin@careerbridge.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <div className="admin-input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-admin-login" disabled={loading}>
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
