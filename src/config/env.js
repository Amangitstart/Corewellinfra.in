// Settings that come from environment variables (see .env.example).
// Vite only exposes variables that start with VITE_. They end up in the browser,
// so NEVER put a secret or service_role key in any VITE_ variable.

const env = import.meta.env ?? {};

export const SUPABASE_URL = (env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_PUBLISHABLE_KEY = (env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();
export const SITE_URL = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
export const GA_MEASUREMENT_ID = (env.VITE_GA_MEASUREMENT_ID || '').trim();

// Name of the "name" column in public.leads. The default matches the schema you described.
export const LEADS_NAME_COLUMN = (env.VITE_LEADS_NAME_COLUMN || 'name').trim();
