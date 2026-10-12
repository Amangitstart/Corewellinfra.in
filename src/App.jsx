import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx';
import Terms from './pages/legal/Terms.jsx';
import Refunds from './pages/legal/Refunds.jsx';
import CookiePolicy from './pages/legal/CookiePolicy.jsx';
import { ROUTES, legacyRedirects } from './config/routes.js';
import { prefersReducedMotion } from './hooks/usePrefersReducedMotion.js';

// Scrolls to #section links, or back to the top when you open another page.
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }));
    } else if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

// Old short policy addresses (/privacy, /terms, /refunds) forward to the new ones.
// An old "/privacy#cookies" link goes to the Cookie Policy page.
function LegacyRedirect({ to }) {
  const { hash } = useLocation();
  if (hash === '#cookies') return <Navigate to={ROUTES.cookies} replace />;
  return <Navigate to={{ pathname: to, hash }} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.privacy} element={<PrivacyPolicy />} />
          <Route path={ROUTES.terms} element={<Terms />} />
          <Route path={ROUTES.refunds} element={<Refunds />} />
          <Route path={ROUTES.cookies} element={<CookiePolicy />} />
          {Object.entries(legacyRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<LegacyRedirect to={to} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
