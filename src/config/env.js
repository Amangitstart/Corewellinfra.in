// Settings that come from environment variables (see .env.example).
// Vite only exposes variables that start with VITE_. They end up in the browser,
// so NEVER put a secret or service_role key in any VITE_ variable.

const env = import.meta.env ?? {};

export const SUPABASE_URL = (env.VITE_SUPABASE_URL || '').trim();
export const SUPABASE_PUBLISHABLE_KEY = (env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();
export const SITE_URL = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
export const GA_MEASUREMENT_ID = (env.VITE_GA_MEASUREMENT_ID || '').trim();

// Name column in public.leads. This project uses full_name; override with
// VITE_LEADS_NAME_COLUMN=name only if a different database schema is used.
export const LEADS_NAME_COLUMN = (env.VITE_LEADS_NAME_COLUMN || 'full_name').trim();
