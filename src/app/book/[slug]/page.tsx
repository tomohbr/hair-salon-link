import { getPublicSalonBySlug } from '@/lib/salonData';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import BookingFlow from './BookingFlow';

/**
 * 流入元の決定優先順位:
 *   1. ?source=line (明示指定)
 *   2. LINE アプリ内ブラウザ (UA に 'Line/' を含む) → line
 *   3. それ以外 → web (自社HP)
 */
function detectSource(spSource: string | undefined, ua: string): 'line' | 'web' | 'hotpepper' {
  if (spSource === 'line' || spSource === 'web' || spSource === 'hotpepper') return spSource;
  if (/Line\//.test(ua)) return 'line';
  return 'web';
}

export default async function BookPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ source?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const salon = await getPublicSalonBySlug(slug);
  if (!salon) return notFound();

  const h = await headers();
  const ua = h.get('user-agent') || '';
  const source = detectSource(sp.source, ua);

  return (
    <BookingFlow
      slug={slug}
      source={source}
      salon={{
        name: salon.name,
        description: salon.description,
        address: salon.address,
        phone: salon.phone,
      }}
      menus={salon.menus.map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        price: m.price,
        durationMinutes: m.durationMinutes,
        description: m.description,
      }))}
      coupons={salon.coupons.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
      }))}
      designs={salon.designs.slice(0, 6).map((d) => ({
        id: d.id,
        title: d.title,
        likesCount: d.likesCount,
      }))}
    />
  );
}
