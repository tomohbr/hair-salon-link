import { getSalonData } from '@/lib/salonData';
import { yen } from '@/lib/utils/format';
import { Clock } from 'lucide-react';
import ImportExportBar from '@/components/shared/ImportExportBar';
import NewMenuButton from './NewMenuButton';

export default async function MenusPage() {
  const { menus } = await getSalonData();
  const byCategory: Record<string, typeof menus> = {};
  menus.forEach(m => {
    if (!byCategory[m.category]) byCategory[m.category] = [];
    byCategory[m.category].push(m);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">メニュー管理</h1>
          <p className="text-sm text-stone-500 mt-1">全 {menus.length}メニュー</p>
        </div>
        <div className="flex items-center gap-2">
          <ImportExportBar
            label="メニュー"
            importUrl="/api/menus/import"
            exportUrl="/api/menus/export"
            templateHeaders={['メニュー名', 'カテゴリ', '料金', '所要時間', '説明', '公開']}
            templateFilename="menus_template.csv"
          />
          <NewMenuButton categories={Array.from(new Set(menus.map(m => m.category)))} />
        </div>
      </div>

      {menus.length === 0 ? (
        <div className="card-box text-center py-10">
          <p className="text-sm text-stone-500">メニューがまだ登録されていません。最初のメニューを追加しましょう。</p>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, ms]) => (
          <div key={cat}>
            <h2 className="text-sm font-semibold text-stone-600 mb-3 uppercase tracking-wider">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ms.map(m => (
                <div key={m.id} className="card-box hover:border-pink-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-stone-900">{m.name}</h3>
                    {m.isActive ? <span className="badge badge-green">公開</span> : <span className="badge badge-gray">非公開</span>}
                  </div>
                  <p className="text-xs text-stone-500 mb-3 h-8">{m.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-xs text-stone-500">
                      <Clock className="w-3 h-3" />{m.durationMinutes}分
                    </div>
                    <div className="font-bold brand-text">{yen(m.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
