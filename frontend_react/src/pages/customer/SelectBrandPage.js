import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listBrands } from '../../lib/catalogApi';
import { clearBookingDraft, updateBookingDraft } from '../../lib/bookingSession';
import { Alert, Button } from '../../ui/tw';
import { BookingStepProgress, BrandCard } from '../../ui/bookingFlow';

const FALLBACK_BRANDS = [
  { id: 'fallback-apple', name: 'Apple', logo_url: null },
  { id: 'fallback-samsung', name: 'Samsung', logo_url: null },
  { id: 'fallback-xiaomi', name: 'Xiaomi (Mi)', logo_url: null },
  { id: 'fallback-realme', name: 'Realme', logo_url: null },
  { id: 'fallback-oneplus', name: 'OnePlus', logo_url: null },
  { id: 'fallback-oppo', name: 'Oppo', logo_url: null },
  { id: 'fallback-vivo', name: 'Vivo', logo_url: null }
];

// PUBLIC_INTERFACE
export default function SelectBrandPage() {
  /** Step 1: Choose a brand (from Supabase brands table when available). */
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedBrand = useMemo(() => brands.find(b => b.id === selectedBrandId) || null, [brands, selectedBrandId]);

  useEffect(() => {
    // Reset flow when entering brand step.
    clearBookingDraft();

    let mounted = true;
    const load = async () => {
      setErrorMsg('');
      setLoading(true);
      try {
        const rows = await listBrands();
        if (!mounted) return;
        setBrands(rows?.length ? rows : FALLBACK_BRANDS);
      } catch (e) {
        if (!mounted) return;
        // If brands table isn't present yet, fall back to static list.
        setBrands(FALLBACK_BRANDS);
        setErrorMsg(e?.message ? `Using fallback brands (Supabase: ${e.message})` : 'Using fallback brands.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const onContinue = () => {
    if (!selectedBrand) return;
    updateBookingDraft({
      brand: { id: selectedBrand.id, name: selectedBrand.name, logo_url: selectedBrand.logo_url },
      model: null,
      issue: null
    });
    navigate(`/select-model?brand=${encodeURIComponent(selectedBrand.name)}&brand_id=${encodeURIComponent(selectedBrand.id)}`);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <h1 className="text-2xl font-black tracking-tight">Book a repair</h1>
        <p className="max-w-3xl text-sm text-ocean-muted">
          Choose your device brand to get started. We’ll guide you through model, issue, and confirmation.
        </p>
      </div>

      <BookingStepProgress currentStep="brand" />

      {errorMsg ? <Alert variant="info">{errorMsg}</Alert> : null}

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold tracking-tight text-ocean-text">Select a brand</div>
        <div className="text-sm text-ocean-muted">{loading ? 'Loading…' : `${brands.length} brands`}</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map(b => (
          <BrandCard
            key={b.id}
            name={b.name}
            logoUrl={b.logo_url || null}
            active={selectedBrandId === b.id}
            onClick={() => setSelectedBrandId(b.id)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-ocean-muted">
          {selectedBrand ? (
            <>
              Selected: <span className="font-semibold text-ocean-text">{selectedBrand.name}</span>
            </>
          ) : (
            'No brand selected'
          )}
        </div>

        <Button onClick={onContinue} disabled={!selectedBrand}>
          Continue
        </Button>
      </div>
    </div>
  );
}
