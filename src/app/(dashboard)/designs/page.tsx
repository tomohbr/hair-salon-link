import { getSalonData } from '@/lib/salonData';
import { Heart, Sparkles } from 'lucide-react';
import { canAccessFeature } from '@/lib/planLimits';

export default async function DesignsPage() {
  const { salon, designs, staff } = await getSalonData();
  // プランチェック: pro のみ
  if (!canAccessFeature(salon.plan, 'designs')) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">プランのアップグレードが必要です</h1>
        <p className="text-stone-600 mb-6">この機能は Pro プランでご利用いただけます。</p>
        <a href="/settings" className="btn-brand">設定画面でプラン変更</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">スタイルギャラリー</h1>
          <p className="text-sm text-stone-500 mt-1">公開中 {designs.length}デザイン</p>
        </div>
        <button className="btn-brand">+ デザイン追加</button>
      </div>

      <div className="card-box brand-light-bg border-pink-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 brand-text mt-0.5" />
          <div>
            <h3 className="font-semibold brand-text">差別化機能：スタイルギャラリー</h3>
            <p className="text-xs text-stone-600 mt-1">
              競合の管理SaaS（リピッテ・LiME等）にはないビジュアル訴求機能。
            </p>
          </div>
        </div>
      </div>

      {designs.length === 0 ? (
        <div className="card-box text-center py-10">
          <p className="text-sm text-stone-500">デザインがまだ登録されていません。</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {designs.map(d => (
            <div key={d.id} className="card-box p-3 hover:shadow-md transition-shadow">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-100 via-purple-100 to-amber-100 flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-white/70" />
              </div>
              <h3 className="font-semibold text-sm text-stone-900">{d.title}</h3>
              <div className="text-xs text-stone-500 mt-0.5">{staff.find(s => s.id === d.staffId)?.name}</div>
              <div className="flex items-center gap-2 mt-3">
                <span className="badge badge-gray">{d.category}</span>
                <div className="ml-auto flex items-center gap-1 text-xs text-stone-500">
                  <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                  {d.likesCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
