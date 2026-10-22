import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('lead form does not expose debug diagnostics or analytics location', () => {
  const source = read('../src/components/quote/LeadForm.jsx');
  assert.doesNotMatch(source, /debugText|debug=1/);
  assert.doesNotMatch(source, /track\(['"]generate_lead['"],\s*\{/);
});

test('feedback form limits input and blocks duplicate submissions', () => {
  const source = read('../src/sections/FeedbackSection.jsx');
  assert.match(source, /maxLength=\{80\}/);
  assert.match(source, /maxLength=\{1000\}/);
  assert.match(source, /if \(sending \|\| sent\) return/);
  assert.match(source, /disabled=\{sending\}/);
});

test('lead hardening requires server-side rate limiting and does not grant anonymous inserts', () => {
  const migration = read('../supabase/migrations/202610230001_leads_hardening.sql');
  assert.match(migration, /consume_lead_rate_limit/);
  assert.match(migration, /revoke select, update, delete, insert on table public\.leads from anon, authenticated/);
  assert.doesNotMatch(migration, /grant insert on table public\.leads to anon/);
});
