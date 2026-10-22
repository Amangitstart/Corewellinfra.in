import { useEffect, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from '../../config/env.js';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export default function Turnstile({ onToken }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined;
    let cancelled = false;
    const render = () => {
      if (!cancelled && window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => onToken(token),
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        });
      }
    };
    const existing = document.querySelector(`script[src^="${SCRIPT_SRC.split('?')[0]}"]`);
    if (existing) {
      if (window.turnstile) render();
      else existing.addEventListener('load', render, { once: true });
    } else {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', render, { once: true });
      document.head.appendChild(script);
    }
    return () => { cancelled = true; };
  }, [onToken]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={containerRef} aria-label="Security verification" />;
}
