import React, { useEffect, useMemo, useState } from 'react';
import '../ui/theme.css';
import { Button, TextField } from '../ui/components';
import RepairsList from '../ui/RepairsList';
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
        const changed = repairFromRealtimePayload(payload);
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
    <div style={{ display: 'grid', gap: 14 }}>
      <div>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>Admin</h1>
        <div style={{ color: 'var(--ocean-muted)', maxWidth: 980 }}>
          Operational overview. Live updates come from Supabase Realtime on <code>public.repairs</code>.
        </div>
      </div>

      {errorMsg ? <div className="alert">{errorMsg}</div> : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12
        }}
      >
        <div className="card" style={{ width: 'auto' }}>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>Total</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{stats.total}</div>
          </div>
        </div>
        <div className="card" style={{ width: 'auto' }}>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>Requested</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{stats.requested}</div>
          </div>
        </div>
        <div className="card" style={{ width: 'auto' }}>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>Assigned</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{stats.assigned}</div>
          </div>
        </div>
        <div className="card" style={{ width: 'auto' }}>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>In progress</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{stats.in_progress}</div>
          </div>
        </div>
        <div className="card" style={{ width: 'auto' }}>
          <div className="cardBody">
            <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>Completed</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{stats.completed}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1.2fr) minmax(320px, 0.8fr)', gap: 14 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>All repairs</h2>
            <div style={{ color: 'var(--ocean-muted)', fontSize: 13 }}>{loading ? 'Loading…' : null}</div>
          </div>

          <RepairsList
            repairs={repairs}
            selectedId={selectedId}
            onSelect={setSelectedId}
            actionSlot={r => (
              <span style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>
                {r.technician_id ? `Tech: ${r.technician_id}` : 'Unassigned'}
              </span>
            )}
          />
        </div>

        <div className="card" style={{ width: 'auto' }}>
          <h2 className="cardTitle">Actions</h2>
          <div className="cardBody" style={{ gap: 10 }}>
            {!selectedRepair ? (
              <div style={{ color: 'var(--ocean-muted)' }}>Select a repair to manage.</div>
            ) : (
              <>
                <div style={{ display: 'grid', gap: 4 }}>
                  <div style={{ fontWeight: 900 }}>{selectedRepair.device || 'Device'}</div>
                  <div style={{ color: 'var(--ocean-muted)' }}>{selectedRepair.issue || '—'}</div>
                  <div style={{ fontSize: 14 }}>
                    <span style={{ color: 'var(--ocean-muted)' }}>Status:</span>{' '}
                    <span style={{ fontWeight: 800 }}>{selectedRepair.status}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--ocean-border)', paddingTop: 10, display: 'grid', gap: 10 }}>
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

                <div style={{ borderTop: '1px solid var(--ocean-border)', paddingTop: 10, display: 'grid', gap: 8 }}>
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

                <div style={{ color: 'var(--ocean-muted)', fontSize: 12 }}>
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
