/**
 * HPB 予約メールの自動取込 (Slug 経由 / Cloudflare Email Workers 用)
 *
 * 仕組み:
 *   1. サロンごとに「{slug}@hpb.hair-salon-link.app」のメールアドレスを発行
 *   2. サロンが Gmail フィルタで HPB の予約確定メールを上記アドレスに転送
 *   3. Cloudflare Email Workers がメール受信 → このエンドポイントに POST
 *   4. 共有シークレットで Worker からの呼び出しか検証
 *   5. slug → salon → 既存の processHpbEmail() で予約反映
 *
 * セキュリティ:
 *   - X-Inbound-Secret ヘッダで共有シークレット検証
 *   - 送信元 IP の検証は Cloudflare 側で実施 (Worker が経由)
 *
 * 環境変数:
 *   - HPB_INBOUND_SHARED_SECRET: Worker と本 API で共有する秘密鍵
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { processHpbEmail } from '@/lib/hpb/processBookings';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // ── 1. 共有シークレット検証 ──
    const secretExpected = process.env.HPB_INBOUND_SHARED_SECRET;
    const secretSent = req.headers.get('x-inbound-secret');
    if (!secretExpected) {
      return NextResponse.json(
        { error: 'server not configured (HPB_INBOUND_SHARED_SECRET missing)' },
        { status: 503 },
      );
    }
    if (secretSent !== secretExpected) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // ── 2. slug 検証 ──
    const { slug } = await params;
    if (!slug || !/^[a-z0-9\-_]+$/.test(slug)) {
      return NextResponse.json({ error: 'invalid slug' }, { status: 400 });
    }

    const salon = await prisma.salon.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });
    if (!salon) {
      return NextResponse.json({ error: 'salon not found' }, { status: 404 });
    }
    if (salon.status === 'suspended') {
      return NextResponse.json({ error: 'salon suspended' }, { status: 403 });
    }

    // ── 3. 本文を抽出 (Worker からは JSON で来る想定) ──
    const ct = (req.headers.get('content-type') || '').toLowerCase();
    let emailBody = '';
    if (ct.includes('application/json')) {
      const payload = await req.json().catch(() => ({}));
      emailBody =
        payload.body || payload.text || payload.content ||
        payload.emailBody || payload.body_plain || payload.plain ||
        payload.message || '';
    } else {
      emailBody = await req.text();
    }

    if (!emailBody) {
      return NextResponse.json({ error: 'empty body' }, { status: 400 });
    }

    // ── 4. 取込処理 ──
    const result = await processHpbEmail(salon.id, emailBody);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[inbound hpb by-slug]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'server error' },
      { status: 500 },
    );
  }
}

// 疎通確認用
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const salon = await prisma.salon.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, status: true },
  });
  if (!salon) return NextResponse.json({ ok: false, error: 'salon not found' }, { status: 404 });
  return NextResponse.json({ ok: true, salon: salon.name, slug: salon.slug });
}
