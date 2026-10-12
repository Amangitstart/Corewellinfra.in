import { GA_MEASUREMENT_ID } from '../config/env.js';

// Analytics is OFF unless VITE_GA_MEASUREMENT_ID is set AND the visitor accepts cookies.

const CONSENT_KEY = 'cw_consent';
export const analyticsEnabled = Boolean(GA_MEASUREMENT_ID);

export function getConsent() {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}
export function setConsent(value) {
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage blocked: ignore */ }
}

let loaded = false;
export function loadAnalytics() {
  if (!analyticsEnabled || loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

// Sends an event only if the visitor accepted analytics.
export function track(name, params = {}) {
  if (window.gtag && getConsent() === 'yes') window.gtag('event', name, params);
}
