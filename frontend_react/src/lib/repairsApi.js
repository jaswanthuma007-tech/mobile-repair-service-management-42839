import { supabase } from './supabaseClient';

/**
 * Repairs data-access helper using Supabase PostgREST + Realtime.
 *
 * This project has historically used multiple DB column layouts for `public.repairs`:
 * 1) "frontend demo" layout:
 *    - customer_id, technician_id, device, issue, status, created_at
 * 2) "backend_api" layout (per OpenAPI spec):
 *    - customer_user_id, technician_user_id, device_type, issue_description, status, created_at
 *
 * New Customer Portal spec adds optional columns:
 *   - brand, model, issue (or issue_description), status='Booked'
 *
 * To keep the app working across environments (and avoid NOT NULL/RLS failures),
 * this module detects the available column layout once (cached) and then uses
 * the correct column names for inserts/filters/updates.
 */

// PUBLIC_INTERFACE
export const REPAIR_STATUSES = ['requested', 'assigned', 'in_progress', 'completed', 'cancelled', 'Booked'];

let repairsSchemaPromise = null;

/**
 * Normalizes different “repair” row shapes into a UI-friendly model.
 * Some deployments may use different column names; this tries a best-effort mapping.
 */
function normalizeRepair(row) {
  if (!row) return null;

  // Support both layouts.
  const customerId =
    row.customer_user_id ??
    row.customer_id ??
    row.customerId ??
    row.user_id ??
    row.userId;

  const technicianId = row.technician_user_id ?? row.technician_id ?? row.technicianId ?? null;

  // Prefer explicit brand/model columns if present, otherwise parse from "device"
  const brand = row.brand ?? null;
  const model = row.model ?? row.model_name ?? null;

  return {
    id: row.id,
    customer_id: customerId,
    technician_id: technicianId,

    // Legacy UI fields:
    device: row.device_type ?? row.device ?? row.device_model ?? row.model ?? '',
    issue: row.issue_description ?? row.issue ?? row.problem ?? row.description ?? '',

    // New UI fields:
    brand,
    model,

    status: row.status ?? 'requested',
    created_at: row.created_at ?? row.createdAt ?? null,
    updated_at: row.updated_at ?? row.updatedAt ?? null
  };
}

async function requireAuthedUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user?.id) throw new Error('You must be signed in to book a repair.');
  return user;
}

/**
 * Detect which repair table columns exist.
 *
 * We do this by attempting a minimal insert using one layout; if it fails due to
 * missing columns, we try the other layout. To avoid leaving test rows behind,
 * we immediately delete the inserted row.
 */
async function getRepairsSchema() {
  if (repairsSchemaPromise) return repairsSchemaPromise;

  repairsSchemaPromise = (async () => {
    const user = await requireAuthedUser();

    // Try backend_api layout first (matches the provided OpenAPI spec).
    const candidates = [
      {
        name: 'backend_api',
        customerIdCol: 'customer_user_id',
        technicianIdCol: 'technician_user_id',
        deviceCol: 'device_type',
        issueCol: 'issue_description'
      },
      {
        name: 'frontend_demo',
        customerIdCol: 'customer_id',
        technicianIdCol: 'technician_id',
        deviceCol: 'device',
        issueCol: 'issue'
      }
    ];

    for (const c of candidates) {
      const probePayload = {
        [c.customerIdCol]: user.id,
        [c.deviceCol]: '__schema_probe__',
        [c.issueCol]: '__schema_probe__'
      };

      const { data, error } = await supabase.from('repairs').insert(probePayload).select('id').single();

      if (!error && data?.id) {
        // Best-effort cleanup. Even if RLS blocks delete, at worst we leave a single probe row.
        await supabase.from('repairs').delete().eq('id', data.id);
        return c;
      }

      // eslint-disable-next-line no-console
      console.warn('[repairsApi] schema probe failed for', c.name, error?.message || error);
    }

    // If we get here, we couldn't confidently determine. Default to backend_api layout.
    return candidates[0];
  })();

  return repairsSchemaPromise;
}

