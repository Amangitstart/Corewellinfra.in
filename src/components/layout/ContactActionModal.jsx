import { useEffect, useRef, useState } from 'react';
import { site } from '../../config/site.js';
import { copyText } from '../../utils/cardExport.js';
import { track } from '../../utils/analytics.js';

const BOXES = {
  tel: { title: `Call ${site.name}`, value: site.phone, shown: site.phoneDisplay, href: `tel:${site.phone}`, label: 'Call now' },
  mailto: { title: `Email ${site.name}`, value: site.email, shown: site.email, href: `mailto:${site.email}`, label: 'Send email' },
};
const isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Phone and email links normally open the dialer / mail app.
// On computers without one nothing would happen, so we show the number or address with a Copy button instead.
export default function ContactActionModal() {
  const [kind, setKind] = useState(null);
  const [copied, setCopied] = useState(false);
  const callRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a');
      if (!link || link.closest('.modal')) return;
      const href = link.getAttribute('href') || '';
      if (href.startsWith('tel:') || href.startsWith('mailto:')) {
        track(href.startsWith('tel:') ? 'call_click' : 'email_click');
        const k = href.startsWith('tel:') ? 'tel' : 'mailto';
        if (!isPhone) { e.preventDefault(); setCopied(false); setKind(k); return; }
        // On phones, show the box only if the dialer / mail app did not open.
        let left = false;
        const mark = () => { left = true; };
        window.addEventListener('pagehide', mark, { once: true });
        window.addEventListener('blur', mark, { once: true });
        document.addEventListener('visibilitychange', mark, { once: true });
        setTimeout(() => { if (!left) { setCopied(false); setKind(k); } }, 1200);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!kind) return undefined;
    callRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setKind(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [kind]);

  if (!kind) return null;
  const box = BOXES[kind];
  return (
    <div className="modal open" id="callModal" role="dialog" aria-modal="true" aria-label={box.title} onClick={(e) => { if (e.target === e.currentTarget) setKind(null); }}>
      <div className="box">
        <h3>{box.title}</h3>
        <span className="num">{box.shown}</span>
        <a ref={callRef} className="btn" href={box.href}>{box.label}</a>
        <button className="btn ghost" type="button" onClick={async () => { await copyText(box.value); setCopied(true); }}>{copied ? 'Copied' : 'Copy'}</button>
        <button className="btn ghost" type="button" onClick={() => setKind(null)}>Close</button>
      </div>
    </div>
  );
}
