import { NextResponse } from 'next/server';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { toCsv } from '@/lib/csv/hpb';

export async function GET() {
  try {
    const { salon, session } = await getCurrentSalon();
    if (session.role === 'staff') {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }
    const db = prismaForSalon(salon.id);
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const headers = [
      'クーポン名', '説明', '割引種別', '割引額', '最低金額',
      '利用上限', '有効期限', 'ステータス', '利用回数',
    ];
    const rows = coupons.map((c) => [
      c.title, c.description ?? '',
      c.discountType === 'percent' ? 'percent' : 'yen',
      c.discountValue, c.minPurchase, c.maxUses || '',
      c.validUntil ?? '', c.isActive ? '配信中' : '停止', c.usedCount,
    ]);
    const csv = toCsv(headers, rows);
    const filename = `coupons_${salon.slug}_${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'private, no-cache, no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'サーバーエラー' },
      { status: 500 },
    );
  }
}
