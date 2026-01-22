import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRepairById, repairFromRealtimePayload, subscribeToRepairChanges } from '../../lib/repairsApi';
import { Alert, Button, Card, Container, Spinner, TextField } from '../../ui/tw';

function statusLabel(s) {
  return String(s || 'requested').replaceAll('_', ' ');
}

// PUBLIC_INTERFACE
export default function TrackRepairPage() {
  /** Public tracking page by ticket id; shows loading/error states and listens for realtime updates. */
  const [params, setParams] = useSearchParams();
  const initialTicket = params.get('ticket') || '';

  const [ticket, setTicket] = useState(initialTicket);
  const [repair, setRepair] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const normalizedTicket = useMemo(() => ticket.trim(), [ticket]);

  const fetchRepair = async id => {
    setErrorMsg('');
    setRepair(null);
    if (!id) {
      setErrorMsg('Enter a ticket ID to track.');
      return;
    }
    setLoading(true);
    try {
      const data = await getRepairById(id);
      setRepair(data);
      setParams(prev => {
        prev.set('ticket', id);
        return prev;
      });
    } catch (e) {
      setErrorMsg(e?.message || 'Ticket not found (or you do not have access).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicket) {
      fetchRepair(initialTicket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!repair?.id) return;

    const unsubscribe = subscribeToRepairChanges({
      repairId: repair.id,
      onChange: payload => {
        const eventType = payload?.eventType;
        if (eventType === 'DELETE') {
          setErrorMsg('This ticket was removed.');
          setRepair(null);
          return;
        }
        const changed = repairFromRealtimePayload(payload);
        if (!changed) return;
        setRepair(prev => ({ ...(prev || {}), ...changed }));
      }
    });

    return unsubscribe;
  }, [repair?.id]);

  return (
    <Container className="py-12">
      <div className="grid gap-2">
        <h1 className="text-3xl font-black tracking-tight">Track Repair</h1>
        <p className="max-w-2xl text-sm text-ocean-muted">Enter your ticket ID to see the current status and updates.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card title="Enter ticket ID">
          <form
            onSubmit={e => {
              e.preventDefault();
              fetchRepair(normalizedTicket);
            }}
            className="grid gap-3"
          >
            <TextField
              label="Ticket ID"
              value={ticket}
              onChange={setTicket}
              placeholder="Paste ticket id (uuid)"
              autoComplete="off"
              name="ticket"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching…' : 'Track'}
            </Button>
          </form>

          {loading ? (
            <div className="mt-3">
              <Spinner label="Loading ticket…" />
            </div>
          ) : null}

          {errorMsg ? (
            <div className="mt-3">
              <Alert>{errorMsg}</Alert>
            </div>
          ) : null}
        </Card>

        <Card title="Ticket status">
          {!repair ? (
            <div className="text-sm text-ocean-muted">No ticket loaded yet.</div>
          ) : (
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-ocean-muted">Ticket</div>
                <div className="font-mono text-xs font-semibold">{repair.id}</div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-ocean-bg p-4">
                <div className="text-xs font-bold uppercase tracking-wide text-ocean-muted">Current status</div>
                <div className="mt-1 text-2xl font-black">{statusLabel(repair.status)}</div>
              </div>

              <div className="grid gap-2 text-sm">
                <div>
                  <span className="font-semibold text-ocean-muted">Device:</span> {repair.device || '—'}
                </div>
                <div>
                  <span className="font-semibold text-ocean-muted">Issue:</span> {repair.issue || '—'}
                </div>
                <div>
                  <span className="font-semibold text-ocean-muted">Technician:</span> {repair.technician_id || 'Unassigned'}
                </div>
              </div>

              <Button variant="secondary" onClick={() => fetchRepair(repair.id)} disabled={loading}>
                Refresh
              </Button>

              <div className="text-xs text-ocean-muted">
                Live updates: enabled (Supabase Realtime) while this page is open.
              </div>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}
