// HairSalonLink LINE連携マニュアル.pptx を生成
const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10" x 5.625"
pres.title = 'HairSalonLink LINE連携マニュアル';
pres.author = 'HairSalonLink';

// ── Palette (brand: warm dark noir) ──
const BG_DARK = '0c0a09';
const BG_ALT = '120e0c';
const PAPER = 'faf7f2';           // slide 本文の紙色
const PAPER_ALT = 'f1ece3';       // カード背景
const BORDER = 'd9d1bf';
const INK = '1c1917';             // 本文黒
const INK_MUTED = '6b5f52';       // ミューテッド
const BRAND = 'c9a96e';           // antique gold
const BRAND_DEEP = '9c7a4a';
const LINE_GREEN = '06c755';      // LINE ブランドカラー
const ACCENT_RED = 'b85042';      // 注意喚起
const SUCCESS = '166534';

const FONT_JP_SERIF = 'Yu Mincho'; // Windows 標準
const FONT_JP = 'Yu Gothic';       // Windows 標準
const FONT_JP_B = 'Yu Gothic';

// ── helpers ──────────────────────────────────────────────
const makeShadow = () => ({
  type: 'outer', blur: 10, offset: 2, angle: 135, color: '000000', opacity: 0.12,
});

function addHeader(slide, section, no) {
  // 左上 section 表記 + 右上 ページ番号
  slide.addText(section, {
    x: 0.6, y: 0.28, w: 6, h: 0.3, fontSize: 10, color: BRAND,
    fontFace: FONT_JP_B, charSpacing: 6, bold: true, margin: 0,
  });
  slide.addText(`${no} / 12`, {
    x: 8.6, y: 0.28, w: 0.8, h: 0.3, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
  // ヘッダライン
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.6, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
}

function addFooter(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.35, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
  slide.addText('HairSalonLink — LINE連携マニュアル', {
    x: 0.6, y: 5.42, w: 6, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, margin: 0,
  });
  slide.addText('hair-salon-link-production.up.railway.app', {
    x: 6.6, y: 5.42, w: 2.8, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
}

function stepBadge(slide, x, y, num, size = 0.55) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size, fontSize: 22, bold: true,
    color: BG_DARK, align: 'center', valign: 'middle',
    fontFace: FONT_JP_B, margin: 0,
  });
}

// ====================================================================
// Slide 1 — Cover (dark)
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: BG_DARK };

  // 細い装飾縦線
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 0.7, w: 0.04, h: 0.9,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });

  s.addText('HAIR SALON LINK', {
    x: 1.0, y: 0.7, w: 5, h: 0.35, fontSize: 11, color: BRAND,
    charSpacing: 14, bold: true, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText('for Hair Salons', {
    x: 1.0, y: 1.05, w: 5, h: 0.35, fontSize: 10, color: 'a89988',
    charSpacing: 6, fontFace: FONT_JP, italic: true, margin: 0,
  });

  s.addText('LINE連携', {
    x: 0.8, y: 2.0, w: 8.4, h: 1.2, fontSize: 64, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });
  s.addText('かんたんセットアップガイド', {
    x: 0.8, y: 3.2, w: 8.4, h: 0.6, fontSize: 22,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.0, w: 3.5, h: 0.015,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });

  s.addText([
    { text: 'スマートフォンだけで完結。', options: { breakLine: true, color: 'ebe1cf' } },
    { text: '公式アカウント作成から予約通知まで、約15分。', options: { color: 'a89988' } },
  ], {
    x: 0.8, y: 4.15, w: 8.4, h: 0.9, fontSize: 15,
    fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
  });
}

// ====================================================================
// Slide 2 — Why LINE / Overview
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'OVERVIEW — なぜ LINE 連携するのか', 2);
  addFooter(s);

  s.addText('LINE連携で、できること', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 32, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const benefits = [
    {
      title: '予約リマインド自動送信',
      body: '前日に「明日 ○時〜のご予約です」を自動配信。\n電話での再確認・当日スッポカシが激減。',
    },
    {
      title: 'クーポン・新作メニュー配信',
      body: '休眠顧客の呼び戻し、既存客の来店サイクル短縮。\nセグメント配信で反応率を最大化。',
    },
    {
      title: '公式アカウントで友だち増加',
      body: 'HPB 新規を LINE 友だち化することで、\n以降は自社直予約へシフトさせられる。',
    },
  ];

  const cardY = 1.9;
  const cardH = 2.6;
  const cardW = 2.8;
  benefits.forEach((b, i) => {
    const x = 0.6 + i * 2.95;
    // card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.75 },
      shadow: makeShadow(),
    });
    // top accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: 0.08,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText(`0${i + 1}`, {
      x: x + 0.3, y: cardY + 0.25, w: 1, h: 0.4, fontSize: 14, bold: true,
      color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, margin: 0,
    });
    s.addText(b.title, {
      x: x + 0.3, y: cardY + 0.7, w: cardW - 0.6, h: 0.6, fontSize: 16, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(b.body, {
      x: x + 0.3, y: cardY + 1.35, w: cardW - 0.6, h: cardH - 1.5, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
    });
  });

  s.addText('所要時間：約 15 分（初回のみ） / 月額：0 円からスタート可能', {
    x: 0.6, y: 4.75, w: 8.8, h: 0.3, fontSize: 12, italic: true,
    color: BRAND_DEEP, fontFace: FONT_JP, align: 'center', margin: 0,
  });
}

