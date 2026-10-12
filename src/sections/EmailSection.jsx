import { useState } from 'react';
import { site, mailtoLink } from '../config/site.js';
import { copyText } from '../utils/cardExport.js';

export default function EmailSection() {
  const [copied, setCopied] = useState(false);
  return (
    <section className="mail" id="email">
      <div className="wrap mailin">
        <svg className="mailicon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
        <div>
          <h2>Prefer email?</h2>
          <p>Send us your drawings, area details or questions. We read every message.</p>
        </div>
        <div className="mailbtns">
          <a className="btn white" href={mailtoLink}>{site.email}</a>
          <button className="btn ghost" type="button" onClick={async () => { await copyText(site.email); setCopied(true); }}>{copied ? 'Copied' : 'Copy email'}</button>
        </div>
      </div>
    </section>
  );
}
