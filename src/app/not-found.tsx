import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="app-light min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--surface-muted)' }}>
      <div className="card-box max-w-lg w-full p-8 text-center">
        <div
          className="w-12 h-12 rounded-xl mx-auto mb-5 flex items-center justify-center"
          style={{ background: 'var(--accent-surface)', color: 'var(--accent-text)' }}
        >
          <Compass className="w-6 h-6" />
        </div>
        <div className="text-[10px] font-semibold tracking-[0.3em] text-stone-500 uppercase mb-2">
          404 · Not Found
        </div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
          ページが見つかりません
        </h1>
        <p className="text-[13.5px] text-stone-500 leading-relaxed mb-6">
          お探しのページは移動・削除されたか、URL が間違っている可能性があります。
        </p>
        <div className="flex items-center justify-center gap-2">
          <Link href="/" className="btn-brand">トップへ戻る</Link>
          <Link href="/dashboard" className="btn-outline">ダッシュボード</Link>
        </div>
      </div>
    </div>
  );
}
