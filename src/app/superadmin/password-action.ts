'use server';

import { prisma } from '@/lib/db';
import { getSession, hashPassword, verifyPassword } from '@/lib/auth';

/**
 * Server Action — runs on the server with full access to cookies/session
 * directly via Next.js's server context (no API fetch involved).
 *
 * Returns { ok: true, message } on success, or { error } on failure.
 */
export async function changePasswordAction(
  _prevState: { ok?: boolean; error?: string; message?: string } | null,
  formData: FormData
): Promise<{ ok?: boolean; error?: string; message?: string }> {
  try {
    const session = await getSession();
    if (!session) {
      return { error: 'ログイン情報が見つかりません。再ログインしてください。' };
    }

    const currentPassword = String(formData.get('currentPassword') || '');
    const newPassword = String(formData.get('newPassword') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!currentPassword || !newPassword) {
      return { error: '現在のパスワードと新しいパスワードを入力してください' };
    }
    if (newPassword.length < 8) {
      return { error: '新しいパスワードは8文字以上にしてください' };
    }
    if (newPassword !== confirmPassword) {
      return { error: '新しいパスワードと確認用パスワードが一致しません' };
    }
    if (currentPassword === newPassword) {
      return { error: '新しいパスワードは現在のパスワードと異なるものを指定してください' };
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return { error: 'ユーザーが見つかりません' };
    }

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      return { error: '現在のパスワードが正しくありません' };
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return { ok: true, message: 'パスワードを変更しました' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('changePasswordAction error:', err);
    return { error: `エラーが発生しました: ${msg}` };
  }
}
