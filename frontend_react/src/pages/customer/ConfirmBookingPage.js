import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { clearBookingDraft, loadBookingDraft } from '../../lib/bookingSession';
import { createBooking } from '../../lib/repairsApi';
import { Alert, Button } from '../../ui/tw';
import { BookingStepProgress } from '../../ui/bookingFlow';

// PUBLIC_INTERFACE
export default function ConfirmBookingPage() {
  /** Step 4: Confirmation page. Inserts booking into repairs with status='Booked'. */
  const navigate = useNavigate();
  const { user } = useAuth();

  const draft = useMemo(() => loadBookingDraft(), []);
  const brandName = draft?.brand?.name || '';
  const modelName = draft?.model?.model_name || '';
  const issueText = draft?.issue?.effective || draft?.issue?.value || '';

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successId, setSuccessId] = useState('');

  const onConfirm = async () => {
    setErrorMsg('');
    setSuccessId('');

    if (!user?.id) {
      setErrorMsg('Please sign in to confirm booking.');
      return;
    }

    if (!brandName || !modelName || !issueText) {
      setErrorMsg('Missing booking details. Please restart booking.');
      return;
    }

    setBusy(true);
    try {
      const created = await createBooking({ brand: brandName, model: modelName, issue: issueText });
      setSuccessId(created.id);
      clearBookingDraft();

      // Navigate back to customer portal where the "Your Repairs" list will show it.
      setTimeout(() => {
        navigate('/customer', { replace: true });
      }, 900);
    } catch (e) {
      setErrorMsg(e?.message || 'Failed to confirm booking.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-2xl font-black tracking-tight">Confirm booking</h1>
        <p className="max-w-3xl text-sm text-ocean-muted">Review your selections and confirm to create your repair booking.</p>
      </div>

      <BookingStepProgress currentStep="confirm" />

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}
      {successId ? (
        <Alert variant="success">
          Booking created! Ticket: <span className="font-mono font-semibold">{successId}</span>
        </Alert>
      ) : null}

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-ocean-muted">Brand</div>
            <div className="mt-1 text-base font-extrabold tracking-tight text-ocean-text">{brandName || '—'}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-ocean-muted">Model</div>
            <div className="mt-1 text-base font-extrabold tracking-tight text-ocean-text">{modelName || '—'}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wide text-ocean-muted">Issue</div>
            <div className="mt-1 text-sm text-ocean-text">{issueText || '—'}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs font-bold uppercase tracking-wide text-ocean-muted">User email</div>
            <div className="mt-1 text-sm font-semibold text-ocean-text">{user?.email || '—'}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
          <Button variant="secondary" onClick={() => navigate('/select-issue')}>
            Back
          </Button>

          <Button onClick={onConfirm} disabled={busy}>
            {busy ? 'Confirming…' : 'Confirm booking'}
          </Button>
        </div>

        <div className="mt-3 text-xs text-ocean-muted">
          This will insert a row into <code className="font-mono">public.repairs</code> with status <b>Booked</b>.
        </div>
      </div>
    </div>
  );
}
