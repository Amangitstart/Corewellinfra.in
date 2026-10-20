import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLeadRow, submitLead, getLastLeadError } from '../src/lib/leads.js';

const lead = { name: 'Ramesh Kumar', phone: '9876543210', location: 'Shivpur, Varanasi' };

// A tiny stand-in for the Supabase client. "responder" decides what each insert returns.
function fakeClient(responder) {
  const inserted = [];
  return {
    inserted,
    from: (table) => ({
      insert: (row) => {
        inserted.push({ table, row });
        const result = responder(row, inserted.length);
        return { abortSignal: () => Promise.resolve(result) };
      },
    }),
  };
}

test('row contains only full_name, phone and location (no id or created_at)', () => {
  const row = buildLeadRow(lead);
  assert.deepEqual(Object.keys(row).sort(), ['full_name', 'location', 'phone']);
  assert.equal('id' in row || 'created_at' in row, false);
});

test('success is reported only when Supabase confirms (2xx, no error)', async () => {
  const client = fakeClient(() => ({ error: null, status: 201 }));
  assert.deepEqual(await submitLead(lead, client), { ok: true });
  assert.equal(client.inserted[0].table, 'leads');
});

test('a security error is a failure, never a success', async () => {
  const client = fakeClient(() => ({ error: { code: '42501', message: 'permission denied for table leads' }, status: 401 }));
  const result = await submitLead(lead, client);
  assert.equal(result.ok, false);
  assert.equal(getLastLeadError().code, '42501');
  assert.equal(JSON.stringify(getLastLeadError()).includes('Ramesh'), false); // no customer data in debug info
});

test('retries once with name when the table has no "full_name" column', async () => {
  const client = fakeClient((row) => ('full_name' in row
    ? { error: { code: 'PGRST204', message: "Could not find the 'full_name' column of 'leads' in the schema cache" }, status: 400 }
    : { error: null, status: 201 }));
  assert.deepEqual(await submitLead(lead, client), { ok: true });
  assert.equal(client.inserted.length, 2);
  assert.ok('name' in client.inserted[1].row);
});

test('missing configuration fails safely', async () => {
  assert.deepEqual(await submitLead(lead, null), { ok: false, reason: 'config' });
});

test('HTTP 429 is reported as rate limited', async () => {
  const client = fakeClient(() => ({ error: { message: 'too many' }, status: 429 }));
  assert.deepEqual(await submitLead(lead, client), { ok: false, reason: 'rate_limit' });
});
