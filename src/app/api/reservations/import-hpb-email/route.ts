// HPB 予約確定メールの取込 API
// 認証済みユーザーから本文テキストを受け取って、その店舗の Reservation に変換
// 外部ID で重複チェック、無ければ顧客名+日時でも重複チェック

import { NextRequest, NextResponse } from 'next/server';
import { prismaForSalon } from '@/lib/prismaScoped';
import { getCurrentSalon } from '@/lib/salonData';
import { parseHpbEmail } from '@/lib/hpb/emailParser';

export async function POST(req: NextRequest) {
  try {
    const { salon } = await getCurrentSalon();
    const db = prismaForSalon(salon.id);
    const { body } = await req.json();
    if (!body || typeof body !== 'string') {
      return NextResponse.json({ error: 'メール本文を入力してください' }, { status: 400 });
    }

    const bookings = parseHpbEmail(body);
    if (bookings.length === 0) {
      return NextResponse.json({
        error: 'メールから予約情報を抽出できませんでした。日付・時刻・お客様名・メニューが本文に含まれているか確認してください。',
      }, { status: 422 });
    }

    let created = 0;
    let updated = 0;
    let cancelled = 0;
    let skipped = 0;
    const messages: string[] = [];

    for (const bk of bookings) {
      // 既存確認
      let existing = null;
      if (bk.externalId) {
        existing = await db.reservation.findFirst({
          where: { externalId: bk.externalId },
        });
      }
      if (!existing) {
        // 日付+開始時刻+顧客名でも重複チェック
        existing = await db.reservation.findFirst({
          where: {
            date: bk.date,
            startTime: bk.startTime,
            customer: { name: bk.customerName },
          },
          include: { customer: true },
        });
      }

      // キャンセルイベント
      if (bk.kind === 'cancel') {
        if (existing) {
          await db.reservation.update({
            where: { id: existing.id },
            data: { status: 'cancelled' },
          });
          cancelled++;
          messages.push(`キャンセル: ${bk.date} ${bk.startTime} ${bk.customerName}様`);
        } else {
          skipped++;
          messages.push(`キャンセル対象なし: ${bk.date} ${bk.startTime} ${bk.customerName}様`);
        }
        continue;
      }

      // 顧客を確保（電話番号で検索し無ければ作成）
      let customer = bk.customerPhone
        ? await db.customer.findFirst({ where: { phone: bk.customerPhone } })
        : null;
      if (!customer) {
        customer = await db.customer.create({
          data: {
            salonId: salon.id,
            name: bk.customerName,
            nameKana: bk.customerNameKana,
            phone: bk.customerPhone,
            email: bk.customerEmail,
            source: 'hotpepper',
          },
        });
      }

      // 変更イベント
      if (bk.kind === 'change' && existing) {
        await db.reservation.update({
          where: { id: existing.id },
          data: {
            date: bk.date,
            startTime: bk.startTime,
            endTime: bk.endTime,
            menuName: bk.menuName,
            menuPrice: bk.menuPrice,
            notes: bk.notes,
            status: 'confirmed',
          },
        });
        updated++;
        messages.push(`変更: ${bk.date} ${bk.startTime} ${bk.customerName}様`);
        continue;
      }

      // 新規イベント（または既存があれば更新扱い）
      if (existing) {
        skipped++;
        messages.push(`既存あり (重複スキップ): ${bk.date} ${bk.startTime} ${bk.customerName}様`);
        continue;
      }

      // 枠の他予約との衝突チェック（同一店舗同一日時）
      const conflict = await db.reservation.findFirst({
        where: {
          date: bk.date,
          status: { in: ['pending', 'confirmed', 'completed'] },
          AND: [
            { startTime: { lt: bk.endTime } },
            { endTime: { gt: bk.startTime } },
          ],
        },
        include: { customer: true },
      });
      if (conflict && conflict.customerId !== customer.id) {
        messages.push(
          `⚠ 衝突: ${bk.date} ${bk.startTime}-${bk.endTime} ` +
          `既に ${conflict.customer?.name ?? '不明'}様 (${conflict.source}) の予約あり ` +
          `→ HPB側で要調整`
        );
        skipped++;
        continue;
      }

      await db.reservation.create({
        data: {
          salonId: salon.id,
          customerId: customer.id,
          menuName: bk.menuName,
          menuPrice: bk.menuPrice,
          date: bk.date,
          startTime: bk.startTime,
          endTime: bk.endTime,
          source: 'hotpepper',
          status: 'confirmed',
          notes: bk.notes,
          externalId: bk.externalId,
        },
      });
      created++;
      messages.push(`取込完了: ${bk.date} ${bk.startTime} ${bk.customerName}様 (${bk.menuName})`);
    }

    return NextResponse.json({
      ok: true,
      created, updated, cancelled, skipped,
      total: bookings.length,
      messages,
    });
  } catch (err) {
    console.error('[hpb email import]', err);
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'サーバーエラー',
    }, { status: 500 });
  }
}
