import { sitemapPaths } from '../src/config/routes.js';
// Runs before every build (npm run build). Creates public/robots.txt and public/sitemap.xml
// using your address from VITE_SITE_URL, so the domain is never hard-coded.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');
const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
const pages = sitemapPaths;

mkdirSync('public', { recursive: true });

if (!siteUrl) {
  console.warn('VITE_SITE_URL is not set: writing robots.txt without a sitemap and skipping sitemap.xml.');
  writeFileSync('public/robots.txt', 'User-agent: *\nAllow: /\n');
  rmSync('public/sitemap.xml', { force: true });
} else {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.map((p) => `  <url>\n    <loc>${siteUrl}${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n');
  writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`SEO files written for ${siteUrl}`);
}
