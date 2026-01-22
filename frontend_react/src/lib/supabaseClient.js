import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client bootstrap.
 *
 * We support both:
 * - SUPABASE_URL / SUPABASE_KEY (preferred; non-CRA specific)
 * - REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_KEY (CRA-compatible fallback)
 *
 * NOTE: The hosting/preview environment must inject these into the frontend build/runtime
 * so `process.env.*` has values at compile time.
 */

function resolveSupabaseEnv() {
  const urlCandidates = ['SUPABASE_URL', 'REACT_APP_SUPABASE_URL'];
  const keyCandidates = ['SUPABASE_KEY', 'REACT_APP_SUPABASE_KEY'];

  const supabaseUrl = urlCandidates.map(k => process.env[k]).find(Boolean);
  const supabaseAnonKey = keyCandidates.map(k => process.env[k]).find(Boolean);

  const usedUrlVar = urlCandidates.find(k => Boolean(process.env[k])) || null;
  const usedKeyVar = keyCandidates.find(k => Boolean(process.env[k])) || null;

  return { supabaseUrl, supabaseAnonKey, usedUrlVar, usedKeyVar, urlCandidates, keyCandidates };
}

const { supabaseUrl, supabaseAnonKey, usedUrlVar, usedKeyVar, urlCandidates, keyCandidates } = resolveSupabaseEnv();

// Help debugging in preview environments where env injection can be confusing.
// eslint-disable-next-line no-console
console.info(
  `[supabase] env resolution: url=${usedUrlVar || 'MISSING'} key=${usedKeyVar || 'MISSING'}`
);

if (!supabaseUrl || !supabaseAnonKey) {
  const message =
    `[supabase] Missing required environment variables.\n` +
    `Set ${urlCandidates.join(' or ')} and ${keyCandidates.join(' or ')}.\n` +
    `Currently resolved: url=${supabaseUrl ? 'present' : 'missing'}, key=${supabaseAnonKey ? 'present' : 'missing'}.\n` +
    `After setting env vars, restart/rebuild the frontend so values are injected.`;

  // Fail fast with a readable error (and avoid "supabaseUrl is required" deep in the SDK).
  throw new Error(message);
}

// PUBLIC_INTERFACE
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
