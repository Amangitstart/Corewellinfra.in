import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, site } from '../../config/site.js';
import useScrollSpy from '../../hooks/useScrollSpy.js';
import { track } from '../../utils/analytics.js';

export default function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const ids = useMemo(() => navLinks.map((l) => l.id), []);
  const active = useScrollSpy(ids, pathname === '/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on outside click or Escape.
  useEffect(() => {
    const onClick = (e) => {
      if (!navRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="wrap">
        <Link to={{ pathname: '/', hash: '#home' }} className="logo" aria-label={`${site.name} home`}>
          <img src="/logo.svg" alt={site.name} />
        </Link>
        <nav id="nav" aria-label="Main" ref={navRef} className={menuOpen ? 'open' : ''} onClick={(e) => { if (e.target.tagName === 'A') setMenuOpen(false); }}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={{ pathname: '/', hash: `#${link.id}` }}
                  className={active === link.id ? 'active' : undefined}
                  aria-current={active === link.id ? 'true' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hright">
          <Link className="btn hcta" to={{ pathname: '/', hash: '#quote' }} onClick={() => track('cta_click', { place: 'header' })}>Get a quote</Link>
          <button
            ref={menuRef}
            className="menu"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
