import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '../../ui/tw';

const SERVICES = [
  {
    title: 'Screen Replacement',
    desc: 'Cracked glass, touch not working, display flicker—fast replacement with quality parts.'
  },
  {
    title: 'Battery Replacement',
    desc: 'Low health, sudden shutdowns, swelling—safe replacement with testing.'
  },
  {
    title: 'Camera Repair',
    desc: 'Blurry images, focus issues, lens cracks—module replacement and calibration.'
  },
  {
    title: 'Software Repair',
    desc: 'Boot loops, freezing, malware cleanup, OS reinstall, performance tune-up.'
  },
  {
    title: 'Water Damage',
    desc: 'Diagnostic + cleaning + recovery attempt. We will update ticket with findings.'
  }
];

// PUBLIC_INTERFACE
export default function ServicesPage() {
  /** Public services catalog page. */
  return (
    <div>
      <div className="bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(37,99,235,0.10),transparent_55%)]">
        <Container className="py-12">
          <h1 className="text-3xl font-black tracking-tight">Services</h1>
          <p className="mt-2 max-w-2xl text-sm text-ocean-muted">
            Choose from popular repair categories. Book a repair to generate a ticket ID, then track it in real time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/book">
              <Button>Book Repair</Button>
            </Link>
            <Link to="/track">
              <Button variant="secondary">Track Repair</Button>
            </Link>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {SERVICES.map(s => (
            <div
              key={s.title}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]"
            >
              <div className="text-lg font-extrabold tracking-tight">{s.title}</div>
              <div className="mt-2 text-sm text-ocean-muted">{s.desc}</div>
              <div className="mt-4">
                <Link to="/book">
                  <Button variant="secondary">Book this service</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
