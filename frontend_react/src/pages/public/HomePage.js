import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '../../ui/tw';
import {
  LandingBrandCard,
  LandingFloatingCTAs,
  LandingMobileStickyCta,
  LandingRepairIllustration,
  LandingTopNav
} from '../../ui/landing';

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Public marketing homepage (LG-reference inspired): hero, brand search + cards, illustration, floating WhatsApp/Call, and popular brands section. */

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
      <LandingTopNav brandName="Fixma" bookCtaTo="/book" />

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
                    <LandingBrandCard
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
            <LandingRepairIllustration />
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

      <LandingFloatingCTAs />
      <LandingMobileStickyCta to="/book" />
    </div>
  );
}
