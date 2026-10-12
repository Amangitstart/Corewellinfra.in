import { useEffect, useState } from 'react';

// Returns the id of the section currently in view (used to underline the menu item).
export default function useScrollSpy(ids, enabled = true) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled) { setActive(null); return undefined; }
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = window.innerHeight * 0.35;
      let current = null;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = id;
      });
      setActive(current);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids, enabled]);
  return active;
}
