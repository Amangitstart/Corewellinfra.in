import { useCallback, useEffect, useRef, useState } from 'react';
import { workSlides } from '../data/photos.js';
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

// "Our work" slider: swipe, arrows, thumbnails and a gentle auto-advance.
export default function WorkSection() {
  const trackRef = useRef(null);
  const current = useRef(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const autoScrolling = useRef(null); // set while our own smooth scroll is running
  const count = workSlides.length;

  const goTo = useCallback((n, byUser = false) => {
    const next = (n + count) % count;
    current.current = next;
    setIndex(next);
    const track = trackRef.current;
    clearTimeout(autoScrolling.current);
    autoScrolling.current = setTimeout(() => { autoScrolling.current = null; }, 800);
    track?.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
    if (byUser) setRestartKey((k) => k + 1);
  }, [count]);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return undefined;
    const timer = setInterval(() => goTo(current.current + 1), 4500);
    return () => clearInterval(timer);
  }, [paused, restartKey, goTo]);

  const onScroll = () => {
    if (autoScrolling.current) return; // ignore the in-between positions of our own scroll
    const track = trackRef.current;
    const n = Math.round(track.scrollLeft / track.clientWidth);
    if (n !== current.current) { current.current = n; setIndex(n); }
  };

  return (
    <section id="work" style={{ paddingBottom: 100 }}>
      <div className="wrap">
        <h2>Our work</h2>
        <p className="intro">A look at our stock and yard. Swipe, tap the arrows or pick a photo below.</p>
        <div className="workbox" id="workbox" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
          <div className="wtrack" id="wtrack" ref={trackRef} tabIndex={0} aria-label="Photo slides" onScroll={onScroll}>
            {workSlides.map((w) => (
              <figure className="ws" key={w.title}>
                <img src={w.src} alt={w.title} style={w.position ? { objectPosition: w.position } : undefined} loading="lazy" decoding="async" />
                <figcaption><b>{w.title}</b><span>{w.text}</span></figcaption>
              </figure>
            ))}
          </div>
          <button className="wnav wprev" type="button" aria-label="Previous slide" onClick={() => goTo(index - 1, true)}>&#10094;</button>
          <button className="wnav wnext" type="button" aria-label="Next slide" onClick={() => goTo(index + 1, true)}>&#10095;</button>
          <span className="wcount" id="wcount">{index + 1} / {count}</span>
        </div>
        <div className="wthumbs" id="wthumbs">
          {workSlides.map((w, n) => (
            <button key={w.title} type="button" className={n === index ? 'on' : undefined} aria-label={`Show photo ${n + 1}`} onClick={() => goTo(n, true)}>
              <img src={w.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
