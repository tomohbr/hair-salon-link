'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

const VIEW_COOKIE = 'hsl_superadmin_view_salon';

/** SuperAdmin: 指定店舗のビューモードに入って /dashboard へ */
export async function enterSalonView(salonId: string): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    throw new Error('権限がありません');
  }
  const cookieStore = await cookies();
  cookieStore.set(VIEW_COOKIE, salonId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,  // 8時間
    path: '/',
  });
  redirect('/dashboard');
}

/** ビューモード解除: cookieを消して /superadmin に戻る */
export async function exitSalonView(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(VIEW_COOKIE);
  redirect('/superadmin');
}
