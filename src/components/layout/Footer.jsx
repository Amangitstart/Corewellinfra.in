import { Link } from 'react-router-dom';
import { site } from '../../config/site.js';
import { legalLinks } from '../../config/routes.js';
import { analyticsEnabled } from '../../utils/analytics.js';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>&copy; {new Date().getFullYear()} {site.name} &middot; {site.address.full}</span>
        <nav className="footlegal" aria-label="Legal">
          <strong>Legal</strong>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
            ))}
          </ul>
          {analyticsEnabled && (
            <button type="button" id="cookieSettings" onClick={() => window.dispatchEvent(new Event('cw:open-cookie-settings'))}>
              Cookie settings
            </button>
          )}
        </nav>
      </div>
    </footer>
  );
}
