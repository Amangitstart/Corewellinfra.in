// Small reusable icons.

const PHONE_PATH =
  'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z';

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={PHONE_PATH} />
    </svg>
  );
}

export function WhatsAppFloatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      <g transform="translate(6.6 6.4) scale(.45)"><path d={PHONE_PATH} /></g>
    </svg>
  );
}

export function WhatsAppButtonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path style={{ fill: 'none' }} d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      <path style={{ fill: '#fff' }} d="M8.6 8.4c.3 3 3.2 5.9 6.4 6.7l1.5-1.5-2-1-.9.9c-1-.4-2-1.4-2.4-2.4l.9-.9-1-2z" />
    </svg>
  );
}
