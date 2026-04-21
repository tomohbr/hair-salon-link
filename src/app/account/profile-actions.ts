'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { getSession, verifyPassword, createSession, type Role } from '@/lib/auth';

type ActionState = { ok?: boolean; error?: string; message?: string } | null;

/**
 * メールアドレス変更。
 * - ログイン中ユーザー本人のメールのみ変更可
 * - 現在のパスワードで本人確認
 * - 他ユーザーが既に使っている場合は拒否
 * - 変更後はセッション JWT を再発行（email が payload に含まれるため）
 */
export async function changeEmailAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    if (!session) return { error: 'ログインが必要です' };

    const newEmail = String(formData.get('newEmail') || '').trim().toLowerCase();
    const password = String(formData.get('currentPassword') || '');

    if (!newEmail) return { error: '新しいメールアドレスを入力してください' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return { error: 'メールアドレスの形式が正しくありません' };
    }
    if (!password) return { error: '本人確認のため現在のパスワードを入力してください' };

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return { error: 'ユーザー情報が取得できませんでした' };

    // 同じメールならスキップ
    if (user.email === newEmail) {
      return { ok: true, message: '現在のメールアドレスと同じです（変更なし）' };
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return { error: '現在のパスワードが正しくありません' };

    // 他ユーザーとの重複チェック
    const exists = await prisma.user.findUnique({ where: { email: newEmail } });
    if (exists && exists.id !== user.id) {
      return { error: 'このメールアドレスは既に使われています' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    // セッション再発行（email を payload に含むため）
    await createSession({
      userId: user.id,
      email: newEmail,
      name: user.name,
      role: user.role as Role,
      salonId: user.salonId,
    });

    revalidatePath('/account');
    return { ok: true, message: `メールアドレスを ${newEmail} に変更しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}

/** 表示名（ユーザー名）変更 */
export async function changeNameAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    if (!session) return { error: 'ログインが必要です' };

    const newName = String(formData.get('newName') || '').trim();
    if (!newName) return { error: '名前を入力してください' };
    if (newName.length > 50) return { error: '名前は50文字以内で入力してください' };

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return { error: 'ユーザー情報が取得できませんでした' };

    if (user.name === newName) {
      return { ok: true, message: '現在の名前と同じです（変更なし）' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: newName },
    });

    // セッション再発行
    await createSession({
      userId: user.id,
      email: user.email,
      name: newName,
      role: user.role as Role,
      salonId: user.salonId,
    });

    revalidatePath('/account');
    return { ok: true, message: `名前を「${newName}」に変更しました` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'エラーが発生しました' };
  }
}
