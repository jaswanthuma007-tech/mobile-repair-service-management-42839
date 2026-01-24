import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from '../ui/tw';
import { listCustomerRepairs, repairFromRealtimePayload, subscribeToRepairChanges } from '../lib/repairsApi';
import { useAuth } from '../auth/AuthContext';

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
  const normalized = String(status || '').toLowerCase();

  const map = {
    booked: 'bg-blue-500/10 text-blue-800 border-blue-500/25',
    requested: 'bg-blue-500/10 text-blue-800 border-blue-500/25',
    assigned: 'bg-amber-500/15 text-amber-900 border-amber-500/25',
    in_progress: 'bg-blue-500/10 text-blue-800 border-blue-500/25',
    completed: 'bg-emerald-500/15 text-emerald-900 border-emerald-500/25',
    cancelled: 'bg-red-500/10 text-red-800 border-red-500/25'
  };

  return map[normalized] || 'bg-black/5 text-ocean-text border-black/10';
}

function normalizeStatusLabel(status) {
  const s = String(status || 'requested');
  // Preserve "Booked" capitalization if stored that way, but normalize underscores.
  return s.replaceAll('_', ' ');
}

function mergeRepair(list, updated) {
  const idx = list.findIndex(r => r.id === updated.id);
  if (idx === -1) return [updated, ...list];
  const next = [...list];
  next[idx] = { ...next[idx], ...updated };
  return next;
}

function getBrandInitials(brand) {
  const b = String(brand || '').trim();
  if (!b) return '?';
  return b.slice(0, 2).toUpperCase();
}

