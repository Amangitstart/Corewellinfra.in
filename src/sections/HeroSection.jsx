import { useEffect, useState } from 'react';
import { heroSlides } from '../data/photos.js';
import { prefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const count = heroSlides.length;
  const go = (n) => { setIndex((n + count) % count); setRestartKey((k) => k + 1); };

  // Auto-advance every 5 seconds (not with "reduce motion"). Restarts after a manual change.
  useEffect(() => {
    if (prefersReducedMotion() || count <= 1) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(timer);
  }, [restartKey, count]);

  return (
    <section className="hero" id="home" style={{ padding: 0 }} role="region" aria-roledescription="carousel" aria-label="Corewell photos">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.src}
          className={`slide${i === index ? ' on' : ''}`}
          style={{ backgroundImage: `url(${slide.src})`, backgroundPosition: slide.position }}
        />
      ))}
      {count > 1 && (
        <>
          <button className="arrow prev" type="button" aria-label="Previous photo" onClick={() => go(index - 1)}>&#10094;</button>
          <button className="arrow next" type="button" aria-label="Next photo" onClick={() => go(index + 1)}>&#10095;</button>
        </>
      )}
      <div className="wrap">
        <h1>Construction and <em>building materials</em><br />for Varanasi and nearby</h1>
        <p>Building and road construction, paver blocks, sand and gravel, and equipment rental from Corewell Infra Developers, Varanasi. Tell us what you need and we will send a quote.</p>
        <div className="actions">
          <a className="btn" href="#quote">Get a Quote</a>
          <a className="btn ghost" href="#products">View Products</a>
        </div>
      </div>
      {count > 1 && (
        <div className="dots">
          {heroSlides.map((slide, i) => (
            <button key={slide.src} type="button" aria-label={`Photo ${i + 1}`} aria-current={i === index ? 'true' : undefined} className={i === index ? 'on' : undefined} onClick={() => go(i)} />
          ))}
        </div>
      )}
    </section>
  );
}
