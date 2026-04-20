// パスワード変更 API
// POST /api/auth/change-password
// body: { currentPassword, newPassword }
//
// セッション必須。currentPassword を検証し、newPassword で上書き。
// 変更後も同じセッションは継続して有効。

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // セッション確認 (throw せず明示的にチェックして 401 を返す)
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'ログイン情報が見つかりません。再ログインしてください。' }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'リクエストの形式が正しくありません' }, { status: 400 });
    }
    const { currentPassword, newPassword } = body || {};

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
    // 詳細メッセージをレスポンスに含める (デバッグ用、本番でも一時的に表示)
    const msg = err instanceof Error ? err.message : String(err);
    console.error('change-password error:', err);
    return NextResponse.json(
      { error: `サーバーエラー: ${msg}` },
      { status: 500 }
    );
  }
}