function RepairRow({ repair, onViewDetails }) {
  const brand = repair.brand || (repair.device ? repair.device.split(' ')[0] : '');
  const model = repair.model || (repair.device ? repair.device.replace(`${brand} `, '') : repair.device);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-black/10 bg-ocean-bg text-sm font-black text-ocean-text">
            {getBrandInitials(brand)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-base font-extrabold tracking-tight text-ocean-text">
              {brand ? `${brand} ` : ''}
              {model || repair.device || 'Device'}
            </div>
            <div className="mt-1 line-clamp-2 break-words text-sm text-ocean-muted">{repair.issue || '—'}</div>
            <div className="mt-2 text-xs text-ocean-muted">{repair.created_at ? `Created: ${formatDate(repair.created_at)}` : null}</div>
          </div>
        </div>

        <div
          className={[
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold',
            statusTone(repair.status)
          ].join(' ')}
        >
          {normalizeStatusLabel(repair.status)}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
        <div className="text-xs text-ocean-muted">
          Ticket: <span className="font-mono font-semibold">{repair.id}</span>
        </div>
        <Button variant="secondary" onClick={() => onViewDetails(repair)}>
          View Details
        </Button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function CustomerPage() {
  /** Customer dashboard: start multi-step booking flow and view repair history with realtime updates. */
  const { user } = useAuth();
  const navigate = useNavigate();

  const customerId = user?.id;

  const [repairs, setRepairs] = useState([]);
  const [selectedRepair, setSelectedRepair] = useState(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const stats = useMemo(() => {
    const s = { total: repairs.length, booked: 0, in_progress: 0, completed: 0 };
    for (const r of repairs) {
      const key = String(r.status || '').toLowerCase();
      if (key === 'booked') s.booked += 1;
      if (key === 'in_progress') s.in_progress += 1;
      if (key === 'completed') s.completed += 1;
    }
    return s;
  }, [repairs]);

  useEffect(() => {
    if (!customerId) return;

    let mounted = true;
    const load = async () => {
      setErrorMsg('');
      setLoadingList(true);
      try {
        const rows = await listCustomerRepairs({ customerId });
        if (!mounted) return;
        setRepairs(rows);
      } catch (e) {
        if (!mounted) return;
        setErrorMsg(e?.message || 'Failed to load repairs.');
      } finally {
        if (mounted) setLoadingList(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;

    const unsubscribe = subscribeToRepairChanges({
      onChange: payload => {
        const eventType = payload?.eventType;
        const nextRow = payload?.new ?? null;
        const oldRow = payload?.old ?? null;

        if (eventType === 'DELETE') {
          const removed = repairFromRealtimePayload({ old: oldRow });
          if (!removed) return;
          if (removed.customer_id !== customerId) return;
          setRepairs(prev => prev.filter(r => r.id !== removed.id));
          return;
        }

        const changed = repairFromRealtimePayload({ new: nextRow });
        if (!changed) return;
        if (changed.customer_id !== customerId) return;

        setRepairs(prev => mergeRepair(prev, changed));
      }
    });

    return unsubscribe;
  }, [customerId]);

  const onViewDetails = async repair => {
    setSelectedRepair(null);
    setLoadingDetail(true);
    try {
      // In this frontend template we already have all fields needed for details.
      // Keep this local and lightweight.
      setSelectedRepair(repair);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Customer Portal</h1>
          <div className="mt-2 max-w-3xl text-sm text-ocean-muted">
            Book a repair in 4 quick steps and track all tickets here. Live updates come from Supabase Realtime on{' '}
            <code className="rounded-lg border border-black/10 bg-black/5 px-2 py-0.5 font-mono text-xs">public.repairs</code>.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/select-brand">
            <Button>New booking</Button>
          </Link>
          <Link to="/track">
            <Button variant="secondary">Track by ticket</Button>
          </Link>
        </div>
      </div>

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total', stats.total],
          ['Booked', stats.booked],
          ['In progress', stats.in_progress],
          ['Completed', stats.completed]
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_20px_rgba(17,24,39,0.06)]"
          >
            <div className="text-xs font-bold uppercase tracking-wide text-ocean-muted">{label}</div>
            <div className="mt-1 text-2xl font-black">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold tracking-tight">Your repairs</h2>
            <div className="text-sm text-ocean-muted">{loadingList ? 'Loading…' : null}</div>
          </div>

          <div className="grid gap-3">
            {repairs.length === 0 && !loadingList ? (
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
                <div className="text-sm font-extrabold tracking-tight text-ocean-text">No repairs yet</div>
                <div className="mt-1 text-sm text-ocean-muted">Start a booking to create your first ticket.</div>
                <div className="mt-4">
                  <Button onClick={() => navigate('/select-brand')}>Book now</Button>
                </div>
              </div>
            ) : null}

            {repairs.map(r => (
              <RepairRow key={r.id} repair={r} onViewDetails={onViewDetails} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <h2 className="text-lg font-extrabold tracking-tight">View details</h2>
          <div className="mt-3 grid gap-3">
            {loadingDetail ? <div className="text-sm text-ocean-muted">Loading…</div> : null}

            {!selectedRepair ? (
              <div className="text-sm text-ocean-muted">Select “View Details” on a ticket to see information here.</div>
            ) : (
              <>
                <div className="grid gap-1">
                  <div className="text-base font-extrabold tracking-tight text-ocean-text">
                    {(selectedRepair.brand || '') + ' ' + (selectedRepair.model || selectedRepair.device || 'Device')}
                  </div>
                  <div className="text-sm text-ocean-muted">{selectedRepair.issue || '—'}</div>
                </div>

                <div className="grid gap-2 text-sm">
                  <div>
                    <span className="font-semibold text-ocean-muted">Status:</span>{' '}
                    <span className="font-semibold text-ocean-text">{normalizeStatusLabel(selectedRepair.status)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-ocean-muted">Technician:</span>{' '}
                    <span className="font-semibold text-ocean-text">{selectedRepair.technician_id || 'Unassigned'}</span>
                  </div>
                  <div className="break-all">
                    <span className="font-semibold text-ocean-muted">Ticket:</span>{' '}
                    <span className="font-mono text-xs font-semibold">{selectedRepair.id}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link to={`/track?ticket=${encodeURIComponent(selectedRepair.id)}`}>
                    <Button variant="secondary">Open tracking</Button>
                  </Link>
                </div>

                <div className="text-xs text-ocean-muted">
                  Tip: tracking page also listens for realtime updates while open.
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-ocean-muted">
        Signed in as <span className="font-semibold text-ocean-text">{user?.email || 'Unknown'}</span>
      </div>
    </div>
  );
}
