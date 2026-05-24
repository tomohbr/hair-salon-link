'use client';

import { useActionState, useState } from 'react';
import { Copy, Check, RefreshCw, AlertTriangle, Mail, Zap, ChevronDown } from 'lucide-react';
import { rotateHpbInboundTokenAction } from './settings-actions';

export default function HpbInboundForm({
  initialToken,
  baseUrl,
  slug,
  emailDomain,
}: {
  initialToken: string | null;
  baseUrl: string;
  slug: string;
  emailDomain: string;
}) {
  const [state, formAction, pending] = useActionState(rotateHpbInboundTokenAction, null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const token = state?.token ?? initialToken;
  const forwardingEmail = `${slug}@${emailDomain}`;
  const webhookUrl = token
    ? `${baseUrl.replace(/\/$/, '')}/api/inbound/hpb/${token}`
    : null;

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch { /* noop */ }
  }

  return (
    <div className="space-y-4">
      {state?.ok && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
          <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {state.message}
        </div>
      )}
      {state?.error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {state.error}
        </div>
      )}

      {/* === 推奨: メール転送方式 === */}
      <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
        <div className="flex items-center gap-1.5 mb-2">
          <Mail className="w-4 h-4 text-emerald-700" />
          <div className="text-[12px] font-semibold text-emerald-900">
            あなた専用の HPB 転送先メールアドレス
          </div>
          <span className="ml-auto text-[10px] tracking-wider uppercase text-emerald-700 font-medium">推奨 ・ 即時連携</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-[12px] bg-white border border-emerald-200 rounded px-2.5 py-2 break-all font-mono">
            {forwardingEmail}
          </code>
          <button
            type="button"
            onClick={() => copy(forwardingEmail, 'email')}
            className="text-[11px] px-2.5 py-2 border border-emerald-300 rounded bg-white text-emerald-800 flex items-center gap-1 flex-shrink-0 hover:bg-emerald-50"
          >
            {copiedKey === 'email' ? <><Check className="w-3 h-3" />済</> : <><Copy className="w-3 h-3" />コピー</>}
          </button>
        </div>
        <p className="text-[10px] text-emerald-800/80 mt-2 leading-relaxed">
          このアドレスに HPB の予約確定メールが転送されると、即座にこちらの予約枠に反映されます。<br />
          下の手順で Gmail (または現在 HPB メールを受けているメール) から自動転送を設定するだけ。
        </p>
      </div>

      {/* === 手順 (3ステップ) === */}
      <div className="border border-stone-200 rounded-lg overflow-hidden">
        <div className="px-3.5 py-2.5 bg-stone-50 border-b border-stone-200">
          <div className="text-[12px] font-semibold text-stone-800">設定手順 (一度だけ ・ 約 2 分)</div>
        </div>
        <ol className="p-3.5 space-y-3 text-[12px] text-stone-700 leading-relaxed">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">1</span>
            <div className="flex-1">
              <div className="font-medium text-stone-900 mb-0.5">Gmail に転送先を登録</div>
              <div className="text-[11.5px] text-stone-600">
                Gmail を開く → 右上の <b>歯車</b> → <b>すべての設定を表示</b> → <b>メール転送と POP/IMAP</b> タブ →
                <b>「転送先アドレスを追加」</b>に上のメールアドレスを貼り付け
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">2</span>
            <div className="flex-1">
              <div className="font-medium text-stone-900 mb-0.5">確認コードを承認</div>
              <div className="text-[11.5px] text-stone-600">
                数秒以内に確認コードがメールで届きます。表示された URL をクリックすると承認完了。
                (届かない場合は迷惑メールフォルダもご確認ください)
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">3</span>
            <div className="flex-1">
              <div className="font-medium text-stone-900 mb-0.5">転送フィルタを作成</div>
              <div className="text-[11.5px] text-stone-600">
                Gmail の<b>検索ボックスの右端 (フィルタアイコン)</b> → <b>From</b> 欄に
                <code className="bg-stone-100 px-1 mx-1 rounded text-[10.5px]">hairmore@hotpepper.jp</code>
                → <b>フィルタを作成</b> → <b>次のアドレスに転送する</b> をチェックして上のアドレスを選択 → 保存
              </div>
            </div>
          </li>
        </ol>
        <div className="px-3.5 py-2.5 bg-amber-50 border-t border-amber-200 text-[11px] text-amber-900 leading-relaxed">
          ⚠️ docomo / au / SoftBank のキャリアメールで HPB 通知を受けている場合は外部転送が制限されていることが多いです。
          無料の Gmail を 1 つ作成 → SalonBoard の通知先メールアドレスを Gmail に変更 → 上記手順、の流れになります。
        </div>
      </div>

      {/* === 上級者向け: Webhook URL === */}
      <details className="border border-stone-200 rounded-lg" open={advancedOpen} onToggle={(e) => setAdvancedOpen((e.target as HTMLDetailsElement).open)}>
        <summary className="cursor-pointer px-3.5 py-2.5 bg-stone-50 border-b border-stone-200 list-none flex items-center gap-2 text-[12px] text-stone-700 select-none">
          <Zap className="w-3.5 h-3.5" />
          上級者向け: Webhook URL (Zapier / Make / n8n 等で連携する場合)
          <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
        </summary>
        <div className="p-3.5 space-y-3">
          {webhookUrl ? (
            <div>
              <div className="text-[11px] font-medium text-stone-700 mb-1.5">あなた専用の Webhook URL</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[11px] bg-white border border-stone-200 rounded px-2 py-1.5 break-all">
                  {webhookUrl}
                </code>
                <button
                  type="button"
                  onClick={() => copy(webhookUrl, 'url')}
                  className="text-[11px] px-2.5 py-1.5 border border-stone-300 rounded bg-white flex items-center gap-1 flex-shrink-0"
                >
                  {copiedKey === 'url' ? <><Check className="w-3 h-3" />済</> : <><Copy className="w-3 h-3" />コピー</>}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                🔒 このURLは鍵です。SNSや公開リポジトリに貼らないでください。漏れた場合は下から再発行。
              </p>
            </div>
          ) : (
            <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              Webhook URL を発行していません。下のボタンで発行できます。
            </div>
          )}

          <form action={formAction}>
            <button
              type="submit"
              disabled={pending}
              className="btn-ghost border border-stone-300 text-xs px-3 py-2 inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pending ? 'animate-spin' : ''}`} />
              {pending ? '発行中...' : (token ? 'URL を再発行' : 'Webhook URL を発行')}
            </button>
          </form>

          <div className="text-[11px] text-stone-600 leading-relaxed">
            <b>使い方の概要</b>: 上の Webhook URL に、HPB の予約確定メール本文を JSON
            <code className="bg-stone-100 px-1 mx-0.5 rounded">{`{ "body": "..." }`}</code>
            形式で POST すれば取り込まれます。Zapier / Make / IFTTT / n8n / Postmark Inbound / SendGrid Inbound Parse などから利用可能です。
            通常のサロンは上のメール転送方式で十分です。
          </div>
        </div>
      </details>
    </div>
  );
}
