import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://hair-salon-link-production.up.railway.app').replace(/\/$/, '');
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // 公開予約ページを店舗ごとに列挙 (active のみ)
  let salonPages: MetadataRoute.Sitemap = [];
  try {
    const salons = await prisma.salon.findMany({
      where: { status: { not: 'suspended' } },
      select: { slug: true, updatedAt: true },
      take: 500,
    });
    salonPages = salons.flatMap((s) => [
      { url: `${base}/book/${s.slug}`, lastModified: s.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 },
      { url: `${base}/book/${s.slug}/menu`, lastModified: s.updatedAt, changeFrequency: 'weekly' as const, priority: 0.5 },
      { url: `${base}/book/${s.slug}/styles`, lastModified: s.updatedAt, changeFrequency: 'weekly' as const, priority: 0.4 },
    ]);
  } catch {
    // DB 未接続でもビルドを壊さない
  }

  return [...staticEntries, ...salonPages];
}
