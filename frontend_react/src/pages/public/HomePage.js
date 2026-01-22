import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, TextArea, TextField } from '../../ui/tw';

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
      <div className="text-base font-extrabold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-ocean-muted">{desc}</div>
    </div>
  );
}

function PriceCard({ name, price, items, highlight }) {
  return (
    <div
      className={[
        'rounded-2xl border p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]',
        highlight ? 'border-blue-500/30 bg-blue-500/5' : 'border-black/10 bg-white'
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-lg font-extrabold tracking-tight">{name}</div>
        {highlight ? (
          <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-800">
            Popular
          </span>
        ) : null}
      </div>
      <div className="mt-2 text-3xl font-black">{price}</div>
      <ul className="mt-4 grid gap-2 text-sm text-ocean-muted">
        {items.map(i => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ocean-primary" aria-hidden="true" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Link to="/book">
          <Button className="w-full" variant={highlight ? 'primary' : 'secondary'}>
            Book now
          </Button>
        </Link>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Public marketing homepage. */
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_500px_at_100%_10%,rgba(245,158,11,0.10),transparent_55%)]" />
        <Container className="grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="grid gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-800">
              Trusted campus-friendly repair service
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Fast phone repairs with <span className="text-ocean-primary">transparent pricing</span>.
            </h1>
            <p className="max-w-xl text-base text-ocean-muted">
              Book a repair in minutes, track your ticket in real time, and get your device back quickly—Cashify/UrbanClap
              style experience for your final project demo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/book">
                <Button className="px-5 py-2.5">Book Repair</Button>
              </Link>
              <Link to="/track">
                <Button variant="secondary" className="px-5 py-2.5">
                  Track Ticket
                </Button>
              </Link>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
                <div className="text-xl font-black">60–90m</div>
                <div className="text-ocean-muted">Typical repairs</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
                <div className="text-xl font-black">Realtime</div>
                <div className="text-ocean-muted">Status updates</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4 backdrop-blur">
                <div className="text-xl font-black">Secure</div>
                <div className="text-ocean-muted">Email login</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card title="Quick booking">
              <div className="grid gap-3">
                <div className="text-sm text-ocean-muted">
                  Demo form. Use the full booking page to create an actual repair request.
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField label="Brand" value={'Apple'} onChange={() => {}} required={false} />
                  <TextField label="Model" value={'iPhone 13'} onChange={() => {}} required={false} />
                </div>
                <TextField label="Issue" value={'Screen cracked'} onChange={() => {}} required={false} />
                <Link to="/book">
                  <Button className="w-full">Go to booking</Button>
                </Link>
              </div>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              <Feature title="Pickup / drop" desc="Optional (for demo). Add address in customer profile later." />
              <Feature title="Verified techs" desc="Technicians update status and notes in their portal." />
              <Feature title="Admin control" desc="Admins assign technicians, monitor all bookings and stats." />
              <Feature title="Warranty" desc="30-day service warranty on common repairs (demo text)." />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight">Services</h2>
            <p className="mt-2 max-w-2xl text-sm text-ocean-muted">Popular repairs for phones and tablets.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Screen Replacement', 'Cracked or unresponsive screens.'],
              ['Battery Replacement', 'Quick swap for swollen/weak batteries.'],
              ['Camera Repair', 'Blur, focus issues, lens damage.'],
              ['Software Fix', 'Boot loops, crashes, slow performance.'],
              ['Water Damage', 'Diagnostic + cleaning + recovery attempt.'],
              ['Charging Port', 'Loose port, not charging, debris damage.']
            ].map(([t, d]) => (
              <Feature key={t} title={t} desc={d} />
            ))}
          </div>
          <div className="mt-6">
            <Link to="/services">
              <Button variant="secondary">View all services</Button>
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-y border-black/10 bg-white py-14">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight">How it works</h2>
            <p className="mt-2 max-w-2xl text-sm text-ocean-muted">Simple 3-step flow (like UrbanClap).</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Feature title="1) Book" desc="Tell us your brand/model and issue. Create a ticket instantly." />
            <Feature title="2) Repair" desc="Technician receives the job, updates status, notes and cost." />
            <Feature title="3) Track" desc="Track the repair by ticket ID and get realtime updates." />
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight">Pricing</h2>
            <p className="mt-2 max-w-2xl text-sm text-ocean-muted">
              Transparent ballpark pricing for the demo (final cost can be set by technician/admin).
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <PriceCard name="Basic" price="₹499+" items={['Software fix', 'Diagnostics', 'Same-day slots']} />
            <PriceCard
              name="Standard"
              price="₹999+"
              highlight
              items={['Battery / port', 'Quality parts', 'Realtime tracking']}
            />
            <PriceCard name="Premium" price="₹1499+" items={['Screen replacement', 'Warranty', 'Priority handling']} />
          </div>
        </Container>
      </section>

      <section className="border-t border-black/10 bg-white py-14">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Contact</h2>
            <p className="mt-2 max-w-xl text-sm text-ocean-muted">
              This contact form is UI-only (for your bootcamp). Hook it to an API/email provider later.
            </p>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="rounded-2xl border border-black/10 bg-ocean-bg p-4">
                <div className="font-bold">Support</div>
                <div className="text-ocean-muted">support@mobilerepair.example</div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-ocean-bg p-4">
                <div className="font-bold">Location</div>
                <div className="text-ocean-muted">Near your campus (demo)</div>
              </div>
            </div>
          </div>

          <Card title="Send a message">
            <form
              onSubmit={e => {
                e.preventDefault();
                // Intentionally no backend yet; avoid blank screens.
                // eslint-disable-next-line no-alert
                alert('Thanks! (Demo form) We will get back to you soon.');
              }}
              className="grid gap-3"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Name" value={''} onChange={() => {}} required={false} placeholder="Your name" />
                <TextField label="Email" value={''} onChange={() => {}} required={false} placeholder="you@domain.com" />
              </div>
              <TextArea label="Message" value={''} onChange={() => {}} required={false} placeholder="How can we help?" />
              <Button type="submit">Submit</Button>
            </form>
          </Card>
        </Container>
      </section>
    </div>
  );
}
