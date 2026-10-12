import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js';

// Full-screen photo viewer with next/previous, keyboard, swipe and a focus trap.
// index === null means closed.
export default function Lightbox({ photos, index, onChange, onClose }) {
  const open = index !== null && index !== undefined;
  const [shown, setShown] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swipeStart = useRef(null);
  const count = photos.length;

  // Open / close: lock page scroll, move focus in, and give it back afterwards.
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    setShown(index);
    const frame = requestAnimationFrame(() => setVisible(true));
    document.documentElement.classList.add('lightbox-open');
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(frame);
      setVisible(false);
      document.documentElement.classList.remove('lightbox-open');
      opener?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Fade between photos.
  useEffect(() => {
    if (!open || index === shown) return undefined;
    if (prefersReducedMotion()) { setShown(index); return undefined; }
    setSwapping(true);
    const timer = setTimeout(() => { setShown(index); setSwapping(false); }, 170);
    return () => clearTimeout(timer);
  }, [index, open, shown]);

  // Keyboard: Escape, arrows, and Tab stays inside the viewer.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onChange((index - 1 + count) % count);
      else if (e.key === 'ArrowRight') onChange((index + 1) % count);
      else if (e.key === 'Tab') {
        const items = [closeRef.current, prevRef.current, nextRef.current];
        const at = items.indexOf(document.activeElement);
        e.preventDefault();
        items[(at + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, count, onChange, onClose]);

  if (!open || !photos[shown]) return null;
  const photo = photos[shown];

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('lightbox-stage')) onClose();
  };
  const onTouchEnd = (e) => {
    if (swipeStart.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) onChange((index + (dx < 0 ? 1 : -1) + count) % count);
  };

  return (
    <div
      className={`lightbox${visible ? ' on' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onBackdrop}
      onTouchStart={(e) => { swipeStart.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      <button ref={closeRef} className="lightbox-btn lightbox-close" type="button" aria-label="Close photo viewer" onClick={onClose}>&#10005;</button>
      <button ref={prevRef} className="lightbox-btn lightbox-prev" type="button" aria-label="Previous photo" onClick={() => onChange((index - 1 + count) % count)}>&#10094;</button>
      <button ref={nextRef} className="lightbox-btn lightbox-next" type="button" aria-label="Next photo" onClick={() => onChange((index + 1) % count)}>&#10095;</button>
      <div className="lightbox-stage">
        <img className={`lightbox-img${swapping ? ' swap' : ''}`} src={photo.src} alt={photo.alt} />
      </div>
      <div className="lightbox-bar" aria-live="polite">
        <span className="lightbox-count">{shown + 1} / {count}</span>
        <span className="lightbox-cap">{photo.caption || photo.alt}</span>
      </div>
    </div>
  );
}
