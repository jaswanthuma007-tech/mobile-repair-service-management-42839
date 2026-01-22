import React, { useMemo } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../ui/components';
import '../ui/theme.css';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
    >
      {children}
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export default function DashboardShell() {
  /** App shell layout for protected areas. */
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const title = useMemo(() => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/customer')) return 'Customer';
    if (location.pathname.startsWith('/technician')) return 'Technician';
    if (location.pathname.startsWith('/admin')) return 'Admin';
    return 'App';
  }, [location.pathname]);

  const onLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Sidebar navigation">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div>
            <div className="brandTitle">Mobile Repair</div>
            <div style={{ fontSize: 12, color: 'var(--ocean-muted)' }}>Ocean Professional</div>
          </div>
        </div>

        <nav className="nav">
          <NavItem to="/">Overview</NavItem>
          <NavItem to="/customer">Customer</NavItem>
          <NavItem to="/technician">Technician</NavItem>
          <NavItem to="/admin">Admin</NavItem>
        </nav>

        <div style={{ marginTop: 18, padding: '10px 10px 0', color: 'var(--ocean-muted)' }}>
          <div style={{ fontSize: 12 }}>Signed in as</div>
          <div style={{ fontSize: 13, color: 'var(--ocean-text)', fontWeight: 600 }}>
            {user?.email || 'Unknown'}
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="headerTitle">{title}</div>
          <Button variant="secondary" onClick={onLogout}>
            Log out
          </Button>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
