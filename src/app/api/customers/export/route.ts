// 顧客 CSV 書出
import { NextResponse } from 'next/server';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { toCsv } from '@/lib/csv/hpb';

export async function GET() {
  try {
    const { salon } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const customers = await db.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      '顧客名', 'フリガナ', '電話番号', 'メール', '誕生日', '性別',
      '流入元', '初回来店日', '最終来店日', '来店回数', '累計金額',
      'LINE連携', 'タグ', 'メモ', '登録日',
    ];
    const rows = customers.map((c) => [
      c.name, c.nameKana ?? '', c.phone ?? '', c.email ?? '',
      c.birthday ?? '', c.gender ?? '', c.source,
      c.firstVisitDate ?? '', c.lastVisitDate ?? '',
      c.visitCount, c.totalSpent,
      c.isLineFriend ? 'はい' : 'いいえ', (c.tags || []).join('|'),
      c.notes ?? '', c.createdAt.toISOString().slice(0, 10),
    ]);

    const csv = toCsv(headers, rows);
    const filename = `customers_${salon.slug}_${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'private, no-cache, no-store',
      },
    });
  } catch (err) {
    console.error('[customer export] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'サーバーエラー' },
      { status: 500 },
    );
  }
}
