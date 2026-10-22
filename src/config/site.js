// Business facts used across the site. Change them here once and every page updates.
// (Only real details from the existing website. Nothing here is invented.)

export const site = {
  name: 'Corewell Infra Developers',
  shortName: 'Corewell',
  logoSubtitle: 'INFRA DEVELOPERS',
  description:
    'Building and road construction, paver blocks, sand and gravel supply, and construction equipment rental from Corewell Infra Developers, Shivpur, Varanasi. Get a quote on WhatsApp.',
  tagline: 'Construction, paver blocks, building materials and equipment rental in Shivpur, Varanasi.',
  phone: '+918533861394', // used in tel: links
  phoneDisplay: '+91 8533861394',
  whatsappNumber: '918533861394', // country code + number, no + or spaces
  email: 'corewellinfradevelopers@gmail.com',
  address: {
    street: 'Arazi No. 19, Mahesh Nagar Colony, Nawalpur, Shivpur',
    locality: 'Varanasi',
    postalCode: '221003',
    country: 'IN',
    full: 'Arazi No. 19, Mahesh Nagar Colony, Nawalpur, Shivpur, Varanasi 221003',
    lines: ['Arazi No. 19, Mahesh Nagar Colony,', 'Nawalpur, Shivpur, Varanasi 221003'],
    short: 'Mahesh Nagar Colony, Shivpur, Varanasi 221003',
  },
  ogImage: '/images/red.jpg',
};

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'feedback', label: 'Feedback' },
];

export const whatsappLink = (text) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mailtoLink = `mailto:${site.email}?subject=${encodeURIComponent(`Enquiry for ${site.name}`)}`;

// Short list printed on the business card.
export const cardServices = [
  'Building & Construction',
  'Civil Engineering & Infrastructure',
  'Real Estate Development',
];
