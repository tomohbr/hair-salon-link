'use client';

import { useActionState, useState } from 'react';
import { Copy, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { rotateHpbInboundTokenAction } from './settings-actions';

export default function HpbInboundForm({
  initialToken, baseUrl,
}: { initialToken: string | null; baseUrl: string }) {
  const [state, formAction, pending] = useActionState(rotateHpbInboundTokenAction, null);
  const [copied, setCopied] = useState(false);

  // 最新のトークンは state 優先
  const token = state?.token ?? initialToken;
  const webhookUrl = token
    ? `${baseUrl.replace(/\/$/, '')}/api/inbound/hpb/${token}`
    : null;

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }

  return (
    <div className="space-y-4">
      {state?.ok && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
          <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {state.message}
          {state.token && (
            <span className="ml-1">（新 URL を下からコピーしてください）</span>
          )}
        </div>
      )}
      {state?.error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          {state.error}
        </div>
      )}

      {webhookUrl ? (
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
          <div className="text-[11px] font-medium text-stone-700 mb-1.5">
            あなた専用の Webhook URL
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-[11px] bg-white border border-stone-200 rounded px-2 py-1.5 break-all">
              {webhookUrl}
            </code>
            <button
              type="button"
              onClick={() => copy(webhookUrl)}
              className="btn-ghost text-[11px] px-2.5 py-1.5 border border-stone-300 flex items-center gap-1 flex-shrink-0"
            >
              {copied ? <><Check className="w-3 h-3" />済</> : <><Copy className="w-3 h-3" />コピー</>}
            </button>
          </div>
          <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
            🔒 このURLは鍵です。他人に見せない／SNSに貼らない。漏れた時は下で再発行。
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          まだ Webhook URL を発行していません。下のボタンで発行してください。
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

      <div className="border-t border-stone-100 pt-4 space-y-3">
        <div className="text-xs font-medium text-stone-700">自動連携のセットアップ手順 (Zapier)</div>
        <ol className="text-[11.5px] text-stone-600 leading-relaxed list-decimal ml-5 space-y-1.5">
          <li>
            <a href="https://zapier.com/" target="_blank" rel="noopener" className="brand-text underline">
              Zapier
            </a>
            に無料登録 (Gmail 連携)。
          </li>
          <li>
            新しい Zap を作成 →<br />
            <b>Trigger:</b> Gmail - New Email Matching Search<br />
            <b>Search string:</b> <code className="bg-stone-100 px-1 rounded">from:hotpepper.jp OR subject:"予約"</code>
          </li>
          <li>
            <b>Action:</b> Webhooks by Zapier - POST<br />
            <b>URL:</b> 上の Webhook URL を貼り付け<br />
            <b>Payload Type:</b> JSON<br />
            <b>Data:</b> <code className="bg-stone-100 px-1 rounded">body</code> フィールドに Gmail の <code className="bg-stone-100 px-1 rounded">Body Plain</code> をマッピング
          </li>
          <li>
            Zap を ON にする → 以降、HPB メールが届いた瞬間に自動で予約枠に反映されます。
          </li>
        </ol>

        <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-relaxed mt-3">
          💡 <b>代替手段</b>: Cloudflare Email Routing / Make / IFTTT / n8n / Postmark Inbound / SendGrid Inbound Parse なども使えます。
          本文を POST で上の URL に送れればどれでも動作します。
        </div>
      </div>
    </div>
  );
}
