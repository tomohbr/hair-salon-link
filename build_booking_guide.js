// HairSalonLink LINEからの予約導線セットアップ手順書.pptx
const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'HairSalonLink LINEからの予約導線セットアップ手順書';
pres.author = 'HairSalonLink';

// ── Brand palette (同系統) ──
const BG_DARK = '0c0a09';
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

const FONT_JP_SERIF = 'Yu Mincho';
const FONT_JP = 'Yu Gothic';
const FONT_JP_B = 'Yu Gothic';

const TOTAL = 11;

const makeShadow = () => ({
  type: 'outer', blur: 10, offset: 2, angle: 135, color: '000000', opacity: 0.12,
});
function addHeader(slide, section, no) {
  slide.addText(section, {
    x: 0.6, y: 0.28, w: 7, h: 0.3, fontSize: 10, color: BRAND,
    fontFace: FONT_JP_B, charSpacing: 6, bold: true, margin: 0,
  });
  slide.addText(`${no} / ${TOTAL}`, {
    x: 8.6, y: 0.28, w: 0.8, h: 0.3, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.6, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
}
function addFooter(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 5.35, w: 8.8, h: 0.012, fill: { color: BORDER }, line: { color: BORDER, width: 0 },
  });
  slide.addText('HairSalonLink — LINE予約導線セットアップ（社内限定）', {
    x: 0.6, y: 5.42, w: 6, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, margin: 0,
  });
  slide.addText('v1.0 / 営業員用', {
    x: 6.6, y: 5.42, w: 2.8, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
}
function numBadge(slide, x, y, num, color = BRAND, size = 0.36) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color }, line: { color, width: 0 },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size, fontSize: 13, bold: true,
    color: BG_DARK, align: 'center', valign: 'middle',
    fontFace: FONT_JP_B, margin: 0,
  });
}
function urlBar(s, x, y, w, url, label = 'URL') {
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h: 0.6,
    fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
  });
  s.addText(label, {
    x: x + 0.2, y: y + 0.05, w: 1.4, h: 0.5, fontSize: 10, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 4, valign: 'middle', margin: 0,
  });
  s.addText(url, {
    x: x + 1.7, y: y + 0.05, w: w - 1.9, h: 0.5, fontSize: 13,
    color: 'ebe1cf', fontFace: 'Consolas', valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 1 — Cover
// ====================================================================
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

  s.addText('LINE から予約', {
    x: 0.8, y: 1.65, w: 8.4, h: 1.0, fontSize: 46, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });
  s.addText('セットアップ手順書', {
    x: 0.8, y: 2.6, w: 8.4, h: 0.9, fontSize: 42, bold: true,
    color: BRAND, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.7, w: 3.5, h: 0.015,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });

  s.addText([
    { text: 'LINE 友だちが「予約」ボタンをタップするだけで', options: { breakLine: true, color: 'ebe1cf' } },
    { text: '自社予約ページに直行できる導線を作る。', options: { breakLine: true, color: 'a89988' } },
    { text: ' ', options: { breakLine: true } },
    { text: '事前にこちらで設定できる部分 / オーナーに任せる部分を明確化。', options: { color: 'a89988', italic: true } },
  ], {
    x: 0.8, y: 3.85, w: 8.4, h: 1.4, fontSize: 14,
    fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
  });
}

// ====================================================================
// Slide 2 — 3つの予約導線
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'OVERVIEW — 3つの予約導線', 2);
  addFooter(s);

  s.addText('LINEからお客様を予約ページに誘導する', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('この3つをすべて設定すると、友だち追加したお客様は確実に予約まで到達できる。', {
    x: 0.6, y: 1.55, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  const channels = [
    {
      n: '01',
      title: 'あいさつメッセージ',
      body: '友だち追加の瞬間に予約ページ URL を自動送信。最初の接点で即予約誘導。',
      imp: '必須',
      color: LINE_GREEN,
    },
    {
      n: '02',
      title: 'リッチメニュー',
      body: 'トーク画面の下に常時表示される「予約する」ボタン。最も強い導線。',
      imp: '強推奨',
      color: BRAND,
    },
    {
      n: '03',
      title: 'キーワード自動返信',
      body: 'お客様が「予約」と送った瞬間に URL を返信。HairSalonLink が自動処理。',
      imp: '設定済',
      color: BRAND_DEEP,
    },
  ];

  const cardY = 2.0;
  const cardH = 3.2;
  channels.forEach((c, i) => {
    const x = 0.6 + i * 2.95;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: 2.8, h: cardH,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: cardY, w: 2.8, h: 0.08,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
    });
    s.addText(c.n, {
      x: x + 0.25, y: cardY + 0.25, w: 1, h: 0.5, fontSize: 18, bold: true,
      color: c.color, fontFace: FONT_JP_SERIF, charSpacing: 2, margin: 0,
    });
    // 重要度バッジ
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + cardW_tag(c.imp), y: cardY + 0.3, w: 0.75, h: 0.3,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
    });
    s.addText(c.imp, {
      x: x + cardW_tag(c.imp), y: cardY + 0.3, w: 0.75, h: 0.3, fontSize: 10, bold: true,
      color: BG_DARK, align: 'center', valign: 'middle',
      fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(c.title, {
      x: x + 0.25, y: cardY + 0.85, w: 2.3, h: 0.5, fontSize: 16, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(c.body, {
      x: x + 0.25, y: cardY + 1.45, w: 2.3, h: cardH - 1.6, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
    });
  });

  function cardW_tag() { return 1.85; }
}

// ====================================================================
// Slide 3 — Pre-check
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'PREP — 事前チェック', 3);
  addFooter(s);

  s.addText('設定前に揃える情報', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const rows = [
    [
      { text: '項目', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '内容', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '取得場所', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: '予約ページ URL', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '店舗ごとの公開URL（/book/店舗slug）', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'HairSalonLink 設定画面', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'LINE公式アカウント', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '作成済み・Messaging API 有効化済み', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'LINE Official Account Manager', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'リッチメニュー画像', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '2500x1686px（1:0.67） JPG/PNG', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '要作成 or テンプレ流用', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'あいさつ文のテキスト', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '店舗ごとにカスタマイズした予約案内文', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'テンプレから微調整', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
  ];
  s.addTable(rows, {
    x: 0.6, y: 1.55, w: 8.8, colW: [2.4, 3.8, 2.6],
    rowH: 0.55, fontSize: 10.5,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.6, w: 8.8, h: 0.65,
    fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.6, w: 0.08, h: 0.65,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('💡 予約ページURLの例', {
    x: 0.9, y: 4.65, w: 8.4, h: 0.25, fontSize: 11, bold: true,
    color: INK, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText('https://hair-salon-link-production.up.railway.app/book/〈店舗のslug〉', {
    x: 0.9, y: 4.92, w: 8.4, h: 0.3, fontSize: 11.5,
    color: BRAND_DEEP, fontFace: 'Consolas', margin: 0,
  });
}

// ====================================================================
// Slide 4 — STEP 1: Get the booking URL
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 1 — 予約ページ URL を取得', 4);
  addFooter(s);

  s.addText('店舗専用の予約 URL を確保する', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const steps = [
    { t: '1', d: 'HairSalonLink にログイン' },
    { t: '2', d: '下部タブ「もっと」→「設定」を開く' },
    { t: '3', d: '画面上部の「公開予約URL」カード' },
    { t: '4', d: 'URL 右の「コピー」アイコン or 手動で URL を全選択コピー' },
    { t: '5', d: '「プレビュー」ボタンで実際のページを確認（お客様視点でのUX確認）' },
  ];
  steps.forEach((st, i) => {
    const y = 1.65 + i * 0.45;
    numBadge(s, 0.6, y + 0.04, st.t, BRAND, 0.32);
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.4, fontSize: 12.5,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.15, w: 8.8, h: 1.1,
    fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.15, w: 0.08, h: 1.1,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('💡 URL が長い場合', {
    x: 0.9, y: 4.22, w: 8.4, h: 0.3, fontSize: 12, bold: true,
    color: INK, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText('リッチメニューなど文字数制限がある場所に貼る場合、短縮 URL（Bitly / TinyURL）を使うと貼りやすい。ただし URL の透明性は下がるため、あいさつメッセージには生 URL を使うのが無難。', {
    x: 0.9, y: 4.5, w: 8.4, h: 0.7, fontSize: 10.5,
    color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
  });
}

// ====================================================================
// Slide 5 — STEP 2: Greeting message
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 2 — あいさつメッセージ設定', 5);
  addFooter(s);

  s.addText('友だち追加 → 即予約導線をセット', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  urlBar(s, 0.6, 1.55, 8.8, 'manager.line.biz', 'アクセス');

  const steps = [
    { t: '1', d: 'Official Account Manager にログイン → 該当アカウント選択' },
    { t: '2', d: '左メニュー「トークルーム管理」→「あいさつメッセージ」' },
    { t: '3', d: '既定のメッセージを置換 → 下のテンプレを貼付 → 保存' },
  ];
  steps.forEach((st, i) => {
    const y = 2.35 + i * 0.38;
    numBadge(s, 0.6, y + 0.02, st.t, BRAND, 0.3);
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.32, fontSize: 11.5,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // テンプレート
  s.addText('貼り付け用テンプレート（店舗名・URL だけ差替え）', {
    x: 0.6, y: 3.62, w: 8.8, h: 0.3, fontSize: 12, bold: true,
    color: BRAND_DEEP, fontFace: FONT_JP_B, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.95, w: 8.8, h: 1.3,
    fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
  });
  s.addText(
    '〈店舗名〉を友だち追加いただきありがとうございます🌸\n\n' +
    'ご予約はこちらから24時間受付中👇\n' +
    'https://hair-salon-link-production.up.railway.app/book/〈店舗slug〉\n\n' +
    '💌 クーポン・新作スタイルも配信予定！\n「予約」と送信すると予約ページをいつでもお送りします。',
    {
      x: 0.8, y: 4.05, w: 8.4, h: 1.15, fontSize: 10,
      color: INK, fontFace: 'Yu Gothic', lineSpacingMultiple: 1.35, margin: 0,
    }
  );
}

// ====================================================================
// Slide 6 — STEP 3: Rich menu
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 3 — リッチメニュー作成', 6);
  addFooter(s);

  s.addText('トーク画面の「予約ボタン」を常設', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 左: 手順
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.6, w: 5.1, h: 3.55,
    fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
    shadow: makeShadow(),
  });
  s.addText('Manager での作成手順', {
    x: 0.9, y: 1.75, w: 4.5, h: 0.35, fontSize: 14, bold: true,
    color: BRAND, fontFace: FONT_JP_B, margin: 0,
  });

  const proc = [
    { n: '1', d: 'Manager →「トークルーム管理」→「リッチメニュー」' },
    { n: '2', d: '「作成」→ タイトル「予約案内」' },
    { n: '3', d: '表示期間：無期限 / サイズ：大' },
    { n: '4', d: 'テンプレート選択（1ボタン〜6ボタン）' },
    { n: '5', d: '画像をアップロード（2500x1686 推奨）' },
    { n: '6', d: 'アクション：「リンク」→ 予約 URL を貼付' },
    { n: '7', d: 'アクション名：「ご予約はこちら」' },
    { n: '8', d: 'デフォルトで表示を ON → 保存' },
  ];
  proc.forEach((p, i) => {
    const y = 2.2 + i * 0.36;
    numBadge(s, 0.9, y + 0.04, p.n, BRAND, 0.28);
    s.addText(p.d, {
      x: 1.28, y, w: 4.3, h: 0.32, fontSize: 10.5,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // 右: 画像ガイド
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.9, y: 1.6, w: 3.5, h: 3.55,
    fill: { color: PAPER_ALT }, line: { color: BORDER, width: 0.5 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.9, y: 1.6, w: 0.08, h: 3.55,
    fill: { color: LINE_GREEN }, line: { color: LINE_GREEN, width: 0 },
  });
  s.addText('画像の作り方', {
    x: 6.1, y: 1.75, w: 3.2, h: 0.35, fontSize: 13, bold: true,
    color: INK, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText([
    { text: 'サイズ', options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true, fontSize: 11 } },
    { text: '2500 x 1686 px（大）', options: { color: INK_MUTED, fontFace: FONT_JP, breakLine: true, fontSize: 10.5 } },
    { text: ' ', options: { breakLine: true, fontSize: 6 } },
    { text: '形式', options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true, fontSize: 11 } },
    { text: 'JPG / PNG（1MB以下）', options: { color: INK_MUTED, fontFace: FONT_JP, breakLine: true, fontSize: 10.5 } },
    { text: ' ', options: { breakLine: true, fontSize: 6 } },
    { text: '作成ツール', options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true, fontSize: 11 } },
    { text: 'Canva（無料テンプレあり）', options: { color: INK_MUTED, fontFace: FONT_JP, breakLine: true, fontSize: 10.5 } },
    { text: '「LINEリッチメニュー」で検索', options: { color: INK_MUTED, fontFace: FONT_JP, italic: true, breakLine: true, fontSize: 9.5 } },
    { text: ' ', options: { breakLine: true, fontSize: 6 } },
    { text: '最小構成', options: { bold: true, color: INK, fontFace: FONT_JP_B, breakLine: true, fontSize: 11 } },
    { text: '1ボタン（「予約」のみ）でも十分効果あり', options: { color: INK_MUTED, fontFace: FONT_JP, fontSize: 10.5 } },
  ], {
    x: 6.1, y: 2.2, w: 3.2, h: 2.9,
    lineSpacingMultiple: 1.25, margin: 0,
  });
}

// ====================================================================
// Slide 7 — STEP 4: Keyword auto-reply (already in webhook)
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 4 — キーワード自動返信（設定済）', 7);
  addFooter(s);

  s.addText('「予約」と送ると URL が返る仕組み', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.55, w: 8.8, h: 0.7,
    fill: { color: PAPER_ALT }, line: { color: SUCCESS, width: 0.4 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.55, w: 0.08, h: 0.7,
    fill: { color: SUCCESS }, line: { color: SUCCESS, width: 0 },
  });
  s.addText('✓ この機能は HairSalonLink の Webhook で既に実装済。追加設定は不要。', {
    x: 0.9, y: 1.6, w: 8.3, h: 0.6, fontSize: 12, bold: true,
    color: SUCCESS, fontFace: FONT_JP_B, valign: 'middle', margin: 0,
  });

  // 反応するキーワード
  s.addText('既に動作するキーワード', {
    x: 0.6, y: 2.5, w: 8.8, h: 0.3, fontSize: 13, bold: true,
    color: BRAND_DEEP, fontFace: FONT_JP_B, margin: 0,
  });
  const keywords = [
    { k: '「予約」 ', r: '予約ページ URL を返信' },
    { k: '「クーポン」 ', r: 'クーポン配信案内を返信' },
    { k: '「営業」「時間」「定休」「アクセス」', r: '店舗ページへ誘導' },
    { k: 'それ以外の文字', r: 'ヘルプ案内を返信' },
  ];
  keywords.forEach((kw, i) => {
    const y = 2.85 + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 8.8, h: 0.32,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.3 },
    });
    s.addText(kw.k, {
      x: 0.8, y, w: 3.0, h: 0.32, fontSize: 11, bold: true,
      color: INK, fontFace: FONT_JP_B, valign: 'middle', margin: 0,
    });
    s.addText('→', {
      x: 3.8, y, w: 0.3, h: 0.32, fontSize: 11,
      color: BRAND, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
    s.addText(kw.r, {
      x: 4.1, y, w: 5.2, h: 0.32, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // 注意
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.7, w: 8.8, h: 0.55,
    fill: { color: 'fef2f2' }, line: { color: ACCENT_RED, width: 0.3 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.7, w: 0.08, h: 0.55,
    fill: { color: ACCENT_RED }, line: { color: ACCENT_RED, width: 0 },
  });
  s.addText('⚠ 必須：LINE Developers → Messaging API 設定で「応答メッセージ」OFF／「Webhookの利用」ON。これを怠ると Bot の返信が LINE 既定の応答に上書きされる。', {
    x: 0.9, y: 4.77, w: 8.4, h: 0.45, fontSize: 10,
    color: ACCENT_RED, fontFace: FONT_JP, valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 8 — STEP 5: QR code (poster / business card)
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 5 — QR コードで拡散', 8);
  addFooter(s);

  s.addText('お店の QR コードでオフライン導線を作る', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('店内ポスター・レジ横・名刺・会計レシート等に貼って、一度来たお客様を必ず友だち化する。', {
    x: 0.6, y: 1.55, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  // 2 種類の QR
  const qrs = [
    {
      title: '① 友だち追加 QR（LINE OA）',
      body: 'Manager → 「友だちを増やす」タブ → 「友だち追加QRコード」 → 画像ダウンロード',
      use: '【用途】店内・名刺・レシート',
      color: LINE_GREEN,
    },
    {
      title: '② 直接予約 QR',
      body: '予約URL から QR コード生成（qr-code-generator.com 等）→ 画像ダウンロード',
      use: '【用途】ウェブサイト・チラシ・広告',
      color: BRAND,
    },
  ];
  qrs.forEach((q, i) => {
    const x = 0.6 + i * 4.55;
    const y = 2.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.25, h: 3.1,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.25, h: 0.08,
      fill: { color: q.color }, line: { color: q.color, width: 0 },
    });
    s.addText(q.title, {
      x: x + 0.25, y: y + 0.25, w: 3.75, h: 0.4, fontSize: 14, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(q.body, {
      x: x + 0.25, y: y + 0.85, w: 3.75, h: 1.2, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.5, margin: 0,
    });
    // use badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.25, y: y + 2.35, w: 3.75, h: 0.55,
      fill: { color: PAPER_ALT }, line: { color: q.color, width: 0.3 },
    });
    s.addText(q.use, {
      x: x + 0.4, y: y + 2.4, w: 3.5, h: 0.45, fontSize: 10.5, bold: true,
      color: q.color === LINE_GREEN ? SUCCESS : BRAND_DEEP,
      fontFace: FONT_JP_B, valign: 'middle', margin: 0,
    });
  });
}

// ====================================================================
// Slide 9 — STEP 6: End to end test
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 6 — エンドツーエンドテスト', 9);
  addFooter(s);

  s.addText('お客様目線で通してみる', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('営業員の自分のスマホで、お客様が実際にやる流れを再現。引っかかりがないか確認する。', {
    x: 0.6, y: 1.55, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  const flow = [
    {
      step: '1. 友だち追加',
      expect: 'QRコードを読み取り → あいさつメッセージが即届く',
      fail: 'あいさつが届かない → STEP 2 のあいさつ設定を確認',
    },
    {
      step: '2. リッチメニュー確認',
      expect: 'トーク画面の下に「ご予約はこちら」ボタンが表示',
      fail: '表示されない → STEP 3 のリッチメニュー「表示ON」を確認',
    },
    {
      step: '3. 予約ボタンをタップ',
      expect: 'LINE内ブラウザで予約ページが開く',
      fail: '開かない or 別の場所に飛ぶ → URL の誤記を確認',
    },
    {
      step: '4. メニュー・日時を選んで予約',
      expect: '完了画面が表示、DB にデータが保存される',
      fail: 'エラー → HairSalonLink のログを確認',
    },
    {
      step: '5. ダッシュボードで確認',
      expect: '予約一覧に新規予約が「LINE」流入で表示',
      fail: '表示されない → /reservations ページを再読込',
    },
    {
      step: '6. 前日リマインド（翌日予約を入れた場合）',
      expect: '翌日9時に自動リマインドが LINE に届く',
      fail: '届かない → cron 設定と Channel Access Token を再確認',
    },
  ];

  flow.forEach((f, i) => {
    const y = 2.0 + i * 0.52;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y, w: 8.8, h: 0.46,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.3 },
    });
    s.addText(f.step, {
      x: 0.8, y, w: 2.5, h: 0.46, fontSize: 11, bold: true,
      color: INK, fontFace: FONT_JP_B, valign: 'middle', margin: 0,
    });
    s.addText([
      { text: '期待  ', options: { fontSize: 9, color: SUCCESS, fontFace: FONT_JP_B, bold: true } },
      { text: f.expect, options: { fontSize: 10, color: INK_MUTED, fontFace: FONT_JP, breakLine: true } },
      { text: '失敗時  ', options: { fontSize: 9, color: ACCENT_RED, fontFace: FONT_JP_B, bold: true } },
      { text: f.fail, options: { fontSize: 10, color: INK_MUTED, fontFace: FONT_JP } },
    ], {
      x: 3.3, y, w: 6.0, h: 0.46,
      lineSpacingMultiple: 1.2, valign: 'middle', margin: 0,
    });
  });
}

// ====================================================================
// Slide 10 — What operator does in advance vs owner
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'ROLES — 誰がいつやるか', 10);
  addFooter(s);

  s.addText('事前に代行する部分・オーナーに任せる部分', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const rows = [
    [
      { text: '工程', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '営業員（事前）', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '商談当日', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: 'オーナー（事後）', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: 'STEP 1  予約URL取得', options: { color: INK, fontFace: FONT_JP } },
      { text: '✓', options: { color: SUCCESS, bold: true, fontFace: FONT_JP_B, align: 'center' } },
      { text: '', options: { color: INK_MUTED, align: 'center' } },
      { text: '', options: { color: INK_MUTED, align: 'center' } },
    ],
    [
      { text: 'STEP 2  あいさつメッセージ', options: { color: INK, fontFace: FONT_JP } },
      { text: '✓', options: { color: SUCCESS, bold: true, fontFace: FONT_JP_B, align: 'center' } },
      { text: '', options: { align: 'center' } },
      { text: '必要に応じて文言微調整', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'STEP 3  リッチメニュー', options: { color: INK, fontFace: FONT_JP } },
      { text: '✓', options: { color: SUCCESS, bold: true, fontFace: FONT_JP_B, align: 'center' } },
      { text: '', options: { align: 'center' } },
      { text: '画像差替えで独自性', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'STEP 4  キーワード自動返信', options: { color: INK, fontFace: FONT_JP } },
      { text: '設定済(アプリ側)', options: { color: SUCCESS, fontFace: FONT_JP, align: 'center' } },
      { text: '', options: { align: 'center' } },
      { text: '', options: { align: 'center' } },
    ],
    [
      { text: 'STEP 5  QRコード配布', options: { color: INK, fontFace: FONT_JP } },
      { text: 'QR画像生成', options: { color: SUCCESS, fontFace: FONT_JP, align: 'center' } },
      { text: 'QR印刷物を渡す', options: { color: BRAND_DEEP, fontFace: FONT_JP_B } },
      { text: '店内掲示', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'STEP 6  E2Eテスト', options: { color: INK, fontFace: FONT_JP } },
      { text: '', options: { align: 'center' } },
      { text: '✓ 一緒にやる', options: { color: BRAND_DEEP, bold: true, fontFace: FONT_JP_B } },
      { text: '', options: { align: 'center' } },
    ],
  ];

  s.addTable(rows, {
    x: 0.6, y: 1.55, w: 8.8, colW: [2.4, 1.8, 2.2, 2.4],
    rowH: 0.5, fontSize: 10.5,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });

  s.addText('💡 STEP 1〜5 は全て商談前日までに営業員 PC で完了可能。当日はテスト通しだけ10分。', {
    x: 0.6, y: 5.0, w: 8.8, h: 0.3, fontSize: 11, italic: true,
    color: BRAND_DEEP, fontFace: FONT_JP, margin: 0,
  });
}

// ====================================================================
// Slide 11 — Closing
// ====================================================================
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
  s.addText('ワンタップで予約へ。', {
    x: 0.8, y: 1.65, w: 8.4, h: 1.0, fontSize: 46, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });

  const points = [
    { h: '3つの導線を全部セットする', d: 'あいさつ・リッチメニュー・自動返信で取り逃しゼロ' },
    { h: '事前に90%済ませる', d: 'STEP 1〜5 は営業員PCで完結。当日はE2Eテストのみ' },
    { h: 'QRコードを活用する', d: '店内に貼るだけで、来店客を 100% 友だち化できる' },
    { h: '契約後は画像差替えだけでOK', d: 'オーナーはリッチメニューの画像変更を覚えれば十分' },
  ];
  points.forEach((p, i) => {
    const y = 2.95 + i * 0.52;
    s.addText('—', {
      x: 0.8, y, w: 0.4, h: 0.3, fontSize: 14, bold: true,
      color: BRAND, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(p.h, {
      x: 1.2, y, w: 7.8, h: 0.3, fontSize: 14, bold: true,
      color: 'ebe1cf', fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(p.d, {
      x: 1.2, y: y + 0.28, w: 7.8, h: 0.25, fontSize: 10.5,
      color: 'a89988', fontFace: FONT_JP, margin: 0,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 5.1, w: 8.4, h: 0.015,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('HairSalonLink  ·  社内マニュアル  ·  v1.0', {
    x: 0.8, y: 5.2, w: 8.4, h: 0.25, fontSize: 10,
    color: 'a89988', fontFace: FONT_JP, italic: true, align: 'center', margin: 0,
  });
}

pres.writeFile({ fileName: 'HairSalonLink_LINE予約導線セットアップ手順書.pptx' })
  .then(() => { console.log('✅ LINE予約導線セットアップ手順書 完成'); })
  .catch((e) => { console.error(e); process.exit(1); });
