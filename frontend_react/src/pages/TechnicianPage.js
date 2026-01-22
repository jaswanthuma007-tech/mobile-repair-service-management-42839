import React, { useEffect, useMemo, useState } from 'react';
import '../ui/theme.css';
import { Button } from '../ui/components';
import RepairsList from '../ui/RepairsList';
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

        // If a row is deleted, remove it if it was in our list.
        if (eventType === 'DELETE') {
          const removed = repairFromRealtimePayload({ old: oldRow });
          if (!removed) return;
          setRepairs(prev => prev.filter(r => r.id !== removed.id));
          return;
        }

        // For UPDATE/INSERT, we need to:
        // - add/merge if assigned to me
        // - remove if it was previously assigned to me but no longer is
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
    <div style={{ display: 'grid', gap: 14 }}>
      <div>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>Technician</h1>
        <div style={{ color: 'var(--ocean-muted)', maxWidth: 860 }}>
          Your assigned jobs. This page subscribes to Supabase Realtime changes and updates the list instantly.
        </div>
      </div>

      {errorMsg ? <div className="alert">{errorMsg}</div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1.2fr) minmax(320px, 0.8fr)', gap: 14 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Assigned to you</h2>
            <div style={{ color: 'var(--ocean-muted)', fontSize: 13 }}>{loadingList ? 'Loading…' : null}</div>
          </div>

          <RepairsList repairs={repairs} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        <div className="card" style={{ width: 'auto' }}>
          <h2 className="cardTitle">Update status</h2>
          <div className="cardBody" style={{ gap: 10 }}>
            {!selectedRepair ? (
              <div style={{ color: 'var(--ocean-muted)' }}>Select a repair to update.</div>
            ) : (
              <>
                <div style={{ display: 'grid', gap: 4 }}>
                  <div style={{ fontWeight: 800 }}>{selectedRepair.device || 'Device'}</div>
                  <div style={{ color: 'var(--ocean-muted)' }}>{selectedRepair.issue || '—'}</div>
                  <div style={{ fontSize: 14 }}>
                    <span style={{ color: 'var(--ocean-muted)' }}>Current:</span>{' '}
                    <span style={{ fontWeight: 800 }}>{selectedRepair.status}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
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

                <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>
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
