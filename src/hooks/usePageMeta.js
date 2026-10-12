import { useEffect } from 'react';
import { site } from '../config/site.js';
import { SITE_URL } from '../config/env.js';

function setMeta(selector, create, value) {
  let el = document.head.querySelector(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  return el;
}

// Sets the browser tab title, the description and the canonical link for the current page.
export default function usePageMeta({ title, description, path = '/' }) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : `${site.name} | Construction, Paver Blocks and Building Materials, Varanasi`;
    if (description) {
      const meta = setMeta('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }));
      meta.setAttribute('content', description);
    }
    if (SITE_URL) {
      const link = setMeta('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }));
      link.setAttribute('href', SITE_URL + path);
    }
  }, [title, description, path]);
}
