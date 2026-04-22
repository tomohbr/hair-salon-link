'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[page error]', error);
  }, [error]);

  return (
    <div className="app-light min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--surface-muted)' }}>
      <div className="card-box max-w-lg w-full p-8 text-center">
        <div
          className="w-12 h-12 rounded-xl mx-auto mb-5 flex items-center justify-center"
          style={{ background: 'var(--danger-surface)', color: 'var(--danger-text)' }}
        >
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold text-stone-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
          予期しないエラーが発生しました
        </h1>
        <p className="text-[13.5px] text-stone-500 leading-relaxed mb-6">
          一時的な問題の可能性があります。再読み込みをお試しください。<br />
          繰り返し発生する場合はサポートまでご連絡ください。
        </p>

        {error.digest && (
          <div
            className="mb-6 p-2.5 rounded-md text-[11px] font-mono text-stone-500 border"
            style={{ background: 'var(--surface-muted)', borderColor: 'var(--line)' }}
          >
            ref: {error.digest}
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={reset} className="btn-brand">
            <RefreshCw className="w-3.5 h-3.5" />
            再読み込み
          </button>
          <Link href="/" className="btn-outline">
            トップへ
          </Link>
        </div>
      </div>
    </div>
  );
}
