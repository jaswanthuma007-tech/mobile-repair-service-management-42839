import React from 'react';
import { Outlet } from 'react-router-dom';
import XiaomiNavbar from '../components/XiaomiNavbar';
import { Container } from '../ui/tw';

// PUBLIC_INTERFACE
export default function AuthShell() {
  /** Auth pages shell (gradient background) with shared sticky top navbar. */
  return (
    <div className="min-h-full bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_500px_at_100%_10%,rgba(245,158,11,0.10),transparent_55%)]">
      <XiaomiNavbar />
      <Container className="py-10">
        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </Container>
    </div>
  );
}
