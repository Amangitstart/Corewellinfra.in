import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, site } from '../../config/site.js';
import useScrollSpy from '../../hooks/useScrollSpy.js';
import { track } from '../../utils/analytics.js';

export default function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem('corewell-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
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

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    window.localStorage.setItem('corewell-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
        <Link to={{ pathname: '/', hash: '#quote' }} className="logo" aria-label={`Get a quote from ${site.name}`}>
          <img className="brand-mark" src="/company-logo.jpg" alt="" aria-hidden="true" />
          <span className="brand-name">{site.shortName}<small>{site.logoSubtitle}</small></span>
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
          <button className="theme-toggle" type="button" onClick={() => setDarkMode((enabled) => !enabled)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <span aria-hidden="true">{darkMode ? '☀' : '☾'}</span>
            <span className="theme-label">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
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
