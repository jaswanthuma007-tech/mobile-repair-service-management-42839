import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

import PublicShell from './layouts/PublicShell';
import AuthShell from './layouts/AuthShell';
import DashboardShell from './layouts/DashboardShell';

import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import BookRepairPage from './pages/public/BookRepairPage';
import TrackRepairPage from './pages/public/TrackRepairPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import CustomerPage from './pages/CustomerPage';
import TechnicianPage from './pages/TechnicianPage';
import AdminPage from './pages/AdminPage';

function RootRedirect() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-full bg-ocean-bg">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ocean-muted">Loading session…</div>
      </div>
    );
  }

  // Default route to /login until session exists (per spec).
  return user ? <Navigate to="/customer" replace /> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div className="min-h-full bg-ocean-bg">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ocean-muted">Loading…</div>
      </div>
    );
  }
  return user ? <Navigate to="/customer" replace /> : children;
}

// PUBLIC_INTERFACE
function App() {
  /** App entry that wires Router + AuthProvider and defines all top-level routes. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route should never be blank. */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public marketing site */}
          <Route element={<PublicShell />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/book" element={<BookRepairPage />} />
            <Route path="/track" element={<TrackRepairPage />} />
          </Route>

          {/* Auth */}
          <Route element={<AuthShell />}>
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPasswordPage />
                </PublicOnlyRoute>
              }
            />
          </Route>

          {/* Protected portals */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardShell />}>
              <Route path="/customer" element={<CustomerPage />} />
              <Route path="/technician" element={<TechnicianPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* Back-compat alias */}
              <Route path="/dashboard" element={<Navigate to="/customer" replace />} />
            </Route>
          </Route>

          {/* Convenience: allow marketing home at /home; redirect / to auth-first. */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
