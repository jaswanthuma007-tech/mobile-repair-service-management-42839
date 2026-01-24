import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { listModelsForBrand } from '../../lib/catalogApi';
import { loadBookingDraft, updateBookingDraft } from '../../lib/bookingSession';
import { Alert, Button, TextField } from '../../ui/tw';
import { BookingStepProgress } from '../../ui/bookingFlow';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function ModelCard({ name, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-4 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition',
        'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)] focus:outline-none focus:ring-4 focus:ring-blue-500/15',
        active ? 'border-blue-500/30 ring-4 ring-blue-500/10' : 'border-black/10'
      )}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-extrabold tracking-tight text-ocean-text">{name}</div>
        <div className="text-xs text-ocean-muted">Tap to continue</div>
      </div>
      <div className={cn('rounded-full border px-3 py-1 text-xs font-bold', active ? 'border-blue-500/25 bg-blue-500/10 text-blue-800' : 'border-black/10 bg-black/5 text-ocean-muted')}>
        Select
      </div>
    </button>
  );
}

// PUBLIC_INTERFACE
export default function SelectModelPage() {
  /** Step 2: Choose model (fetched from Supabase device_models). */
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const brandFromQuery = params.get('brand') || '';
  const brandId = params.get('brand_id') || null;

  const draft = useMemo(() => loadBookingDraft(), []);
  const draftBrandName = draft?.brand?.name || '';
  const brandName = brandFromQuery || draftBrandName;

  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedModel = useMemo(() => models.find(m => m.id === selectedModelId) || null, [models, selectedModelId]);

  const filteredModels = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return models;
    return models.filter(m => String(m.model_name || '').toLowerCase().includes(q));
  }, [models, search]);

  useEffect(() => {
    if (!brandName) {
      setErrorMsg('Missing brand selection. Please go back and select a brand.');
      return;
    }

    let mounted = true;
    const load = async () => {
      setErrorMsg('');
      setLoading(true);
      try {
        const rows = await listModelsForBrand({ brandId, brandName });
        if (!mounted) return;
        setModels(rows || []);
      } catch (e) {
        if (!mounted) return;
        setErrorMsg(e?.message || 'Failed to load models from Supabase. Ensure device_models table exists.');
        setModels([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [brandId, brandName]);

  const onContinue = () => {
    if (!selectedModel) return;
    updateBookingDraft({
      brand: draft?.brand?.name ? draft.brand : { id: brandId, name: brandName, logo_url: null },
      model: { id: selectedModel.id, model_name: selectedModel.model_name },
      issue: null
    });
    navigate('/select-issue');
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight">Select model</h1>
          <Link to="/select-brand" className="text-sm font-semibold text-ocean-primary hover:underline">
            Change brand
          </Link>
        </div>
        <p className="max-w-3xl text-sm text-ocean-muted">
          Brand:{' '}
          <span className="font-semibold text-ocean-text">{brandName || '—'}</span>
        </p>
      </div>

      <BookingStepProgress currentStep="model" />

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}

      <TextField
        label="Search models"
        value={search}
        onChange={setSearch}
        placeholder="e.g., iPhone 13, Galaxy S22"
        required={false}
        autoComplete="off"
      />

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold tracking-tight text-ocean-text">Choose your device</div>
        <div className="text-sm text-ocean-muted">{loading ? 'Loading…' : `${filteredModels.length} models`}</div>
      </div>

      {models.length === 0 && !loading ? (
        <div className="rounded-2xl border border-black/10 bg-white p-5 text-sm text-ocean-muted shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          No models found for this brand. Add rows to <code className="font-mono">device_models</code> in Supabase.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredModels.map(m => (
          <ModelCard
            key={m.id}
            name={m.model_name}
            active={selectedModelId === m.id}
            onClick={() => setSelectedModelId(m.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate('/select-brand')}>
          Back
        </Button>

        <Button onClick={onContinue} disabled={!selectedModel}>
          Continue
        </Button>
      </div>
    </div>
  );
}
