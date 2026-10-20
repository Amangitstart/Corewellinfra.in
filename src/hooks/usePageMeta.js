import { useEffect } from 'react';
import { site } from '../config/site.js';
import { SITE_URL } from '../config/env.js';

function setMeta(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  return el;
}

function setMetaContent(selector, create, value) {
  const el = setMeta(selector, create);
  el.setAttribute('content', value);
}

// Sets the browser tab title, the description and the canonical link for the current page.
export default function usePageMeta({ title, description, path = '/' }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${site.name}` : `${site.name} | Construction, Paver Blocks and Building Materials, Varanasi`;
    const pageDescription = description || site.description;
    document.title = pageTitle;
    setMetaContent('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), pageDescription);
    setMetaContent('meta[property="og:title"]', () => Object.assign(document.createElement('meta'), { property: 'og:title' }), pageTitle);
    setMetaContent('meta[property="og:description"]', () => Object.assign(document.createElement('meta'), { property: 'og:description' }), pageDescription);
    setMetaContent('meta[property="og:image"]', () => Object.assign(document.createElement('meta'), { property: 'og:image' }), SITE_URL ? `${SITE_URL}${site.ogImage}` : site.ogImage);
    setMetaContent('meta[name="twitter:title"]', () => Object.assign(document.createElement('meta'), { name: 'twitter:title' }), pageTitle);
    setMetaContent('meta[name="twitter:description"]', () => Object.assign(document.createElement('meta'), { name: 'twitter:description' }), pageDescription);
    setMetaContent('meta[name="twitter:image"]', () => Object.assign(document.createElement('meta'), { name: 'twitter:image' }), SITE_URL ? `${SITE_URL}${site.ogImage}` : site.ogImage);
    if (SITE_URL) {
      const link = setMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }));
      link.setAttribute('href', SITE_URL + path);
      setMetaContent('meta[property="og:url"]', () => Object.assign(document.createElement('meta'), { property: 'og:url' }), SITE_URL + path);
    }
  }, [title, description, path]);
}
