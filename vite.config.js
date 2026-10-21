import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { site } from './src/config/site.js';

// Adds the canonical link, social image and Google business data to index.html.
// They need your final web address, so they are only added when VITE_SITE_URL is set.
function seoTags(siteUrl) {
  if (!siteUrl) return '<!-- Set VITE_SITE_URL to add canonical and social image tags -->';
  const businessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    url: `${siteUrl}/`,
    image: `${siteUrl}${site.ogImage}`,
    telephone: site.phone,
    email: site.email,
    description: site.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
  };
  const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
  return [
    `<link rel="canonical" href="${siteUrl}/" />`,
    `<meta property="og:url" content="${siteUrl}/" />`,
    `<meta property="og:image" content="${siteUrl}${site.ogImage}" />`,
    `<script type="application/ld+json">${json(businessData)}</script>`,
  ].join('\n    ');
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '');
  return {
    plugins: [
      react(),
      { name: 'seo-tags', transformIndexHtml: (html) => html.replace('<!--seo-tags-->', seoTags(siteUrl)) },
    ],
    build: { sourcemap: false },
  };
});
