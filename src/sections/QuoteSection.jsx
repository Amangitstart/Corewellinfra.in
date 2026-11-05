import LeadForm from '../components/quote/LeadForm.jsx';
import { PhoneIcon, WhatsAppButtonIcon } from '../components/common/icons.jsx';
import { site, whatsappLink } from '../config/site.js';

export default function QuoteSection() {
  return (
    <section className="quote slant-b" id="quote">
      <div className="wrap split">
        <div className="qleft">
          <div className="quote-intro">
            <span className="section-kicker">Start your next project</span>
            <h2>Let's Build Something Together.</h2>
            <p>Tell us what you are planning and our team will help you take the next step with a clear, practical quote.</p>
            <div className="quote-contact-options" aria-label="Contact Corewell Infra Developers">
              <a href={`tel:${site.phone}`}>
                <PhoneIcon />
                <span><small>Call us</small>{site.phoneDisplay}</span>
              </a>
              <a href={whatsappLink('Hello Corewell Infra Developers Team, I would like to discuss a project.')} target="_blank" rel="noopener noreferrer">
                <WhatsAppButtonIcon />
                <span><small>WhatsApp us</small>Start a conversation</span>
              </a>
            </div>
          </div>
        </div>
        <div className="formwrap">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
