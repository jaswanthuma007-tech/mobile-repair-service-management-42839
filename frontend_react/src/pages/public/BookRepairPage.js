import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Button, Container } from '../../ui/tw';

// PUBLIC_INTERFACE
export default function BookRepairPage() {
  /** Public booking entry. Promotes the new multi-step customer portal flow (requires sign-in). */
  const { user } = useAuth();

  return (
    <Container className="py-12">
      <div className="grid gap-3">
        <h1 className="text-3xl font-black tracking-tight">Book Repair</h1>
        <p className="max-w-2xl text-sm text-ocean-muted">
          Professional booking flow: Brand → Model → Issue → Confirm. Your booking is linked to your account and appears in Customer
          Portal.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <div className="text-lg font-extrabold tracking-tight">Start booking</div>
          <div className="mt-2 text-sm text-ocean-muted">
            {user ? (
              <>Continue to the guided booking steps.</>
            ) : (
              <>You’ll need to sign in first so we can attach the ticket to your account.</>
            )}
          </div>

          {!user ? (
            <div className="mt-4">
              <Alert variant="info">
                Not signed in. Please <Link className="font-semibold underline" to="/login">sign in</Link> (or{' '}
                <Link className="font-semibold underline" to="/register">create an account</Link>) to book.
              </Alert>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {user ? (
              <Link to="/select-brand">
                <Button className="px-5 py-2.5">Select brand</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="px-5 py-2.5">Sign in to book</Button>
              </Link>
            )}

            <Link to="/track">
              <Button variant="secondary" className="px-5 py-2.5">
                Track a ticket
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <div className="text-lg font-extrabold tracking-tight">What happens next?</div>
          <div className="mt-2 grid gap-3 text-sm text-ocean-muted">
            <div>
              <span className="font-semibold text-ocean-text">1.</span> You select your device & issue.
            </div>
            <div>
              <span className="font-semibold text-ocean-text">2.</span> Booking is created with status <b>Booked</b>.
            </div>
            <div>
              <span className="font-semibold text-ocean-text">3.</span> Admin assigns a technician and you get realtime updates.
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/services">
              <Button variant="ghost">Browse services</Button>
            </Link>
            <Link to="/customer">
              <Button variant="secondary">Customer portal</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
