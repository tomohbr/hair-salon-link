// POST /api/auth/login
// フォーム POST で呼ばれ、Set-Cookie + 303 リダイレクトを返す。
// Server Action は使わない（cookie 挙動を単純化するため）。

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { buildRedirectUrl } from '@/lib/baseUrl';

const COOKIE_NAME = 'hairsalonlink_session';
const ALG = 'HS256';

function getSecret() {
  const secret = process.env.SESSION_SECRET || 'dev-secret-change-me-in-production-12345678';
  return new TextEncoder().encode(secret);
}

function withNoCache(res: NextResponse) {
  res.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    const fail = (msg: string) => {
      const target = new URL(buildRedirectUrl(req, '/login'));
      target.searchParams.set('error', msg);
      return withNoCache(NextResponse.redirect(target.toString(), 303));
    };

    if (!email || !password) return fail('メールアドレスとパスワードを入力してください');

    const user = await prisma.user.findUnique({
      where: { email },
      include: { salon: true },
    });
    if (!user) return fail('メールアドレスまたはパスワードが正しくありません');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return fail('メールアドレスまたはパスワードが正しくありません');

    if (user.role !== 'superadmin') {
      if (!user.salon) return fail('店舗情報が見つかりません');
      if (user.salon.status === 'pending_payment') return fail('決済が未完了です。登録を完了してください。');
      if (user.salon.status === 'suspended') return fail('アカウントが停止されています');
    }

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      salonId: user.salonId,
    })
      .setProtectedHeader({ alg: ALG })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(getSecret());

    const destination = user.role === 'superadmin' ? '/superadmin' : '/dashboard';
    const res = withNoCache(NextResponse.redirect(buildRedirectUrl(req, destination), 303));
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('[login] error:', err);
    const target = new URL(buildRedirectUrl(req, '/login'));
    target.searchParams.set('error', 'サーバーエラー');
    return withNoCache(NextResponse.redirect(target.toString(), 303));
  }
}
