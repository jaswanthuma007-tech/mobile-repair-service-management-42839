import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container } from '../ui/tw';
import XiaomiNavbar from '../components/XiaomiNavbar';

// PUBLIC_INTERFACE
export default function PublicShell() {
  /** Marketing/public website shell with Xiaomi-style sticky header and footer. */
  return (
    <div className="min-h-full">
      <XiaomiNavbar />

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-black/10 bg-white">
        <Container className="grid gap-4 py-10 sm:grid-cols-3">
          <div className="grid gap-2">
            <div className="font-extrabold">MobileRepair</div>
            <div className="text-sm text-ocean-muted">Fast, transparent, professional phone repair service.</div>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="font-bold">Quick links</div>
            <Link className="text-ocean-muted hover:text-ocean-text" to="/services">
              Services
            </Link>
            <Link className="text-ocean-muted hover:text-ocean-text" to="/book">
              Book Repair
            </Link>
            <Link className="text-ocean-muted hover:text-ocean-text" to="/track">
              Track Repair
            </Link>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="font-bold">Contact</div>
            <div className="text-ocean-muted">Email: support@mobilerepair.example</div>
            <div className="text-ocean-muted">Hours: 10am–8pm (Mon–Sat)</div>
          </div>
        </Container>
        <div className="border-t border-black/10 py-4 text-center text-xs text-ocean-muted">
          © {new Date().getFullYear()} MobileRepair. Built for a college bootcamp project.
        </div>
      </footer>
    </div>
  );
}
