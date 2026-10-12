import { site, whatsappLink } from '../../config/site.js';
import { PhoneIcon, WhatsAppFloatIcon } from '../common/icons.jsx';
import { track } from '../../utils/analytics.js';

// The round WhatsApp and Call buttons that stay on screen.
export default function FloatingActions() {
  return (
    <div className="float">
      <a
        className="wa"
        href={whatsappLink(`Hello ${site.name}, I want a quote for paver blocks.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => track('whatsapp_click', { place: 'floating' })}
      >
        <WhatsAppFloatIcon />
      </a>
      <a className="ph" href={`tel:${site.phone}`} aria-label="Call us"><PhoneIcon /></a>
    </div>
  );
}
