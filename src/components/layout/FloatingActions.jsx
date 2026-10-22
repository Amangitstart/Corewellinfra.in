import { useEffect, useState } from 'react';
import { gmailComposeLink, site, whatsappLink } from '../../config/site.js';
import { MailIcon, PhoneIcon, WhatsAppFloatIcon } from '../common/icons.jsx';
import { track } from '../../utils/analytics.js';

// The round WhatsApp and Call buttons that stay on screen.
export default function FloatingActions() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem('corewell-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    window.localStorage.setItem('corewell-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const whatsappMessage = `Hello ${site.name} Team,

I am interested in purchasing paver blocks and would appreciate a quotation.

Please share the following details:
- Available designs and specifications
- Price per square foot/unit
- Minimum order quantity
- Delivery availability and charges

My details:
Name:
Location:
Required quantity:

Thank you.`;

  return (
    <div className="float">
      <button className="theme-toggle" type="button" onClick={() => setDarkMode((enabled) => !enabled)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
        <span aria-hidden="true">{darkMode ? '☀' : '☾'}</span>
      </button>
      <a
        className="wa"
        href={whatsappLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => track('whatsapp_click', { place: 'floating' })}
      >
        <WhatsAppFloatIcon />
      </a>
      <a className="ph" href={`tel:${site.phone}`} aria-label="Call us"><PhoneIcon /></a>
      <a className="em" href={gmailComposeLink} target="_blank" rel="noopener noreferrer" aria-label={`Email us at ${site.email}`} onClick={() => track('email_click', { place: 'floating' })}><MailIcon /></a>
    </div>
  );
}
