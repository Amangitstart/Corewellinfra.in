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
  const [line1, line2] = site.address.lines;
  return (
    <section id="contact">
      <div className="wrap info">
        <h2>Call or visit us</h2>
        <div className="infogrid">
          <div><h3>Address</h3><p>{site.name}<br />{line1}<br />{line2}</p></div>
          <div><h3>Email</h3><p><a className="em" href={mailtoLink}>{site.email}</a></p></div>
          <div>
            <h3>Phone</h3>
            <p><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p>
            <div className="callbox">
              <a className="btn" href={`tel:${site.phone}`}><PhoneIcon />Call now</a>
              <a className="btn wa" href={whatsappLink(`Hello ${site.name}, Hello Corewell Infra Developers, I am interested in your construction services and would like to request a quotation.
               Please share your pricing and availability. Thank you..`)} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { place: 'page' })}>
                <WhatsAppButtonIcon />Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <MapEmbed />
        <p className="mapnote"><a className="btn more" href={site.mapsLink} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>
      </div>
    </section>
  );
}
