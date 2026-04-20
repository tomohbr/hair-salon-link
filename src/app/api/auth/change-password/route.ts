// パスワード変更 API
// POST /api/auth/change-password
// body: { currentPassword, newPassword }
//
// セッション必須。currentPassword を検証し、newPassword で上書き。
// 変更後も同じセッションは継続して有効。

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: '現在のパスワードと新しいパスワードを入力してください' }, { status: 400 });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ error: '新しいパスワードは8文字以上にしてください' }, { status: 400 });
    }
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: '新しいパスワードは現在のパスワードと異なるものを指定してください' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: '現在のパスワードが正しくありません' }, { status: 401 });
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ ok: true, message: 'パスワードを変更しました' });
  } catch (err) {
    console.error('change-password error:', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
