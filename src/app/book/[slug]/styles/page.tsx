// 公開スタイルギャラリーページ（LINE リッチメニューから直接飛ぶための専用ページ）
import { getPublicSalonBySlug } from '@/lib/salonData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PublicStylesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const salon = await getPublicSalonBySlug(slug);
  if (!salon) return notFound();

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
            <h1 className="text-lg font-bold text-stone-900 leading-tight">スタイルギャラリー</h1>
          </div>
          <Link href={`/book/${slug}?source=line`} className="btn-brand text-xs px-3 py-1.5">
            予約する
          </Link>
        </header>

        {/* Gallery */}
        <main className="p-4">
          {salon.designs.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-10 h-10 brand-text mx-auto mb-3 opacity-40" />
              <p className="text-sm text-stone-500">スタイル写真は準備中です</p>
              <p className="text-xs text-stone-400 mt-1">お気軽にお問合せください</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {salon.designs.map((d) => (
                <article key={d.id} className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                  <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white/60" />
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-semibold text-xs text-stone-900 truncate">{d.title}</h3>
                    {d.category && (
                      <span className="badge badge-gray text-[9px] mt-1">{d.category}</span>
                    )}
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-stone-500">
                      <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                      {d.likesCount}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4">
          <Link
            href={`/book/${slug}?source=line`}
            className="block w-full btn-brand text-center py-3 text-sm"
          >
            この雰囲気で予約する →
          </Link>
        </div>
      </div>
    </div>
  );
}
