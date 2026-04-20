'use client';

import { useActionState } from 'react';
import { saveLineSettingsAction } from './settings-actions';

export default function LineForm({
  channelId, channelSecret, accessToken, liffId,
}: {
  channelId: string; channelSecret: string; accessToken: string; liffId: string;
}) {
  const [state, formAction, isPending] = useActionState(saveLineSettingsAction, null);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <div className="p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>
      )}

      <Field label="Channel ID" name="channelId" defaultValue={channelId} placeholder="例: 1234567890" />
      <Field label="Channel Secret" name="channelSecret" defaultValue={channelSecret} placeholder="LINE Developers の Basic settings から取得" type="password" />
      <Field label="Channel Access Token" name="accessToken" defaultValue={accessToken} placeholder="Messaging API settings → Long-lived から発行" type="password" />
      <Field label="LIFF ID (任意)" name="liffId" defaultValue={liffId} placeholder="例: 1234567890-AbCdEfGh" />

      <button type="submit" disabled={isPending} className="btn-brand text-xs px-4 py-2">
        {isPending ? '保存中...' : 'LINE 連携を保存'}
      </button>

      <div className="text-[11px] text-stone-500 mt-3 leading-relaxed">
        ※ 設定値の取得方法: LINE公式アカウント → LINE Developers Console → プロバイダー → チャネル設定<br />
        ※ Webhook URL を LINE Developers に登録: <code className="bg-stone-100 px-1 rounded">/api/line/webhook</code>
      </div>
    </form>
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
