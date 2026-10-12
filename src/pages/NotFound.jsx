import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import { site } from '../config/site.js';

export default function NotFound() {
  usePageMeta({ title: 'Page not found', description: 'This page does not exist.', path: '/404' });
  return (
    <main id="main" className="notfound">
      <h1>Page not found</h1>
      <p>This page does not exist. Go back to our home page, or call us on <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>.</p>
      <Link className="btn" to="/">Back to home</Link>
    </main>
  );
}
