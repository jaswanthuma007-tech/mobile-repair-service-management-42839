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

  // Avoid a blank screen while bootstrapping the auth session.
  if (initializing) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ margin: 0 }}>Loading…</p>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  // If already signed in, do not show login/register; go to dashboard.
  return user ? <Navigate to="/" replace /> : children;
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

          {/* Protected area */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardShell />}>
              {/* Alias for home inside the protected shell */}
              <Route path="/home" element={<DashboardHome />} />
              <Route path="/customer" element={<CustomerPage />} />
              <Route path="/technician" element={<TechnicianPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* Keep / as the canonical landing in the shell for signed-in users */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
