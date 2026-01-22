import React, { useEffect, useMemo, useState } from 'react';
import RepairsList from '../ui/RepairsList';
import { Alert, Button, TextField } from '../ui/tw';
import {
  assignRepair,
  listAllRepairs,
  repairFromRealtimePayload,
  subscribeToRepairChanges,
  updateRepairStatus
} from '../lib/repairsApi';

function mergeRepair(list, updated) {
  const idx = list.findIndex(r => r.id === updated.id);
  if (idx === -1) return [updated, ...list];
  const next = [...list];
  next[idx] = { ...next[idx], ...updated };
  return next;
}

// PUBLIC_INTERFACE
export default function AdminPage() {
  /** Admin dashboard: overview of all repairs, with realtime updates. */
  const [repairs, setRepairs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const selectedRepair = useMemo(() => repairs.find(r => r.id === selectedId) || null, [repairs, selectedId]);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [assignTechnicianId, setAssignTechnicianId] = useState('');

  const stats = useMemo(() => {
    const s = { total: repairs.length, requested: 0, assigned: 0, in_progress: 0, completed: 0, cancelled: 0 };
    for (const r of repairs) {
      const key = r.status || 'requested';
      if (s[key] !== undefined) s[key] += 1;
    }
    return s;
  }, [repairs]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setErrorMsg('');
      setLoading(true);
      try {
        const rows = await listAllRepairs();
        if (!mounted) return;
        setRepairs(rows);
        setSelectedId(rows[0]?.id ?? null);
      } catch (e) {
        if (!mounted) return;
        setErrorMsg(e?.message || 'Failed to load repairs.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToRepairChanges({
      onChange: payload => {
        const eventType = payload?.eventType;
        if (eventType === 'DELETE') {
          const removed = repairFromRealtimePayload({ old: payload?.old ?? null });
          if (!removed) return;
          setRepairs(prev => prev.filter(r => r.id !== removed.id));
          return;
        }

        const changed = repairFromRealtimePayload({ new: payload?.new ?? null });
        if (!changed) return;
        setRepairs(prev => mergeRepair(prev, changed));
      }
    });

    return unsubscribe;
  }, []);

  const doAssign = async () => {
    if (!selectedRepair?.id) return;
    if (!assignTechnicianId.trim()) {
      setErrorMsg('Enter a technician user id to assign.');
      return;
    }
    setErrorMsg('');
    setBusy(true);
    try {
      const updated = await assignRepair({ id: selectedRepair.id, technicianId: assignTechnicianId.trim() });
      setRepairs(prev => mergeRepair(prev, updated));
    } catch (e) {
      setErrorMsg(e?.message || 'Failed to assign repair.');
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async status => {
    if (!selectedRepair?.id) return;
    setErrorMsg('');
    setBusy(true);
    try {
      const updated = await updateRepairStatus({ id: selectedRepair.id, status });
      setRepairs(prev => mergeRepair(prev, updated));
    } catch (e) {
      setErrorMsg(e?.message || 'Failed to update status.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Admin</h1>
        <div className="mt-2 max-w-4xl text-sm text-ocean-muted">
          Operational overview. Live updates come from Supabase Realtime on{' '}
          <code className="rounded-lg border border-black/10 bg-black/5 px-2 py-0.5 font-mono text-xs">public.repairs</code>.
        </div>
      </div>

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['Total', stats.total],
          ['Requested', stats.requested],
          ['Assigned', stats.assigned],
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
            <h2 className="text-lg font-extrabold tracking-tight">All repairs</h2>
            <div className="text-sm text-ocean-muted">{loading ? 'Loading…' : null}</div>
          </div>

          <RepairsList
            repairs={repairs}
            selectedId={selectedId}
            onSelect={setSelectedId}
            actionSlot={r => (
              <span className="text-xs text-ocean-muted">{r.technician_id ? `Tech: ${r.technician_id}` : 'Unassigned'}</span>
            )}
          />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <h2 className="text-lg font-extrabold tracking-tight">Actions</h2>
          <div className="mt-3 grid gap-3">
            {!selectedRepair ? (
              <div className="text-sm text-ocean-muted">Select a repair to manage.</div>
            ) : (
              <>
                <div className="grid gap-1">
                  <div className="text-base font-extrabold tracking-tight">{selectedRepair.device || 'Device'}</div>
                  <div className="text-sm text-ocean-muted">{selectedRepair.issue || '—'}</div>
                  <div className="text-sm">
                    <span className="font-semibold text-ocean-muted">Status:</span>{' '}
                    <span className="font-semibold text-ocean-text">{selectedRepair.status}</span>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-black/10 pt-3">
                  <TextField
                    label="Assign technician id"
                    value={assignTechnicianId}
                    onChange={setAssignTechnicianId}
                    placeholder="Supabase user id of technician"
                    autoComplete="off"
                  />
                  <Button variant="secondary" onClick={doAssign} disabled={busy}>
                    {busy ? 'Working…' : 'Assign'}
                  </Button>
                </div>

                <div className="grid gap-2 border-t border-black/10 pt-3">
                  <Button variant="secondary" onClick={() => setStatus('assigned')} disabled={busy}>
                    Mark assigned
                  </Button>
                  <Button variant="secondary" onClick={() => setStatus('in_progress')} disabled={busy}>
                    Mark in progress
                  </Button>
                  <Button variant="secondary" onClick={() => setStatus('completed')} disabled={busy}>
                    Mark completed
                  </Button>
                  <Button variant="secondary" onClick={() => setStatus('cancelled')} disabled={busy}>
                    Cancel
                  </Button>
                </div>

                <div className="text-xs text-ocean-muted">
                  Note: admin assignment/status changes require appropriate Supabase RLS policies.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
