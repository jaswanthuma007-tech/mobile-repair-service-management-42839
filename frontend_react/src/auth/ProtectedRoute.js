import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// PUBLIC_INTERFACE
export function ProtectedRoute() {
  /** Protects nested routes; redirects to /login when unauthenticated. */
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-full bg-ocean-bg">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ocean-muted">Loading session…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
