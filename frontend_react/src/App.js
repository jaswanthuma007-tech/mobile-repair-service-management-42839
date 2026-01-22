import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DashboardShell from './layouts/DashboardShell';
import DashboardHome from './pages/DashboardHome';
import CustomerPage from './pages/CustomerPage';
import TechnicianPage from './pages/TechnicianPage';
import AdminPage from './pages/AdminPage';

import './ui/theme.css';

function RootRedirect() {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}

// PUBLIC_INTERFACE
function App() {
  /** App entry that wires Router + AuthProvider and defines all top-level routes. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected area */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardShell />}>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/customer" element={<CustomerPage />} />
              <Route path="/technician" element={<TechnicianPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
