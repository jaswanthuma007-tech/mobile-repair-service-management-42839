import { supabase } from './supabaseClient';

// PUBLIC_INTERFACE
export async function getMyRole() {
  /** Returns the current user's role from public.profiles (best-effort). Defaults to 'customer' if missing. */
  try {
    const { data, error } = await supabase.from('profiles').select('role').single();
    if (error) throw error;
    return data?.role || 'customer';
  } catch {
    return 'customer';
  }
}
