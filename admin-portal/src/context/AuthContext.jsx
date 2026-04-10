import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cb_admin');
    const token = localStorage.getItem('cb_admin_token');
    if (stored && token) {
      setAdmin(JSON.parse(stored));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = (adminData, token) => {
    localStorage.setItem('cb_admin', JSON.stringify(adminData));
    localStorage.setItem('cb_admin_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('cb_admin');
    localStorage.removeItem('cb_admin_token');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
