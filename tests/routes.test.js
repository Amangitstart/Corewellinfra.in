import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUTES, legalLinks, legacyRedirects, sitemapPaths } from '../src/config/routes.js';

test('every policy has its own distinct address', () => {
  const paths = [ROUTES.privacy, ROUTES.terms, ROUTES.refunds, ROUTES.cookies];
  assert.equal(new Set(paths).size, 4);
  paths.forEach((p) => assert.match(p, /^\/[a-z-]+$/));
});
test('footer lists all four policies with the expected names', () => {
  assert.deepEqual(legalLinks.map((l) => l.label), ['Privacy Policy', 'Terms and Conditions', 'Refund and Cancellation Policy', 'Cookie Policy']);
});
test('old addresses forward to real pages and are not themselves policy pages', () => {
  Object.entries(legacyRedirects).forEach(([from, to]) => { assert.ok(sitemapPaths.includes(to)); assert.ok(!sitemapPaths.includes(from)); });
});
