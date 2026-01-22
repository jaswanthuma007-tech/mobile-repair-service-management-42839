import React, { useEffect, useMemo, useState } from 'react';
import RepairsList from '../ui/RepairsList';
import { Alert, Button, Card, TextField } from '../ui/tw';
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
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Customer</h1>
        <div className="mt-2 max-w-3xl text-sm text-ocean-muted">
          Create a repair booking and track its status. This page subscribes to Supabase Realtime changes on the{' '}
          <code className="rounded-lg border border-black/10 bg-black/5 px-2 py-0.5 font-mono text-xs">repairs</code> table.
        </div>
      </div>

      {errorMsg ? <Alert>{errorMsg}</Alert> : null}
      {infoMsg ? <Alert variant="info">{infoMsg}</Alert> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Create booking" footer={<span>Bookings are tied to your Supabase user id.</span>}>
          <form onSubmit={onCreate} className="grid gap-3">
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

        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_20px_rgba(17,24,39,0.06)]">
          <h2 className="text-lg font-extrabold tracking-tight">Selected repair</h2>
          <div className="mt-3 grid gap-3">
            {!selectedRepair ? (
              <div className="text-sm text-ocean-muted">Select a repair from the list to view details.</div>
            ) : (
              <>
                <div className="grid gap-1">
                  <div className="text-base font-extrabold tracking-tight">{selectedRepair.device || 'Device'}</div>
                  <div className="text-sm text-ocean-muted">{selectedRepair.issue || '—'}</div>
                </div>

                <div className="grid gap-1 text-sm">
                  <div>
                    <span className="font-semibold text-ocean-muted">Status:</span>{' '}
                    <span className="font-semibold text-ocean-text">{selectedRepair.status || 'requested'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-ocean-muted">Technician:</span>{' '}
                    <span className="font-semibold text-ocean-text">{selectedRepair.technician_id || 'Unassigned'}</span>
                  </div>
                  <div className="break-all">
                    <span className="font-semibold text-ocean-muted">Repair ID:</span>{' '}
                    <span className="font-mono text-xs font-semibold">{selectedRepair.id}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => refreshDetail(selectedRepair.id)} disabled={loadingDetail}>
                    {loadingDetail ? 'Refreshing…' : 'Refresh'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold tracking-tight">Your repairs</h2>
          <div className="text-sm text-ocean-muted">{loadingList ? 'Loading…' : null}</div>
        </div>

        <RepairsList repairs={repairs} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
