import { supabase } from './supabaseClient';

/**
 * Repairs data-access helper using Supabase PostgREST + Realtime.
 *
 * This app's customer booking flow now uses the new Supabase `repairs` table shape:
 * - customer_user_id = auth.uid()
 * - brand (text)
 * - model (text)
 * - issue (text)
 * - status (text) defaulting to "Booked" for customer-created bookings
 *
 * IMPORTANT (RLS): Do not do any "schema probing" inserts. Under RLS, probe rows may
 * not be deletable and can leak into UI lists (e.g., "__schema_probe__").
 * All queries/inserts below are intended to be RLS-compliant.
 */

// PUBLIC_INTERFACE
export const REPAIR_STATUSES = ['Booked', 'requested', 'assigned', 'in_progress', 'completed', 'cancelled'];

function normalizeRepair(row) {
  if (!row) return null;

  return {
    id: row.id,
    customer_id: row.customer_user_id ?? null,
    technician_id: row.technician_user_id ?? null,

    // New canonical fields
    brand: row.brand ?? null,
    model: row.model ?? null,
    issue: row.issue ?? row.issue_description ?? row.issue_text ?? null,

    status: row.status ?? 'Booked',
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null
  };
}

async function requireAuthedUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user?.id) throw new Error('You must be signed in to view or book repairs.');
  return user;
}

// PUBLIC_INTERFACE
export async function createBooking({ brand, model, issue }) {
  /**
   * Creates a new repair booking (customer flow).
   *
   * Spec insertion:
   * - customer_user_id = auth.uid()
   * - brand = selected brand name
   * - model = selected model name
   * - issue = selected issue label
   * - status = 'Booked'
   */
  const brandValue = typeof brand === 'string' ? brand.trim() : '';
  const modelValue = typeof model === 'string' ? model.trim() : '';
  const issueValue = typeof issue === 'string' ? issue.trim() : '';

  if (!brandValue) throw new Error('Brand is required.');
  if (!modelValue) throw new Error('Model is required.');
  if (!issueValue) throw new Error('Issue is required.');

  const user = await requireAuthedUser();

  const payload = {
    customer_user_id: user.id,
    brand: brandValue,
    model: modelValue,
    issue: issueValue,
    status: 'Booked'
  };

  const { data, error } = await supabase.from('repairs').insert(payload).select('*').single();
  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function listCustomerRepairs({ customerId } = {}) {
  /**
   * Lists repairs belonging to the currently authenticated customer.
   *
   * Note: We intentionally do NOT filter by customer_user_id here.
   * With RLS, the caller should only see their own rows anyway.
   * This avoids coupling UI to schema variants and keeps the call RLS-first.
   */
  await requireAuthedUser();

  const { data, error } = await supabase.from('repairs').select('*').order('created_at', { ascending: false });
  if (error) throw error;

  // Extra defensive filter in case an environment accidentally has looser RLS.
  const normalized = (data || []).map(normalizeRepair).filter(Boolean);
  if (!customerId) return normalized;
  return normalized.filter(r => r.customer_id === customerId);
}

// PUBLIC_INTERFACE
export async function listTechnicianRepairs({ technicianId }) {
  /** Lists repairs assigned to a technician (requires matching RLS on technician_user_id). */
  if (!technicianId) throw new Error('technicianId is required');

  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .eq('technician_user_id', technicianId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeRepair);
}

// PUBLIC_INTERFACE
export async function listAllRepairs() {
  /** Lists all repairs (admin view, requires admin RLS/policy). */
  const { data, error } = await supabase.from('repairs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizeRepair);
}

// PUBLIC_INTERFACE
export async function getRepairById(id) {
  /** Fetch a single repair by id (role-scoped by RLS). */
  if (!id) throw new Error('id is required');

  const { data, error } = await supabase.from('repairs').select('*').eq('id', id).single();
  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function updateRepairStatus({ id, status }) {
  /** Updates repair status (role-scoped by RLS). */
  if (!id) throw new Error('id is required');
  if (!status) throw new Error('status is required');

  const { data, error } = await supabase.from('repairs').update({ status }).eq('id', id).select('*').single();
  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function assignRepair({ id, technicianId }) {
  /** Assign repair to a technician (admin flow; requires admin RLS/policy). */
  if (!id) throw new Error('id is required');
  if (!technicianId) throw new Error('technicianId is required');

  const { data, error } = await supabase
    .from('repairs')
    .update({ technician_user_id: technicianId, status: 'assigned' })
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
  const filter = repairId ? `id=eq.${repairId}` : undefined;

  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'repairs', filter }, payload => {
      onChange(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function repairFromRealtimePayload(payload) {
  const row = payload?.new ?? payload?.old ?? null;
  return normalizeRepair(row);
}
