import React from 'react';
import { Outlet } from 'react-router-dom';
import XiaomiNavbar from '../components/XiaomiNavbar';

// PUBLIC_INTERFACE
export default function DashboardShell() {
  /** App shell layout for protected portals (customer/technician/admin) using the shared Xiaomi-style top navbar. */
  return (
    <div className="min-h-full bg-ocean-bg">
      <XiaomiNavbar />
      <main className="min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
