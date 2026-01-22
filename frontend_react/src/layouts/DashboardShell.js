import React, { useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button, Container } from '../ui/tw';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition border',
          isActive
            ? 'bg-blue-500/10 text-ocean-primary border-blue-500/20'
            : 'text-ocean-text border-transparent hover:bg-black/5 hover:border-black/10'
        ].join(' ')
      }
      end={to === '/'}
    >
      {children}
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export default function DashboardShell() {
  /** App shell layout for protected portals (customer/technician/admin). */
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname.startsWith('/customer')) return 'Customer Portal';
    if (location.pathname.startsWith('/technician')) return 'Technician Portal';
    if (location.pathname.startsWith('/admin')) return 'Admin Portal';
    return 'Dashboard';
  }, [location.pathname]);

  const onLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-full bg-ocean-bg">
      <div className="grid min-h-full grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-black/10 bg-white/70 p-4 backdrop-blur lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 rounded-2xl p-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-[0_12px_22px_rgba(37,99,235,0.22)]" aria-hidden="true" />
            <div>
              <div className="font-extrabold tracking-tight">MobileRepair</div>
              <div className="text-xs text-ocean-muted">Ocean Professional</div>
            </div>
          </div>

          <nav className="mt-4 grid gap-2" aria-label="Portal navigation">
            <NavItem to="/customer">Customer</NavItem>
            <NavItem to="/technician">Technician</NavItem>
            <NavItem to="/admin">Admin</NavItem>
            <NavItem to="/">Marketing site</NavItem>
          </nav>

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-3">
            <div className="text-xs text-ocean-muted">Signed in as</div>
            <div className="mt-1 truncate text-sm font-semibold text-ocean-text">{user?.email || 'Unknown'}</div>
          </div>

          <div className="mt-3">
            <Button variant="secondary" onClick={onLogout} className="w-full">
              Log out
            </Button>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-black/10 bg-white/70 backdrop-blur">
            <Container className="flex h-16 items-center justify-between">
              <div className="font-extrabold tracking-tight">{title}</div>
              <div className="hidden sm:block text-sm text-ocean-muted">Realtime status updates enabled</div>
            </Container>
          </header>

          <Container className="py-6">
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  );
}
