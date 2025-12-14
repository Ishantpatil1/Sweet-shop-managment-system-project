import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManageSweets from './pages/ManageSweets';
import Storefront from './pages/Storefront';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (requiredRole === 'admin' && payload.role !== 'admin') {
        return <Navigate to="/store" replace />;
      }
      if (requiredRole === 'user' && payload.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
    } catch (err) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-sweets"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageSweets />
              </ProtectedRoute>
            }
          />

          {/* User/Customer Routes */}
          <Route
            path="/store"
            element={
              <ProtectedRoute requiredRole="user">
                <Storefront />
              </ProtectedRoute>
            }
          />

          {/* Root redirect - check role and redirect */}
          <Route
            path="/"
            element={
              token ? (
                (() => {
                  try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/store" replace />;
                  } catch {
                    return <Navigate to="/login" replace />;
                  }
                })()
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

createRoot(document.getElementById('root')).render(<App />);