// ====================================================================
// Slide 3 — Cost / Pricing
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'COST — 費用は？', 3);
  addFooter(s);

  s.addText('料金：基本は無料で回せます', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 32, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 料金表
  const rows = [
    [
      { text: 'LINE公式アカウント プラン', options: { bold: true, color: INK, fontFace: FONT_JP_B } },
      { text: '月額', options: { bold: true, color: INK, fontFace: FONT_JP_B, align: 'center' } },
      { text: '配信可能数', options: { bold: true, color: INK, fontFace: FONT_JP_B, align: 'center' } },
    ],
    [
      { text: 'コミュニケーション', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '¥0', options: { color: SUCCESS, fontFace: FONT_JP_B, bold: true, align: 'center' } },
      { text: '月 200 通まで', options: { color: INK_MUTED, fontFace: FONT_JP, align: 'center' } },
    ],
    [
      { text: 'ライト', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '¥5,000', options: { color: INK, fontFace: FONT_JP_B, align: 'center' } },
      { text: '月 5,000 通まで', options: { color: INK_MUTED, fontFace: FONT_JP, align: 'center' } },
    ],
    [
      { text: 'スタンダード', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '¥15,000', options: { color: INK, fontFace: FONT_JP_B, align: 'center' } },
      { text: '月 30,000 通まで', options: { color: INK_MUTED, fontFace: FONT_JP, align: 'center' } },
    ],
  ];

  s.addTable(rows, {
    x: 0.6, y: 1.9, w: 8.8,
    colW: [4.4, 1.8, 2.6],
    rowH: 0.45,
    fontSize: 12,
    border: { pt: 0.5, color: BORDER },
    fill: { color: 'ffffff' },
  });

  // 重要ポイント
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.0, w: 8.8, h: 1.05,
    fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.5 },
  });
  // 左に縦のアクセント
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.0, w: 0.08, h: 1.05,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText([
    {
      text: '無料枠（200通／月）で回せる理由',
      options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true, fontSize: 13 },
    },
    {
      text: '予約リマインド・1対1の返信・友だち追加時のウェルカムメッセージは「応答メッセージ」扱いで配信数にカウントされません。無料枠は「ブロードキャスト／セグメント配信（＝クーポン告知など）」の本数のみ消費します。',
      options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 11 },
    },
  ], {
    x: 0.95, y: 4.1, w: 8.35, h: 0.9, lineSpacingMultiple: 1.4, margin: 0,
  });
}

