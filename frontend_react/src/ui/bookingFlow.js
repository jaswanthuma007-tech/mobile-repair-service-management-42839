import React from 'react';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

const STEPS = [
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'issue', label: 'Issue' },
  { key: 'confirm', label: 'Confirm' }
];

function isStepComplete(stepKey, currentKey) {
  const currentIdx = STEPS.findIndex(s => s.key === currentKey);
  const idx = STEPS.findIndex(s => s.key === stepKey);
  return idx < currentIdx;
}

function isStepActive(stepKey, currentKey) {
  return stepKey === currentKey;
}

// PUBLIC_INTERFACE
export function BookingStepProgress({ currentStep }) {
  /** Step progress bar for multi-step booking flow. currentStep: brand|model|issue|confirm. */
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
      <div className="flex flex-wrap items-center gap-2">
        {STEPS.map((s, idx) => {
          const complete = isStepComplete(s.key, currentStep);
          const active = isStepActive(s.key, currentStep);

          return (
            <React.Fragment key={s.key}>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'grid h-7 w-7 place-items-center rounded-full border text-xs font-extrabold',
                    complete
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800'
                      : active
                        ? 'border-blue-500/30 bg-blue-500/10 text-blue-800'
                        : 'border-black/10 bg-black/5 text-ocean-muted'
                  )}
                  aria-hidden="true"
                >
                  {idx + 1}
                </span>
                <span className={cn('text-sm font-semibold', active ? 'text-ocean-text' : 'text-ocean-muted')}>
                  {s.label}
                </span>
              </div>

              {idx < STEPS.length - 1 ? (
                <span className="hidden h-px flex-1 bg-black/10 sm:block" aria-hidden="true" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function BrandCard({ name, logoUrl, active, onClick }) {
  /** Clickable brand card with optional logo image. */
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-4 text-left shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition will-change-transform',
        'hover:-translate-y-0.5 hover:shadow-[0_16px_26px_rgba(17,24,39,0.10)] focus:outline-none focus:ring-4 focus:ring-blue-500/15',
        active ? 'border-blue-500/30 ring-4 ring-blue-500/10' : 'border-black/10'
      )}
      aria-pressed={active ? 'true' : 'false'}
    >
      <span
        className={cn(
          'grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border bg-ocean-bg text-sm font-black text-ocean-text',
          active ? 'border-blue-500/20 bg-blue-500/10 text-blue-800' : 'border-black/10'
        )}
        aria-hidden="true"
      >
        {logoUrl ? (
          <img src={logoUrl} alt="" className="h-full w-full object-contain p-2" loading="lazy" />
        ) : (
          <span className="select-none">{String(name || '?').slice(0, 2).toUpperCase()}</span>
        )}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold tracking-tight text-ocean-text">{name}</span>
        <span className="block text-xs text-ocean-muted">Tap to continue</span>
      </span>

      <span className="ml-auto text-xs font-semibold text-ocean-muted transition group-hover:text-ocean-text">Select</span>
    </button>
  );
}
