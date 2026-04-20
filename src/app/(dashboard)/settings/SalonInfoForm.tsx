'use client';

import { useActionState } from 'react';
import { saveSalonInfoAction } from './settings-actions';

export default function SalonInfoForm({
  initialName, initialAddress, initialPhone, initialDescription,
}: {
  initialName: string;
  initialAddress: string;
  initialPhone: string;
  initialDescription: string;
}) {
  const [state, formAction, isPending] = useActionState(saveSalonInfoAction, null);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <div className="p-2 rounded text-xs bg-red-50 border border-red-200 text-red-700">{state.error}</div>
      )}
      {state?.ok && (
        <div className="p-2 rounded text-xs bg-emerald-50 border border-emerald-200 text-emerald-800">{state.message}</div>
      )}

      <Field label="店舗名 *" name="name" defaultValue={initialName} required />
      <Field label="住所" name="address" defaultValue={initialAddress} placeholder="東京都渋谷区..." />
      <Field label="電話番号" name="phone" defaultValue={initialPhone} placeholder="03-1234-5678" />
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">店舗説明</label>
        <textarea
          name="description"
          defaultValue={initialDescription}
          rows={2}
          className="input"
          placeholder="お店の特徴を一文で..."
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-brand text-xs px-4 py-2">
        {isPending ? '保存中...' : '店舗情報を保存'}
      </button>
    </form>
  );
}

function Field({
  label, name, defaultValue, placeholder, required,
}: {
  label: string; name: string; defaultValue: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="input"
      />
    </div>
  );
}
