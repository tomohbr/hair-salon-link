// HairSalonLink HPB データ移行手順書.pptx
// 内容: ホットペッパービューティー (HPB) / サロンボード からの CSV 出力 →
//       HairSalonLink への取込 / 逆方向の出力、まで全体像を網羅。

const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'HairSalonLink HPBデータ移行手順書';
pres.author = 'HairSalonLink';

// Palette
const BG_DARK = '0c0a09';
const PAPER = 'faf7f2';
const PAPER_ALT = 'f1ece3';
const BORDER = 'd9d1bf';
const INK = '1c1917';
const INK_MUTED = '6b5f52';
const BRAND = 'c9a96e';
const BRAND_DEEP = '9c7a4a';
const ACCENT_RED = 'b85042';
const SUCCESS = '166534';

const FONT_JP_SERIF = 'Yu Mincho';
const FONT_JP = 'Yu Gothic';
const FONT_JP_B = 'Yu Gothic';

const TOTAL = 12;
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
  slide.addText('HairSalonLink — HPBデータ移行手順書', {
    x: 0.6, y: 5.42, w: 6, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, margin: 0,
  });
  slide.addText('v1.0', {
    x: 6.6, y: 5.42, w: 2.8, h: 0.2, fontSize: 9, color: INK_MUTED,
    fontFace: FONT_JP, align: 'right', margin: 0,
  });
}
function numBadge(slide, x, y, num, color = BRAND, size = 0.36) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size, fill: { color }, line: { color, width: 0 },
  });
  slide.addText(String(num), {
    x, y, w: size, h: size, fontSize: 13, bold: true,
    color: BG_DARK, align: 'center', valign: 'middle',
    fontFace: FONT_JP_B, margin: 0,
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
  s.addText('HAIR SALON LINK', {
    x: 1.0, y: 0.7, w: 6, h: 0.35, fontSize: 11, color: BRAND,
    charSpacing: 14, bold: true, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText('Data Migration Guide', {
    x: 1.0, y: 1.05, w: 6, h: 0.35, fontSize: 10, color: 'a89988',
    charSpacing: 6, fontFace: FONT_JP, italic: true, margin: 0,
  });
  s.addText('ホットペッパーから', {
    x: 0.8, y: 1.95, w: 8.4, h: 1.0, fontSize: 44, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });
  s.addText('データ移行マニュアル', {
    x: 0.8, y: 2.85, w: 8.4, h: 0.9, fontSize: 44, bold: true,
    color: BRAND, fontFace: FONT_JP_SERIF, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.95, w: 3.5, h: 0.015,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText([
    { text: 'HPB / サロンボードの顧客・メニュー・クーポンを', options: { breakLine: true, color: 'ebe1cf' } },
    { text: 'HairSalonLink に CSV で一括移行する全手順。', options: { color: 'a89988' } },
  ], {
    x: 0.8, y: 4.1, w: 8.4, h: 1.0, fontSize: 14,
    fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
  });
}

// ====================================================================
// Slide 2 — Big picture
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'OVERVIEW — 全体像', 2);
  addFooter(s);

  s.addText('データ移行のフロー', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 28, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const boxes = [
    { n: '1', label: 'HPB / サロンボード', desc: 'CSV を出力', color: BRAND_DEEP },
    { n: '2', label: 'CSV ファイル', desc: '端末に保存', color: INK_MUTED },
    { n: '3', label: 'HairSalonLink', desc: '取込ボタン', color: BRAND },
    { n: '4', label: '取込完了', desc: '自動マッピング', color: SUCCESS },
  ];
  const bw = 2.0, bh = 1.6;
  const startX = 0.7;
  const gap = (9.4 - bw * 4) / 3;
  boxes.forEach((b, i) => {
    const x = startX + i * (bw + gap);
    const y = 1.75;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: bw, h: bh,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: bw, h: 0.05,
      fill: { color: b.color }, line: { color: b.color, width: 0 },
    });
    s.addText(b.n, {
      x: x + 0.1, y: y + 0.15, w: 0.6, h: 0.4, fontSize: 18, bold: true,
      color: b.color, fontFace: FONT_JP_SERIF, margin: 0,
    });
    s.addText(b.label, {
      x: x + 0.15, y: y + 0.6, w: bw - 0.3, h: 0.4, fontSize: 13, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(b.desc, {
      x: x + 0.15, y: y + 1.0, w: bw - 0.3, h: 0.4, fontSize: 11,
      color: INK_MUTED, fontFace: FONT_JP, margin: 0,
    });
    if (i < boxes.length - 1) {
      s.addText('▶', {
        x: x + bw + 0.02, y: y + bh / 2 - 0.15, w: gap, h: 0.3, fontSize: 14,
        color: BRAND, align: 'center', valign: 'middle', margin: 0,
      });
    }
  });

  s.addText('所要時間：1店舗あたり 約 10 分（顧客 500名規模）', {
    x: 0.6, y: 3.7, w: 8.8, h: 0.3, fontSize: 12, italic: true,
    color: BRAND_DEEP, fontFace: FONT_JP, align: 'center', margin: 0,
  });

  // 対応データ
  s.addText('対応データ（3種類）', {
    x: 0.6, y: 4.15, w: 8.8, h: 0.3, fontSize: 12, bold: true,
    color: INK, fontFace: FONT_JP_B, align: 'center', margin: 0,
  });
  const entities = [
    { n: '顧客', d: '名前・電話・メール・来店履歴・累計金額 等' },
    { n: 'メニュー', d: 'カット・カラー・パーマ 等の料金＆所要時間' },
    { n: 'クーポン', d: '名称・割引・有効期限 等' },
  ];
  entities.forEach((e, i) => {
    const x = 0.7 + i * 2.9;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.55, w: 2.7, h: 0.7,
      fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
    });
    s.addText(e.n, {
      x: x + 0.15, y: 4.58, w: 1.0, h: 0.3, fontSize: 13, bold: true,
      color: BRAND_DEEP, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(e.d, {
      x: x + 0.15, y: 4.88, w: 2.5, h: 0.35, fontSize: 9.5,
      color: INK_MUTED, fontFace: FONT_JP, margin: 0,
    });
  });
}

// ====================================================================
// Slide 3 — HPB CSV export: Customers
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 1 — HPB から顧客CSVを出力', 3);
  addFooter(s);

  s.addText('顧客データを CSV で書き出す', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('サロンボード（HPB の管理画面）の顧客カルテ機能から CSV を出力します。', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  const steps = [
    { t: '1', d: 'サロンボードに PC でログイン  (salonboard.com)' },
    { t: '2', d: '左メニュー「顧客カルテ」→ 「顧客一覧」を開く' },
    { t: '3', d: '画面上部の「CSVダウンロード」または「エクスポート」ボタン' },
    { t: '4', d: '出力期間：「全期間」「現時点の全顧客」を選択' },
    { t: '5', d: '出力項目：基本情報 + 来店履歴 + 売上金額 にチェック' },
    { t: '6', d: '「ダウンロード」→ 端末に CSV ファイルを保存' },
    { t: '7', d: 'ファイル名の例: customer_list_20260421.csv' },
  ];
  steps.forEach((st, i) => {
    const y = 1.95 + i * 0.4;
    numBadge(s, 0.6, y + 0.02, st.t, BRAND, 0.3);
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.35, fontSize: 11.5,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.85, w: 8.8, h: 0.42,
    fill: { color: 'fef2f2' }, line: { color: ACCENT_RED, width: 0.3 },
  });
  s.addText('⚠ 文字コードは Shift-JIS で出力されますが、HairSalonLink が自動変換します。加工不要。', {
    x: 0.75, y: 4.87, w: 8.6, h: 0.38, fontSize: 10,
    color: ACCENT_RED, fontFace: FONT_JP, valign: 'middle', margin: 0,
  });
}

// ====================================================================
// Slide 4 — HPB CSV export: Menus & Coupons
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 2 — メニュー・クーポンCSVを出力', 4);
  addFooter(s);

  s.addText('メニュー / クーポンも同じ要領で', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // 2 カラム
  const cards = [
    {
      title: 'メニュー CSV',
      path: 'サロンボード → 「HPB掲載管理」→ 「メニュー設定」',
      steps: [
        '「メニュー設定」画面で一覧を表示',
        '画面上部の「CSV 出力」ボタン',
        '出力項目：メニュー名 / カテゴリ / 料金 / 所要時間',
        '端末に保存',
      ],
      color: BRAND,
    },
    {
      title: 'クーポン CSV',
      path: 'サロンボード → 「HPB掲載管理」→ 「クーポン設定」',
      steps: [
        '「クーポン一覧」画面を表示',
        '画面上部の「CSV 出力」ボタン',
        '出力項目：クーポン名 / 割引額 / 有効期限',
        '端末に保存',
      ],
      color: BRAND_DEEP,
    },
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 4.55;
    const y = 1.6;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.25, h: 3.5,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.25, h: 0.08,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
    });
    s.addText(c.title, {
      x: x + 0.2, y: y + 0.2, w: 3.85, h: 0.4, fontSize: 16, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(c.path, {
      x: x + 0.2, y: y + 0.65, w: 3.85, h: 0.35, fontSize: 10,
      color: BRAND_DEEP, fontFace: FONT_JP_B, italic: true, margin: 0,
    });
    c.steps.forEach((st, idx) => {
      const yy = y + 1.15 + idx * 0.45;
      s.addText(`${idx + 1}. `, {
        x: x + 0.2, y: yy, w: 0.25, h: 0.3, fontSize: 11, bold: true,
        color: c.color, fontFace: FONT_JP_B, margin: 0,
      });
      s.addText(st, {
        x: x + 0.45, y: yy, w: 3.6, h: 0.4, fontSize: 10.5,
        color: INK, fontFace: FONT_JP, margin: 0,
      });
    });
  });

  s.addText('💡 HPB のメニュー / クーポンは「HPB掲載管理」配下にあります。見当たらない時は検索バーで「CSV」と検索', {
    x: 0.6, y: 5.0, w: 8.8, h: 0.3, fontSize: 10, italic: true,
    color: BRAND_DEEP, fontFace: FONT_JP, margin: 0,
  });
}

// ====================================================================
// Slide 5 — Import into HairSalonLink (customers)
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'STEP 3 — HairSalonLink に取込', 5);
  addFooter(s);

  s.addText('CSV を HairSalonLink に取込む', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  // テーブル：どのCSV → どのページ
  const rows = [
    [
      { text: 'CSV の種類', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: 'HairSalonLink の取込先', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '下部タブ', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: '顧客 CSV', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '顧客管理ページの右上「CSV取込」', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '「顧客」', options: { color: BRAND_DEEP, fontFace: FONT_JP_B, align: 'center' } },
    ],
    [
      { text: 'メニュー CSV', options: { color: INK, fontFace: FONT_JP_B } },
      { text: 'メニュー管理ページの右上「CSV取込」', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '「メニュー」', options: { color: BRAND_DEEP, fontFace: FONT_JP_B, align: 'center' } },
    ],
    [
      { text: 'クーポン CSV', options: { color: INK, fontFace: FONT_JP_B } },
      { text: 'クーポン管理ページの右上「CSV取込」', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '「もっと」→「クーポン」', options: { color: BRAND_DEEP, fontFace: FONT_JP_B, align: 'center' } },
    ],
  ];
  s.addTable(rows, {
    x: 0.6, y: 1.6, w: 8.8, colW: [2.2, 4.2, 2.4],
    rowH: 0.5, fontSize: 11,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });

  // 取込手順
  s.addText('取込の実際の流れ', {
    x: 0.6, y: 3.9, w: 8.8, h: 0.3, fontSize: 13, bold: true,
    color: BRAND_DEEP, fontFace: FONT_JP_B, margin: 0,
  });
  const tsteps = [
    { t: '1', d: '該当ページ（例：顧客管理）を開く' },
    { t: '2', d: '右上「CSV取込」→ ファイル選択 → HPB の CSV を選ぶ' },
    { t: '3', d: 'プレビュー確認 →「取込を実行」→ 完了レポート' },
  ];
  tsteps.forEach((st, i) => {
    const y = 4.25 + i * 0.32;
    numBadge(s, 0.6, y + 0.02, st.t, BRAND, 0.28);
    s.addText(st.d, {
      x: 0.95, y, w: 8.4, h: 0.3, fontSize: 11,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });
}

// ====================================================================
// Slide 6 — Auto-mapping 説明
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'FEATURE — 自動マッピング', 6);
  addFooter(s);

  s.addText('列名が違っても自動で認識', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('HPB ・ サロンボード・Excel 手作成、どれでも OK。列の順番・追加列があっても問題ありません。', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  // マッピング例テーブル
  const rows = [
    [
      { text: 'HairSalonLink', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '受け付ける列名（いずれかでOK）', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: '顧客名', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '顧客名 / お客様名 / 氏名 / 名前 / お名前 / name', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: '電話番号', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '電話番号 / 電話 / TEL / 携帯番号 / モバイル', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: '来店回数', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '来店回数 / 累計来店数 / 来店数 / visit_count', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: '累計金額', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '累計金額 / 累計売上 / 総額 / 合計金額', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'メニュー料金', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '料金 / 金額 / 価格 / 税込金額 / price', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
    [
      { text: 'クーポン割引', options: { color: INK, fontFace: FONT_JP_B } },
      { text: '割引額 / 値引額 / 金額 / discount  ※「%」付きなら割合として解釈', options: { color: INK_MUTED, fontFace: FONT_JP } },
    ],
  ];
  s.addTable(rows, {
    x: 0.6, y: 2.0, w: 8.8, colW: [2.4, 6.4],
    rowH: 0.38, fontSize: 10.5,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });
}

// ====================================================================
// Slide 7 — Dedup behavior
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'FEATURE — 重複処理の仕組み', 7);
  addFooter(s);

  s.addText('「新規 or 更新」を自動判定', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('何度取り込んでも重複は作られません。既存データは上書き更新されます。', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  const cards = [
    {
      title: '顧客',
      rule: '電話番号で判定',
      sub: '電話番号 → メール の順で一致検索。両方なければ新規作成。',
      color: BRAND,
    },
    {
      title: 'メニュー',
      rule: '名前で判定',
      sub: 'メニュー名（大文字小文字・空白を無視）で判定。',
      color: BRAND_DEEP,
    },
    {
      title: 'クーポン',
      rule: 'タイトルで判定',
      sub: 'クーポン名で一致検索。同名は上書き、違えば新規作成。',
      color: SUCCESS,
    },
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 2.95;
    const y = 2.0;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.8, h: 2.4,
      fill: { color: 'ffffff' }, line: { color: BORDER, width: 0.5 },
      shadow: makeShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.8, h: 0.08,
      fill: { color: c.color }, line: { color: c.color, width: 0 },
    });
    s.addText(c.title, {
      x: x + 0.2, y: y + 0.25, w: 2.4, h: 0.4, fontSize: 16, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(c.rule, {
      x: x + 0.2, y: y + 0.75, w: 2.4, h: 0.3, fontSize: 12, bold: true,
      color: c.color, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(c.sub, {
      x: x + 0.2, y: y + 1.15, w: 2.4, h: 1.15, fontSize: 10.5,
      color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
    });
  });

  s.addText('取込レポート：新規 / 更新 / スキップ の件数を毎回表示します。', {
    x: 0.6, y: 4.7, w: 8.8, h: 0.3, fontSize: 10.5, italic: true,
    color: BRAND_DEEP, fontFace: FONT_JP, align: 'center', margin: 0,
  });
}

// ====================================================================
// Slide 8 — Template CSV
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'TEMPLATE — テンプレート CSV', 8);
  addFooter(s);

  s.addText('HPB を使っていない店舗向け', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('HPB 契約がない、紙台帳で管理している店舗でも OK。HairSalonLink 内で空のテンプレ CSV をダウンロードして、Excel で埋めて取込むだけ。', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.6, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.4, margin: 0,
  });

  const steps = [
    { t: '1', d: '顧客管理・メニュー管理・クーポン管理のいずれかを開く' },
    { t: '2', d: '右上「CSV取込」→ モーダル内「テンプレート CSV をダウンロード」' },
    { t: '3', d: 'Excel / Googleスプレッドシート で開き、項目を入力' },
    { t: '4', d: 'CSV（UTF-8 推奨）で保存 → 同じ「CSV取込」ボタンからアップロード' },
  ];
  steps.forEach((st, i) => {
    const y = 2.3 + i * 0.45;
    numBadge(s, 0.6, y + 0.04, st.t, BRAND, 0.32);
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.4, fontSize: 12,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // ヘッダー例
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.3, w: 8.8, h: 0.85,
    fill: { color: BG_DARK }, line: { color: BRAND, width: 0.5 },
  });
  s.addText('顧客テンプレの1行目（列名）', {
    x: 0.85, y: 4.38, w: 8.3, h: 0.3, fontSize: 10, bold: true,
    color: BRAND, fontFace: FONT_JP_B, charSpacing: 2, margin: 0,
  });
  s.addText('顧客名,フリガナ,電話番号,メール,誕生日,性別,初回来店日,最終来店日,来店回数,累計金額,メモ', {
    x: 0.85, y: 4.7, w: 8.3, h: 0.4, fontSize: 11,
    color: 'ebe1cf', fontFace: 'Consolas', margin: 0,
  });
}

// ====================================================================
// Slide 9 — CSV Export from HairSalonLink
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'EXPORT — 逆方向の CSV 出力', 9);
  addFooter(s);

  s.addText('HairSalonLink からも CSV 出力可能', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addText('税務処理、外部ツール連携、バックアップ用途など、いつでも CSV 出力できます。', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.35, fontSize: 11, italic: true,
    color: INK_MUTED, fontFace: FONT_JP, margin: 0,
  });

  const steps = [
    { t: '1', d: '顧客管理・メニュー管理・クーポン管理のいずれかを開く' },
    { t: '2', d: '右上「CSV出力」をタップ' },
    { t: '3', d: '端末に CSV ファイルがダウンロードされる（BOM付UTF-8、Excel 互換）' },
    { t: '4', d: 'ファイル名の例: customers_{slug}_2026-04-21.csv' },
  ];
  steps.forEach((st, i) => {
    const y = 2.0 + i * 0.45;
    numBadge(s, 0.6, y + 0.04, st.t, BRAND, 0.32);
    s.addText(st.d, {
      x: 1.0, y, w: 8.4, h: 0.4, fontSize: 12,
      color: INK, fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  // 出力フィールド表
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.0, w: 8.8, h: 1.15,
    fill: { color: PAPER_ALT }, line: { color: BRAND, width: 0.3 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.0, w: 0.08, h: 1.15,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });
  s.addText('出力される項目（顧客の場合）', {
    x: 0.9, y: 4.08, w: 8.4, h: 0.3, fontSize: 12, bold: true,
    color: INK, fontFace: FONT_JP_B, margin: 0,
  });
  s.addText(
    '顧客名, フリガナ, 電話番号, メール, 誕生日, 性別, 流入元, 初回来店日,\n' +
    '最終来店日, 来店回数, 累計金額, LINE連携, タグ, メモ, 登録日',
    {
      x: 0.9, y: 4.4, w: 8.4, h: 0.7, fontSize: 10,
      color: INK_MUTED, fontFace: FONT_JP, lineSpacingMultiple: 1.35, margin: 0,
    }
  );
}

// ====================================================================
// Slide 10 — Troubleshooting
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'TROUBLESHOOT — 困った時', 10);
  addFooter(s);

  s.addText('取込でエラーが出た時の即解決表', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const rows = [
    [
      { text: '症状', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '原因', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
      { text: '解決策', options: { bold: true, color: INK, fontFace: FONT_JP_B, fill: { color: PAPER_ALT } } },
    ],
    [
      { text: '日本語が文字化け', options: { color: INK, fontFace: FONT_JP } },
      { text: 'Shift-JIS 判定失敗', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'Excel で開き、UTF-8 (BOM付き) で保存し直して再取込', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: 'すべてスキップされる', options: { color: INK, fontFace: FONT_JP } },
      { text: '顧客名 / メニュー名 列が認識できていない', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '1行目のヘッダーに「顧客名」「メニュー名」等の日本語列名を追加', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: '二重登録された', options: { color: INK, fontFace: FONT_JP } },
      { text: '電話番号の表記ゆれ（ハイフン有無）', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: 'Excel で電話番号列を統一（ハイフン削除）→ 再取込で統合', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: 'クーポンの割引が 0 円', options: { color: INK, fontFace: FONT_JP } },
      { text: '「割引額」列に「500円」「20%」など単位混在', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '「%」は自動で割合判定、それ以外は数字のみ残して取込', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
    [
      { text: 'メニューの所要時間が 0', options: { color: INK, fontFace: FONT_JP } },
      { text: '「所要時間」列に「60分」など単位付き', options: { color: INK_MUTED, fontFace: FONT_JP } },
      { text: '自動で数字のみ抽出。空なら 60 分デフォルト', options: { color: SUCCESS, fontFace: FONT_JP } },
    ],
  ];
  s.addTable(rows, {
    x: 0.6, y: 1.5, w: 8.8, colW: [2.2, 2.6, 4.0],
    rowH: 0.55, fontSize: 10.5,
    border: { pt: 0.4, color: BORDER },
    fill: { color: 'ffffff' },
  });
}

// ====================================================================
// Slide 11 — Best practices
// ====================================================================
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  addHeader(s, 'BEST PRACTICE — 成功するコツ', 11);
  addFooter(s);

  s.addText('スムーズに移行するための 5 原則', {
    x: 0.6, y: 0.9, w: 8.8, h: 0.6, fontSize: 24, bold: true,
    color: INK, fontFace: FONT_JP_SERIF, margin: 0,
  });

  const tips = [
    {
      n: '01',
      h: '顧客から先に取込む',
      d: 'メニュー・クーポンより先に顧客 CSV を取込む。以降の売上紐付けがスムーズに。',
    },
    {
      n: '02',
      h: '電話番号を統一する',
      d: 'HPB の CSV は表記揺れあり。Excel で「ハイフン削除」「先頭0 保持」を揃える。',
    },
    {
      n: '03',
      h: 'サンプル 10件でテスト',
      d: 'いきなり全件ではなく、サンプル抽出で一度取込 → 結果を確認してから全件移行。',
    },
    {
      n: '04',
      h: 'バックアップを取る',
      d: '取込前に HairSalonLink 側の「CSV出力」でバックアップ。戻したくなった時のお守り。',
    },
    {
      n: '05',
      h: '営業員が事前に代行',
      d: '商談前日までに代行取込 → 当日オーナーは「結果確認」するだけ。オーナー負担ゼロ。',
    },
  ];
  tips.forEach((t, i) => {
    const y = 1.6 + i * 0.68;
    s.addText(t.n, {
      x: 0.6, y, w: 0.7, h: 0.5, fontSize: 20, bold: true,
      color: BRAND, fontFace: FONT_JP_SERIF, charSpacing: 2, margin: 0,
    });
    s.addText(t.h, {
      x: 1.3, y, w: 8.1, h: 0.3, fontSize: 14, bold: true,
      color: INK, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(t.d, {
      x: 1.3, y: y + 0.3, w: 8.1, h: 0.3, fontSize: 10.5,
      color: INK_MUTED, fontFace: FONT_JP, margin: 0,
    });
  });
}

// ====================================================================
// Slide 12 — Closing
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
  s.addText('過去のデータを、', {
    x: 0.8, y: 1.65, w: 8.4, h: 0.9, fontSize: 40, bold: true,
    color: 'ebe1cf', fontFace: FONT_JP_SERIF, margin: 0,
  });
  s.addText('1 行も失わず移行する。', {
    x: 0.8, y: 2.55, w: 8.4, h: 0.9, fontSize: 40, bold: true,
    color: BRAND, fontFace: FONT_JP_SERIF, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.7, w: 3.5, h: 0.015,
    fill: { color: BRAND }, line: { color: BRAND, width: 0 },
  });

  const key = [
    'HPB の CSV はそのまま使える（自動マッピング）',
    '重複は電話 / 名前 / タイトルで自動判定',
    'テンプレートからの手入力にも対応',
    'いつでも CSV 出力できる（バックアップ可）',
  ];
  key.forEach((k, i) => {
    const y = 3.9 + i * 0.35;
    s.addText('—', {
      x: 0.8, y, w: 0.3, h: 0.3, fontSize: 14, bold: true,
      color: BRAND, fontFace: FONT_JP_B, margin: 0,
    });
    s.addText(k, {
      x: 1.1, y, w: 8.1, h: 0.3, fontSize: 12,
      color: 'ebe1cf', fontFace: FONT_JP, valign: 'middle', margin: 0,
    });
  });

  s.addText('HairSalonLink  ·  Data Migration Guide v1.0', {
    x: 0.8, y: 5.35, w: 8.4, h: 0.25, fontSize: 10,
    color: 'a89988', fontFace: FONT_JP, italic: true, align: 'center', margin: 0,
  });
}

pres.writeFile({ fileName: 'HairSalonLink_HPBデータ移行手順書.pptx' })
  .then(() => { console.log('✅ HPBデータ移行手順書 完成'); })
  .catch((e) => { console.error(e); process.exit(1); });
