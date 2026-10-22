import { ROUTES } from '../../config/routes.js';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import BusinessCard from './BusinessCard.jsx';
import Turnstile from './Turnstile.jsx';
import { site, whatsappLink } from '../../config/site.js';
import { normalizePhone } from '../../utils/phone.js';
import { submitLead } from '../../lib/leads.js';
import { track } from '../../utils/analytics.js';
import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

const ERROR_TEXT = {
  name: 'Enter your full name',
  phone: 'Enter a valid phone number, like 98765 43210',
  location: 'Enter your location',
};
const GENERIC_ERROR = 'Sorry, we could not send your details just now. Please try again, or send them on WhatsApp or call us.';

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = ERROR_TEXT.name;
  const phone = normalizePhone(values.phone);
  if (!phone.ok) errors.phone = ERROR_TEXT.phone;
  if (values.location.trim().length < 2) errors.location = ERROR_TEXT.location;
  return { errors, phone };
}

export default function LeadForm() {
  const [values, setValues] = useState({ name: '', phone: '', location: '', website: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | leaving | sent
  const [donePhone, setDonePhone] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const sendingRef = useRef(false); // blocks double submits even before React re-renders
  const refs = { name: useRef(null), phone: useRef(null), location: useRef(null) };
  const doneRef = useRef(null);

  const change = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (sendingRef.current) return;
    setFormError('');
    setShowFallback(false);

    const { errors: found, phone } = validate(values);
    setErrors(found);
    const firstBad = ['name', 'phone', 'location'].find((f) => found[f]);
    if (firstBad) { refs[firstBad].current?.focus(); return; }

    // The hidden "website" field is a trap for bots. Real visitors never fill it in.
    if (values.website) { setFormError(GENERIC_ERROR); return; }

    sendingRef.current = true;
    setStatus('sending');
    try {
      const result = await submitLead({ name: values.name.trim(), phone: phone.value, location: values.location.trim(), turnstileToken });
      if (result.ok) {
        setDonePhone(phone.display);
        track('generate_lead');
        setStatus('leaving');
        setTimeout(() => setStatus('sent'), 450);
      } else {
        setStatus('idle');
        setFormError(result.reason === 'rate_limit'
          ? 'Too many tries from your connection. Please wait a few minutes, or contact us on WhatsApp.'
          : GENERIC_ERROR);
        setShowFallback(true);
      }
    } catch (error) {
      console.error('Lead form error', error?.name);
      setStatus('idle');
      setFormError('No internet connection or the server did not respond. Send it on WhatsApp instead, or call us.');
      setShowFallback(true);
    } finally {
      sendingRef.current = false;
    }
  }

  // After success, bring the thank-you box into view.
  useEffect(() => {
    if (status !== 'sent') return;
    doneRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  const sending = status === 'sending';
  const whatsappHref = whatsappLink(`Quote request - ${site.name}\nName: ${values.name.trim()}\nPhone: ${values.phone.trim()}\nLocation: ${values.location.trim()}`);

  return (
    <>
      <form
        id="enquiry"
        noValidate
        className={status === 'leaving' ? 'sent' : undefined}
        style={status === 'sent' ? { display: 'none' } : undefined}
        aria-busy={sending}
        onSubmit={onSubmit}
      >
        <div className="hp" aria-hidden="true">
          <label htmlFor="fWeb">Leave this field empty</label>
          <input id="fWeb" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={change('website')} />
        </div>

        <label htmlFor="fName">Full Name*</label>
        <input id="fName" ref={refs.name} className={errors.name ? 'bad' : undefined} required autoComplete="name" autoCapitalize="words" enterKeyHint="next" maxLength={80}
          value={values.name} onChange={change('name')} aria-invalid={errors.name ? 'true' : undefined} aria-describedby="e_fName" />
        <span className="ferr" id="e_fName" aria-live="polite">{errors.name}</span>

        <label htmlFor="fPhone">Mobile Number*</label>
        <input id="fPhone" ref={refs.phone} className={errors.phone ? 'bad' : undefined} type="tel" required autoComplete="tel" inputMode="tel" enterKeyHint="next" maxLength={20} placeholder="98765 43210"
          value={values.phone} onChange={change('phone')} aria-invalid={errors.phone ? 'true' : undefined} aria-describedby="e_fPhone" />
        <span className="ferr" id="e_fPhone" aria-live="polite">{errors.phone}</span>

        <label htmlFor="fCity">Location*</label>
        <input id="fCity" ref={refs.location} className={errors.location ? 'bad' : undefined} required enterKeyHint="done" maxLength={100} autoComplete="address-level2" placeholder="Area / city, e.g. Shivpur, Varanasi"
          value={values.location} onChange={change('location')} aria-invalid={errors.location ? 'true' : undefined} aria-describedby="e_fCity" />
        <span className="ferr" id="e_fCity" aria-live="polite">{errors.location}</span>

        <p className="req-note" style={{ margin: '2px 0 0' }}>
          By sending, you agree we may call or WhatsApp you about this enquiry. See our <Link to={ROUTES.privacy}>Privacy Policy</Link>.
        </p>
        <Turnstile onToken={setTurnstileToken} />
        <div className={`errbox${formError ? ' show' : ''}`} id="fErr" role="alert">{formError}</div>
        <p className="errfb" id="fFallback" hidden={!showFallback}>
          <a className="btn" href={whatsappHref} target="_blank" rel="noopener noreferrer">Send on WhatsApp instead</a>
        </p>
        <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Request a call back'}</button>
        <p className="req-note">All 3 fields are required.</p>
      </form>

      <div className={`done${status === 'sent' ? ' show' : ''}`} id="done" ref={doneRef} aria-live="polite" tabIndex={-1}>
        <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" /><path d="M15 27l8 8 14-16" /></svg>
        <h3>Thank you!</h3>
        <p>We have received your details and will call you on <b id="donePhone" style={{ whiteSpace: 'nowrap' }}>{donePhone}</b> shortly.</p>
        <p className="small">Need it faster? <a href={`tel:${site.phone}`}>Call {site.phoneDisplay}</a></p>
        {status === 'sent' && <BusinessCard />}
      </div>
    </>
  );
}
