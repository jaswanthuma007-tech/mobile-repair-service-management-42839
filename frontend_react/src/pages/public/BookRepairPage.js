import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { createRepair } from '../../lib/repairsApi';
import { Alert, Button, Card, Container, TextArea, TextField } from '../../ui/tw';

// PUBLIC_INTERFACE
export default function BookRepairPage() {
  /** Public booking page. If logged out, it prompts login; if logged in, creates repair ticket for the current user. */
  const { user } = useAuth();

  const customerId = user?.id ?? null;

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [issue, setIssue] = useState('');
  const [preferredContact, setPreferredContact] = useState('');

  const device = useMemo(() => {
    const b = brand.trim();
    const m = model.trim();
    if (!b && !m) return '';
    if (!b) return m;
    if (!m) return b;
    return `${b} ${m}`;
  }, [brand, model]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setCreatedTicketId('');

    if (!customerId) {
      setErrorMsg('Please login to book a repair (email signup/login required).');
      return;
    }

    const deviceValue = device.trim();
    const issueValue = issue.trim();
    const contactValue = preferredContact.trim();

    // Client-side validation to prevent null/empty inserts.
    if (!deviceValue) {
      setErrorMsg('Please enter your device brand/model.');
      return;
    }
    if (!issueValue) {
      setErrorMsg('Please describe the issue.');
      return;
    }

    setLoading(true);
    try {
      const combinedIssue = contactValue ? `${issueValue}\nContact: ${contactValue}` : issueValue;
      const created = await createRepair({ device: deviceValue, issue: combinedIssue });
      setCreatedTicketId(created.id);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <div className="grid gap-3">
        <h1 className="text-3xl font-black tracking-tight">Book Repair</h1>
        <p className="max-w-2xl text-sm text-ocean-muted">
          Fill the form to create a repair ticket. You can track it later using the ticket ID.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card title="Booking form">
          {errorMsg ? <Alert>{errorMsg}</Alert> : null}

          {!user ? (
            <Alert variant="info">
              You’re currently not logged in. <Link className="font-semibold underline" to="/login">Sign in</Link> to create a real ticket.
            </Alert>
          ) : null}

          <form onSubmit={onSubmit} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Brand" value={brand} onChange={setBrand} placeholder="Apple / Samsung / OnePlus" required />
              <TextField label="Model" value={model} onChange={setModel} placeholder="iPhone 13 / S22 / Nord" required />
            </div>

            <TextArea label="Issue" value={issue} onChange={setIssue} placeholder="Describe the problem (screen, battery, etc.)" required />

            <TextField
              label="Preferred contact (optional)"
              value={preferredContact}
              onChange={setPreferredContact}
              placeholder="Phone number / WhatsApp / notes"
              required={false}
              autoComplete="tel"
            />

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating ticket…' : 'Create ticket'}
            </Button>
          </form>

          {createdTicketId ? (
            <Alert variant="success" className="mt-3">
              Ticket created! Your Ticket ID is{' '}
              <span className="font-mono font-semibold">{createdTicketId}</span>.{' '}
              <Link className="font-semibold underline" to={`/track?ticket=${encodeURIComponent(createdTicketId)}`}>
                Track now
              </Link>
              .
            </Alert>
          ) : null}
        </Card>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <div className="text-lg font-extrabold tracking-tight">What happens next?</div>
          <div className="mt-2 grid gap-3 text-sm text-ocean-muted">
            <div>
              <span className="font-semibold text-ocean-text">1.</span> Admin reviews booking and assigns a technician.
            </div>
            <div>
              <span className="font-semibold text-ocean-text">2.</span> Technician updates status (Received → Repairing → Completed).
            </div>
            <div>
              <span className="font-semibold text-ocean-text">3.</span> You can track progress live with your Ticket ID.
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/track">
              <Button variant="secondary">Track Repair</Button>
            </Link>
            <Link to="/services">
              <Button variant="ghost">Browse services</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
