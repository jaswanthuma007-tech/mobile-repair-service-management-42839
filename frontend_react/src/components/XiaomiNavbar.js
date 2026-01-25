import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container } from '../ui/tw';
import DrawerNavItem from './DrawerNavItem';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function useEscapeToClose(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);
}

/**
 * Minimal inline SVG icon button (keeps dependencies at zero).
 * `title` provides accessible name for assistive tech.
 */
function IconButton({ title, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={cx(
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-ocean-text transition',
        'hover:bg-blue-500/10 hover:text-ocean-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </button>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16.25 16.25 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true" {...props}>
      <path
        d="M6.5 8.5h15l-1.2 6.4a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5.6 4.5H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 21a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm9 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true" {...props}>
      <path
        d="M12 12a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMenu(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true" {...props}>
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true" {...props}>
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UnderlineNavItem({ to, children, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={to === '/' || to === '/home'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cx(
          'relative px-3 py-2 text-[13px] font-semibold tracking-wide text-ocean-text transition-colors',
          'hover:text-ocean-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2',
          // Xiaomi-like underline behavior: subtle underline that animates in on hover.
          // Active state keeps underline visible.
          'after:absolute after:left-3 after:right-3 after:bottom-0 after:h-[2px] after:origin-left after:rounded-full',
          'after:bg-blue-600 after:transition-transform after:duration-300 after:ease-out',
          isActive ? 'after:scale-x-100 text-ocean-primary' : 'after:scale-x-0 hover:after:scale-x-100'
        )
      }
    >
      {children}
    </NavLink>
  );
}



// PUBLIC_INTERFACE
export default function XiaomiNavbar() {
  /** Sticky Xiaomi-style navbar for the public marketing site. Includes responsive drawer and icon actions. */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const drawerTitleId = useId();
  const firstDrawerLinkRef = useRef(null);

  const menu = useMemo(
    () => [
      { label: 'Home', to: '/home' },
      { label: 'Phones', to: '/services' },
      { label: 'Tablets', to: '/services' },
      { label: 'TV & Smart Home', to: '/services' },
      { label: 'Smart Watch & Audio', to: '/services' },
      { label: 'Services', to: '/services' }
    ],
    []
  );

  const closeDrawer = () => setDrawerOpen(false);

  // Close drawer on route change (prevents stale overlay).
  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useBodyScrollLock(drawerOpen);
  useEscapeToClose(drawerOpen, closeDrawer);

  useEffect(() => {
    if (!drawerOpen) return;
    // Focus management for accessibility: focus first item in drawer.
    const t = window.setTimeout(() => {
      firstDrawerLinkRef.current?.focus?.();
    }, 50);
    return () => window.clearTimeout(t);
  }, [drawerOpen]);

  const onSearch = () => {
    // Placeholder behavior: we don't implement search yet, but keep the interaction accessible.
    // Could later open a search modal or navigate to a search page.
    window.alert('Search coming soon');
  };

  const onCart = () => {
    window.alert('Cart coming soon');
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          {/* Left: logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={cx(
                'inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden',
                'text-ocean-text transition hover:bg-blue-500/10 hover:text-ocean-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
              )}
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <IconMenu />
            </button>

            <Link to="/home" className="flex items-center gap-2 font-extrabold tracking-tight">
              <span
                className="h-9 w-9 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-[0_12px_22px_rgba(37,99,235,0.22)]"
                aria-hidden="true"
              />
              <span className="text-[15px] sm:text-base">MobileRepair</span>
            </Link>
          </div>

          {/* Center: menu */}
          <nav className="hidden items-center justify-center md:flex" aria-label="Primary">
            <div className="flex items-center">
              {menu.map((item) => (
                <UnderlineNavItem key={item.label} to={item.to}>
                  {item.label}
                </UnderlineNavItem>
              ))}
            </div>
          </nav>

          {/* Right: icons */}
          <div className="flex items-center gap-1">
            <IconButton title="Search" onClick={onSearch}>
              <IconSearch />
            </IconButton>
            <IconButton title="Cart" onClick={onCart}>
              <IconCart />
            </IconButton>

            {/* Account/Login */}
            <Link
              to="/login"
              className={cx(
                'inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-ocean-text transition',
                'hover:bg-blue-500/10 hover:text-ocean-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
              )}
              aria-label="Account"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full">
                <IconUser />
              </span>
              <span className="hidden lg:inline">Account</span>
            </Link>
          </div>
        </Container>

        {/* Subtle Xiaomi-like shadow at bottom */}
        <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </header>

      {/* Mobile drawer */}
      <div
        className={cx(
          'fixed inset-0 z-40 md:hidden',
          drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          className={cx(
            'absolute inset-0 bg-black/30 transition-opacity',
            drawerOpen ? 'opacity-100' : 'opacity-0'
          )}
          aria-label="Close menu"
          onClick={closeDrawer}
          tabIndex={drawerOpen ? 0 : -1}
        />

        {/* Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby={drawerTitleId}
          className={cx(
            'absolute left-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out',
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between border-b border-black/10 p-4">
            <div className="flex items-center gap-2">
              <span
                className="h-9 w-9 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-[0_12px_22px_rgba(37,99,235,0.18)]"
                aria-hidden="true"
              />
              <div>
                <div id={drawerTitleId} className="font-extrabold tracking-tight">
                  MobileRepair
                </div>
                <div className="text-xs text-ocean-muted">Menu</div>
              </div>
            </div>

            <IconButton title="Close menu" onClick={closeDrawer} className="hover:bg-black/5">
              <IconClose />
            </IconButton>
          </div>

          <nav className="grid gap-2 p-3" aria-label="Mobile navigation">
            {menu.map((item, idx) => (
              <DrawerNavItem
                key={item.label}
                to={item.to}
                label={item.label}
                onNavigate={closeDrawer}
                ref={idx === 0 ? firstDrawerLinkRef : undefined}
              />
            ))}

            <div className="mt-2 rounded-2xl border border-black/10 p-3">
              <div className="text-xs text-ocean-muted">Quick actions</div>
              <div className="mt-2 flex items-center gap-2">
                <IconButton title="Search" onClick={onSearch} className="border border-black/10">
                  <IconSearch />
                </IconButton>
                <IconButton title="Cart" onClick={onCart} className="border border-black/10">
                  <IconCart />
                </IconButton>
                <Link
                  to="/login"
                  onClick={closeDrawer}
                  className={cx(
                    'ml-auto inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold text-ocean-text transition',
                    'hover:border-blue-600/30 hover:bg-blue-500/10 hover:text-ocean-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
                  )}
                >
                  <IconUser />
                  <span>Account</span>
                </Link>
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}

