import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Container, Button } from '../ui/tw';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-xl px-3 py-2 text-sm font-semibold transition',
          isActive ? 'bg-blue-500/10 text-ocean-primary' : 'text-ocean-text hover:bg-black/5'
        ].join(' ')
      }
      end={to === '/'}
    >
      {children}
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export default function PublicShell() {
  /** Marketing/public website shell with header and footer. */
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-[0_12px_22px_rgba(37,99,235,0.22)]" aria-hidden="true" />
            <span>MobileRepair</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Public navigation">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/services">Services</NavItem>
            <NavItem to="/book">Book Repair</NavItem>
            <NavItem to="/track">Track Repair</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </Container>
      </header>

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
