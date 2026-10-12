import { getSupabase } from './supabase.js';
import { LEADS_NAME_COLUMN } from '../config/env.js';

const TABLE = 'leads';
const TIMEOUT_MS = 15000;

// Details of the most recent failure. They never contain the visitor's name or phone.
let lastError = null;
export const getLastLeadError = () => lastError;

// Builds the row we insert. Only these three columns are sent.
// id and created_at are filled in by the database.
export function buildLeadRow({ name, phone, location }, nameColumn = LEADS_NAME_COLUMN) {
  return { [nameColumn]: name, phone, location };
}

// The two spellings of the name column we may meet: "name" or "full_name".
const alternateNameColumn = (col) => (col === 'name' ? 'full_name' : 'name');

async function insertRow(supabase, row) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // No .select() on purpose: visitors may insert, but they are never allowed to read leads back.
    return await supabase.from(TABLE).insert(row).abortSignal(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

const isSuccess = (res) => !res.error && res.status >= 200 && res.status < 300;

function describeFailure(res) {
  const err = res.error || {};
  return { http: res.status || null, code: err.code || null, message: err.message || null, hint: err.hint || null };
}

/**
 * Saves one enquiry to Supabase.
 * Resolves to { ok: true } only after Supabase confirms the insert.
 * Otherwise { ok: false, reason } where reason is 'config' | 'rate_limit' | 'failed'.
 */
export async function submitLead(lead, injectedClient) {
  const supabase = injectedClient === undefined ? await getSupabase() : injectedClient;
  if (!supabase) {
    lastError = { message: 'Supabase is not configured (missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY)' };
    console.error('Lead not sent:', lastError.message);
    return { ok: false, reason: 'config' };
  }

  let res = await insertRow(supabase, buildLeadRow(lead));

  // If the table calls the column "full_name" instead of "name" (or the other way round),
  // Supabase answers PGRST204 ("column not found"). Try the other spelling once.
  if (!isSuccess(res) && res.error?.code === 'PGRST204' && res.error.message?.includes(`'${LEADS_NAME_COLUMN}'`)) {
    console.warn(`Column "${LEADS_NAME_COLUMN}" not found. Retrying with "${alternateNameColumn(LEADS_NAME_COLUMN)}".`);
    res = await insertRow(supabase, buildLeadRow(lead, alternateNameColumn(LEADS_NAME_COLUMN)));
  }

  if (isSuccess(res)) {
    lastError = null;
    return { ok: true };
  }

  lastError = describeFailure(res);
  console.error('Lead insert failed', lastError);
  return { ok: false, reason: res.status === 429 ? 'rate_limit' : 'failed' };
}
