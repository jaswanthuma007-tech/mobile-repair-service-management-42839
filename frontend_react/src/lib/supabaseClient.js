import { createClient } from '@supabase/supabase-js';

/**
 * IMPORTANT:
 * This project intentionally uses process.env.SUPABASE_URL and process.env.SUPABASE_KEY
 * per user instruction. Ensure these are set in the runtime environment (or .env in dev).
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast with a clear error (helps avoid confusing runtime behavior).
  // Do not log secrets.
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase environment variables missing. Please set SUPABASE_URL and SUPABASE_KEY.'
  );
}

// PUBLIC_INTERFACE
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
