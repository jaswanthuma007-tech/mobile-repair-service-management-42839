import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { listServicesForModel } from '../../lib/catalogApi';
import { loadBookingDraft, updateBookingDraft } from '../../lib/bookingSession';
import { Alert, Button } from '../../ui/tw';
import { BookingStepProgress } from '../../ui/bookingFlow';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

function ServiceCard({ name, price, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-2xl border bg-white px-4 py-4 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition',
        'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)] focus:outline-none focus:ring-4 focus:ring-blue-500/15',
        active ? 'border-blue-500/30 ring-4 ring-blue-500/10' : 'border-black/10'
      )}
      aria-pressed={active ? 'true' : 'false'}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-extrabold tracking-tight text-ocean-text">{name}</div>
          <div className="mt-1 text-xs text-ocean-muted">Tap to select</div>
        </div>
        <div className="shrink-0 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-bold text-ocean-text">
          {formatMoney(price)}
        </div>
      </div>
    </button>
  );
}

// PUBLIC_INTERFACE
export default function SelectIssuePage() {
  /** Step 3: Choose issue/service from Supabase `services` table by model_id. */
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const modelId = params.get('model_id') || '';

  const draft = useMemo(() => loadBookingDraft(), []);
  const brandName = draft?.brand?.name || '';
  const modelName = draft?.model?.model_name || '';

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(draft?.issue?.id || null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedService = useMemo(
    () => services.find(s => String(s.id) === String(selectedServiceId)) || null,
    [services, selectedServiceId]
  );

  useEffect(() => {
    if (!modelId) {
      setErrorMsg('Missing model selection. Please go back and select a model.');
      return;
    }

    let mounted = true;
    const load = async () => {
      setErrorMsg('');
      setLoading(true);
      try {
        const rows = await listServicesForModel({ modelId });
        if (!mounted) return;
        setServices(rows || []);
      } catch (e) {
        if (!mounted) return;
        setErrorMsg(e?.message || 'Failed to load services from Supabase. Ensure services table exists.');
        setServices([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [modelId]);

  const onContinue = () => {
    setErrorMsg('');

    if (!draft?.brand?.id || !draft?.brand?.name) {
      setErrorMsg('Missing brand selection. Please restart booking.');
      return;
    }
    if (!draft?.model?.id || !draft?.model?.model_name) {
      setErrorMsg('Missing model selection. Please restart booking.');
      return;
    }
    if (!selectedService) {
      setErrorMsg('Please select an issue.');
      return;
    }

    updateBookingDraft({
      issue: {
        id: selectedService.id,
        name: selectedService.name,
        price: selectedService.price
      }
    });

    navigate('/confirm');
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight">Select issue</h1>
          <Link
            to={draft?.brand?.id ? `/models?brand_id=${encodeURIComponent(draft.brand.id)}` : '/select-brand'}
            className="text-sm font-semibold text-ocean-primary hover:underline"
          >
            Change model
          </Link>
        </div>

        <p className="max-w-3xl text-sm text-ocean-muted">
          Device:{' '}
          <span className="font-semibold text-ocean-text">
            {brandName} {modelName}
          </span>
        </p>
      </div>

      <BookingStepProgress currentStep="issue" />

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold tracking-tight text-ocean-text">Choose a repair</div>
        <div className="text-sm text-ocean-muted">{loading ? 'Loading…' : `${services.length} options`}</div>
      </div>

      {services.length === 0 && !loading ? (
        <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-ocean-muted shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          No services found for this model. Add rows to <code className="font-mono">services</code> in Supabase.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(s => (
          <ServiceCard
            key={s.id}
            name={s.name}
            price={s.price}
            active={String(selectedServiceId) === String(s.id)}
            onClick={() => setSelectedServiceId(s.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => (draft?.model?.id ? navigate(`/models?brand_id=${encodeURIComponent(draft.brand.id)}`) : navigate('/select-brand'))}
        >
          Back
        </Button>

        <Button onClick={onContinue} disabled={!selectedService}>
          Continue
        </Button>
      </div>
    </div>
  );
}
