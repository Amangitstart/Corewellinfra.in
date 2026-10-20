import { useState } from 'react';
import { site, mailtoLink, whatsappLink } from '../config/site.js';
import { PhoneIcon, WhatsAppButtonIcon } from '../components/common/icons.jsx';
import { track } from '../utils/analytics.js';

// Google Maps is only loaded after the visitor taps "Show map" (it may set cookies).
function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="mapbox" id="mapBox" style={{ position: 'relative' }}>
      {loaded ? (
        <iframe
          title={`${site.name} location on Google Maps`}
          src={site.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 20, color: '#5b5b5b' }}>
          <div>
            <b style={{ fontSize: '1.1rem', color: '#111' }}>Our location</b><br />
            Mahesh Nagar Colony, Shivpur, Varanasi.<br />
            <button type="button" className="btn" style={{ display: 'inline-block', marginTop: 14 }} onClick={() => setLoaded(true)}>Show map</button>
            <p style={{ marginTop: 10, fontSize: '.82rem' }}>Tapping this loads Google Maps, which may set cookies.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactSection() {
  return (
    <section id="contact">
      <div className="wrap info">
        <h2>Call or visit us</h2>
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
