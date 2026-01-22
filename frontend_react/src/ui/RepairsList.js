import React from 'react';
import { Button } from './components';
import './theme.css';

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

function statusPillStyle(status) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: '1px solid rgba(17,24,39,0.12)'
  };

  const map = {
    requested: { background: 'rgba(37,99,235,0.10)', color: '#1d4ed8', borderColor: 'rgba(37,99,235,0.22)' },
    assigned: { background: 'rgba(245,158,11,0.16)', color: '#92400e', borderColor: 'rgba(245,158,11,0.28)' },
    in_progress: { background: 'rgba(37,99,235,0.10)', color: '#1d4ed8', borderColor: 'rgba(37,99,235,0.22)' },
    completed: { background: 'rgba(16,185,129,0.14)', color: '#065f46', borderColor: 'rgba(16,185,129,0.26)' },
    cancelled: { background: 'rgba(239,68,68,0.10)', color: '#991b1b', borderColor: 'rgba(239,68,68,0.26)' }
  };

  return { ...base, ...(map[status] || {}) };
}

// PUBLIC_INTERFACE
export default function RepairsList({ repairs, selectedId, onSelect, actionSlot }) {
  /** List UI for repairs with selection support. */
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {(repairs || []).length === 0 ? (
        <div className="card" style={{ width: 'auto' }}>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)' }}>No repairs yet.</div>
          </div>
        </div>
      ) : null}

      {(repairs || []).map(r => (
        <div
          key={r.id}
          className="card"
          style={{
            width: 'auto',
            borderColor: r.id === selectedId ? 'rgba(37,99,235,0.28)' : 'var(--ocean-border)',
            boxShadow: r.id === selectedId ? '0 10px 24px rgba(37, 99, 235, 0.16)' : 'var(--ocean-shadow)'
          }}
        >
          <div className="cardBody" style={{ gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{r.device || 'Device'}</div>
                <div style={{ color: 'var(--ocean-muted)', fontSize: 13, marginTop: 2, wordBreak: 'break-word' }}>
                  {r.issue || '—'}
                </div>
              </div>

              <div style={statusPillStyle(r.status)}>{String(r.status || 'requested').replaceAll('_', ' ')}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>
                {r.created_at ? `Created: ${formatDate(r.created_at)}` : null}
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {actionSlot ? actionSlot(r) : null}
                <Button variant="secondary" onClick={() => onSelect?.(r.id)} disabled={!onSelect}>
                  {r.id === selectedId ? 'Selected' : 'View'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
