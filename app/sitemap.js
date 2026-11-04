const siteUrl = 'https://bolesi.webazi.co.ke';
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://bolesi-backend.onrender.com').replace(/\/$/, '');

export default async function sitemap() {
  const now = new Date();
  const entries = [
    { url: siteUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: siteUrl + '/products', lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ];

  try {
    const response = await fetch(apiUrl + '/api/products?limit=100', {
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      const data = await response.json();
      const products = Array.isArray(data) ? data : (data.products || data.items || []);
      for (const product of products) {
        if (!product || product.status === 'DRAFT' || product.isActive === false || !product.slug) continue;
        entries.push({
          url: siteUrl + '/products/' + encodeURIComponent(product.slug),
          lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // Keep the core storefront URLs available if the API is temporarily offline.
  }

  return entries;
}
