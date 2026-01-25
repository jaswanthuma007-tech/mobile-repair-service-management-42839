import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
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
function IconButton({ title, onClick, children, className, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={cx(
        // Fixed 40x40 to guarantee all header items share identical baseline sizing.
        'inline-flex h-10 w-10 flex-none items-center justify-center rounded-full text-ocean-text transition',
        'hover:bg-blue-500/10 hover:text-ocean-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true" {...props}>
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
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
      <path d="M12 12a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
          // Keep nav links a single-line, Xiaomi-like compact style.
          'relative whitespace-nowrap px-3 py-2 text-[13px] font-semibold tracking-wide text-ocean-text transition-colors',
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

function TabLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cx(
          'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition',
          isActive ? 'bg-blue-600 text-white' : 'text-ocean-text hover:bg-blue-500/10 hover:text-ocean-primary'
        )
      }
    >
      {children}
    </NavLink>
  );
}

function getTabsForPath(pathname) {
  // Defaults per role area.
  if (pathname.startsWith('/customer')) {
    return [
      { label: 'Overview', to: '/customer', end: true },
      { label: 'New booking', to: '/select-brand' },
      { label: 'Track repair', to: '/track' }
    ];
  }
  if (pathname.startsWith('/technician')) {
    return [
      { label: 'Assigned', to: '/technician', end: true },
      { label: 'Track repair', to: '/track' },
      { label: 'Marketing', to: '/home' }
    ];
  }
  if (pathname.startsWith('/admin')) {
    return [
      { label: 'All repairs', to: '/admin', end: true },
      { label: 'Track repair', to: '/track' },
      { label: 'Marketing', to: '/home' }
    ];
  }
  return [];
}

function isDashboardArea(pathname) {
  return (
    pathname.startsWith('/customer') ||
    pathname.startsWith('/technician') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/select-') ||
    pathname.startsWith('/models') ||
    pathname.startsWith('/issues') ||
    pathname.startsWith('/confirm') ||
    pathname.startsWith('/confirm-')
  );
}

// PUBLIC_INTERFACE
export default function XiaomiNavbar() {
  /** Sticky Xiaomi-style navbar used across public marketing + protected dashboards. */
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [megaOpenKey, setMegaOpenKey] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);

  const drawerTitleId = useId();
  const firstDrawerLinkRef = useRef(null);
  const accountBtnRef = useRef(null);
  const searchInputRef = useRef(null);

  const isDashboard = isDashboardArea(location.pathname);
  const tabs = useMemo(() => (isDashboard ? getTabsForPath(location.pathname) : []), [isDashboard, location.pathname]);

  const publicMenu = useMemo(
    () => [
      { label: 'Home', to: '/home' },
      {
        label: 'Phones',
        to: '/services',
        key: 'phones',
        mega: {
          title: 'Phone repairs',
          items: [
            { title: 'Screen repair', desc: 'Cracked, flickering, or unresponsive screens.', to: '/services' },
            { title: 'Battery replacement', desc: 'Fast swaps with quality parts.', to: '/services' },
            { title: 'Camera & mic', desc: 'Fix blurry cameras and audio issues.', to: '/services' }
          ]
        }
      },
      {
        label: 'Tablets',
        to: '/services',
        key: 'tablets',
        mega: {
          title: 'Tablet repairs',
          items: [
            { title: 'iPad repairs', desc: 'Screens, batteries, charging ports.', to: '/services' },
            { title: 'Android tablets', desc: 'Samsung, Lenovo, Huawei and more.', to: '/services' }
          ]
        }
      },
      {
        label: 'TV & Smart Home',
        to: '/services',
        key: 'smarthome',
        mega: {
          title: 'Smart home',
          items: [
            { title: 'Device setup', desc: 'Pairing, Wi‑Fi, and configuration.', to: '/services' },
            { title: 'Diagnostics', desc: 'Find faults quickly and transparently.', to: '/services' }
          ]
        }
      },
      {
        label: 'Smart Watch & Audio',
        to: '/services',
        key: 'wearables',
        mega: {
          title: 'Wearables & audio',
          items: [
            { title: 'Watch battery', desc: 'Restore battery life and seals.', to: '/services' },
            { title: 'Earbuds', desc: 'Charging, sound, and connectivity.', to: '/services' }
          ]
        }
      },
      { label: 'Services', to: '/services', key: 'services' }
    ],
    []
  );

  const closeDrawer = () => setDrawerOpen(false);

  // Close overlays on route change (prevents stale overlay).
  useEffect(() => {
    closeDrawer();
    setMegaOpenKey(null);
    setAccountOpen(false);
    // keep search state unless you prefer to close it:
    // setSearchOpen(false);
  }, [location.pathname]);

  useBodyScrollLock(drawerOpen);
  useEscapeToClose(drawerOpen, closeDrawer);

  useEffect(() => {
    if (!drawerOpen) return;
    const t = window.setTimeout(() => {
      firstDrawerLinkRef.current?.focus?.();
    }, 50);
    return () => window.clearTimeout(t);
  }, [drawerOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const t = window.setTimeout(() => searchInputRef.current?.focus?.(), 50);
    return () => window.clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onDocDown = (e) => {
      if (accountBtnRef.current && accountBtnRef.current.contains(e.target)) return;
      setAccountOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [accountOpen]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    // For now: no global search page exists. Keep accessible + non-blocking.
    window.alert(`Search coming soon. Query: ${searchValue || '(empty)'}`);
  };

  const onCart = () => {
    window.alert('Cart coming soon');
  };

  const onBookRepair = () => {
    // Direct to multi-step booking flow (confirmed route: /select-brand).
    navigate('/select-brand');
  };

  const onLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const accountLabel = user ? (user.email ? user.email.split('@')[0] : 'Account') : 'Account';

  return (
    <>
      <header
        className={cx(
          'sticky top-0 z-30',
          // Subtle Xiaomi-like separation.
          'border-b border-black/10 bg-white/90 shadow-[0_10px_26px_rgba(17,24,39,0.06)] backdrop-blur'
        )}
      >
        {/* Primary row: fixed height 64px, single flex row, vertically centered */}
        <Container className="flex h-16 items-center">
          {/* Left cluster: logo + hamburger (mobile) */}
          <div className="flex min-w-0 flex-none items-center gap-3">
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
              <span className="whitespace-nowrap text-[15px] sm:text-base">MobileRepair</span>
            </Link>
          </div>

          {/* Center cluster: menu (desktop) */}
          <nav
            className={cx(
              // Center in remaining space, but never force wrapping.
              'mx-auto hidden min-w-0 flex-1 items-center justify-center md:flex'
            )}
            aria-label="Primary"
          >
            <div className="flex min-w-0 items-center">
              {publicMenu.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setMegaOpenKey(item.mega ? item.key : null)}
                  onMouseLeave={() => setMegaOpenKey((k) => (k === item.key ? null : k))}
                >
                  <UnderlineNavItem to={item.to}>{item.label}</UnderlineNavItem>

                  {/* Mega menu */}
                  {item.mega && megaOpenKey === item.key ? (
                    <div className="absolute left-1/2 top-full w-[720px] -translate-x-1/2 pt-3">
                      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_18px_40px_rgba(17,24,39,0.12)]">
                        <div className="flex items-start justify-between gap-6">
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold tracking-tight">{item.mega.title}</div>
                            <div className="mt-1 text-xs text-ocean-muted">Quick links to common fixes and services.</div>
                          </div>
                          <button
                            type="button"
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-ocean-muted hover:bg-black/5 hover:text-ocean-text"
                            onClick={() => setMegaOpenKey(null)}
                          >
                            Close
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {item.mega.items.map((m) => (
                            <Link
                              key={m.title}
                              to={m.to}
                              className={cx(
                                'rounded-2xl border border-black/10 p-4 transition',
                                'hover:border-blue-600/25 hover:bg-blue-500/5'
                              )}
                              onClick={() => setMegaOpenKey(null)}
                            >
                              <div className="text-sm font-extrabold tracking-tight text-ocean-text">{m.title}</div>
                              <div className="mt-1 text-xs text-ocean-muted">{m.desc}</div>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/10 pt-4">
                          <div className="text-xs text-ocean-muted">Ready to start? Book in 4 quick steps.</div>
                          <button
                            type="button"
                            onClick={() => {
                              setMegaOpenKey(null);
                              onBookRepair();
                            }}
                            className={cx(
                              'rounded-full bg-blue-600 px-4 py-2 text-sm font-extrabold text-white transition',
                              'hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
                            )}
                          >
                            Book Repair
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </nav>

          {/* Right cluster: icons + CTA + account (never wrap, pinned to far right) */}
          <div className="flex flex-none items-center justify-end gap-1">
            {/* Desktop expanding inline search */}
            <form
              onSubmit={onSearchSubmit}
              className={cx(
                'hidden items-center md:flex',
                'rounded-full border border-black/10 bg-white transition',
                searchOpen ? 'w-72 shadow-[0_10px_24px_rgba(17,24,39,0.08)]' : 'w-10 border-transparent bg-transparent'
              )}
              aria-label="Site search"
            >
              <IconButton
                title={searchOpen ? 'Close search' : 'Open search'}
                onClick={() => setSearchOpen((v) => !v)}
                className={cx(searchOpen ? 'hover:bg-blue-500/10' : '')}
                aria-expanded={searchOpen}
              >
                <IconSearch />
              </IconButton>

              <input
                ref={searchInputRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={cx(
                  'w-full bg-transparent pr-3 text-sm text-ocean-text outline-none placeholder:text-ocean-muted',
                  searchOpen ? 'block' : 'hidden'
                )}
                placeholder="Search repairs, services…"
              />
            </form>

            {/* Mobile: keep search icon visible */}
            <IconButton title="Search" onClick={() => setSearchOpen(true)} className="md:hidden">
              <IconSearch />
            </IconButton>

            {/* Cart grouped with search */}
            <IconButton title="Cart" onClick={onCart}>
              <IconCart />
            </IconButton>

            {/* Desktop Book Repair */}
            <button
              type="button"
              onClick={onBookRepair}
              className={cx(
                'ml-1 hidden items-center whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-sm font-extrabold text-white transition md:inline-flex',
                'hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
              )}
            >
              Book Repair
            </button>

            {/* Mobile Book Repair (kept visible per requirement) */}
            <button
              type="button"
              onClick={onBookRepair}
              className={cx(
                'ml-1 inline-flex items-center whitespace-nowrap rounded-full bg-blue-600 px-3 py-2 text-xs font-extrabold text-white transition md:hidden',
                'hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
              )}
            >
              Book Repair
            </button>

            {/* Account / login dropdown (far right) */}
            <div className="relative ml-1">
              <button
                ref={accountBtnRef}
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className={cx(
                  'inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-ocean-text transition',
                  'hover:bg-blue-500/10 hover:text-ocean-primary',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/60 focus-visible:ring-offset-2'
                )}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full">
                  <IconUser />
                </span>
                <span className="hidden max-w-[140px] truncate whitespace-nowrap lg:inline">{accountLabel}</span>
                <span className="hidden lg:inline text-ocean-muted">
                  <IconChevronDown />
                </span>
              </button>

              {accountOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_40px_rgba(17,24,39,0.12)]"
                >
                  <div className="border-b border-black/10 px-4 py-3">
                    <div className="text-xs text-ocean-muted">Signed in</div>
                    <div className="mt-0.5 truncate text-sm font-extrabold">{user?.email || 'Guest'}</div>
                  </div>

                  {user ? (
                    <div className="p-2">
                      <Link
                        to="/customer"
                        role="menuitem"
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-ocean-text hover:bg-black/5"
                        onClick={() => setAccountOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-500/10"
                        onClick={onLogout}
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Link
                        to="/login"
                        role="menuitem"
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-ocean-text hover:bg-black/5"
                        onClick={() => setAccountOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        role="menuitem"
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-ocean-text hover:bg-black/5"
                        onClick={() => setAccountOpen(false)}
                      >
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Container>

        {/* Dashboard second-row tabs (kept as-is, already aligned; prevent wrapping) */}
        {tabs.length ? (
          <div className="border-t border-black/5 bg-white/70 backdrop-blur">
            <Container className="flex h-12 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto" aria-label="Dashboard tabs">
                {tabs.map((t) => (
                  <TabLink key={t.label} to={t.to} end={t.end}>
                    {t.label}
                  </TabLink>
                ))}
              </div>

              <div className="hidden flex-none items-center gap-2 text-xs text-ocean-muted sm:flex">
                <span className="whitespace-nowrap rounded-full bg-blue-500/10 px-3 py-1 font-semibold">
                  Realtime enabled
                </span>
              </div>
            </Container>
          </div>
        ) : null}

        {/* Xiaomi-like bottom hairline */}
        <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </header>

      {/* Mobile drawer (hamburger collapse) */}
      <div
        className={cx('fixed inset-0 z-40 md:hidden', drawerOpen ? 'pointer-events-auto' : 'pointer-events-none')}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          className={cx('absolute inset-0 bg-black/30 transition-opacity', drawerOpen ? 'opacity-100' : 'opacity-0')}
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
            {publicMenu.map((item, idx) => (
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
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    onBookRepair();
                  }}
                  className={cx(
                    'inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-3 py-2 text-sm font-extrabold text-white transition',
                    'hover:bg-blue-700'
                  )}
                >
                  Book Repair
                </button>

                <Link
                  to={user ? '/customer' : '/login'}
                  onClick={closeDrawer}
                  className={cx(
                    'inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold text-ocean-text transition',
                    'hover:border-blue-600/30 hover:bg-blue-500/10 hover:text-ocean-primary'
                  )}
                >
                  <span className="mr-2 inline-flex">
                    <IconUser />
                  </span>
                  {user ? 'Dashboard' : 'Login'}
                </Link>

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      onLogout();
                    }}
                    className="w-full whitespace-nowrap rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    Log out
                  </button>
                ) : null}
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}
