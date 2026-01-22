import React, { useEffect, useMemo, useState } from 'react';
import '../ui/theme.css';
import { Button, Card, TextField } from '../ui/components';
import RepairsList from '../ui/RepairsList';
import {
  createRepair,
  getRepairById,
  listCustomerRepairs,
  repairFromRealtimePayload,
  subscribeToRepairChanges
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
export default function CustomerPage() {
  /** Customer dashboard: create booking and track repair status in realtime. */
  const { user } = useAuth();

  const customerId = user?.id;

  const [repairs, setRepairs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const selectedRepair = useMemo(() => repairs.find(r => r.id === selectedId) || null, [repairs, selectedId]);

  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');

  const [loadingList, setLoadingList] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

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
        setSelectedId(rows[0]?.id ?? null);
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
    // Subscribe to all repair changes and filter client-side by customer_id for simplicity.
    // In production, use RLS policies to ensure users only receive events they are allowed to see.
    if (!customerId) return;

    const unsubscribe = subscribeToRepairChanges({
      onChange: payload => {
        const changed = repairFromRealtimePayload(payload);
        if (!changed) return;
        if (changed.customer_id !== customerId) return;
        setRepairs(prev => mergeRepair(prev, changed));
      }
    });

    return unsubscribe;
  }, [customerId]);

  const refreshDetail = async repairId => {
    if (!repairId) return;
    setLoadingDetail(true);
    setErrorMsg('');
    try {
      const fresh = await getRepairById(repairId);
      setRepairs(prev => mergeRepair(prev, fresh));
    } catch (e) {
      setErrorMsg(e?.message || 'Failed to load repair details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const onCreate = async e => {
    e.preventDefault();
    if (!customerId) return;
    setErrorMsg('');
    setInfoMsg('');
    setLoadingCreate(true);
    try {
      const created = await createRepair({ customerId, device, issue });
      setRepairs(prev => [created, ...prev]);
      setSelectedId(created.id);
      setDevice('');
      setIssue('');
      setInfoMsg('Booking created. You will receive realtime status updates here.');
    } catch (e2) {
      setErrorMsg(e2?.message || 'Failed to create booking.');
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>Customer</h1>
        <div style={{ color: 'var(--ocean-muted)', maxWidth: 840 }}>
          Create a repair booking and track its status. This page subscribes to Supabase Realtime changes on the{' '}
          <code>repairs</code> table.
        </div>
      </div>

      {errorMsg ? <div className="alert">{errorMsg}</div> : null}
      {infoMsg ? (
        <div
          className="alert"
          style={{
            borderColor: 'rgba(37,99,235,0.22)',
            background: 'rgba(37,99,235,0.08)',
            color: '#1d4ed8'
          }}
        >
          {infoMsg}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)', gap: 14 }}>
        <Card
          title="Create booking"
          footer={<span style={{ color: 'var(--ocean-muted)' }}>Bookings are tied to your Supabase user id.</span>}
        >
          <form onSubmit={onCreate} style={{ display: 'grid', gap: 12 }}>
            <TextField
              label="Device"
              value={device}
              onChange={setDevice}
              placeholder="e.g., iPhone 13, Samsung S22"
              autoComplete="off"
            />
            <TextField
              label="Issue"
              value={issue}
              onChange={setIssue}
              placeholder="Describe the problem (screen cracked, battery, etc.)"
              autoComplete="off"
            />

            <Button type="submit" disabled={loadingCreate || loadingList}>
              {loadingCreate ? 'Creating…' : 'Create booking'}
            </Button>
          </form>
        </Card>

        <div className="card" style={{ width: 'auto' }}>
          <h2 className="cardTitle">Selected repair</h2>
          <div className="cardBody" style={{ gap: 10 }}>
            {!selectedRepair ? (
              <div style={{ color: 'var(--ocean-muted)' }}>Select a repair from the list to view details.</div>
            ) : (
              <>
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{selectedRepair.device || 'Device'}</div>
                  <div style={{ color: 'var(--ocean-muted)' }}>{selectedRepair.issue || '—'}</div>
                </div>

                <div style={{ display: 'grid', gap: 4, fontSize: 14 }}>
                  <div>
                    <span style={{ color: 'var(--ocean-muted)' }}>Status:</span>{' '}
                    <span style={{ fontWeight: 700 }}>{selectedRepair.status || 'requested'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ocean-muted)' }}>Technician:</span>{' '}
                    <span style={{ fontWeight: 700 }}>{selectedRepair.technician_id || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--ocean-muted)' }}>Repair ID:</span>{' '}
                    <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                      {selectedRepair.id}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    variant="secondary"
                    onClick={() => refreshDetail(selectedRepair.id)}
                    disabled={loadingDetail}
                  >
                    {loadingDetail ? 'Refreshing…' : 'Refresh'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Your repairs</h2>
          <div style={{ color: 'var(--ocean-muted)', fontSize: 13 }}>{loadingList ? 'Loading…' : null}</div>
        </div>

        <RepairsList repairs={repairs} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
