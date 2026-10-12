import { useEffect, useRef, useState } from 'react';

// Tells you when an element has scrolled into view (used for the fade-in effects).
// Uses IntersectionObserver, plus a scroll check as a backup so nothing stays hidden.
export default function useInView({ threshold = 0.12 } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    if (!('IntersectionObserver' in window)) { setSeen(true); return undefined; }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(el);

    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) { setSeen(true); observer.disconnect(); }
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [seen, threshold]);

  return [ref, seen];
}
