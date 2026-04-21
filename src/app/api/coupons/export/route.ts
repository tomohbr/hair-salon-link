import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';
import { toCsv } from '@/lib/csv/hpb';

export async function GET() {
  try {
    const { salon } = await getCurrentSalon();
    const coupons = await prisma.coupon.findMany({
      where: { salonId: salon.id },
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
