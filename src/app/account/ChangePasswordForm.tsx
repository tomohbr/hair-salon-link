'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'err', text: '新しいパスワードと確認用パスワードが一致しません' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'err', text: '新しいパスワードは8文字以上にしてください' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'err', text: data.error || 'パスワード変更に失敗しました' });
        setLoading(false);
        return;
      }
      setMessage({ type: 'ok', text: data.message || 'パスワードを変更しました' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage({ type: 'err', text: '通信エラーが発生しました' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'ok'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">現在のパスワード</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">新しいパスワード (8文字以上)</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">新しいパスワード (確認)</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-brand w-full justify-center py-2.5">
        {loading ? '変更中...' : 'パスワードを変更する'}
      </button>

      <p className="text-[11px] text-stone-500">
        ※ 変更後のパスワードはデータベースに保存され、再デプロイされても保持されます。
      </p>
    </form>
  );
}
