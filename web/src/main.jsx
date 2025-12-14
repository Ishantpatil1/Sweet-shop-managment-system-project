import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import { UserProvider, useUser } from './context/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManageSweets from './pages/ManageSweets';
import Storefront from './pages/Storefront';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] text-[#1F1F1F] font-semibold">
    Loading...
  </div>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, authLoading } = useUser();

  if (authLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole === 'admin' && user.role !== 'admin') return <Navigate to="/store" replace />;
  if (requiredRole === 'user' && user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
};

const RoleRedirect = () => {
  const { user, authLoading } = useUser();
  if (authLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/store" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, authLoading } = useUser();
  if (authLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
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
        <Route
          path="/store"
          element={
            <ProtectedRoute requiredRole="user">
              <Storefront />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<RoleRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
);

createRoot(document.getElementById('root')).render(<App />);
