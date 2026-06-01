'use client';

import { useEffect, useState } from 'react';
import { Mail, X, Check, AlertCircle, Send } from 'lucide-react';

type State =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'ok'; message: string }
  | { status: 'error'; message: string };

export default function InquiryForm({
  triggerLabel = '資料請求 / お問合せ',
  source = 'lp',
  buttonClass = 'btn-cta-ghost',
}: {
  triggerLabel?: string;
  source?: string;
  buttonClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status === 'sending') return;
    setState({ status: 'sending' });
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      salonName: String(fd.get('salonName') || ''),
      message: String(fd.get('message') || ''),
      website: String(fd.get('website') || ''), // honeypot
      source,
    };
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ status: 'error', message: data?.error || 'エラーが発生しました' });
        return;
      }
      setState({ status: 'ok', message: 'お問合せを受け付けました。2 営業日以内に返信します。' });
    } catch {
      setState({ status: 'error', message: 'ネットワークエラー。しばらく時間をおいてお試しください。' });
    }
  }

  function reset() {
    setOpen(false);
    setState({ status: 'idle' });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass} style={{ cursor: 'pointer' }}>
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end md:items-center justify-center px-3 md:px-6"
          onClick={reset}
        >
          <div
            className="w-full max-w-lg bg-[#1b1510] border border-[#48382a] rounded-t-2xl md:rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#302519]">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c9a675]" />
                <h2 className="text-[15px] font-semibold text-[#efe3c8]">お問合せ / 資料請求</h2>
              </div>
              <button onClick={reset} className="text-[#a89778] hover:text-[#efe3c8] transition" aria-label="閉じる">
                <X className="w-5 h-5" />
              </button>
            </div>

            {state.status === 'ok' ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="display-serif text-[#efe3c8] text-[18px] mb-2">ありがとうございました</h3>
                <p className="text-[13px] text-[#bdaa88] leading-relaxed">{state.message}</p>
                <p className="text-[11px] text-[#7a6850] mt-3 leading-relaxed">受領メールを送信しています。届かない場合は迷惑メールフォルダもご確認ください。</p>
                <button onClick={reset} className="mt-5 inline-flex items-center gap-1.5 text-[12px] tracking-[0.1em] text-[#c9a675] hover:text-[#efe3c8]">
                  閉じる
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-5 space-y-3">
                {state.status === 'error' && (
                  <div className="flex items-start gap-2 p-2.5 rounded bg-red-950/50 border border-red-700/50 text-[12px] text-red-200">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{state.message}</span>
                  </div>
                )}

                {/* honeypot — 通常見えない */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden>
                  <label>Website</label>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <Field label="お名前" name="name" required placeholder="山田 太郎" />
                <Field label="店舗名" name="salonName" placeholder="○○ヘアサロン (任意)" />
                <Field label="メールアドレス" name="email" type="email" required placeholder="you@example.jp" />
                <Field label="電話番号" name="phone" type="tel" placeholder="090-XXXX-XXXX (任意)" />

                <div>
                  <label className="block text-[11px] tracking-[0.1em] text-[#a89778] mb-1.5">お問合せ内容 *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    maxLength={4000}
                    placeholder="導入を検討しています。デモ画面を見せていただけますか？ など"
                    className="w-full bg-[#14100c] border border-[#48382a] focus:border-[#c9a675] outline-none rounded px-3 py-2.5 text-[13px] text-[#efe3c8] placeholder:text-[#6b5b44] transition-colors"
                  />
                </div>

                <p className="text-[10.5px] text-[#7a6850] leading-relaxed">
                  送信することで <a href="/legal/privacy" className="underline underline-offset-2 text-[#c9a675]" target="_blank">プライバシーポリシー</a> に同意したものとみなします。返信は 2 営業日以内 (平日)。
                </p>

                <button
                  type="submit"
                  disabled={state.status === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-[#d9b986] to-[#b88a4a] text-[#14100c] text-[13px] font-semibold tracking-[0.1em] rounded transition hover:from-[#e8c898] hover:to-[#c69b58] disabled:opacity-60"
                >
                  {state.status === 'sending' ? (
                    <>送信中...</>
                  ) : (
                    <><Send className="w-3.5 h-3.5" />送信する</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label, name, type = 'text', required = false, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.1em] text-[#a89778] mb-1.5">
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-[#14100c] border border-[#48382a] focus:border-[#c9a675] outline-none rounded px-3 py-2.5 text-[13px] text-[#efe3c8] placeholder:text-[#6b5b44] transition-colors"
      />
    </div>
  );
}
