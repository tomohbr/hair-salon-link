'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';
import type { Role } from '@/lib/auth';

/**
 * Server Action でログインを処理する。
 * - クッキー設定もリダイレクトもサーバー側で完結
 * - クライアント側の router.push に頼らない (= 不安定な挙動を排除)
 */
export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'メールアドレスとパスワードを入力してください' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'メールアドレスまたはパスワードが正しくありません' };
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { error: 'メールアドレスまたはパスワードが正しくありません' };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    salonId: user.salonId || undefined,
  });

  // ロール別の遷移先
  const redirectUrl =
    user.role === 'superadmin'
      ? '/superadmin'
      : '/dashboard';

  // redirect() は Server Action 内ではエラーを throw する形で動作するため、
  // try/catch で囲まずに直接呼ぶ
  redirect(redirectUrl);
}
