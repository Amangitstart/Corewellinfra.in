import { useEffect } from 'react';
import { prefersReducedMotion } from './usePrefersReducedMotion.js';

// Very small parallax drift on gallery photos. Desktop with a mouse only, never with reduced motion.
export default function useParallax(containerRef) {
  useEffect(() => {
    const allowed = !prefersReducedMotion() && window.matchMedia('(hover: hover) and (min-width: 821px)').matches;
    const root = containerRef.current;
    if (!allowed || !root) return undefined;
    document.documentElement.classList.add('par');
    const buttons = [...root.querySelectorAll('.pfi')];
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      buttons.forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        const c = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2)));
        b.style.setProperty('--py', `${(c * -10).toFixed(1)}px`);
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); document.documentElement.classList.remove('par'); };
  }, [containerRef]);
}
