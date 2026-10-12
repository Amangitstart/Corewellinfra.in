// Page addresses. Change a policy address here and every link, redirect and the sitemap follow.

export const ROUTES = {
  home: '/',
  privacy: '/privacy-policy',
  terms: '/terms-and-conditions',
  refunds: '/refund-policy',
  cookies: '/cookie-policy',
};

// Shown in the footer under "Legal", in this order.
export const legalLinks = [
  { to: ROUTES.privacy, label: 'Privacy Policy' },
  { to: ROUTES.terms, label: 'Terms and Conditions' },
  { to: ROUTES.refunds, label: 'Refund and Cancellation Policy' },
  { to: ROUTES.cookies, label: 'Cookie Policy' },
];

// Old short addresses still work and forward to the new ones (bookmarks, earlier links).
export const legacyRedirects = {
  '/privacy': ROUTES.privacy,
  '/terms': ROUTES.terms,
  '/refunds': ROUTES.refunds,
};

// Every address that belongs in the sitemap.
export const sitemapPaths = [ROUTES.home, ROUTES.privacy, ROUTES.terms, ROUTES.refunds, ROUTES.cookies];
