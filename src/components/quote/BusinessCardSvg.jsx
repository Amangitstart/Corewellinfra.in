import { site, cardServices } from '../../config/site.js';

const PHONE_PATH =
  'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z';

// The business card drawn as an SVG. Text comes from src/config/site.js.
// The same SVG is what gets exported as PNG / PDF, so the download always matches the screen.
export default function BusinessCardSvg({ svgRef }) {
  const [line1, line2] = site.address.lines;
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1050 600"
      role="img"
      aria-label={`${site.name} business card with services, phone, email and address`}
      fontFamily="'Helvetica Neue',Arial,Helvetica,sans-serif"
    >
      <defs><clipPath id="bcClip"><rect width="1050" height="600" rx="28" /></clipPath></defs>
      <g clipPath="url(#bcClip)">
        <rect width="1050" height="600" fill="#151515" />
        <circle cx="980" cy="60" r="190" fill="#c63a2b" opacity=".14" />
        <rect width="16" height="600" fill="#c63a2b" />
        <text x="60" y="110" fontSize="64" fontWeight="800" letterSpacing="6" fill="#fff">{site.shortName.toUpperCase()}</text>
        <rect x="60" y="128" width="90" height="6" fill="#c63a2b" />
        <text x="60" y="172" fontSize="24" letterSpacing="7" fill="#bdb7ae">{site.logoSubtitle}</text>
        <text x="60" y="226" fontSize="22" fill="#e8e4de">Construction &#183; Real Estate &#183; Infrastructure</text>
        <text x="60" y="296" fontSize="18" fontWeight="700" letterSpacing="4" fill="#ff7a66">WHAT WE DO</text>
        <g fill="#fff" fontSize="26">
          {cardServices.map((label, i) => (
            <g key={label}>
              <circle cx="68" cy={336 + i * 44} r="6" fill="#c63a2b" />
              <text x="90" y={345 + i * 44}>{label}</text>
            </g>
          ))}
        </g>
        <rect x="530" y="250" width="480" height="300" rx="18" fill="#fff" />
        <g fill="none" stroke="#c63a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path transform="translate(562,292) scale(1.5)" fill="#c63a2b" stroke="none" d={PHONE_PATH} />
          <path transform="translate(562,380) scale(1.5)" d="M3 6h18v12H3zM3 7l9 7 9-7" />
          <path transform="translate(562,448) scale(1.5)" d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        </g>
        <text x="618" y="320" fontSize="34" fontWeight="800" fill="#111">{site.phoneDisplay}</text>
        <text x="618" y="347" fontSize="17" fill="#5b5b5b">Call or WhatsApp</text>
        <text x="618" y="408" fontSize="25" fontWeight="600" fill="#111">{site.email}</text>
        <text x="618" y="468" fontSize="20" fill="#111">{line1}</text>
        <text x="618" y="496" fontSize="20" fill="#111">{line2}</text>
      </g>
    </svg>
  );
}
