import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../config/env.js';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

let clientPromise = null;

// Use only the browser-safe publishable key. Never put a service-role key in VITE_ variables.
export function getSupabase() {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      }),
    );
    clientPromise.catch(() => { clientPromise = null; });
  }
  return clientPromise;
}

export const warmSupabase = () => { getSupabase().catch(() => {}); };
