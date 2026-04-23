import { NextRequest, NextResponse } from 'next/server';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { parseMenusCsv } from '@/lib/csv/hpb';

export async function POST(req: NextRequest) {
  try {
    const { salon } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const { csv } = await req.json();
    if (!csv) return NextResponse.json({ error: 'CSV が空です' }, { status: 400 });

    const parsed = parseMenusCsv(csv);
    let created = 0;
    let updated = 0;
    let skipped = parsed.skipped;

    const existingAll = await db.menu.findMany();
    const existingByName = new Map(existingAll.map((m) => [m.name.trim().toLowerCase(), m]));

    for (const row of parsed.rows) {
      try {
        const key = row.name.trim().toLowerCase();
        const existing = existingByName.get(key);
        if (existing) {
          await db.menu.update({
            where: { id: existing.id },
            data: {
              category: row.category || existing.category,
              price: row.price || existing.price,
              durationMinutes: row.durationMinutes || existing.durationMinutes,
              description: row.description ?? existing.description,
              isActive: row.isActive,
            },
          });
          updated++;
        } else {
          const maxSort = existingAll.reduce((m, x) => Math.max(m, x.sortOrder), 0);
          await db.menu.create({
            data: {
              salonId: salon.id,
              name: row.name,
              category: row.category || 'その他',
              price: row.price,
              durationMinutes: row.durationMinutes,
              description: row.description,
              isActive: row.isActive,
              sortOrder: maxSort + 10,
            },
          });
          created++;
        }
      } catch (e) {
        console.error('[menu import] row failed:', e);
        skipped++;
      }
    }

    return NextResponse.json({ ok: true, total: parsed.rows.length + skipped, created, updated, skipped });
  } catch (err) {
    console.error('[menu import] fatal:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'サーバーエラー' },
      { status: 500 },
    );
  }
}
