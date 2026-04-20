'use client';

import { useActionState, useState } from 'react';
import { saveLineSettingsAction, testLineConnectionAction } from './settings-actions';
import { Copy, Check, Zap } from 'lucide-react';

export default function LineForm({
  channelId, channelSecret, accessToken, liffId, webhookUrl,
}: {
  channelId: string; channelSecret: string; accessToken: string; liffId: string; webhookUrl: string;
}) {
  const [saveState, saveAction, saving] = useActionState(saveLineSettingsAction, null);
  const [testState, testAction, testing] = useActionState(testLineConnectionAction, null);
  const [copied, setCopied] = useState(false);

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  return (
    <div className="space-y-5">
      {/* Webhook URL — LINE Developers に登録 */}
      <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
        <div className="text-[11px] font-medium text-stone-700 mb-1.5">
          LINE Developers に登録する Webhook URL
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-[11px] bg-white border border-stone-200 rounded px-2 py-1.5 break-all">
            {webhookUrl}
          </code>
          <button
            type="button"
            onClick={copyWebhook}
            className="btn-ghost text-[11px] px-2.5 py-1.5 border border-stone-300 flex items-center gap-1 flex-shrink-0"
          >
            {copied ? <><Check className="w-3 h-3" />済</> : <><Copy className="w-3 h-3" />コピー</>}
          </button>
        </div>
        <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
          LINE Developers Console → Messaging API 設定 → Webhook URL にこれを貼り、<br />
          「Webhook の利用」を ON にしてください。
        </p>
      </div>

      <form action={saveAction} className="space-y-3">
        {saveState?.error && (
          <div className="p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{saveState.error}</div>
        )}
        {saveState?.ok && (
          <div className="p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{saveState.message}</div>
        )}

        <Field label="Channel ID" name="channelId" defaultValue={channelId} placeholder="例: 1234567890" />
        <Field label="Channel Secret" name="channelSecret" defaultValue={channelSecret} placeholder="LINE Developers の Basic settings から" type="password" />
        <Field label="Channel Access Token" name="accessToken" defaultValue={accessToken} placeholder="Messaging API settings → Issue から発行" type="password" />
        <Field label="LIFF ID (任意)" name="liffId" defaultValue={liffId} placeholder="例: 1234567890-AbCdEfGh" />

        <button type="submit" disabled={saving} className="btn-brand text-xs px-4 py-2">
          {saving ? '保存中...' : '保存'}
        </button>
      </form>

      {/* 接続テスト (保存した token で LINE API を叩く) */}
      <form action={testAction} className="border-t border-stone-100 pt-4">
        {testState?.error && (
          <div className="mb-2 p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">
            <div className="font-semibold">接続失敗</div>
            <div className="mt-1">{testState.error}</div>
          </div>
        )}
        {testState?.ok && (
          <div className="mb-2 p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">
            <div className="font-semibold">✅ 接続成功</div>
            <div className="mt-1">{testState.message}</div>
          </div>
        )}
        <button type="submit" disabled={testing} className="btn-ghost border border-stone-300 text-xs px-4 py-2 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {testing ? 'テスト中...' : 'LINE 接続をテスト'}
        </button>
        <p className="text-[10px] text-stone-500 mt-2">
          保存した Channel Access Token で LINE API に問い合わせ、認証が通るか確認します。
        </p>
      </form>

      <div className="text-[11px] text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
        <div className="font-medium text-stone-700 mb-1">取得場所</div>
        <div>・Channel ID / Secret: LINE Developers Console → プロバイダー → チャネル → Basic settings</div>
        <div>・Channel Access Token: 同じチャネルの「Messaging API」タブ → Channel access token → Issue</div>
      </div>
    </div>
  );
}

function Field({
  label, name, defaultValue, placeholder, type = 'text',
}: {
  label: string; name: string; defaultValue: string; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="input"
        autoComplete="off"
      />
    </div>
  );
}
