import { useEffect, useRef } from 'react';

// Thin red line at the top of the page that grows as you scroll.
export default function ProgressBar() {
  const ref = useRef(null);
  useEffect(() => {
    const bar = ref.current;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div className="progress" id="progress" ref={ref} aria-hidden="true" />;
}
