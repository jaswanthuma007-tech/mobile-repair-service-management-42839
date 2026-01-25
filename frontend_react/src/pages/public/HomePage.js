import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Container } from '../../ui/tw';

/**
 * Motion helpers (small, local, and predictable).
 */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function BrandCard({ name, logoText, onSelect }) {
  return (
    <motion.div variants={fadeUp}>
      <button
        type="button"
        onClick={() => onSelect(name)}
        className={cn(
          'group flex w-full items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 text-left',
          'shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition will-change-transform',
          'hover:-translate-y-0.5 hover:border-blue-600/25 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)]',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15'
        )}
        aria-label={`Select ${name}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              'grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-black/10 bg-ocean-bg',
              'text-xs font-black tracking-tight text-ocean-text transition',
              'group-hover:bg-blue-500/10 group-hover:text-blue-700 group-hover:border-blue-600/20'
            )}
            aria-hidden="true"
          >
            {logoText}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold tracking-tight text-ocean-text">{name}</div>
            <div className="text-xs text-ocean-muted">Screen • Battery • Diagnostics</div>
          </div>
        </div>

        <span
          className={cn(
            'inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-3 py-2',
            'text-xs font-semibold text-ocean-text transition',
            'group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
          )}
        >
          Select
        </span>
      </button>
    </motion.div>
  );
}

function StatPill({ title, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'rounded-2xl border border-black/10 bg-ocean-bg px-4 py-3',
        'shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition',
        'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)]'
      )}
    >
      <div className="text-base font-black tracking-tight text-ocean-text">{title}</div>
      <div className="text-xs text-ocean-muted">{subtitle}</div>
    </motion.div>
  );
}

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Modern marketing homepage: hero (tagline + search), brand grid (Select -> booking flow), and motion micro-animations. */

  const navigate = useNavigate();

  const BRANDS = useMemo(
    () => [
      { name: 'Apple', logoText: '' },
      { name: 'Samsung', logoText: 'S' },
      { name: 'Xiaomi', logoText: 'MI' },
      { name: 'OnePlus', logoText: '1+' },
      { name: 'Oppo', logoText: 'O' },
      { name: 'Vivo', logoText: 'V' },
      { name: 'Realme', logoText: 'R' }
    ],
    []
  );

  const [search, setSearch] = useState('');

  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BRANDS;
    return BRANDS.filter(b => b.name.toLowerCase().includes(q));
  }, [BRANDS, search]);

  const goToBooking = (brandName) => {
    // Booking flow requirement: Brand → Model → Issue → Address → Confirm.
    // Current app routes start at /select-brand; pass a brand if present so
    // the booking flow can preselect/route accordingly (supported by existing pages).
    const q = brandName ? `?brand=${encodeURIComponent(brandName)}` : '';
    navigate(`/select-brand${q}`);
  };

  return (
    <div className="bg-ocean-bg">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_650px_at_15%_0%,rgba(37,99,235,0.14),transparent_55%),radial-gradient(900px_520px_at_100%_10%,rgba(245,158,11,0.10),transparent_55%)]" />

        <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
          {/* Left */}
          <motion.div initial="hidden" animate="show" variants={stagger} className="grid gap-6">
            <motion.div
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-800"
            >
              Startup-grade service • Minimal • Responsive
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-black leading-tight tracking-tight text-ocean-text sm:text-5xl"
            >
              Mobile Repair in Bangalore within <span className="text-ocean-primary">2 Hrs</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl text-base text-ocean-muted">
              Clean, professional booking experience. Search your brand, choose your service, and track your ticket in real time.
            </motion.p>

            {/* Search + CTA */}
            <motion.div variants={fadeUp} className="grid gap-3">
              <label className="text-sm font-semibold text-ocean-text" htmlFor="brand-search">
                Search your brand
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  id="brand-search"
                  className={cn(
                    'w-full flex-1 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ocean-text',
                    'shadow-[0_10px_20px_rgba(17,24,39,0.06)] outline-none transition will-change-transform',
                    'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)]',
                    'focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10'
                  )}
                  placeholder="Search your brand…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoComplete="off"
                />

                <Button className="btn-shine w-full px-5 py-3 sm:w-auto" onClick={() => goToBooking(search || undefined)}>
                  Book Repair
                </Button>
              </div>
            </motion.div>

            {/* Brand grid */}
            <motion.div variants={fadeUp} className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold tracking-tight text-ocean-text">Choose a brand</div>
                <Link to="/services" className="text-xs font-semibold text-ocean-primary hover:underline">
                  View services
                </Link>
              </div>

              <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 sm:grid-cols-2">
                {filteredBrands.map(b => (
                  <BrandCard key={b.name} name={b.name} logoText={b.logoText} onSelect={goToBooking} />
                ))}
              </motion.div>

              <div className="text-xs text-ocean-muted">
                Tip: selecting a brand starts the booking flow (Brand → Model → Issue → Address → Confirm).
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Illustration + floating cards */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="relative lg:pl-6"
            aria-label="Technician illustration with service highlights"
          >
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_16px_34px_rgba(17,24,39,0.10)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(700px_380px_at_20%_10%,rgba(37,99,235,0.16),transparent_60%),radial-gradient(520px_320px_at_95%_20%,rgba(245,158,11,0.12),transparent_55%)]" />
              <div className="relative p-6 sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-extrabold tracking-tight text-ocean-text">Technician at work</div>
                  <div className="rounded-full border border-black/10 bg-ocean-bg px-3 py-1 text-xs font-semibold text-ocean-muted">
                    Fast • Transparent • Professional
                  </div>
                </div>

                <div className="relative">
                  <motion.img
                    src="/assets/landing-illustration.svg"
                    alt="Technician repairing a smartphone"
                    className="h-[280px] w-full select-none object-contain"
                    draggable="false"
                    loading="eager"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    onError={e => {
                      // Fail gracefully if the asset isn't present.
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
                </div>

                <motion.div variants={stagger} className="mt-4 grid gap-2 sm:grid-cols-3">
                  <StatPill title="2 Hrs" subtitle="Bangalore coverage" />
                  <StatPill title="Genuine" subtitle="Quality parts" />
                  <StatPill title="Warranty" subtitle="Service assurance" />
                </motion.div>
              </div>
            </motion.div>

            {/* Small, subtle floating accent card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className={cn(
                'pointer-events-none absolute -bottom-4 left-6 hidden w-[260px] rounded-2xl border border-blue-500/20',
                'bg-white/90 p-4 shadow-[0_18px_40px_rgba(17,24,39,0.12)] backdrop-blur lg:block'
              )}
            >
              <div className="text-xs font-bold text-blue-700">Realtime updates</div>
              <div className="mt-1 text-sm font-extrabold tracking-tight text-ocean-text">Track repair status live</div>
              <div className="mt-1 text-xs text-ocean-muted">Get transparent progress updates from pickup to delivery.</div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Brand strip / trust area */}
      <section className="border-t border-black/10 bg-white py-12">
        <Container>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="grid gap-2">
            <motion.h2 variants={fadeUp} className="text-2xl font-black tracking-tight text-ocean-text">
              Trusted repairs for popular brands
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-2xl text-sm text-ocean-muted">
              Quick access to commonly serviced devices — built with clean Tailwind styling and subtle motion.
            </motion.p>

            <motion.div variants={stagger} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BRANDS.map(b => (
                <motion.div
                  key={b.name}
                  variants={fadeUp}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-ocean-bg text-sm font-black text-ocean-text">
                      {b.logoText}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold tracking-tight text-ocean-text">{b.name}</div>
                      <div className="text-xs text-ocean-muted">Screen • Battery • Water damage</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => goToBooking(b.name)}
                    className="text-sm font-semibold text-ocean-primary hover:underline"
                  >
                    Book
                  </button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link to="/track" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full px-5 py-2.5 sm:w-auto">
                  Track Repair
                </Button>
              </Link>
              <div className="text-xs text-ocean-muted">
                Already booked? Track by ticket in real time.
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Mobile-only sticky CTA (the global navbar has the main CTA; this boosts conversion on small screens) */}
      <div className="sticky bottom-0 z-20 border-t border-black/10 bg-white/85 backdrop-blur sm:hidden">
        <Container className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold">Need repair fast?</div>
            <div className="truncate text-xs text-ocean-muted">Book now & track live</div>
          </div>
          <Button className="shrink-0 px-4 py-2.5" onClick={() => goToBooking()}>
            Book Repair
          </Button>
        </Container>
      </div>
    </div>
  );
}
