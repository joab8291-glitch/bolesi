const siteUrl = 'https://bolesi.webazi.co.ke';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/account', '/checkout', '/orders'],
    },
    sitemap: siteUrl + '/sitemap.xml',
    host: siteUrl,
  };
}
