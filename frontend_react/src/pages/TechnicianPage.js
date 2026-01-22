import React, { useEffect, useMemo, useState } from 'react';
import RepairsList from '../ui/RepairsList';
import { Alert, Button } from '../ui/tw';
import {
  listTechnicianRepairs,
  repairFromRealtimePayload,
  subscribeToRepairChanges,
  updateRepairStatus
} from '../lib/repairsApi';
import { useAuth } from '../auth/AuthContext';

function mergeRepair(list, updated) {
  const idx = list.findIndex(r => r.id === updated.id);
  if (idx === -1) return [updated, ...list];
  const next = [...list];
  next[idx] = { ...next[idx], ...updated };
  return next;
}

// PUBLIC_INTERFACE
export default function TechnicianPage() {
  /** Technician dashboard: view assigned repairs and update their status (realtime). */
  const { user } = useAuth();
  const technicianId = user?.id;

  const [repairs, setRepairs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const selectedRepair = useMemo(() => repairs.find(r => r.id === selectedId) || null, [repairs, selectedId]);

  const [loadingList, setLoadingList] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!technicianId) return;
    let mounted = true;

    const load = async () => {
      setErrorMsg('');
      setLoadingList(true);
      try {
        const rows = await listTechnicianRepairs({ technicianId });
        if (!mounted) return;
        setRepairs(rows);
        setSelectedId(rows[0]?.id ?? null);
      } catch (e) {
        if (!mounted) return;
        setErrorMsg(e?.message || 'Failed to load assigned repairs.');
      } finally {
        if (mounted) setLoadingList(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [technicianId]);

  useEffect(() => {
    if (!technicianId) return;

    const unsubscribe = subscribeToRepairChanges({
      onChange: payload => {
        const eventType = payload?.eventType;
        const nextRow = payload?.new ?? null;
        const oldRow = payload?.old ?? null;

        if (eventType === 'DELETE') {
          const removed = repairFromRealtimePayload({ old: oldRow });
          if (!removed) return;
          setRepairs(prev => prev.filter(r => r.id !== removed.id));
          return;
        }

        const changed = repairFromRealtimePayload({ new: nextRow });
        const oldNorm = oldRow ? repairFromRealtimePayload({ old: oldRow }) : null;

        const wasMine = oldNorm?.technician_id === technicianId;
        const isMine = changed?.technician_id === technicianId;

        if (isMine && changed) {
          setRepairs(prev => mergeRepair(prev, changed));
          return;
        }

        if (wasMine && !isMine && oldNorm) {
          setRepairs(prev => prev.filter(r => r.id !== oldNorm.id));
        }
      }
    });

    return unsubscribe;
  }, [technicianId]);

  const setStatus = async status => {
    if (!selectedRepair?.id) return;
    setErrorMsg('');
    setUpdating(true);
    try {
      const updated = await updateRepairStatus({ id: selectedRepair.id, status });
      setRepairs(prev => mergeRepair(prev, updated));
    } catch (e) {
      setErrorMsg(e?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Technician</h1>
        <div className="mt-2 max-w-3xl text-sm text-ocean-muted">
          Your assigned jobs. This page subscribes to Supabase Realtime changes and updates the list instantly.
        </div>
      </div>

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold tracking-tight">Assigned to you</h2>
            <div className="text-sm text-ocean-muted">{loadingList ? 'Loading…' : null}</div>
          </div>

          <RepairsList repairs={repairs} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <h2 className="text-lg font-extrabold tracking-tight">Update status</h2>
          <div className="mt-3 grid gap-3">
            {!selectedRepair ? (
              <div className="text-sm text-ocean-muted">Select a repair to update.</div>
            ) : (
              <>
                <div className="grid gap-1">
                  <div className="text-base font-extrabold tracking-tight">{selectedRepair.device || 'Device'}</div>
                  <div className="text-sm text-ocean-muted">{selectedRepair.issue || '—'}</div>
                  <div className="text-sm">
                    <span className="font-semibold text-ocean-muted">Current:</span>{' '}
                    <span className="font-semibold text-ocean-text">{selectedRepair.status}</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Button variant="secondary" onClick={() => setStatus('in_progress')} disabled={updating}>
                    Mark in progress
                  </Button>
                  <Button variant="secondary" onClick={() => setStatus('completed')} disabled={updating}>
                    Mark completed
                  </Button>
                  <Button variant="secondary" onClick={() => setStatus('cancelled')} disabled={updating}>
                    Cancel
                  </Button>
                </div>

                <div className="text-xs text-ocean-muted">
                  Note: ensure your Supabase RLS policies allow technicians to update status for their assigned repairs.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
