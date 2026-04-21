import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentSalon } from '@/lib/salonData';
import { toCsv } from '@/lib/csv/hpb';

export async function GET() {
  try {
    const { salon } = await getCurrentSalon();
    const menus = await prisma.menu.findMany({
      where: { salonId: salon.id },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
    const headers = ['メニュー名', 'カテゴリ', '料金', '所要時間', '説明', '公開'];
    const rows = menus.map((m) => [
      m.name, m.category, m.price, m.durationMinutes,
      m.description ?? '', m.isActive ? '公開' : '非公開',
    ]);
    const csv = toCsv(headers, rows);
    const filename = `menus_${salon.slug}_${new Date().toISOString().slice(0, 10)}.csv`;
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
