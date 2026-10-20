import { site, mailtoLink, whatsappLink } from '../config/site.js';
import { PhoneIcon, WhatsAppButtonIcon } from '../components/common/icons.jsx';
import { track } from '../utils/analytics.js';

function MapEmbed() {
  return (
    <div className="mapbox" id="mapBox" style={{ position: 'relative' }}>
      <iframe
        title={`${site.name} location on Google Maps`}
        src={site.mapsEmbed}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  );
}

export default function ContactSection() {
  return (
    <section id="contact">
      <div className="wrap info">
        <div className="contact-video-panel">
          <video autoPlay muted loop playsInline preload="auto" aria-hidden="true">
            <source src="/videos/feedback-thank-you.mp4" type="video/mp4" />
          </video>
          <div className="contact-video-actions" aria-label="Contact options">
            <a className="btn" href={`tel:${site.phone}`}><PhoneIcon />Call now</a>
            <a className="btn wa" href={whatsappLink(`Hello ${site.name}, I am interested in your construction services and would like to request a quotation.`)} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { place: 'contact_video' })}>
              <WhatsAppButtonIcon />WhatsApp
            </a>
            <a className="btn email" href={mailtoLink}>Email us</a>
          </div>
        </div>
        <MapEmbed />
        <p className="mapnote"><a className="btn more" href={site.mapsLink} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>
      </div>
    </section>
  );
}
