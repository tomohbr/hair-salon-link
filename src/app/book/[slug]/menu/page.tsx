// 公開メニューページ（LINE リッチメニューから直接飛ぶための専用ページ）
import { getPublicSalonBySlug } from '@/lib/salonData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

function yen(n: number) {
  return '¥' + n.toLocaleString();
}

export default async function PublicMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const salon = await getPublicSalonBySlug(slug);
  if (!salon) return notFound();

  const byCategory: Record<string, typeof salon.menus> = {};
  salon.menus.forEach((m) => {
    if (!byCategory[m.category]) byCategory[m.category] = [];
    byCategory[m.category].push(m);
  });

  return (
    <div className="app-light min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3">
          <Link href={`/book/${slug}`} className="text-stone-500 hover:text-stone-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-stone-500">{salon.name}</div>
            <h1 className="text-lg font-bold text-stone-900 leading-tight">メニュー</h1>
          </div>
          <Link href={`/book/${slug}?source=line`} className="btn-brand text-xs px-3 py-1.5">
            予約する
          </Link>
        </header>

        {/* Menu list */}
        <main className="p-4 space-y-6">
          {salon.menus.length === 0 ? (
            <p className="text-center text-sm text-stone-500 py-12">メニューが登録されていません</p>
          ) : (
            Object.entries(byCategory).map(([cat, items]) => (
              <section key={cat}>
                <h2 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
                  {cat}
                </h2>
                <div className="space-y-2">
                  {items.map((m) => (
                    <article key={m.id} className="border border-stone-200 rounded-xl p-3.5 bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-stone-900">{m.name}</h3>
                          {m.description && (
                            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                              {m.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-2">
                            <Clock className="w-3 h-3" />
                            {m.durationMinutes}分
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold brand-text text-base">{yen(m.price)}</div>
                          <div className="text-[10px] text-stone-400">税込</div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4">
          <Link
            href={`/book/${slug}?source=line`}
            className="block w-full btn-brand text-center py-3 text-sm"
          >
            このメニューで予約する →
          </Link>
        </div>
      </div>
    </div>
  );
}
