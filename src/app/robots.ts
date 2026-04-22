import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://hair-salon-link-production.up.railway.app';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/dashboard', '/reservations', '/customers', '/menus', '/sales', '/inventory', '/coupons', '/messages', '/analytics', '/settings', '/superadmin', '/account', '/api', '/book/*/history'] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
