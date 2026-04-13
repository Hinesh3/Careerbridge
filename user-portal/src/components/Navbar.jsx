import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span style={{ fontSize: '1.5rem' }}>🔗</span>
          <span className="brand-name">CareerBridge</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link></li>
          {user && (
            <>
              <li><Link to="/jobs" className={isActive('/jobs')} onClick={() => setMenuOpen(false)}>Jobs</Link></li>
              <li><Link to="/my-applications" className={isActive('/my-applications')} onClick={() => setMenuOpen(false)}>My Applications</Link></li>
              <li><Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>Profile</Link></li>
            </>
          )}
          {user ? (
            <li>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </li>
          ) : (
            <>
              <li><Link to="/login" className={`btn-login ${isActive('/login')}`} onClick={() => setMenuOpen(false)}>Login</Link></li>
              <li><Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
