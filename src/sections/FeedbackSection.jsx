import { Fragment, useState } from 'react';
import { site, whatsappLink } from '../config/site.js';

const STARS = ['5', '4', '3', '2', '1'];

// Feedback is sent to the business on WhatsApp (it is not stored in the database).
export default function FeedbackSection() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [url, setUrl] = useState('#');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !rating) { setError('Please add your name, a rating and your feedback'); return; }
    setError('');
    const stars = '\u2605'.repeat(Number(rating)) + '\u2606'.repeat(5 - Number(rating));
    const link = whatsappLink(`Feedback for ${site.name}\nName: ${name.trim()}\nRating: ${stars} (${rating}/5)\nFeedback: ${message.trim()}`);
    setUrl(link);
    setLeaving(true);
    setTimeout(() => setSent(true), 450);
    window.open(link, '_blank', 'noopener');
  };

  return (
    <section className="fbsec" id="feedback">
      <div className="wrap split">
        <div>
          <h2>Share your feedback</h2>
          <p className="intro">Bought from us? Tell us how it went. Your feedback helps us improve and helps other buyers.</p>
        </div>
        <div className="fbwrap">
          <form id="fbForm" noValidate className={leaving ? 'sent' : undefined} style={sent ? { display: 'none' } : undefined} onSubmit={onSubmit}>
            <label htmlFor="bName">Your name*</label>
            <input id="bName" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            <label id="rateLbl">Your rating*</label>
            <div className="stars" role="radiogroup" aria-labelledby="rateLbl">
              {STARS.map((n) => (
                <Fragment key={n}>
                  <input type="radio" name="rate" id={`r${n}`} value={n} checked={rating === n} onChange={() => setRating(n)} aria-label={`${n} star${n === '1' ? '' : 's'}`} />
                  <label htmlFor={`r${n}`} title={`${n} star${n === '1' ? '' : 's'}`}>&#9733;</label>
                </Fragment>
              ))}
            </div>
            <label htmlFor="bMsg">Your feedback*</label>
            <textarea id="bMsg" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} />
            <p className="err" id="bErr" role="alert">{error}</p>
            <button className="btn" type="submit">Send feedback</button>
          </form>
          <div className={`done${sent ? ' show' : ''}`} id="bDone" aria-live="polite">
            <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" /><path d="M15 27l8 8 14-16" /></svg>
            <h3>Thank you!</h3>
            <p>We value your feedback. If WhatsApp did not open, tap the button.</p>
            <a className="btn wa" id="bLink" href={url} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
