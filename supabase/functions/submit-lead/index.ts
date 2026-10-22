import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NAME_MAX = 80;
const PHONE_MAX = 20;
const LOCATION_MAX = 100;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const json = (body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

const corsHeaders = (origin: string | null) => {
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((v) => v.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return {};
  return { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };
};

function normalizePhone(input: unknown) {
  let raw = String(input ?? '').trim().replace(/[\s().-]/g, '');
  if (raw.startsWith('00')) raw = '+' + raw.slice(2);
  if (!/^\+?\d+$/.test(raw)) return null;
  if (raw.startsWith('+')) {
    const digits = raw.slice(1);
    if (digits.startsWith('91') && digits.length === 12) return digits.slice(2);
    if (digits.length < 8 || digits.length > 15 || digits[0] === '0') return null;
    return '+' + digits;
  }
  if (raw.length === 12 && raw.startsWith('91')) raw = raw.slice(2);
  else if (raw.length === 11 && raw.startsWith('0')) raw = raw.slice(1);
  return /^[2-9]\d{9}$/.test(raw) ? raw : null;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyTurnstile(token: unknown, remoteip: string | null) {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret || typeof token !== 'string' || token.length < 10) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set('remoteip', remoteip);
  const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  const headers = corsHeaders(origin);
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map((v) => v.trim()).filter(Boolean);
  if (request.method === 'OPTIONS') {
    if (!allowed.length || !origin || !allowed.includes(origin)) return new Response(null, { status: 403 });
    return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' } });
  }
  if (request.method !== 'POST') return json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405, headers);
  if (!allowed.length) return json({ ok: false, code: 'SERVICE_UNAVAILABLE' }, 503);
  if (!origin || !allowed.includes(origin)) return json({ ok: false, code: 'ORIGIN_NOT_ALLOWED' }, 403);

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return json({ ok: false, code: 'INVALID_JSON' }, 400, headers); }
  const keys = Object.keys(input);
  if (keys.some((key) => !['name', 'phone', 'location', 'turnstileToken'].includes(key))) return json({ ok: false, code: 'INVALID_FIELDS' }, 400, headers);
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const location = typeof input.location === 'string' ? input.location.trim() : '';
  const phone = normalizePhone(input.phone);
  if (name.length < 2 || name.length > NAME_MAX || location.length < 2 || location.length > LOCATION_MAX || !phone || String(input.phone ?? '').length > PHONE_MAX) {
    return json({ ok: false, code: 'INVALID_INPUT' }, 400, headers);
  }

  const remoteip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  if (!await verifyTurnstile(input.turnstileToken, remoteip)) return json({ ok: false, code: 'BOT_CHECK_FAILED' }, 403, headers);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json({ ok: false, code: 'SERVICE_UNAVAILABLE' }, 503, headers);
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const rateKey = await sha256(`${remoteip || 'unknown'}:${request.headers.get('user-agent') || 'unknown'}`);
  const { data: allowedByRate, error: rateError } = await supabase.rpc('consume_lead_rate_limit', { p_key_hash: rateKey });
  if (rateError || allowedByRate !== true) return json({ ok: false, code: 'RATE_LIMITED' }, 429, headers);
  const { error } = await supabase.from('leads').insert({ full_name: name, phone, location });
  if (error) return json({ ok: false, code: 'SUBMISSION_FAILED' }, 500, headers);
  return json({ ok: true }, 200, headers);
});
