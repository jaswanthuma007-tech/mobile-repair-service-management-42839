import React from 'react';
import { Button } from './tw';

function formatDate(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  } catch {
    return String(value);
  }
}

function statusTone(status) {
  const map = {
    requested: 'bg-blue-500/10 text-blue-800 border-blue-500/25',
    assigned: 'bg-amber-500/15 text-amber-900 border-amber-500/25',
    in_progress: 'bg-blue-500/10 text-blue-800 border-blue-500/25',
    completed: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/25',
    cancelled: 'bg-red-500/10 text-red-800 border-red-500/25'
  };
  return map[status] || 'bg-black/5 text-ocean-text border-black/10';
}

// PUBLIC_INTERFACE
export default function RepairsList({ repairs, selectedId, onSelect, actionSlot }) {
  /** List UI for repairs with selection support. */
  const items = repairs || [];

  return (
    <div className="grid gap-3">
      {items.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <div className="text-sm text-ocean-muted">No repairs yet.</div>
        </div>
      ) : null}

      {items.map(r => {
        const active = r.id === selectedId;
        return (
          <div
            key={r.id}
            className={[
              'rounded-2xl border bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)] transition',
              active ? 'border-blue-500/30 shadow-[0_18px_30px_rgba(37,99,235,0.14)]' : 'border-black/10'
            ].join(' ')}
          >
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-base font-extrabold tracking-tight">{r.device || 'Device'}</div>
                  <div className="mt-1 break-words text-sm text-ocean-muted">{r.issue || '—'}</div>
                </div>
                <div
                  className={[
                    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold',
                    statusTone(r.status)
                  ].join(' ')}
                >
                  {String(r.status || 'requested').replaceAll('_', ' ')}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-ocean-muted">{r.created_at ? `Created: ${formatDate(r.created_at)}` : null}</div>

                <div className="flex items-center gap-2">
                  {actionSlot ? <div className="text-xs text-ocean-muted">{actionSlot(r)}</div> : null}
                  <Button variant="secondary" onClick={() => onSelect?.(r.id)} disabled={!onSelect}>
                    {active ? 'Selected' : 'View'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
