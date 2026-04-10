import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobManagement from './pages/JobManagement';
import ApplicationManagement from './pages/ApplicationManagement';
import UserManagement from './pages/UserManagement';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading...</div>;
  return admin ? children : <Navigate to="/login" replace />;
};

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <Sidebar />
    <main className="admin-main">{children}</main>
  </div>
);

const AppRoutes = () => {
  const { admin } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <AdminLayout><Dashboard /></AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/jobs" element={
        <PrivateRoute>
          <AdminLayout><JobManagement /></AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/applications" element={
        <PrivateRoute>
          <AdminLayout><ApplicationManagement /></AdminLayout>
        </PrivateRoute>
      } />
      <Route path="/users" element={
        <PrivateRoute>
          <AdminLayout><UserManagement /></AdminLayout>
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to={admin ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
