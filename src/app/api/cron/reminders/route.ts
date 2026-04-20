import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pushText } from '@/lib/line/client';

// 翌日予約の顧客に LINE リマインドを送信（店舗ごとの LINE 認証情報を使用）
export async function GET() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const targets = await prisma.reservation.findMany({
    where: { date: tomorrowStr, status: 'confirmed', reminderSent: false },
    include: { customer: true, salon: true },
  });

  let sent = 0;
  let skipped = 0;
  for (const r of targets) {
    if (!r.customer?.lineUserId) { skipped++; continue; }
    if (!r.salon?.lineAccessToken) { skipped++; continue; }
    const result = await pushText(
      r.customer.lineUserId,
      `${r.customer.name}様\n明日 ${r.startTime}〜 のご予約のご案内です。\nメニュー: ${r.menuName}\nご来店お待ちしております🌸`,
      { accessToken: r.salon.lineAccessToken, channelSecret: r.salon.lineChannelSecret },
    );
    if (result.ok) {
      await prisma.reservation.update({ where: { id: r.id }, data: { reminderSent: true } });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, total: targets.length });
}
