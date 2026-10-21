import { useEffect } from 'react';

const SELECTORS = [
  '.fbwrap', 'section h2', '.intro', '.card', '.steps li', '.formwrap',
  '.infogrid>div', '.tile', '.feat .f', '.yfacts li', '.yact',
].join(',');

// Gentle fade-in for blocks as they scroll into view. Only touches CSS classes (rv / in).
export default function useScrollReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    const elements = [...document.querySelectorAll(SELECTORS)];
    elements.forEach((el, n) => { el.classList.add('rv'); el.style.transitionDelay = `${(n % 4) * 90}ms`; observer.observe(el); });
    return () => {
      observer.disconnect();
      elements.forEach((el) => { el.classList.remove('rv', 'in'); el.style.transitionDelay = ''; });
    };
  }, []);
}
