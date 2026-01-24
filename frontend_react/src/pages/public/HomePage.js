import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '../../ui/tw';

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

function BrandCard({ name, logoText, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition will-change-transform',
        'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)] focus:outline-none focus:ring-4 focus:ring-blue-500/15',
        'active:translate-y-0 active:shadow-[0_10px_20px_rgba(17,24,39,0.06)]',
        active ? 'border-blue-500/30 ring-4 ring-blue-500/10' : 'border-black/10'
      ].join(' ')}
      aria-pressed={active ? 'true' : 'false'}
    >
      <span
        className={[
          'grid h-10 w-10 place-items-center rounded-2xl border text-xs font-black tracking-tight transition',
          'group-hover:scale-[1.02]',
          active ? 'border-blue-500/25 bg-blue-500/10 text-blue-700' : 'border-black/10 bg-ocean-bg text-ocean-text'
        ].join(' ')}
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

function RepairIllustration() {
  // Uses a real illustration asset (SVG) so the landing feels more production-ready.
  // Kept local in /public/assets to avoid extra build tooling.
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
            src="/assets/landing-illustration.svg"
            alt="Technicians repairing a smartphone with tools and a motherboard"
            className="h-[280px] w-full select-none object-contain anim-float"
            draggable="false"
            loading="eager"
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
              className={[
                'rounded-2xl border border-black/10 bg-ocean-bg px-4 py-3 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition',
                'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)]',
                'focus-within:ring-4 focus-within:ring-blue-500/10',
                idx === 0 ? 'anim-fade-up anim-delay-200' : idx === 1 ? 'anim-fade-up anim-delay-300' : 'anim-fade-up anim-delay-500'
              ].join(' ')}
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
export default function HomePage() {
  /** Public marketing homepage (Fixma-style): hero, brand search + cards, illustration, floating WhatsApp/Call, and popular brands section. */

  const BRANDS = useMemo(
    () => [
      { name: 'Apple', logoText: '' },
      { name: 'Samsung', logoText: 'S' },
      { name: 'Nokia', logoText: 'N' },
      { name: 'Mi', logoText: 'MI' },
      { name: 'Realme', logoText: 'R' },
      { name: 'OnePlus', logoText: '1+' }
    ],
    []
  );

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BRANDS;
    return BRANDS.filter(b => b.name.toLowerCase().includes(q));
  }, [BRANDS, search]);

  return (
    <div className="bg-ocean-bg">
      {/* Top nav (per spec: Home, About, Services, Blog, Contact + highlighted Book Now) */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 font-extrabold tracking-tight text-ocean-text">
            <span
              className="h-9 w-9 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-[0_12px_22px_rgba(37,99,235,0.22)]"
              aria-hidden="true"
            />
            <span>Fixma</span>
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
            <Link to="/book" className="hidden sm:block">
              <Button className="px-4 py-2.5">Book Now</Button>
            </Link>
            <Link to="/book" className="sm:hidden">
              <Button className="px-3 py-2">Book</Button>
            </Link>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_650px_at_15%_0%,rgba(37,99,235,0.14),transparent_55%),radial-gradient(900px_520px_at_100%_10%,rgba(245,158,11,0.12),transparent_55%)]" />
        <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          <div className="grid gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-800 anim-fade-up">
              Startup-grade service • Minimal • Responsive
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-ocean-text sm:text-5xl anim-fade-up anim-delay-100">
              Mobile Repair in Bangalore within <span className="text-ocean-primary">2 Hrs</span>
            </h1>

            <p className="max-w-xl text-base text-ocean-muted anim-fade-up anim-delay-200">
              Clean, professional booking experience for customers. Search your brand, choose a service, and track your ticket in real
              time.
            </p>

            {/* Search + brands */}
            <div className="grid gap-3 anim-fade-up anim-delay-300">
              <label className="text-sm font-semibold text-ocean-text" htmlFor="brand-search">
                Search box
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  id="brand-search"
                  className="w-full flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ocean-text shadow-[0_10px_20px_rgba(17,24,39,0.06)] outline-none transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)] focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Search Your Brand"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoComplete="off"
                />
                <Link to="/book" className="shrink-0">
                  <Button className="btn-shine w-full px-5 py-3 sm:w-auto">Book Repair</Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 anim-fade-up anim-delay-500">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold tracking-tight text-ocean-text">Choose a brand</div>
                {selectedBrand ? (
                  <div className="text-xs text-ocean-muted">
                    Selected: <span className="font-semibold text-ocean-text">{selectedBrand}</span>
                  </div>
                ) : (
                  <div className="text-xs text-ocean-muted">No brand selected</div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {filteredBrands.map((b, idx) => (
                  <div
                    key={b.name}
                    className={idx < 2 ? 'anim-fade-up anim-delay-200' : idx < 4 ? 'anim-fade-up anim-delay-300' : 'anim-fade-up anim-delay-500'}
                  >
                    <BrandCard
                      name={b.name}
                      logoText={b.logoText}
                      active={selectedBrand === b.name}
                      onClick={() => setSelectedBrand(b.name)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/services">
                  <Button variant="secondary" className="px-5 py-2.5">
                    More Brands
                  </Button>
                </Link>
                <div className="text-xs text-ocean-muted">
                  Tip: Use <span className="font-semibold">Book Now</span> to create a ticket and track it.
                </div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="lg:pl-6">
            <RepairIllustration />
          </div>
        </Container>
      </section>

      {/* Popular repaired brands */}
      <section className="border-t border-black/10 bg-white py-12">
        <Container>
          <div className="grid gap-2">
            <h2 className="text-2xl font-black tracking-tight text-ocean-text">Popular Repaired Brands</h2>
            <p className="max-w-2xl text-sm text-ocean-muted">
              A quick view of commonly serviced devices. Built to look like a real production homepage.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BRANDS.map(b => (
              <div
                key={b.name}
                className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-ocean-bg text-sm font-black text-ocean-text">
                    {b.logoText}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold tracking-tight text-ocean-text">{b.name}</div>
                    <div className="text-xs text-ocean-muted">Screen • Battery • Diagnostics</div>
                  </div>
                </div>
                <Link to="/book" className="text-sm font-semibold text-ocean-primary hover:underline">
                  Book
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Floating action buttons (bottom-right) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 anim-fade-in">
        <a
          href="https://wa.me/0000000000"
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
          href="tel:+910000000000"
          className="group inline-flex items-center justify-center rounded-2xl border border-blue-500/25 bg-blue-500/10 p-3 text-blue-800 shadow-[0_16px_26px_rgba(37,99,235,0.18)] transition will-change-transform hover:-translate-y-1 hover:bg-blue-500/15 hover:shadow-[0_22px_34px_rgba(37,99,235,0.22)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 anim-glow-pulse"
          aria-label="Call now"
          title="Call"
        >
          <IconPhone className="h-6 w-6 transition group-hover:scale-105" />
          <span className="sr-only">Call</span>
        </a>
      </div>

      {/* Mobile bottom CTA (optional, helps conversion on small screens) */}
      <div className="sticky bottom-0 z-20 border-t border-black/10 bg-white/80 backdrop-blur sm:hidden">
        <Container className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold">Need repair fast?</div>
            <div className="truncate text-xs text-ocean-muted">Book now & track live</div>
          </div>
          <Link to="/book" className="shrink-0">
            <Button className="px-4 py-2.5">Book Now</Button>
          </Link>
        </Container>
      </div>
    </div>
  );
}
