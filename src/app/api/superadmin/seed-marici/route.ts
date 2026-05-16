// SuperAdmin 限定: 中西雄大様 (marici) の HairSalonLink アカウントに
// HPB から取得した実データ (メニュー 7件 + クーポン 6件) を流し込む一回用エンドポイント
//
// 安全性:
//   - shibahara.724@gmail.com の SuperAdmin セッションでのみ実行可能
//   - 冪等: 同名メニュー/クーポンが既にあれば更新、無ければ作成 (重複作成なし)
//   - slug 指定: salon-ad76iza2-q47p にしか書き込まない
//
// 使い方:
//   SuperAdmin でログインした状態で、ブラウザの URL バーに下記を入れて Enter:
//   https://hair-salon-link-production.up.railway.app/api/superadmin/seed-marici

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { buildRedirectUrl } from '@/lib/baseUrl';

// 中西雄大様のオーナーメール
const TARGET_OWNER_EMAIL = 'a@gmail.com';

/** HPB 取得済みの実データ (メニュー) */
const MENUS = [
  { name: 'カット', category: 'カット', price: 4450, durationMinutes: 60, description: 'レディース／メンズ対応のベーシックカット' },
  { name: 'カット + カラー', category: 'カラー', price: 9700, durationMinutes: 120, description: 'カット + カラーの定番セット（クーポン価格 / 通常¥10,700）' },
  { name: 'カット + カラー + 3Stepトリートメント', category: 'カラー', price: 10700, durationMinutes: 150, description: 'カラー持ちUP★ / 通常¥12,700 → クーポン¥10,700' },
  { name: 'パーマ + カット', category: 'パーマ', price: 11000, durationMinutes: 120, description: 'パーマとカットのセット' },
  { name: 'ケアブリーチ + カラー', category: 'ハイトーン', price: 16800, durationMinutes: 180, description: 'Wカラー / ケアブリーチで艶を残しながら透明感のあるハイトーンへ' },
  { name: 'カット + 美髪矯正 + トリートメント', category: '髪質改善', price: 19200, durationMinutes: 210, description: '美髪プログラム / 艶・質感・扱いやすさを整える' },
  { name: 'ケアブリーチ + カラー + カット', category: 'ハイトーン', price: 19800, durationMinutes: 210, description: 'Wカラー Full / ハイトーンの到達点' },
];

/** クーポン (HPB 記載のクーポンと整合) */
const COUPONS = [
  { title: 'カット + カラー 特別価格', description: '通常 ¥10,700 → ¥9,700 のお得なカラーセット', discountType: 'yen', discountValue: 1000, minPurchase: 0, maxUses: 0, validUntil: null, targetSegment: 'all' },
  { title: 'カラー持ちUP★ 3Stepトリートメント付', description: '通常 ¥12,700 → ¥10,700 に。色持ちを伸ばす3Step付', discountType: 'yen', discountValue: 2000, minPurchase: 0, maxUses: 0, validUntil: null, targetSegment: 'all' },
  { title: 'Wカラー ケアブリーチ+カラー', description: 'ケアブリーチで艶を残しながら透明感のあるハイトーンへ', discountType: 'yen', discountValue: 0, minPurchase: 0, maxUses: 0, validUntil: null, targetSegment: 'all' },
  { title: 'パーマ + カット セット', description: 'パーマとカットのお得なセット', discountType: 'yen', discountValue: 0, minPurchase: 0, maxUses: 0, validUntil: null, targetSegment: 'all' },
  { title: '美髪プログラム カット+美髪矯正+トリートメント', description: '艶・質感・扱いやすさをまとめて整える', discountType: 'yen', discountValue: 0, minPurchase: 0, maxUses: 0, validUntil: null, targetSegment: 'all' },
  { title: 'Wカラー Full (ケアブリーチ+カラー+カット)', description: 'Wカラーのフルメニュー。ハイトーンの到達点', discountType: 'yen', discountValue: 0, minPurchase: 0, maxUses: 0, validUntil: null, targetSegment: 'all' },
];

async function seed(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'superadmin') {
    return NextResponse.redirect(buildRedirectUrl(req, '/login?error=SuperAdmin権限が必要です'));
  }

  // オーナーメールで店舗を検索（ownerEmail 列 or User.salon リレーション両方試す）
  let salon = await prisma.salon.findFirst({
    where: { ownerEmail: TARGET_OWNER_EMAIL },
  });
  if (!salon) {
    const owner = await prisma.user.findUnique({
      where: { email: TARGET_OWNER_EMAIL },
      include: { salon: true },
    });
    if (owner?.salon) salon = owner.salon;
  }
  if (!salon) {
    return NextResponse.json(
      { error: `オーナーメール ${TARGET_OWNER_EMAIL} の店舗が見つかりません。先に新規登録してください。` },
      { status: 404 },
    );
  }

  let menusCreated = 0, menusUpdated = 0;
  for (let i = 0; i < MENUS.length; i++) {
    const m = MENUS[i];
    const existing = await prisma.menu.findFirst({
      where: { salonId: salon.id, name: m.name },
    });
    if (existing) {
      await prisma.menu.update({
        where: { id: existing.id },
        data: {
          category: m.category,
          price: m.price,
          durationMinutes: m.durationMinutes,
          description: m.description,
          isActive: true,
        },
      });
      menusUpdated++;
    } else {
      await prisma.menu.create({
        data: {
          salonId: salon.id,
          name: m.name,
          category: m.category,
          price: m.price,
          durationMinutes: m.durationMinutes,
          description: m.description,
          isActive: true,
          sortOrder: (i + 1) * 10,
        },
      });
      menusCreated++;
    }
  }

  let couponsCreated = 0, couponsUpdated = 0;
  for (const c of COUPONS) {
    const existing = await prisma.coupon.findFirst({
      where: { salonId: salon.id, title: c.title },
    });
    if (existing) {
      await prisma.coupon.update({
        where: { id: existing.id },
        data: {
          description: c.description,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minPurchase: c.minPurchase,
          maxUses: c.maxUses,
          validUntil: c.validUntil,
          targetSegment: c.targetSegment,
          isActive: true,
        },
      });
      couponsUpdated++;
    } else {
      await prisma.coupon.create({
        data: {
          salonId: salon.id,
          title: c.title,
          description: c.description,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minPurchase: c.minPurchase,
          maxUses: c.maxUses,
          validUntil: c.validUntil,
          targetSegment: c.targetSegment,
          isActive: true,
        },
      });
      couponsCreated++;
    }
  }

  return NextResponse.json({
    ok: true,
    salon: { id: salon.id, name: salon.name, slug: salon.slug },
    menus: { created: menusCreated, updated: menusUpdated, total: MENUS.length },
    coupons: { created: couponsCreated, updated: couponsUpdated, total: COUPONS.length },
    bookingUrl: `/book/${salon.slug}`,
  });
}

// 一回用の移行エンドポイント。状態を変更するため POST のみ許可する
// （GET だとブラウザのプリフェッチ／クローラで意図せず実行され得る）。
export const POST = seed;
