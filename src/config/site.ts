export const siteConfig = {
  name: 'Warewise',
  shortName: 'Warewise',
  description:
    'Complete inventory management solution for small Indian businesses with vendor management, billing, POS, customer management and accounting',
  tagline: 'Smart Inventory Management for Growing Indian Businesses',
  url: 'https://warewise.rnxj.dev',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  creator: '@rnxj',
  keywords: [
    'inventory management',
    'small business software',
    'vendor management',
    'billing software',
    'point of sale',
    'customer management',
    'accounting software',
    'warehouse management',
    'inventory tracking',
    'business management',
    'indian businesses',
    'GST billing',
    'stock management',
    'supply chain',
    'retail management',
  ],
  author: {
    name: 'Reuel Nixon',
    email: 'reuelnixon@gmail.com',
    url: 'https://rnxj.dev',
  },
  social: {
    twitter: '@_rnxj',
    github: 'rnxj',
  },
} as const;

export type SiteConfig = typeof siteConfig;
