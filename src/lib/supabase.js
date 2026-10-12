import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../config/env.js';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

let clientPromise = null;

// One shared Supabase client, created the first time it is needed.
// The library is loaded on demand, so visitors who never send the form do not download it.
// It only uses the PUBLISHABLE key, which is safe in the browser.
export function getSupabase() {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      }),
    );
    clientPromise.catch(() => { clientPromise = null; }); // allow a retry if the download failed
  }
  return clientPromise;
}

// Starts downloading the library early (called when the visitor first touches the form).
export const warmSupabase = () => { getSupabase().catch(() => {}); };
