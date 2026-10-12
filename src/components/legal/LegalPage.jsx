import { Link } from 'react-router-dom';
import usePageMeta from '../../hooks/usePageMeta.js';
import { ROUTES } from '../../config/routes.js';

// Shared frame for every policy page: Back link, heading, "last updated" date, then the policy text.
export default function LegalPage({ title, description, path, updated, children }) {
  usePageMeta({ title, description, path });
  return (
    <main className="legal" id="main" style={{ background: '#fff' }}>
      <Link className="legal-back" to={ROUTES.home}>&larr; Back to home</Link>
      <h1>{title}</h1>
      <p className="upd">Last updated: {updated}</p>
      {children}
    </main>
  );
}
