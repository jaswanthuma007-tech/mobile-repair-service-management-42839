import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container } from '../ui/tw';

// PUBLIC_INTERFACE
export default function AuthShell() {
  /** Auth pages shell (centered, gradient background). */
  return (
    <div className="min-h-full bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_500px_at_100%_10%,rgba(245,158,11,0.10),transparent_55%)]">
      <Container className="py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-[0_12px_22px_rgba(37,99,235,0.22)]" aria-hidden="true" />
            <span>MobileRepair</span>
          </Link>
          <div className="text-sm text-ocean-muted">Secure email login • Supabase Auth</div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </Container>
    </div>
  );
}
