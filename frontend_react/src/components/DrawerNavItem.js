import React, { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

// PUBLIC_INTERFACE
const DrawerNavItem = forwardRef(function DrawerNavItem({ to, label, onNavigate }, ref) {
  /** Drawer navigation item used in XiaomiNavbar mobile panel. */
  return (
    <NavLink
      ref={ref}
      to={to}
      end={to === '/' || to === '/home'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cx(
          'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition',
          isActive ? 'bg-blue-500/10 text-ocean-primary' : 'text-ocean-text hover:bg-black/5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
        )
      }
    >
      <span>{label}</span>
      <span className="text-xs text-ocean-muted">{'>'}</span>
    </NavLink>
  );
});

export default DrawerNavItem;
