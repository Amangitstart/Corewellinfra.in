import { Link } from 'react-router-dom';
import LegalPage from '../../components/legal/LegalPage.jsx';
import CookieDetails from './CookieDetails.jsx';
import { ROUTES } from '../../config/routes.js';
import { site } from '../../config/site.js';

export default function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      description={`Cookies and similar storage on the ${site.name} website.`}
      path={ROUTES.cookies}
      updated="10 October 2026"
    >
      <p>This page explains the cookies and similar storage used on the {site.name} website.</p>
      <CookieDetails />
      <p>For what happens to the details you send in an enquiry, read our <Link to={ROUTES.privacy}>Privacy Policy</Link>.</p>
    </LegalPage>
  );
}
