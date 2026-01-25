import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Alert, Button, Card, Container } from '../../ui/tw';

// PUBLIC_INTERFACE
export default function BookingFlowOverviewPage() {
  /** Public booking flow overview (scaffolding page). Explains end-to-end flow and routes to login or first step. */
  const { user } = useAuth();

  return (
    <div className="bg-[radial-gradient(1200px_650px_at_15%_0%,rgba(37,99,235,0.10),transparent_55%),radial-gradient(900px_520px_at_100%_10%,rgba(245,158,11,0.08),transparent_55%)]">
      <Container className="py-12">
        <div className="grid gap-2">
          <h1 className="text-3xl font-black tracking-tight">Book a repair</h1>
          <p className="max-w-2xl text-sm text-ocean-muted">
            This is the end-to-end flow scaffolding: marketing entry → authenticated multi-step booking → ticket creation → realtime
            tracking.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card title="Start booking">
            <div className="text-sm text-ocean-muted">
              {user ? (
                <>Continue to the guided booking steps.</>
              ) : (
                <>You’ll need to sign in first so we can attach the ticket to your account.</>
              )}
            </div>

            {!user ? (
              <Alert variant="info" className="mt-3">
                Not signed in. Please <Link className="font-semibold underline" to="/login">sign in</Link> (or{' '}
                <Link className="font-semibold underline" to="/register">create an account</Link>) to book.
              </Alert>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-3">
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
          </Card>

          <Card title="What happens next?">
            <div className="grid gap-3 text-sm text-ocean-muted">
              <div>
                <span className="font-semibold text-ocean-text">1.</span> Choose your device brand/model and issue.
              </div>
              <div>
                <span className="font-semibold text-ocean-text">2.</span> Confirm details to create a ticket.
              </div>
              <div>
                <span className="font-semibold text-ocean-text">3.</span> Admin assigns technician; technician updates status.
              </div>
              <div>
                <span className="font-semibold text-ocean-text">4.</span> Track status live (Supabase Realtime).
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/services">
                <Button variant="ghost">Browse services</Button>
              </Link>
              <Link to="/customer">
                <Button variant="secondary">Customer portal</Button>
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