// PUBLIC_INTERFACE
export async function createRepair({ device, issue }) {
  /** Creates a new repair booking for the currently authenticated customer (auth.uid()). */
  const deviceValue = typeof device === 'string' ? device.trim() : '';
  const issueValue = typeof issue === 'string' ? issue.trim() : '';

  // Client-side guards to prevent NOT NULL constraint violations and bad payloads.
  if (!deviceValue) throw new Error('Device is required.');
  if (!issueValue) throw new Error('Issue is required.');

  const user = await requireAuthedUser();
  const schema = await getRepairsSchema();

  const payload = {
    [schema.customerIdCol]: user.id,
    [schema.deviceCol]: deviceValue,
    [schema.issueCol]: issueValue
  };

  const { data, error } = await supabase.from('repairs').insert(payload).select('*').single();
  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function createBooking({ brand, model, issue }) {
  /**
   * Creates a new repair booking from the multi-step portal.
   *
   * Spec insertion:
   * - customer_user_id = auth.uid()
   * - brand
   * - model
   * - issue
   * - status = 'Booked'
   *
   * Compatibility strategy:
   * - Always write the schema's issueCol (issue / issue_description)
   * - Also attempt to include brand/model columns if the table supports them (best-effort)
   * - If brand/model columns do not exist, we fall back to storing device_type/device = `${brand} ${model}`
   */
  const brandValue = typeof brand === 'string' ? brand.trim() : '';
  const modelValue = typeof model === 'string' ? model.trim() : '';
  const issueValue = typeof issue === 'string' ? issue.trim() : '';

  if (!brandValue) throw new Error('Brand is required.');
  if (!modelValue) throw new Error('Model is required.');
  if (!issueValue) throw new Error('Issue is required.');

  const user = await requireAuthedUser();
  const schema = await getRepairsSchema();

  const deviceValue = `${brandValue} ${modelValue}`.trim();

  // First attempt: include brand/model columns (if they exist)
  const payloadWithBrandModel = {
    [schema.customerIdCol]: user.id,
    [schema.deviceCol]: deviceValue,
    [schema.issueCol]: issueValue,
    status: 'Booked',
    brand: brandValue,
    model: modelValue
  };

  let { data, error } = await supabase.from('repairs').insert(payloadWithBrandModel).select('*').single();

  if (error) {
    // If schema doesn't have brand/model columns, retry without them.
    // eslint-disable-next-line no-console
    console.warn('[repairsApi] createBooking retrying without brand/model:', error?.message || error);

    const fallbackPayload = {
      [schema.customerIdCol]: user.id,
      [schema.deviceCol]: deviceValue,
      [schema.issueCol]: issueValue,
      status: 'Booked'
    };

    const retry = await supabase.from('repairs').insert(fallbackPayload).select('*').single();
    data = retry.data;
    error = retry.error;
  }

  if (error) throw error;
  return normalizeRepair(data);
}

// PUBLIC_INTERFACE
export async function listCustomerRepairs({ customerId }) {
  /** Lists repairs belonging to a customer. */
  if (!customerId) throw new Error('customerId is required');

  const schema = await getRepairsSchema();

  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .eq(schema.customerIdCol, customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeRepair);
}

// PUBLIC_INTERFACE
export async function listTechnicianRepairs({ technicianId }) {
  /** Lists repairs assigned to a technician. */
  if (!technicianId) throw new Error('technicianId is required');

  const schema = await getRepairsSchema();

  const { data, error } = await supabase
    .from('repairs')
    .select('*')
    .eq(schema.technicianIdCol, technicianId)
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

  const schema = await getRepairsSchema();

  const { data, error } = await supabase
    .from('repairs')
    .update({ [schema.technicianIdCol]: technicianId, status: 'assigned' })
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
