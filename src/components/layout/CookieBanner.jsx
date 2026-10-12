import { ROUTES } from '../../config/routes.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsEnabled, getConsent, loadAnalytics, setConsent } from '../../utils/analytics.js';

// Only appears when Google Analytics is switched on (VITE_GA_MEASUREMENT_ID is set).
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return undefined;
    const choice = getConsent();
    if (choice === 'yes') loadAnalytics();
    else if (choice !== 'no') setShow(true);
    const reopen = () => setShow(true);
    window.addEventListener('cw:open-cookie-settings', reopen);
    return () => window.removeEventListener('cw:open-cookie-settings', reopen);
  }, []);

  useEffect(() => { document.body.classList.toggle('cb', show); }, [show]);

  if (!analyticsEnabled) return null;

  const accept = () => { setConsent('yes'); loadAnalytics(); setShow(false); };
  const decline = () => {
    const wasAccepted = getConsent() === 'yes';
    setConsent('no');
    setShow(false);
    if (wasAccepted) window.location.reload(); // stops analytics that were already loaded
  };

  return (
    <div className={`cookie${show ? ' show' : ''}`} id="cookie" role="dialog" aria-label="Cookie choices">
      <p>
        We use cookies to count visits and see which ads bring enquiries. They are off unless you accept.{' '}
        <Link to={ROUTES.cookies}>Learn more</Link>
      </p>
      <div className="row">
        <button className="btn" type="button" onClick={accept}>Accept</button>
        <button className="btn ghost" type="button" onClick={decline}>Decline</button>
      </div>
    </div>
  );
}
