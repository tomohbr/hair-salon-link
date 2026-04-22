// HairSalonLink HPBメール自動連携セットアップ手順書 .pptx
// 2 種類を生成: 営業員向け (詳細) / オーナー向け (要点)

const pptxgen = require('pptxgenjs');

/* ═══════════ shared palette (HairSalonLink brand) ═══════════ */
const BG_DARK = '0c0a09';
const BG_ALT = '120e0c';
const PAPER = 'faf7f2';
const PAPER_ALT = 'f1ece3';
const BORDER = 'd9d1bf';
const INK = '1c1917';
const INK_MUTED = '6b5f52';
const BRAND = 'c9a96e';
const BRAND_DEEP = '9c7a4a';
const LINE_GREEN = '06c755';
const ACCENT_RED = 'b85042';
const SUCCESS = '166534';
const ZAP_ORANGE = 'ff4a00';

const FONT_JP_SERIF = 'Yu Mincho';
const FONT_JP = 'Yu Gothic';
const FONT_JP_B = 'Yu Gothic';

const makeShadow = () => ({
  type: 'outer', blur: 10, offset: 2, angle: 135, color: '000000', opacity: 0.12,
});

function addHeader(slide, pres, section, no, total) {
  slide.addText(section, {
    x: 0.6, y: 0.28, w: 7, h: 0.3, fontSize: 10, color: BRAND,
    fontFace: FONT_JP_B, charSpacing: 6, bold: true, margin: 0,
  });
  slide.addText(`${no} / ${total}`, {
    x: 8.6, y: 0.28, w: 0.8, h: 0.3, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.6, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
}

function addFooter(slide, pres, footerText) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.35, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
  slide.addText(footerText, {
    x: 0.6, y: 5.42, w: 6, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, margin: 0,
  });
  slide.addText('v1.0', {
    x: 8.0, y: 5.42, w: 1.4, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
}

function numBadge(slide, pres, x, y, num, color = BRAND, size = 0.36) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size, fill: { color }, line: { color, width: 0 },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size, fontSize: 13, bold: true,
    color: BG_DARK, align: 'center', valign: 'middle',
    fontFace: FONT_JP_B, margin: 0,
  });
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PPT 1: 営業員向け 詳細マニュアル                                  */
/* ═══════════════════════════════════════════════════════════════ */
function buildOperator() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'HairSalonLink HPBメール自動連携 セットアップ手順書 (営業員向け)';
  pres.author = 'HairSalonLink';
  const TOTAL = 12;
  const FOOTER = 'HairSalonLink — HPB 自動連携セットアップ（社内限定）';

  // ─── 1. Cover ───
  {
    const s = pres.addSlide();
    s.background = { color: BG_DARK };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.7, w: 0.04, h: 0.9,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText('HAIR SALON LINK — INTERNAL', {
      x: 1.0, y: 0.7, w: 6, h: 0.35, fontSize: 11, color: BRAND,
      charSpacing: 14, bold: true, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('for Sales Staff Only', {
      x: 1.0, y: 1.05, w: 6, h: 0.35, fontSize: 10, color: 'a89988',
      charSpacing: 6, fontFace: FONT_JP, italic: true, margin: 0,
    });

    s.addText('HPB 予約の', {
      x: 0.8, y: 1.85, w: 8.4, h: 0.9, fontSize: 44, bold: true,
      color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
    });
    s.addText('リアルタイム自動連携', {
      x: 0.8, y: 2.65, w: 8.4, h: 0.9, fontSize: 44, bold: true,
      color: BRAND, fontFace: FONT_JP_SERIF, margin: 0,
    });
    s.addText('代行セットアップマニュアル', {
      x: 0.8, y: 3.5, w: 8.4, h: 0.5, fontSize: 20,
      color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 4.1, w: 3.5, h: 0.015,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText([
      { text: 'HPB 予約メールを Zapier 経由で HairSalonLink に自動転送。', options: { breakLine: true, color: 'ebe1cf' } },
      { text: 'ダブルブッキング防止・設定5分・月100件まで無料。', options: { color: 'a89988' } },
    ], {
      x: 0.8, y: 4.25, w: 8.4, h: 0.85, fontSize: 14,
      fontFace: FONT_JP, lineSpacingMultiple: 1.5, margin: 0,
    });
    s.addText('⚠ 本資料は社外持ち出し禁止。', {
      x: 0.8, y: 4.95, w: 8.4, h: 0.25, fontSize: 10,
      color: ACCENT_RED, fontFace: FONT_JP, italic: true, margin: 0,
    });
  }

  // ─── 2. 全体像 ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'OVERVIEW — なぜ必要か', 2, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('HPB と HairSalonLink のダブルブッキング問題', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 26, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    // 問題図
    const boxW = 2.8, boxH = 1.2, boxY = 1.8;
    // 左: HPB
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: boxY, w: boxW, h: boxH,
      fill: { color: 'fef2f2' }, line: { color: ACCENT_RED, width: 0.5 },
    });
    s.addText('HPB (ホットペッパー)', {
      x: 0.7, y: boxY + 0.1, w: boxW - 0.2, h: 0.3, fontSize: 12, bold: true,
      color: ACCENT_RED, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('14:00〜16:00\n山田花子様 新規予約', {
      x: 0.7, y: boxY + 0.45, w: boxW - 0.2, h: 0.7, fontSize: 11,
      color: INK, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
    });
    // 中: 自社予約 / LINE
    s.addShape(pres.shapes.RECTANGLE, {
      x: 3.6, y: boxY, w: boxW, h: boxH,
      fill: { color: PAPER_ALT }, line: { color: LINE_GREEN, width: 0.5 },
    });
    s.addText('LINE / 自社HP 予約', {
      x: 3.7, y: boxY + 0.1, w: boxW - 0.2, h: 0.3, fontSize: 12, bold: true,
      color: LINE_GREEN, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('14:30〜16:00\n鈴木一郎様 新規予約', {
      x: 3.7, y: boxY + 0.45, w: boxW - 0.2, h: 0.7, fontSize: 11,
      color: INK, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
    });
    // 右: 衝突
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.6, y: boxY, w: boxW, h: boxH,
      fill: { color: BG_DARK }, line: { color: ACCENT_RED, width: 0.8 },
    });
    s.addText('💥 ダブルブッキング', {
      x: 6.7, y: boxY + 0.1, w: boxW - 0.2, h: 0.3, fontSize: 12, bold: true,
      color: 'ff8888', fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('気づいた時には2名同時来店。\n当日キャンセル・信用失墜・損失', {
      x: 6.7, y: boxY + 0.45, w: boxW - 0.2, h: 0.7, fontSize: 10,
      color: 'ebe1cf', fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
    });

    // ↓ 矢印 + 解決
    s.addText('↓ 解決策', {
      x: 0.6, y: 3.2, w: 8.8, h: 0.3, fontSize: 14, bold: true,
      color: BRAND_DEEP, fontFace: FONT_JP_B, align: 'center', margin: 0,
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 3.65, w: 8.8, h: 1.5,
      fill: { color: 'ffffff' }, line: { color: BRAND, width: 0.6 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 3.65, w: 0.08, h: 1.5,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText('HPB 予約メールを Zapier 経由で HairSalonLink に自動転送', {
      x: 0.95, y: 3.75, w: 8.3, h: 0.35, fontSize: 14, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText([
      { text: '✓  Gmail に HPB メールが届いた瞬間、5秒以内に HairSalonLink に反映', options: { breakLine: true } },
      { text: '✓  LINE・自社HP の予約枠が即座に「予約不可」に更新', options: { breakLine: true } },
      { text: '✓  HPB の予約番号で重複検知、何度転送されても安全', options: {} },
    ], {
      x: 0.95, y: 4.15, w: 8.3, h: 0.95, fontSize: 11.5,
      color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.5, margin: 0,
    });
  }

  // ─── 3. フロー図 ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'FLOW — 自動連携の流れ', 3, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('メールが届いてから予約枠に反映されるまで', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const steps = [
      { ic: '📧', label: 'HPB → Gmail', sub: 'お客様が予約', color: ACCENT_RED },
      { ic: '🤖', label: 'Zapier 検知', sub: '新着メールを検出', color: ZAP_ORANGE },
      { ic: '📮', label: 'Webhook 送信', sub: '本文を POST', color: BRAND },
      { ic: '✅', label: 'HairSalonLink', sub: '予約枠を自動作成', color: SUCCESS },
    ];
    const startY = 2.1;
    const cardH = 1.6;
    const cardW = 1.95;
    steps.forEach((st, i) => {
      const x = 0.6 + i * 2.2;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: startY, w: cardW, h: cardH,
        fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
        shadow: makeShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: startY, w: cardW, h: 0.1,
        fill: { color: st.color }, line: { color: st.color, width: 0 },
      });
      s.addText(st.ic, {
        x, y: startY + 0.25, w: cardW, h: 0.55, fontSize: 28,
        align: 'center', valign: 'middle', margin: 0,
      });
      s.addText(st.label, {
        x, y: startY + 0.85, w: cardW, h: 0.35, fontSize: 13, bold: true,
        color: INK, fontFace: FONT_JP_B, align: 'center', valign: 'middle', margin: 0,
      });
      s.addText(st.sub, {
        x, y: startY + 1.2, w: cardW, h: 0.35, fontSize: 10,
        color: INK_MUTED, fontFace: FONT_JP, align: 'center', valign: 'middle', margin: 0,
      });
      if (i < steps.length - 1) {
        s.addText('→', {
          x: x + cardW + 0.02, y: startY + 0.55, w: 0.2, h: 0.5, fontSize: 22,
          color: BRAND, fontFace: FONT_JP_B, align: 'center', valign: 'middle', margin: 0,
        });
      }
    });

    // 所要時間
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.0, w: 8.8, h: 1.1,
      fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.0, w: 0.08, h: 1.1,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText('所要時間 / コスト', {
      x: 0.95, y: 4.1, w: 8.3, h: 0.3, fontSize: 12, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText([
      { text: '初回セットアップ: ', options: { bold: true, color: INK, fontFace: FONT_JP_B } },
      { text: '約 5 分（Zapier 登録＋連携設定）', options: { color: INK_MUTED, breakLine: true } },
      { text: '反映までの遅延: ', options: { bold: true, color: INK, fontFace: FONT_JP_B } },
      { text: 'メール受信から 1〜15 分（Zapier のポーリング間隔に依存）', options: { color: INK_MUTED, breakLine: true } },
      { text: '月額費用: ', options: { bold: true, color: INK, fontFace: FONT_JP_B } },
      { text: '100 件/月まで完全無料、超過時のみ Zapier 有料プラン', options: { color: INK_MUTED } },
    ], {
      x: 0.95, y: 4.4, w: 8.3, h: 0.7, fontSize: 10.5,
      lineSpacingMultiple: 1.5, margin: 0,
    });
  }

  // ─── 4. 必要なもの ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'PREP — 事前に準備するもの', 4, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('代行前にお客様から確認すべきもの', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const rows = [
      [
        { text: '項目', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
        { text: '内容', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
        { text: '用途', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      ],
      [
        { text: 'HPB 登録メール', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'HPB に登録されている連絡先 Gmail', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: 'Zapier で読み取る対象', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Gmail アカウント', options: { color: INK, fontFace: FONT_JP_B } },
        { text: '上記と同一の Google アカウント', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: 'Zapier 連携許可', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'HairSalonLink 権限', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'オーナー or 代行オペレータのログイン', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: '設定画面で Webhook URL 発行', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Zapier アカウント', options: { color: INK, fontFace: FONT_JP_B } },
        { text: '新規登録 (無料)', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: '連携ロボットを作成する場所', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.7, w: 8.8, colW: [2.4, 3.6, 2.8],
      rowH: 0.5, fontSize: 11,
      border: { pt: 0.4, color: BORDER },
      fill: { color: 'ffffff' },
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.3, w: 8.8, h: 0.8,
      fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.3, w: 0.08, h: 0.8,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText([
      { text: '💡 代行のコツ', options: { bold: true, color: INK, fontFace: FONT_JP_B, fontSize: 12, breakLine: true } },
      { text: 'オーナーが Zapier アカウントを持つことが重要（代行用アカウントは後で権限移譲が面倒）。代行時は商談先で一緒に作成 → オーナー本人の手でパスワード設定。', options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 10.5 } },
    ], {
      x: 0.95, y: 4.38, w: 8.3, h: 0.65, lineSpacingMultiple: 1.4, margin: 0,
    });
  }

  // ─── 5. STEP 1: HairSalonLink で URL 発行 ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'STEP 1 — HairSalonLink で Webhook URL を発行', 5, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('まず HairSalonLink 側で URL を発行', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const steps = [
      { t: '1', d: 'HairSalonLink にログイン（オーナーアカウント）' },
      { t: '2', d: '下部タブ「もっと」→「設定」を開く' },
      { t: '3', d: '「HPB メール自動連携」カードを見つける' },
      { t: '4', d: '「Webhook URL を発行」ボタンをタップ' },
      { t: '5', d: '表示された URL の「コピー」ボタンで控える' },
    ];
    steps.forEach((st, i) => {
      const y = 1.7 + i * 0.52;
      numBadge(s, pres, 0.6, y + 0.04, st.t, BRAND, 0.36);
      s.addText(st.d, {
        x: 1.1, y, w: 8.3, h: 0.4, fontSize: 13,
        color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
      });
    });

    // URL サンプル
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.5, w: 8.8, h: 0.65,
      fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
    });
    s.addText('URL 例', {
      x: 0.85, y: 4.58, w: 1, h: 0.5, fontSize: 10, bold: true,
      color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, valign: 'middle', margin: 0,
    });
    s.addText('https://hair-salon-link-production.up.railway.app/api/inbound/hpb/abc123...', {
      x: 1.85, y: 4.58, w: 7.4, h: 0.5, fontSize: 11,
      color: 'ebe1cf', fontFace: 'Consolas', valign: 'middle', margin: 0,
    });
  }

  // ─── 6. STEP 2: Zapier アカウント作成 ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'STEP 2 — Zapier アカウント作成・Gmail 連携', 6, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('Zapier に Gmail を連携する', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    // URL バー
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 1.55, w: 8.8, h: 0.65,
      fill: { color: BG_DARK }, line: { color: ZAP_ORANGE, width: 0.5 },
    });
    s.addText('URL', {
      x: 0.85, y: 1.62, w: 0.6, h: 0.5, fontSize: 10, bold: true,
      color: ZAP_ORANGE, fontFace: FONT_JP_B, charSpacing: 4, valign: 'middle', margin: 0,
    });
    s.addText('https://zapier.com/sign-up', {
      x: 1.4, y: 1.62, w: 7.9, h: 0.5, fontSize: 14,
      color: 'ebe1cf', fontFace: 'Consolas', valign: 'middle', margin: 0,
    });

    const steps = [
      { t: '1', d: 'URL を開いて「Sign up」→ Google アカウントでサインアップ（Gmail のアカウント）' },
      { t: '2', d: 'プロフィール情報: 役職「Marketing Manager」/ チーム規模「1-10」適当でOK' },
      { t: '3', d: 'アプリ選択画面は Gmail を選んで次へ（後で追加できる）' },
      { t: '4', d: 'ダッシュボードが表示されたら OK、次の STEP に進む' },
    ];
    steps.forEach((st, i) => {
      const y = 2.5 + i * 0.48;
      numBadge(s, pres, 0.6, y + 0.04, st.t, ZAP_ORANGE, 0.32);
      s.addText(st.d, {
        x: 1.05, y, w: 8.35, h: 0.4, fontSize: 12,
        color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
      });
    });

    // ヒント
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.6, w: 8.8, h: 0.55,
      fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
    });
    s.addText('💡 無料枠', {
      x: 0.85, y: 4.65, w: 1.2, h: 0.3, fontSize: 11, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('Free プランで OK（月 100 タスクまで無料）。超えそうなら Starter $19.99/月に上げる', {
      x: 2.0, y: 4.65, w: 7.3, h: 0.4, fontSize: 10.5,
      color: INK_MUTED, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  }

  // ─── 7. STEP 3: Zap 作成 (Trigger) ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'STEP 3 — Zap 作成・Trigger 設定', 7, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('Trigger: Gmail で HPB メールを検知', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    // 設定表
    const rows = [
      [
        { text: '設定項目', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
        { text: '入力する値', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      ],
      [
        { text: 'App', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'Gmail', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Event', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'New Email Matching Search', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Account', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'サロンの Gmail アカウントを選択（初回は認証許可）', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Search String', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'from:hotpepper.jp OR from:beauty.hotpepper.jp', options: { color: ACCENT_RED, fontFace: 'Consolas' } },
      ],
      [
        { text: 'Label / Mailbox', options: { color: INK, fontFace: FONT_JP_B } },
        { text: '空欄でOK（全フォルダから検索）', options: { color: INK_MUTED, fontFace: FONT_JP, italic: true } },
      ],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.65, w: 8.8, colW: [2.6, 6.2],
      rowH: 0.42, fontSize: 11.5,
      border: { pt: 0.4, color: BORDER },
      fill: { color: 'ffffff' },
    });

    // テスト
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.45, w: 8.8, h: 0.7,
      fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.45, w: 0.08, h: 0.7,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText([
      { text: 'Test Trigger', options: { bold: true, color: INK, fontFace: FONT_JP_B, fontSize: 12, breakLine: true } },
      { text: '「Test trigger」を押すと過去の HPB メールが 1 件読み込まれる。サンプルが取れたら次へ。', options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 10.5 } },
    ], {
      x: 0.95, y: 4.5, w: 8.3, h: 0.6, lineSpacingMultiple: 1.4, margin: 0,
    });
  }

  // ─── 8. STEP 4: Zap 作成 (Action) ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'STEP 4 — Zap 作成・Action 設定', 8, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('Action: HairSalonLink に POST 転送', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const rows = [
      [
        { text: '設定項目', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
        { text: '入力する値', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      ],
      [
        { text: 'App', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'Webhooks by Zapier', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Event', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'POST', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'URL', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'STEP 1 でコピーした HairSalonLink の Webhook URL', options: { color: ACCENT_RED, fontFace: FONT_JP_B } },
      ],
      [
        { text: 'Payload Type', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'JSON', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Data', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'Key: body   Value: Gmail の [Body Plain] を選択', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Wrap in Array', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'No', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
      [
        { text: 'Unflatten', options: { color: INK, fontFace: FONT_JP_B } },
        { text: 'No', options: { color: INK_MUTED, fontFace: FONT_JP } },
      ],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.65, w: 8.8, colW: [2.6, 6.2],
      rowH: 0.36, fontSize: 11,
      border: { pt: 0.4, color: BORDER },
      fill: { color: 'ffffff' },
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.85, w: 8.8, h: 0.3,
      fill: { color: 'fef2f2' }, line: { color: ACCENT_RED, width: 0.3 },
    });
    s.addText('⚠ URL は他人に絶対に見せない。漏れたら設定画面で即再発行。', {
      x: 0.7, y: 4.85, w: 8.6, h: 0.3, fontSize: 10,
      color: ACCENT_RED, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  }

  // ─── 9. STEP 5: テスト / Publish ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'STEP 5 — 動作テストして Zap を ON', 9, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('テスト実行で動作確認 → Publish', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const steps = [
      { t: '1', d: 'Action 設定画面下部「Test Action」ボタンを押す' },
      { t: '2', d: 'HairSalonLink 側から 200 OK（または {ok:true, parsed:1}）が返ればテスト成功' },
      { t: '3', d: 'HairSalonLink の /reservations 画面を開いて、テスト予約が反映されていることを確認' },
      { t: '4', d: '「Publish Zap」ボタンで Zap を ON にする' },
      { t: '5', d: 'Zapier のダッシュボードで Zap ステータスが「On」になっていれば運用開始' },
    ];
    steps.forEach((st, i) => {
      const y = 1.75 + i * 0.48;
      numBadge(s, pres, 0.6, y + 0.04, st.t, SUCCESS, 0.32);
      s.addText(st.d, {
        x: 1.05, y, w: 8.35, h: 0.4, fontSize: 12,
        color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
      });
    });

    // 動作確認方法
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.55, w: 8.8, h: 0.6,
      fill: { color: PAPER_ALT }, line: { color: SUCCESS, width: 0.3 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.55, w: 0.08, h: 0.6,
      fill: { color: SUCCESS }, line: { color: SUCCESS, width: 0 },
    });
    s.addText([
      { text: '最終確認: ', options: { bold: true, color: SUCCESS, fontFace: FONT_JP_B, fontSize: 12 } },
      { text: '翌日以降、実際の HPB 予約が入った時、HairSalonLink の予約一覧に「hotpepper」源として自動表示されているかを見る。1 件でも反映されたら成功。', options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 11 } },
    ], {
      x: 0.95, y: 4.62, w: 8.3, h: 0.5, lineSpacingMultiple: 1.4, margin: 0,
    });
  }

  // ─── 10. 代替手段 ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'ALT — Zapier が使えない場合', 10, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('代替手段 (Zapier が合わない時)', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const options = [
      {
        n: 'A',
        title: 'Google Apps Script',
        desc: 'Gmail に直接スクリプト設置。完全無料・無制限。\n5 分毎の定期実行で未読の HPB メールを読んで Webhook に POST。',
        pro: '• 完全無料\n• 無制限',
        con: '• 技術的に少し難しい\n• ユーザー本人で管理',
        color: BRAND,
      },
      {
        n: 'B',
        title: 'Cloudflare Email Routing',
        desc: '独自ドメインを持っている場合、hpb@marici.com のような受信用アドレスを作って直接 Worker 経由で転送。',
        pro: '• 完全無料\n• 最速反応（1 秒以内）',
        con: '• 独自ドメイン必須\n• DNS 設定必要',
        color: BRAND,
      },
      {
        n: 'C',
        title: '手動ペースト',
        desc: 'HairSalonLink の予約画面「HPB メール取込」ボタン。\nオーナーが届いたメールをコピペして取り込み。',
        pro: '• 設定ゼロ\n• 即使える',
        con: '• 手間がかかる\n• 取り忘れリスク',
        color: BRAND,
      },
    ];
    options.forEach((opt, i) => {
      const y = 1.7 + i * 1.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 8.8, h: 1.05,
        fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
        shadow: makeShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 0.08, h: 1.05,
        fill: { color: opt.color }, line: { color: opt.color, width: 0 },
      });
      s.addText(opt.n, {
        x: 0.85, y: y + 0.1, w: 0.5, h: 0.85, fontSize: 32, bold: true,
        color: opt.color, fontFace: FONT_JP_SERIF, valign: 'middle', margin: 0,
      });
      s.addText(opt.title, {
        x: 1.4, y: y + 0.1, w: 7.9, h: 0.3, fontSize: 13, bold: true,
        color: INK, fontFace: FONT_JP_B, margin: 0,
      });
      s.addText(opt.desc, {
        x: 1.4, y: y + 0.4, w: 7.9, h: 0.65, fontSize: 10,
        color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
      });
    });
  }

  // ─── 11. トラブルシュート ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'TROUBLE — よくあるトラブル', 11, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('現場で詰まった時の即解決表', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const rows = [
      [
        { text: '症状', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
        { text: '原因', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
        { text: '対応', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      ],
      [
        { text: 'Zap が発火しない', options: { color: INK, fontFace: FONT_JP } },
        { text: 'Search String の誤り / Gmail 連携切れ', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: 'Search String 確認、Gmail 連携再認証', options: { color: SUCCESS, fontFace: FONT_JP } },
      ],
      [
        { text: 'Test Action で 400 or 404', options: { color: INK, fontFace: FONT_JP } },
        { text: 'Webhook URL のトークンが壊れている', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: '設定画面で再発行 → Zapier 側の URL 更新', options: { color: SUCCESS, fontFace: FONT_JP } },
      ],
      [
        { text: '200 OK だが予約に反映されない', options: { color: INK, fontFace: FONT_JP } },
        { text: 'メール本文のパースに失敗', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: 'そのメール本文を support@... に送って調査依頼', options: { color: SUCCESS, fontFace: FONT_JP } },
      ],
      [
        { text: '同じ予約が重複する', options: { color: INK, fontFace: FONT_JP } },
        { text: 'HPB 変更メールを新規扱い', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: 'パーサ側で自動識別するが、念のため予約一覧で確認', options: { color: SUCCESS, fontFace: FONT_JP } },
      ],
      [
        { text: 'Data フィールドに Body Plain が無い', options: { color: INK, fontFace: FONT_JP } },
        { text: 'Gmail のフィールド選択ミス', options: { color: INK_MUTED, fontFace: FONT_JP } },
        { text: 'Zapier の Action 設定で「Show all options」→ Body Plain', options: { color: SUCCESS, fontFace: FONT_JP } },
      ],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.65, w: 8.8, colW: [2.2, 2.8, 3.8],
      rowH: 0.48, fontSize: 10.5,
      border: { pt: 0.4, color: BORDER },
      fill: { color: 'ffffff' },
    });
  }

  // ─── 12. まとめ ───
  {
    const s = pres.addSlide();
    s.background = { color: BG_DARK };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.8, w: 0.04, h: 0.9,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText('SUMMARY', {
      x: 1.0, y: 0.8, w: 6, h: 0.35, fontSize: 10, bold: true,
      color: BRAND, charSpacing: 8, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('ダブルブッキング、ゼロへ。', {
      x: 0.8, y: 1.65, w: 8.4, h: 1.0, fontSize: 44, bold: true,
      color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
    });

    const hls = [
      { n: '01', h: 'HairSalonLink で Webhook URL 発行', d: '設定→HPB メール自動連携→URL 発行ボタン。トークンは秘密、他人に見せない。' },
      { n: '02', h: 'Zapier で Gmail ↔ Webhook を繋ぐ', d: 'Trigger: New Email Matching Search / Action: Webhooks POST + Body Plain。' },
      { n: '03', h: '運用は自動・月100件まで無料', d: 'リアルタイム反映・重複検知・衝突検知を自動処理。オーナーは日常操作ゼロ。' },
    ];
    hls.forEach((h, i) => {
      const y = 2.95 + i * 0.75;
      s.addText(h.n, {
        x: 0.8, y: y + 0.02, w: 0.7, h: 0.4, fontSize: 20, bold: true,
        color: BRAND, fontFace: FONT_JP_SERIF, charSpacing: 2, margin: 0,
      });
      s.addText(h.h, {
        x: 1.55, y, w: 7.7, h: 0.3, fontSize: 14, bold: true,
        color: 'ebe1cf', fontFace: FONT_JP_B, margin: 0,
      });
      s.addText(h.d, {
        x: 1.55, y: y + 0.3, w: 7.7, h: 0.35, fontSize: 10.5,
        color: 'a89988', fontFace: FONT_JP, margin: 0,
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 5.05, w: 8.4, h: 0.015,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText('HairSalonLink  ·  社内マニュアル  ·  v1.0', {
      x: 0.8, y: 5.15, w: 8.4, h: 0.25, fontSize: 10,
      color: 'a89988', fontFace: FONT_JP, italic: true, align: 'center', margin: 0,
    });
  }

  return pres;
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PPT 2: オーナー配布用 要点マニュアル                              */
/* ═══════════════════════════════════════════════════════════════ */
function buildOwner() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'HPB予約 自動連携 クイックガイド (オーナー様向け)';
  pres.author = 'HairSalonLink';
  const TOTAL = 7;
  const FOOTER = 'HairSalonLink — HPB 自動連携 クイックガイド';

  // ─── 1. Cover ───
  {
    const s = pres.addSlide();
    s.background = { color: BG_DARK };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.7, w: 0.04, h: 0.9,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText('HAIR SALON LINK', {
      x: 1.0, y: 0.7, w: 6, h: 0.35, fontSize: 11, color: BRAND,
      charSpacing: 14, bold: true, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('for Salon Owner', {
      x: 1.0, y: 1.05, w: 6, h: 0.35, fontSize: 10, color: 'a89988',
      charSpacing: 6, fontFace: FONT_JP, italic: true, margin: 0,
    });

    s.addText('HPB 予約、', {
      x: 0.8, y: 1.9, w: 8.4, h: 1.0, fontSize: 50, bold: true,
      color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
    });
    s.addText('自動で取り込めます。', {
      x: 0.8, y: 2.8, w: 8.4, h: 1.0, fontSize: 50, bold: true,
      color: BRAND, fontFace: FONT_JP_SERIF, margin: 0,
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 3.95, w: 3.5, h: 0.015,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText([
      { text: 'HPB の予約メールを HairSalonLink に自動転送する設定マニュアル。', options: { breakLine: true, color: 'ebe1cf' } },
      { text: '設定にかかる時間：約 5 分 / 月 100 件まで完全無料。', options: { color: 'a89988' } },
    ], {
      x: 0.8, y: 4.1, w: 8.4, h: 0.85, fontSize: 14,
      fontFace: FONT_JP, lineSpacingMultiple: 1.5, margin: 0,
    });
  }

  // ─── 2. ベネフィット ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'なぜこの設定が必要か', 2, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('設定するとこう変わります', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 28, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const cards = [
      { t: 'ダブルブッキング防止', d: 'HPB の予約が入った瞬間、LINE・自社HP の空き枠からも自動で外れます。' },
      { t: '予約情報の一元管理', d: '全チャネルの予約が HairSalonLink に集約。カレンダー 1 つで全把握。' },
      { t: '手入力ゼロ', d: 'メールを見て手打ちする作業が不要に。店舗業務に集中できます。' },
    ];
    cards.forEach((c, i) => {
      const y = 1.8 + i * 1.1;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 8.8, h: 1.0,
        fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
        shadow: makeShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 0.08, h: 1.0,
        fill: { color: BRAND }, line: { color: BRAND, width: 0 },
      });
      s.addText(`0${i + 1}`, {
        x: 0.85, y: y + 0.1, w: 0.8, h: 0.85, fontSize: 30, bold: true,
        color: BRAND, fontFace: FONT_JP_SERIF, valign: 'middle', margin: 0,
      });
      s.addText(c.t, {
        x: 1.8, y: y + 0.15, w: 7.4, h: 0.35, fontSize: 15, bold: true,
        color: INK, fontFace: FONT_JP_B, margin: 0,
      });
      s.addText(c.d, {
        x: 1.8, y: y + 0.5, w: 7.4, h: 0.5, fontSize: 12,
        color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.5, margin: 0,
      });
    });
  }

  // ─── 3. 準備するもの ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, '事前に準備するもの', 3, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('ご準備いただくもの', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 28, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const items = [
      { ic: '📧', label: 'HPB の連絡先メール', sub: 'HPB から予約メールが届く Gmail アカウント' },
      { ic: '🔐', label: 'Gmail のパスワード', sub: 'Zapier 連携の初回認証に使用' },
      { ic: '📱', label: 'HairSalonLink ログイン', sub: '既にお渡し済みのメール/パスワード' },
    ];
    items.forEach((it, i) => {
      const y = 1.8 + i * 0.9;
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y, w: 8.8, h: 0.78,
        fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      });
      s.addText(it.ic, {
        x: 0.85, y: y + 0.12, w: 0.7, h: 0.6, fontSize: 26,
        align: 'center', valign: 'middle', margin: 0,
      });
      s.addText(it.label, {
        x: 1.7, y: y + 0.1, w: 7.5, h: 0.32, fontSize: 14, bold: true,
        color: INK, fontFace: FONT_JP_B, margin: 0,
      });
      s.addText(it.sub, {
        x: 1.7, y: y + 0.42, w: 7.5, h: 0.32, fontSize: 11,
        color: INK_MUTED, fontFace: FONT_JP, margin: 0,
      });
    });

    s.addText('💡 この3つが揃っていれば、あとは営業員がセットアップを代行いたします。', {
      x: 0.6, y: 4.7, w: 8.8, h: 0.4, fontSize: 11, italic: true,
      color: BRAND_DEEP, fontFace: FONT_JP, align: 'center', margin: 0,
    });
  }

  // ─── 4. 3ステップ ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, '設定の流れ', 4, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('設定は 3 ステップだけ', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 28, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const steps = [
      { t: '1', title: 'HairSalonLink で URL 発行', desc: '設定画面の「HPBメール自動連携」セクションで Webhook URL をコピー', color: BRAND },
      { t: '2', title: 'Zapier で Gmail と連携', desc: 'Zapier (無料サービス) に Gmail アカウントを繋ぐ → 「HPB から来たメール」を検知する設定', color: ZAP_ORANGE },
      { t: '3', title: '動作テスト → ON', desc: '「Test」ボタンで動くか確認 → Zap を ON にすれば以降は全自動', color: SUCCESS },
    ];
    steps.forEach((st, i) => {
      const y = 1.85 + i * 1.05;
      s.addShape(pres.shapes.OVAL, {
        x: 0.85, y: y + 0.15, w: 0.6, h: 0.6,
        fill: { color: st.color }, line: { color: st.color, width: 0 },
      });
      s.addText(st.t, {
        x: 0.85, y: y + 0.15, w: 0.6, h: 0.6, fontSize: 22, bold: true,
        color: 'ffffff', align: 'center', valign: 'middle',
        fontFace: FONT_JP_B, margin: 0,
      });
      s.addText(st.title, {
        x: 1.7, y: y + 0.1, w: 7.5, h: 0.38, fontSize: 16, bold: true,
        color: INK, fontFace: FONT_JP_B, margin: 0,
      });
      s.addText(st.desc, {
        x: 1.7, y: y + 0.5, w: 7.5, h: 0.55, fontSize: 11.5,
        color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
      });
      if (i < steps.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: 1.15, y: y + 0.75, w: 0, h: 0.3,
          line: { color: BORDER, width: 1 },
        });
      }
    });
  }

  // ─── 5. 実際の動き ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, '導入後の日々', 5, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('設定完了後、こう動きます', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 28, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    // タイムライン
    const tl = [
      { time: '09:15', t: 'HPB でお客様が予約を完了' },
      { time: '09:15', t: 'HPB から店舗 Gmail に予約確定メール着信' },
      { time: '09:16', t: 'Zapier が検知し、HairSalonLink に転送' },
      { time: '09:16', t: 'HairSalonLink に予約枠が自動作成される（source=hotpepper）' },
      { time: '09:16', t: 'LINE・自社HP 予約ページでその枠が「予約不可」に切替' },
    ];
    const startY = 1.8;
    const lineH = 0.52;
    tl.forEach((ev, i) => {
      const y = startY + i * lineH;
      // 左: 時刻
      s.addText(ev.time, {
        x: 0.6, y, w: 1.2, h: 0.4, fontSize: 12, bold: true,
        color: BRAND, fontFace: FONT_JP_B, valign: 'middle',
        charSpacing: 1, margin: 0,
      });
      // 中央: 点
      s.addShape(pres.shapes.OVAL, {
        x: 1.85, y: y + 0.12, w: 0.16, h: 0.16,
        fill: { color: i === tl.length - 1 ? SUCCESS : BRAND }, line: { color: BORDER, width: 0 },
      });
      // 縦線
      if (i < tl.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: 1.93, y: y + 0.28, w: 0, h: lineH - 0.16,
          line: { color: BORDER, width: 1 },
        });
      }
      // 右: 内容
      s.addText(ev.t, {
        x: 2.2, y, w: 7.1, h: 0.4, fontSize: 12,
        color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
      });
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.65, w: 8.8, h: 0.5,
      fill: { color: PAPER_ALT }, line: { color: SUCCESS, width: 0.3 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 4.65, w: 0.08, h: 0.5,
      fill: { color: SUCCESS }, line: { color: SUCCESS, width: 0 },
    });
    s.addText('オーナー様の操作: 一切不要。届いた予約を予約一覧で眺めるだけ。', {
      x: 0.95, y: 4.67, w: 8.3, h: 0.45, fontSize: 11.5, bold: true,
      color: SUCCESS, fontFace: FONT_JP_B, valign: 'middle', margin: 0,
    });
  }

  // ─── 6. Q&A ───
  {
    const s = pres.addSlide();
    s.background = { color: PAPER };
    addHeader(s, pres, 'Q&A', 6, TOTAL);
    addFooter(s, pres, FOOTER);

    s.addText('よくあるご質問', {
      x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 28, bold: true,
      color: INK, fontFace: FONT_JP_SERIF, margin: 0,
    });

    const qa = [
      { q: '費用はかかりますか？', a: '月 100 件までは完全無料。月 100 件を超える予約がある繁盛店の場合のみ、Zapier Starter プラン月額 $19.99 (約 3,000 円) で 20,000 件まで対応可能です。' },
      { q: 'HPB の予約メールを停止してもいいですか？', a: '停止しないでください。メールが届くことが前提の連携です。普段メールを読む必要はありません。' },
      { q: 'キャンセルや予約変更も反映されますか？', a: 'はい。HPB が送る変更・キャンセルメールも自動検出して HairSalonLink 側に反映します。' },
      { q: '途中で解除したい時は？', a: 'Zapier の管理画面で Zap を OFF にするだけ。HairSalonLink 側も設定画面から Webhook URL を無効化できます。' },
    ];
    qa.forEach((item, i) => {
      const y = 1.7 + i * 0.8;
      s.addText([
        { text: 'Q. ', options: { bold: true, color: BRAND, fontFace: FONT_JP_B, fontSize: 11 } },
        { text: item.q, options: { bold: true, color: INK, fontFace: FONT_JP_B, fontSize: 12, breakLine: true } },
        { text: 'A. ', options: { bold: true, color: INK_MUTED, fontFace: FONT_JP_B, fontSize: 11 } },
        { text: item.a, options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 10.5 } },
      ], {
        x: 0.6, y, w: 8.8, h: 0.75, lineSpacingMultiple: 1.6, margin: 0,
      });
    });
  }

  // ─── 7. Closing ───
  {
    const s = pres.addSlide();
    s.background = { color: BG_DARK };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 0.8, w: 0.04, h: 0.9,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText('Support', {
      x: 1.0, y: 0.8, w: 6, h: 0.35, fontSize: 10, bold: true,
      color: BRAND, charSpacing: 8, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('お気軽に、', {
      x: 0.8, y: 1.8, w: 8.4, h: 1.0, fontSize: 48, bold: true,
      color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
    });
    s.addText('ご相談ください。', {
      x: 0.8, y: 2.7, w: 8.4, h: 1.0, fontSize: 48, bold: true,
      color: BRAND, fontFace: FONT_JP_SERIF, margin: 0,
    });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y: 3.8, w: 3.5, h: 0.015,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });

    s.addText('HairSalonLink サポート窓口', {
      x: 0.8, y: 4.0, w: 8.4, h: 0.4, fontSize: 13, bold: true,
      color: 'ebe1cf', fontFace: FONT_JP_B, margin: 0,
    });
    s.addText([
      { text: 'Email  ', options: { color: 'a89988', fontFace: FONT_JP_B, fontSize: 11 } },
      { text: 'shibahara.724@gmail.com', options: { color: BRAND, fontFace: 'Consolas', fontSize: 13, breakLine: true } },
      { text: 'ダッシュボード  ', options: { color: 'a89988', fontFace: FONT_JP_B, fontSize: 11 } },
      { text: 'hair-salon-link-production.up.railway.app', options: { color: BRAND, fontFace: 'Consolas', fontSize: 13 } },
    ], {
      x: 0.8, y: 4.45, w: 8.4, h: 0.7, lineSpacingMultiple: 1.6, margin: 0,
    });
  }

  return pres;
}

/* ═══════════════════════════════════════════════════════════════ */

async function main() {
  const op = buildOperator();
  await op.writeFile({ fileName: 'HairSalonLink_HPB自動連携マニュアル_営業員用.pptx' });
  console.log('✅ 営業員用 完成');

  const ow = buildOwner();
  await ow.writeFile({ fileName: 'HairSalonLink_HPB自動連携_オーナー向けクイックガイド.pptx' });
  console.log('✅ オーナー向け 完成');
}
main().catch((e) => { console.error(e); process.exit(1); });
