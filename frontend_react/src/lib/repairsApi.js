import { supabase } from './supabaseClient';

/**
 * Repairs data-access helper using Supabase PostgREST + Realtime.
 *
 * Assumptions (DB schema):
 * - Table: public.repairs
 * - Columns: id (uuid/int), customer_id (uuid), technician_id (uuid|null),
 *            device (text), issue (text), status (text), created_at (timestamptz)
 *
 * This file intentionally keeps business logic minimal and “frontend-safe”.
 */

// PUBLIC_INTERFACE
export const REPAIR_STATUSES = ['requested', 'assigned', 'in_progress', 'completed', 'cancelled'];

/**
 * Normalizes different “repair” row shapes into a UI-friendly model.
 * Some deployments may use different column names; this tries a best-effort mapping.
 */
function normalizeRepair(row) {
  if (!row) return null;
  return {
    id: row.id,
    customer_id: row.customer_id ?? row.customerId ?? row.user_id ?? row.userId,
    technician_id: row.technician_id ?? row.technicianId ?? null,
    device: row.device ?? row.device_model ?? row.model ?? '',
    issue: row.issue ?? row.problem ?? row.description ?? '',
    status: row.status ?? 'requested',
    created_at: row.created_at ?? row.createdAt ?? null
  };
}

// PUBLIC_INTERFACE
export async function createRepair({ customerId, device, issue }) {
  /** Creates a new repair booking for a customer. */
  if (!customerId) throw new Error('customerId is required');
  if (!device?.trim()) throw new Error('device is required');
  if (!issue?.trim()) throw new Error('issue is required');

  const payload = {
    customer_id: customerId,
    device: device.trim(),
    issue: issue.trim(),
    status: 'requested'
  };

  const { data, error } = await supabase.from('repairs').insert(payload).select('*').single();
  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function listCustomerRepairs({ customerId }) {
  /** Lists repairs belonging to a customer. */
  if (!customerId) throw new Error('customerId is required');

  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeRepair);
}

// PUBLIC_INTERFACE
export async function listTechnicianRepairs({ technicianId }) {
  /** Lists repairs assigned to a technician. */
  if (!technicianId) throw new Error('technicianId is required');

  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .eq('technician_id', technicianId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeRepair);
}

// PUBLIC_INTERFACE
export async function listAllRepairs() {
  /** Lists all repairs (admin view). */
  const { data, error } = await supabase.from('repairs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeRepair);
}

// PUBLIC_INTERFACE
export async function getRepairById(id) {
  /** Fetch a single repair by id. */
  if (!id) throw new Error('id is required');
  const { data, error } = await supabase.from('repairs').select('*').eq('id', id).single();
  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function updateRepairStatus({ id, status }) {
  /** Updates repair status. */
  if (!id) throw new Error('id is required');
  if (!status) throw new Error('status is required');

  const { data, error } = await supabase.from('repairs').update({ status }).eq('id', id).select('*').single();
  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function assignRepair({ id, technicianId }) {
  /** Assign repair to a technician (admin flow). */
  if (!id) throw new Error('id is required');
  if (!technicianId) throw new Error('technicianId is required');

  const { data, error } = await supabase
    .from('repairs')
    .update({ technician_id: technicianId, status: 'assigned' })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return normalizeRepair(data);
}

/**
 * Subscribe to changes for the repairs table (optionally filtered by id).
 * Uses Supabase Realtime Postgres changes.
 */
// PUBLIC_INTERFACE
export function subscribeToRepairChanges({ onChange, repairId } = {}) {
  /** Subscribes to repair row changes and calls onChange(payload) on each event. Returns an unsubscribe function. */
  if (typeof onChange !== 'function') {
    throw new Error('onChange callback is required');
  }

  const channelName = repairId ? `realtime:repairs:id:${repairId}` : 'realtime:repairs:all';

  // Note: filter syntax is supported by Supabase Realtime for Postgres changes.
  // If filter is not supported in a given environment, we still receive all events and can client-filter.
  const filter = repairId ? `id=eq.${repairId}` : undefined;

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'repairs', filter },
      payload => {
        onChange(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function repairFromRealtimePayload(payload) {
  const row = payload?.new ?? payload?.old ?? null;
  return normalizeRepair(row);
}
