import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from './tw';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function IconChevronRight(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z" />
    </svg>
  );
}

function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.11 17.42c-.19-.1-1.14-.56-1.32-.62-.18-.06-.31-.1-.44.1-.13.19-.5.62-.61.75-.11.13-.23.15-.42.05-.19-.1-.8-.29-1.52-.93-.56-.5-.93-1.11-1.04-1.3-.11-.19-.01-.29.08-.38.09-.09.19-.23.29-.34.1-.11.13-.19.19-.31.06-.12.03-.23-.02-.33-.05-.1-.44-1.07-.6-1.46-.16-.39-.33-.34-.44-.35-.12-.01-.25-.01-.39-.01-.13 0-.33.05-.51.23-.18.19-.67.65-.67 1.58 0 .93.69 1.83.78 1.96.1.13 1.35 2.06 3.27 2.88.46.2.82.32 1.1.41.46.14.88.12 1.21.07.37-.06 1.14-.47 1.3-.92.16-.45.16-.84.11-.92-.05-.08-.18-.13-.37-.23Z" />
      <path d="M26.69 5.31A13.56 13.56 0 0 0 16.03 1 13.98 13.98 0 0 0 2 15.01c0 2.47.64 4.88 1.86 7.01L2 31l9.24-1.79a14.02 14.02 0 0 0 4.79.83h.01A13.99 13.99 0 0 0 30 15.03c0-3.74-1.46-7.25-3.31-9.72Zm-10.65 22.4h-.01a11.58 11.58 0 0 1-4.43-.88l-.32-.13-5.48 1.06 1.02-5.34-.2-.34a11.52 11.52 0 0 1-1.79-6.2A11.61 11.61 0 0 1 16.03 3.43c3.11 0 6.03 1.22 8.22 3.42a11.49 11.49 0 0 1 3.41 8.2 11.62 11.62 0 0 1-11.62 12.66Z" />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function LandingTopNav({ brandName = 'Fixma', bookCtaTo = '/book' }) {
  /** Sticky top navigation for marketing landing pages. */
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 font-extrabold tracking-tight text-ocean-text">
          <span
            className="h-9 w-9 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-[0_12px_22px_rgba(37,99,235,0.22)]"
            aria-hidden="true"
          />
          <span>{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {[
            ['Home', '/home'],
            ['About', '/services'],
            ['Services', '/services'],
            ['Blog', '/services'],
            ['Contact', '/services']
          ].map(([label, href]) => (
            <Link
              key={label}
              to={href}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-ocean-text transition hover:bg-black/5"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to={bookCtaTo} className="hidden sm:block">
            <Button className="px-4 py-2.5">Book Now</Button>
          </Link>
          <Link to={bookCtaTo} className="sm:hidden">
            <Button className="px-3 py-2">Book</Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}

// PUBLIC_INTERFACE
export function LandingBrandCard({ name, logoText, active, onClick }) {
  /** Landing-only compact brand card used on the homepage. */
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition will-change-transform',
        'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)] focus:outline-none focus:ring-4 focus:ring-blue-500/15',
        'active:translate-y-0 active:shadow-[0_10px_20px_rgba(17,24,39,0.06)]',
        active ? 'border-blue-500/30 ring-4 ring-blue-500/10' : 'border-black/10'
      )}
      aria-pressed={active ? 'true' : 'false'}
    >
      <span
        className={cn(
          'grid h-10 w-10 place-items-center rounded-2xl border text-xs font-black tracking-tight transition',
          'group-hover:scale-[1.02]',
          active ? 'border-blue-500/25 bg-blue-500/10 text-blue-700' : 'border-black/10 bg-ocean-bg text-ocean-text'
        )}
        aria-hidden="true"
      >
        {logoText}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold tracking-tight text-ocean-text">{name}</span>
        <span className="block text-xs text-ocean-muted">Repair services</span>
      </span>
      <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-ocean-muted transition group-hover:text-ocean-text">
        Select <IconChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

// PUBLIC_INTERFACE
export function LandingRepairIllustration({ src = '/assets/landing-illustration.svg' }) {
  /** Landing right-side illustration block, using a static public asset when available. */
  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_16px_34px_rgba(17,24,39,0.10)] anim-fade-in anim-delay-200">
      <div className="absolute inset-0 bg-[radial-gradient(700px_380px_at_20%_10%,rgba(37,99,235,0.15),transparent_60%),radial-gradient(520px_320px_at_95%_20%,rgba(245,158,11,0.14),transparent_55%)]" />
      <div className="relative p-6 sm:p-7">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-extrabold tracking-tight text-ocean-text">Technician at work</div>
          <div className="rounded-full border border-black/10 bg-ocean-bg px-3 py-1 text-xs font-semibold text-ocean-muted">
            Screen • Motherboard • Tools
          </div>
        </div>

        <div className="relative">
          <img
            src={src}
            alt="Technicians repairing a smartphone with tools and a motherboard"
            className="h-[280px] w-full select-none object-contain anim-float"
            draggable="false"
            loading="eager"
            onError={e => {
              // If asset isn't present in this environment, fail gracefully without breaking layout.
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            ['2 Hrs', 'Bangalore coverage'],
            ['Genuine', 'Quality parts'],
            ['Warranty', 'Service assurance']
          ].map(([k, v], idx) => (
            <div
              key={k}
              className={cn(
                'rounded-2xl border border-black/10 bg-ocean-bg px-4 py-3 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition',
                'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)]',
                'focus-within:ring-4 focus-within:ring-blue-500/10',
                idx === 0 ? 'anim-fade-up anim-delay-200' : idx === 1 ? 'anim-fade-up anim-delay-300' : 'anim-fade-up anim-delay-500'
              )}
            >
              <div className="text-base font-black tracking-tight text-ocean-text">{k}</div>
              <div className="text-xs text-ocean-muted">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function LandingFloatingCTAs({
  whatsappHref = 'https://wa.me/0000000000',
  phoneHref = 'tel:+910000000000'
}) {
  /** Floating WhatsApp + Call CTAs for marketing pages. */
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 anim-fade-in">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-emerald-800 shadow-[0_16px_26px_rgba(16,185,129,0.18)] transition will-change-transform hover:-translate-y-1 hover:bg-emerald-500/15 hover:shadow-[0_22px_34px_rgba(16,185,129,0.22)] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 anim-float-slow"
        aria-label="Chat on WhatsApp"
        title="WhatsApp"
      >
        <IconWhatsApp className="h-6 w-6 transition group-hover:scale-105" />
        <span className="sr-only">WhatsApp</span>
      </a>

      <a
        href={phoneHref}
        className="group inline-flex items-center justify-center rounded-2xl border border-blue-500/25 bg-blue-500/10 p-3 text-blue-800 shadow-[0_16px_26px_rgba(37,99,235,0.18)] transition will-change-transform hover:-translate-y-1 hover:bg-blue-500/15 hover:shadow-[0_22px_34px_rgba(37,99,235,0.22)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 anim-glow-pulse"
        aria-label="Call now"
        title="Call"
      >
        <IconPhone className="h-6 w-6 transition group-hover:scale-105" />
        <span className="sr-only">Call</span>
      </a>
    </div>
  );
}

// PUBLIC_INTERFACE
export function LandingMobileStickyCta({ to = '/book' }) {
  /** Sticky bottom mobile CTA bar for conversion on small screens. */
  return (
    <div className="sticky bottom-0 z-20 border-t border-black/10 bg-white/80 backdrop-blur sm:hidden">
      <Container className="flex items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-extrabold">Need repair fast?</div>
          <div className="truncate text-xs text-ocean-muted">Book now & track live</div>
        </div>
        <Link to={to} className="shrink-0">
          <Button className="px-4 py-2.5">Book Now</Button>
        </Link>
      </Container>
    </div>
  );
}