// ====================================================================
// Slide 4 — Overall Flow
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'FLOW — 全体像', 4);
  addFooter(s);

  s.addText('全体の流れ（7ステップ）', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 32, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const steps = [
    'LINE公式アカウントを開設する',
    'LINE Developers Console に入る',
    'プロバイダー・Messaging APIチャネルを作成',
    'Channel Access Token を発行する',
    'HairSalonLink の設定画面に入力',
    'Webhook URL を LINE に登録',
    ' 友だち追加してテストメッセージ',
  ];

  const startY = 1.9;
  const lineH = 0.45;
  steps.forEach((txt, i) => {
    const y = startY + i * lineH;
    // 番号バッジ
    s.addShape(pres.shapes.OVAL, {
      x: 0.7, y: y + 0.04, w: 0.35, h: 0.35,
      fill: { color: i < 5 ? BRAND : LINE_GREEN },
      line: { color: 'ffffff', width: 0 },
    });
    s.addText(String(i + 1), {
      x: 0.7, y: y + 0.04, w: 0.35, h: 0.35, fontSize: 13, bold: true,
      color: BG_DARK, align: 'center', valign: 'middle',
      fontFace: FONT_JP_B, margin: 0,
    });
    // 文字
    s.addText(txt, {
      x: 1.2, y: y + 0.03, w: 7.4, h: 0.38, fontSize: 14,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
    // 矢印線
    if (i < steps.length - 1) {
      s.addShape(pres.shapes.LINE, {
        x: 0.875, y: y + 0.39, w: 0, h: lineH - 0.35,
        line: { color: BORDER, width: 1 },
      });
    }
  });
}

// ====================================================================
// Slide 5 — Step 1: Create LINE Official Account
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 1 — LINE公式アカウントを開設', 5);
  addFooter(s);

  s.addText('LINE公式アカウントを開設する', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 左：手順
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 5.4, h: 3.3,
    fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
    shadow: makeShadow(),
  });
  s.addText('スマホでの手順', {
    x: 0.9, y: 1.95, w: 5, h: 0.4, fontSize: 14, bold: true,
    color: BRAND, fontFace: FONT_JP_B, margin: 0,
  });

  const proc = [
    { n: '1', t: 'ブラウザで以下を開く', d: 'linebiz.com/jp/entry/' },
    { n: '2', t: 'アカウントを開設する(無料)', d: 'をタップ' },
    { n: '3', t: 'LINEアカウントでログイン', d: '普段使っているLINEでOK' },
    { n: '4', t: '入力項目', d: 'アカウント名 / メール / 業種：美容・ヘルスケア → 美容室' },
    { n: '5', t: '「完了」をタップ', d: '開設完了。すぐ使えます。' },
  ];
  proc.forEach((p, i) => {
    const y = 2.4 + i * 0.52;
    s.addText(p.n + '.', {
      x: 0.9, y, w: 0.3, h: 0.35, fontSize: 13, bold: true,
      color: BRAND_DEEP, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(p.t, {
      x: 1.2, y, w: 4.7, h: 0.25, fontSize: 12, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(p.d, {
      x: 1.2, y: y + 0.25, w: 4.7, h: 0.22, fontSize: 10,
      color: INK_MUTED, fontFace: FONT_JP, margin: 0,
    });
  });

  // 右：ポイント
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.2, y: 1.8, w: 3.2, h: 3.3,
    fill: { color: PAPER_ALT }, line: { color: BORDER, width: 0.5 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.2, y: 1.8, w: 0.08, h: 3.3,
    fill: { color: LINE_GREEN }, line: { color: LINE_GREEN, width: 0 },
  });
  s.addText('✓ ポイント', {
    x: 6.4, y: 1.95, w: 2.8, h: 0.35, fontSize: 13, bold: true,
    color: INK, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText([
    { text: '費用はかからない', options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true } },
    { text: '完全に無料で開設できます。', options: { color: INK_MUTED, fontFace: FONT_JP, breakLine: true } },
    { text: ' ', options: { breakLine: true } },
    { text: 'アカウント名は後から変更可', options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true } },
    { text: 'まずは「店舗名 テスト」でOK。', options: { color: INK_MUTED, fontFace: FONT_JP, breakLine: true } },
    { text: ' ', options: { breakLine: true } },
    { text: '認証済アカウントは後申請', options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true } },
    { text: '青バッジは不要。先に運用開始を。', options: { color: INK_MUTED, fontFace: FONT_JP } },
  ], {
    x: 6.4, y: 2.35, w: 2.9, h: 2.7, fontSize: 11,
    lineSpacingMultiple: 1.35, margin: 0,
  });
}

// ====================================================================
// Slide 6 — Step 2: LINE Developers Console + Provider
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 2 — Developers Console にログイン', 6);
  addFooter(s);

  s.addText('Developers Console でプロバイダー作成', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 26, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('「プロバイダー」＝店舗・事業主体のまとまり。チャネルはこの下にぶら下がります。', {
    x: 0.6, y: 1.55, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  // URLカード
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.05, w: 8.8, h: 0.7,
    fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
  });
  s.addText('URL', {
    x: 0.85, y: 2.15, w: 0.6, h: 0.5, fontSize: 11, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, valign: 'middle', margin: 0,
  });
  s.addText('https://developers.line.biz/console/', {
    x: 1.4, y: 2.15, w: 7.9, h: 0.5, fontSize: 15,
    color: 'ebe1cf', fontFace: 'Consolas', valign: 'middle', margin: 0,
  });

  // 手順
  const steps = [
    { t: '1', d: '上の URL を開いて LINE アカウントでログイン' },
    { t: '2', d: '初回なら「開発者登録」で名前・メールを入力' },
    { t: '3', d: 'トップ画面で「プロバイダー」横の「作成」をタップ' },
    { t: '4', d: 'プロバイダー名：例「HairSalonLink テスト」を入力 → 作成' },
  ];
  steps.forEach((st, i) => {
    const y = 3.05 + i * 0.5;
    s.addShape(pres.shapes.OVAL, {
      x: 0.6, y: y + 0.02, w: 0.36, h: 0.36,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText(st.t, {
      x: 0.6, y: y + 0.02, w: 0.36, h: 0.36, fontSize: 13, bold: true,
      color: BG_DARK, align: 'center', valign: 'middle',
      fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(st.d, {
      x: 1.05, y, w: 8.3, h: 0.4, fontSize: 13,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // 赤系ヒント
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.08, w: 8.8, h: 0.22,
    fill: { color: 'fef2f2' }, line: { color: ACCENT_RED, width: 0.3 },
  });
  s.addText('💡 見つからない時は  https://developers.line.biz/console/register/provider  に直接アクセス', {
    x: 0.7, y: 5.08, w: 8.6, h: 0.22, fontSize: 9.5,
    color: ACCENT_RED, fontFace: FONT_JP, valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 7 — Step 3: Create Messaging API channel
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 3 — Messaging APIチャネル作成', 7);
  addFooter(s);

  s.addText('Messaging API チャネルを作る', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // プロバイダーページ → Create channel → Messaging API
  const steps2 = [
    '作ったプロバイダーのページを開く',
    '「Create a new channel」をタップ',
    '種類：「Messaging API」を選択',
  ];
  steps2.forEach((t, i) => {
    s.addText(`${i + 1}. ${t}`, {
      x: 0.6, y: 1.75 + i * 0.32, w: 8.8, h: 0.28, fontSize: 12.5,
      color: INK, fontFace: FONT_JP, margin: 0,
    });
  });

  // 入力項目テーブル
  s.addText('チャネル作成フォームの入力内容', {
    x: 0.6, y: 2.85, w: 8.8, h: 0.3, fontSize: 13, bold: true,
    color: BRAND_DEEP, fontFace: FONT_JP_B, margin: 0,
  });
  const fieldRows = [
    [
      { text: '項目', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '入力内容', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: 'チャネル名', options: { color: INK, fontFace: FONT_JP } },
      { text: 'LINE公式アカウント名と同じにする（例：テスト美容室）', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'チャネル説明', options: { color: INK, fontFace: FONT_JP } },
      { text: '予約受付・お知らせ配信', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: '大業種', options: { color: INK, fontFace: FONT_JP } },
      { text: '生活関連サービス', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: '小業種', options: { color: INK, fontFace: FONT_JP } },
      { text: '美容・理容', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'メールアドレス', options: { color: INK, fontFace: FONT_JP } },
      { text: 'shibahara.724@gmail.com（ご自身のメール）', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'プライバシー / 利用規約URL', options: { color: INK, fontFace: FONT_JP } },
      { text: '空欄でOK（後から設定可能）', options: { color: INK_MUTED, fontFace: FONT_JP, italic: true } },
    ],
  ];
  s.addTable(fieldRows, {
    x: 0.6, y: 3.2, w: 8.8, colW: [3.0, 5.8],
    rowH: 0.28, fontSize: 11,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });
}

// ====================================================================
// Slide 8 — Step 4: Issue Channel Access Token
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 4 — 認証情報を取得する', 8);
  addFooter(s);

  s.addText('3つの値を取得する', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('HairSalonLink に入力する3つの値を、作ったチャネルのページから取得します。', {
    x: 0.6, y: 1.55, w: 8.8, h: 0.35, fontSize: 11,
    color: INK_MUTED, fontFace: FONT_JP, italic: true, margin: 0,
  });

  const creds = [
    {
      label: '① Channel ID',
      where: 'Basic settings タブ',
      desc: '数字10桁ほど。そのままコピー。',
      color: BRAND,
    },
    {
      label: '② Channel Secret',
      where: 'Basic settings タブ',
      desc: '英数字32桁。「表示」をタップしてコピー。',
      color: BRAND,
    },
    {
      label: '③ Channel Access Token',
      where: 'Messaging API settings タブ',
      desc: '「Issue」ボタンで発行。長い英数字列。',
      color: LINE_GREEN,
    },
  ];
  creds.forEach((c, i) => {
    const y = 2.1 + i * 1.02;
    // カード
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 8.8, h: 0.9,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    // 左アクセントバー
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 0.08, h: 0.9,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
    });

    s.addText(c.label, {
      x: 0.85, y: y + 0.12, w: 3.5, h: 0.35, fontSize: 16, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(c.where, {
      x: 0.85, y: y + 0.48, w: 3.5, h: 0.3, fontSize: 10,
      color: BRAND_DEEP, fontFace: FONT_JP_B, charSpacing: 2, margin: 0,
    });
    s.addText(c.desc, {
      x: 4.4, y: y + 0.2, w: 4.8, h: 0.6, fontSize: 12,
      color: INK_MUTED, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // 注意
  s.addText('⚠  Channel Secret・Access Token は「パスワード相当」です。他人に見せない・SNS に貼らない。', {
    x: 0.6, y: 5.16, w: 8.8, h: 0.2, fontSize: 10,
    color: ACCENT_RED, fontFace: FONT_JP, italic: true, margin: 0,
  });
}

// ====================================================================
// Slide 9 — Step 5: Enter in HairSalonLink
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 5 — HairSalonLink に入力', 9);
  addFooter(s);

  s.addText('取得した3つを設定画面に入力', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 左: HairSalonLink 画面導線
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.8, w: 4.3, h: 3.3,
    fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
    shadow: makeShadow(),
  });
  s.addText('画面への入り方', {
    x: 0.9, y: 1.95, w: 4, h: 0.35, fontSize: 14, bold: true,
    color: BRAND, fontFace: FONT_JP_B, margin: 0,
  });
  const nav = [
    { n: '1', t: 'HairSalonLink にログイン' },
    { n: '2', t: '下部タブバーから「もっと」' },
    { n: '3', t: '「設定」をタップ' },
    { n: '4', t: '「LINE 連携」カードを見る' },
    { n: '5', t: '3つのフィールドに貼り付け' },
    { n: '6', t: '「保存」をタップ' },
  ];
  nav.forEach((item, i) => {
    const y = 2.4 + i * 0.42;
    s.addShape(pres.shapes.OVAL, {
      x: 0.9, y: y + 0.04, w: 0.28, h: 0.28,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText(item.n, {
      x: 0.9, y: y + 0.04, w: 0.28, h: 0.28, fontSize: 10, bold: true,
      color: BG_DARK, align: 'center', valign: 'middle',
      fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(item.t, {
      x: 1.28, y: y + 0.04, w: 3.5, h: 0.28, fontSize: 12,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // 右: 入力マッピング
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.8, w: 4.3, h: 3.3,
    fill: { color: PAPER_ALT }, line: { color: BORDER, width: 0.5 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.8, w: 0.08, h: 3.3,
    fill: { color: LINE_GREEN }, line: { color: LINE_GREEN, width: 0 },
  });
  s.addText('入力フィールドの対応', {
    x: 5.3, y: 1.95, w: 4, h: 0.35, fontSize: 14, bold: true,
    color: INK, fontFace: FONT_JP_B, margin: 0,
  });
  const map = [
    { from: 'Channel ID', to: '① Channel ID' },
    { from: 'Channel Secret', to: '② Channel Secret' },
    { from: 'Channel Access Token', to: '③ Access Token' },
    { from: 'LIFF ID', to: '（任意・空欄でOK）' },
  ];
  map.forEach((m, i) => {
    const y = 2.45 + i * 0.52;
    s.addText(m.from, {
      x: 5.3, y, w: 1.8, h: 0.3, fontSize: 11, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText('◀', {
      x: 7.1, y, w: 0.25, h: 0.3, fontSize: 11,
      color: BRAND, fontFace: FONT_JP, margin: 0,
    });
    s.addText(m.to, {
      x: 7.35, y, w: 1.95, h: 0.3, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, margin: 0,
    });
  });
  s.addText('保存後「LINE 接続をテスト」ボタンで疎通確認。✅ と出れば成功です。', {
    x: 5.3, y: 4.55, w: 4, h: 0.5, fontSize: 10.5, italic: true,
    color: BRAND_DEEP, fontFace: FONT_JP, margin: 0,
  });
}

// ====================================================================
// Slide 10 — Step 6: Register Webhook URL
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 6 — Webhook URL を登録', 10);
  addFooter(s);

  s.addText('Webhook URL を LINE 側に貼る', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });
  s.addText('これをやらないと、お客様からのメッセージを HairSalonLink が受信できません。', {
    x: 0.6, y: 1.55, w: 8.8, h: 0.3, fontSize: 11,
    color: INK_MUTED, fontFace: FONT_JP, italic: true, margin: 0,
  });

  // URL ブロック
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.0, w: 8.8, h: 0.85,
    fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
  });
  s.addText('Webhook URL', {
    x: 0.85, y: 2.1, w: 2, h: 0.3, fontSize: 10, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, margin: 0,
  });
  s.addText('https://hair-salon-link-production.up.railway.app/api/line/webhook', {
    x: 0.85, y: 2.4, w: 8.3, h: 0.4, fontSize: 13.5,
    color: 'ebe1cf', fontFace: 'Consolas', margin: 0,
  });

  // 手順
  const steps3 = [
    { t: '1', d: 'LINE Developers Console → 作ったチャネル → 「Messaging API 設定」タブ' },
    { t: '2', d: '「Webhook URL」欄に上記 URL を貼り付け → 「更新」' },
    { t: '3', d: '「Webhookの利用」トグルを ON にする' },
    { t: '4', d: '「検証」ボタン → Success と出れば OK' },
    { t: '5', d: 'さらに下の「応答メッセージ」をオフ、「あいさつメッセージ」をオンに' },
  ];
  steps3.forEach((st, i) => {
    const y = 3.1 + i * 0.38;
    s.addShape(pres.shapes.OVAL, {
      x: 0.6, y: y + 0.03, w: 0.3, h: 0.3,
      fill: { color: BRAND }, line: { color: BRAND, width: 0 },
    });
    s.addText(st.t, {
      x: 0.6, y: y + 0.03, w: 0.3, h: 0.3, fontSize: 11, bold: true,
      color: BG_DARK, align: 'center', valign: 'middle',
      fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.34, fontSize: 11.5,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // ヒント
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.08, w: 8.8, h: 0.22,
    fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
  });
  s.addText('💡 HairSalonLink の設定画面に「コピー」ボタン付きで同じ URL が表示されます。そちらからコピーすると確実。', {
    x: 0.7, y: 5.08, w: 8.6, h: 0.22, fontSize: 9.5,
    color: BRAND_DEEP, fontFace: FONT_JP, valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 11 — Step 7: Add friend and test
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 7 — 友だち追加してテスト', 11);
  addFooter(s);

  s.addText('友だち追加 → 動作確認', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.7, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 3ステップ横並び
  const tests = [
    {
      n: '1', title: 'QRコード取得',
      body: 'LINE公式アカウントマネージャー →「友だちを増やす」→ QRコード を表示・保存。',
    },
    {
      n: '2', title: '自分のLINEで追加',
      body: 'QRコードを自分のLINEで読み取り、公式アカウントを友だち追加。ウェルカムメッセージが届きます。',
    },
    {
      n: '3', title: '「予約」と送信',
      body: '自動返信で予約ページURLが届けば接続成功。届かない場合は STEP 6 の Webhook 設定を再確認。',
    },
  ];
  const cardW = 2.8;
  const cardH = 3.05;
  const cardY = 1.85;
  tests.forEach((t, i) => {
    const x = 0.6 + i * 2.95;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    // 大きな番号
    s.addText(t.n, {
      x: x + 0.3, y: cardY + 0.25, w: 2, h: 0.9, fontSize: 60,
      color: BRAND, fontFace: FONT_JP_SERIF, bold: true, margin: 0,
    });
    s.addText(t.title, {
      x: x + 0.3, y: cardY + 1.35, w: cardW - 0.6, h: 0.4, fontSize: 16, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(t.body, {
      x: x + 0.3, y: cardY + 1.85, w: cardW - 0.6, h: cardH - 2, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
    });
  });

  s.addText('予約リマインド配信は翌日予約があると自動で送信されます（cron起動時）。', {
    x: 0.6, y: 5.05, w: 8.8, h: 0.25, fontSize: 10, italic: true,
    color: BRAND_DEEP, fontFace: FONT_JP, align: 'center', margin: 0,
  });
}

// ====================================================================
// Slide 12 — Closing / troubleshooting
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: BG_DARK };

  // 大見出し
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 0.8, w: 0.04, h: 0.9,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('COMPLETE', {
    x: 1.0, y: 0.8, w: 5, h: 0.35, fontSize: 10, bold: true,
    color: BRAND, charSpacing: 8, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText('連携完了！', {
    x: 0.8, y: 1.7, w: 8.4, h: 1.2, fontSize: 52, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });

  // トラブルシュート
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.0, w: 8.4, h: 1.9,
    fill: { color: BG_ALT }, line: { color: BORDER, width: 0.3 },
  });
  s.addText('うまくいかない時', {
    x: 1.0, y: 3.15, w: 8, h: 0.35, fontSize: 14, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 2, margin: 0,
  });

  const tips = [
    { q: '「LINE 接続をテスト」が失敗', a: 'Channel Access Token が Short-lived のまま。Issue し直して長期版を保存。' },
    { q: 'Webhook 検証で Error', a: 'URL の末尾が /api/line/webhook か再確認。スペース混入も要注意。' },
    { q: 'メッセージに返信が返らない', a: 'LINE Developers の「応答メッセージ」＝OFF、「Webhookの利用」＝ON に設定。' },
    { q: 'クーポン配信がカウントされる', a: '予約リマインドと個別返信は無料枠外。クーポンなどの一斉配信のみカウント。' },
  ];
  tips.forEach((tip, i) => {
    const y = 3.55 + i * 0.32;
    s.addText('・', {
      x: 1.0, y, w: 0.15, h: 0.28, fontSize: 12, bold: true,
      color: BRAND, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText([
      { text: tip.q + '  ', options: { bold: true, color: 'ebe1cf', fontFace: FONT_JP_B } },
      { text: tip.a, options: { color: 'a89988', fontFace: FONT_JP } },
    ], {
      x: 1.15, y, w: 8.0, h: 0.28, fontSize: 10.5, margin: 0,
    });
  });

  s.addText('HairSalonLink サポート  ·  shibahara.724@gmail.com', {
    x: 0.8, y: 5.1, w: 8.4, h: 0.3, fontSize: 11,
    color: 'a89988', fontFace: FONT_JP, align: 'center', italic: true, margin: 0,
  });
}

// ── write ────────────────────────────────────────────────
pres.writeFile({ fileName: 'HairSalonLink_LINE連携マニュアル.pptx' })
  .then(() => { console.log('✅ wrote HairSalonLink_LINE連携マニュアル.pptx'); })
  .catch((e) => { console.error(e); process.exit(1); });
