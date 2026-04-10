import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/jobs', label: 'Job Management', icon: '💼' },
  { path: '/applications', label: 'Applications', icon: '📋' },
  { path: '/users', label: 'Users', icon: '👥' },
];

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <img src="/logo.png" alt="CareerBridge" className="brand-logo-img" />
        {!collapsed && (
          <div className="brand-text">
            <span className="brand-title">CareerBridge</span>
            <span className="brand-sub">Admin Portal</span>
          </div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Admin Info */}
      {!collapsed && (
        <div className="sidebar-admin-info">
          <div className="admin-avatar">{admin?.name?.charAt(0).toUpperCase() || 'A'}</div>
          <div>
            <div className="admin-name">{admin?.name || 'Admin'}</div>
            <div className="admin-badge">Administrator</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {!collapsed && location.pathname === item.path && <span className="nav-active-dot"></span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="btn-sidebar-logout" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
