import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone } from '../src/utils/phone.js';

const ok = (input, value) => { const r = normalizePhone(input); assert.equal(r.ok, true, `${input} should be valid`); assert.equal(r.value, value); };
const bad = (input) => assert.equal(normalizePhone(input).ok, false, `${input} should be invalid`);

test('Indian mobile numbers in common formats', () => {
  ok('9876543210', '9876543210');
  ok('98765 43210', '9876543210');
  ok('098765 43210', '9876543210');
  ok('+91 98765-43210', '9876543210');
  ok('91 9876543210', '9876543210');
  ok('(98765) 43210', '9876543210');
  ok('0091 9876543210', '9876543210');
});
test('landline with STD code is accepted', () => ok('0542 2345678', '5422345678'));
test('international numbers need a + and 8-15 digits', () => {
  ok('+44 20 7946 0958', '+442079460958');
  ok('+971 50 123 4567', '+971501234567');
  bad('442079460958x');
});
test('rejects short, long, and non-numeric input', () => {
  ['', '12345', '0000000000', '1234567890', '98765', '98765432101234', 'abcdefghij', '+91 12345', '+91 98765 4321'].forEach(bad);
});
