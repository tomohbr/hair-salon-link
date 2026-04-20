// 顧客向け導入手順書 (A4横、印刷想定)
// HairSalonLink_導入手順書.pptx

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaUserPlus, FaStore, FaListUl, FaUsers, FaLine, FaCalendarCheck,
  FaCheck, FaArrowRight, FaInfoCircle, FaExclamationTriangle,
} = require("react-icons/fa");

// Palette (matching pamphlet)
const C = {
  white: "FFFFFF", bg: "F5F3EF", card: "FFFFFF",
  bdr: "D9D3CA", ink: "1A1A1A", body: "3D3D3D", muted: "6E6E6E", light: "A5A5A5",
  blue: "1F5F80", blueL: "E5EDF2", blueD: "164660",
  navy: "163249", navyL: "263C54", navyT: "8FA3BA", navyT2: "C4CFDE",
  warm: "B8924F", warmL: "F5EBD5",
  green: "1A7A5C", greenL: "E6F4EE",
  red: "A53838", redL: "F8E8E8",
};
const FH = "Georgia", FB = "Calibri";

const SLIDE_W = 11.69, SLIDE_H = 8.27, MARGIN = 0.55;
const CONTENT_W = SLIDE_W - MARGIN * 2;
const APP_URL = "https://hair-salon-link-production.up.railway.app";

function svg(Ic, color, sz = 256) {
  const s = ReactDOMServer.renderToStaticMarkup(React.createElement(Ic, { color, size: String(sz) }));
  return sharp(Buffer.from(s)).png().toBuffer().then(b => "image/png;base64," + b.toString("base64"));
}

function eyebrow(s, text, y = 0.7) {
  s.addText(text, {
    x: MARGIN, y, w: CONTENT_W, h: 0.35,
    fontSize: 11, fontFace: FB, color: C.blue, charSpacing: 6, bold: true, margin: 0,
  });
}
function heading(s, text, y = 1.1, size = 30) {
  const lines = text.split("\n").length;
  s.addText(text, {
    x: MARGIN, y, w: CONTENT_W, h: 0.65 + lines * 0.55,
    fontSize: size, fontFace: FH, color: C.ink, lineSpacingMultiple: 1.2, margin: 0,
  });
}
function chrome(s, p, n, total) {
  s.addShape(p.shapes.LINE, { x: MARGIN, y: SLIDE_H - 0.65, w: CONTENT_W, h: 0, line: { color: C.bdr, width: 0.5 } });
  s.addText("HairSalonLink — 導入手順書", {
    x: MARGIN, y: SLIDE_H - 0.5, w: 5, h: 0.3,
    fontSize: 10, fontFace: FH, color: C.blue, bold: true, margin: 0,
  });
  s.addText("お問い合わせ: shibahara.724@gmail.com", {
    x: SLIDE_W / 2 - 2.5, y: SLIDE_H - 0.5, w: 5, h: 0.3,
    fontSize: 9, fontFace: FB, color: C.muted, align: "center", margin: 0,
  });
  s.addText(`Step ${n} / ${total}`, {
    x: SLIDE_W - MARGIN - 1.2, y: SLIDE_H - 0.5, w: 1.2, h: 0.3,
    fontSize: 9, fontFace: FB, color: C.light, align: "right", margin: 0,
  });
}

// 番号付きステップカード
function step(s, n, title, body, x, y, w, h) {
  s.addShape(s.__p.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.card }, line: { color: C.bdr, width: 0.5 } });
  s.addShape(s.__p.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, fill: { color: C.blue } });
  s.addText(String(n), { x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, fontSize: 16, fontFace: FH, color: C.white, align: "center", bold: true, valign: "middle", margin: 0 });
  s.addText(title, { x: x + 1.0, y: y + 0.32, w: w - 1.2, h: 0.4, fontSize: 14, fontFace: FH, color: C.ink, bold: true, margin: 0 });
  s.addText(body, { x: x + 0.25, y: y + 1.0, w: w - 0.5, h: h - 1.2, fontSize: 11, fontFace: FB, color: C.body, lineSpacingMultiple: 1.6, margin: 0 });
}

// 注意ボックス
function note(s, p, type, text, x, y, w) {
  const palettes = {
    info:  { bg: C.blueL, border: C.blue,  ink: C.blueD,  emoji: "ℹ" },
    warn:  { bg: "FFF3D9", border: C.warm, ink: "8A6D3B", emoji: "⚠" },
    ok:    { bg: C.greenL, border: C.green, ink: "0F5C44", emoji: "✓" },
  };
  const pl = palettes[type] || palettes.info;
  s.addShape(p.shapes.RECTANGLE, { x, y, w, h: 0.7, fill: { color: pl.bg } });
  s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.08, h: 0.7, fill: { color: pl.border } });
  s.addText(`${pl.emoji}  ${text}`, {
    x: x + 0.25, y, w: w - 0.4, h: 0.7,
    fontSize: 11, fontFace: FB, color: pl.ink, valign: "middle", margin: 0, lineSpacingMultiple: 1.5,
  });
}

async function main() {
  const p = new pptxgen();
  p.defineLayout({ name: "A4_LAND", width: SLIDE_W, height: SLIDE_H });
  p.layout = "A4_LAND";
  p.author = "HairSalonLink";
  p.title = "HairSalonLink 導入手順書";
  p.company = "HairSalonLink";

  const TOTAL = 10;

  const ic = {
    user:  await svg(FaUserPlus, `#${C.blue}`),
    store: await svg(FaStore, `#${C.blue}`),
    list:  await svg(FaListUl, `#${C.blue}`),
    users: await svg(FaUsers, `#${C.blue}`),
    line:  await svg(FaLine, `#06C755`),
    cal:   await svg(FaCalendarCheck, `#${C.blue}`),
    arrow: await svg(FaArrowRight, `#${C.blue}`),
    check: await svg(FaCheck, `#${C.green}`),
  };

  // ════════ 01 — Cover ════════
  {
    const s = p.addSlide();
    s.background = { color: C.navy };
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: SLIDE_H - 0.08, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });

    s.addText("ONBOARDING GUIDE  /  2026", {
      x: MARGIN, y: 1.5, w: CONTENT_W, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.navyT, charSpacing: 6, align: "center", bold: true, margin: 0,
    });
    s.addText("HairSalonLink", {
      x: MARGIN, y: 2.2, w: CONTENT_W, h: 1.2,
      fontSize: 60, fontFace: FH, color: C.white, align: "center",
    });
    s.addText("導入手順書 — 当日30分で運用開始まで。", {
      x: MARGIN, y: 3.7, w: CONTENT_W, h: 0.6,
      fontSize: 22, fontFace: FB, color: C.navyT2, align: "center",
    });
    s.addText("本資料は、店舗オーナーさまと営業担当が一緒に進める、当日のセットアップ手順を示します。", {
      x: MARGIN, y: 4.4, w: CONTENT_W, h: 0.5,
      fontSize: 13, fontFace: FB, color: C.navyT, align: "center",
    });

    // 進行イメージ
    const flow = ["登録", "店舗情報", "メニュー", "スタッフ", "LINE接続", "テスト予約", "運用開始"];
    const fw = 1.4, fg = 0.1;
    const tw = fw * flow.length + fg * (flow.length - 1);
    const sx = (SLIDE_W - tw) / 2;
    flow.forEach((t, i) => {
      const x = sx + i * (fw + fg);
      s.addShape(p.shapes.RECTANGLE, { x, y: 5.6, w: fw, h: 0.55, fill: { color: C.navyL } });
      s.addText(t, {
        x, y: 5.6, w: fw, h: 0.55,
        fontSize: 12, fontFace: FB, color: C.white, align: "center", valign: "middle", bold: true, margin: 0,
      });
    });
    s.addText("所要時間: 約 30〜45分 (LINE公式アカウント未作成の場合は +20分)", {
      x: MARGIN, y: 6.5, w: CONTENT_W, h: 0.4,
      fontSize: 12, fontFace: FB, color: C.navyT2, align: "center", italic: false,
    });
  }

  // ════════ 02 — 必要なもの ════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "STEP 0  PREREQUISITES");
    heading(s, "始める前に、以下をご用意ください。", 1.1);

    const items = [
      { label: "メールアドレス",        body: "ログインIDになります。普段使っているもので結構です。" },
      { label: "クレジットカード (任意)", body: "Free/Standard/Pro どのプランにするかで判断。Freeは不要です。" },
      { label: "LINE 公式アカウント",     body: "未作成の場合は、Step 5 で一緒に作成します。" },
      { label: "店舗の基本情報",         body: "店舗名・住所・電話番号・営業時間。" },
      { label: "メニュー一覧",           body: "メニュー名・料金・所要時間が分かるメモかリスト。" },
      { label: "スタッフ情報 (任意)",     body: "名前・役職 (ディレクター/スタイリスト等)・指名料。" },
    ];
    items.forEach((it, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = MARGIN + col * (CONTENT_W / 2 + 0.2);
      const y = 2.3 + row * 1.4;
      const w = (CONTENT_W - 0.4) / 2;
      s.addShape(p.shapes.RECTANGLE, { x, y, w, h: 1.2, fill: { color: C.card }, line: { color: C.bdr, width: 0.5 } });
      s.addShape(p.shapes.RECTANGLE, { x, y, w: 0.08, h: 1.2, fill: { color: C.blue } });
      s.addText(it.label, { x: x + 0.25, y: y + 0.15, w: w - 0.4, h: 0.4, fontSize: 13, fontFace: FH, color: C.ink, bold: true, margin: 0 });
      s.addText(it.body, { x: x + 0.25, y: y + 0.55, w: w - 0.4, h: 0.6, fontSize: 11, fontFace: FB, color: C.body, lineSpacingMultiple: 1.55, margin: 0 });
    });

    note(s, p, "info", "HPB の既存顧客データがある場合は、CSV をダウンロードしておくと Step 3 で取り込めます。", MARGIN, 6.8, CONTENT_W);

    chrome(s, p, 2, TOTAL);
  }

  // ════════ 03 — Step 1: アカウント登録 ════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "STEP 1");
    heading(s, "アカウントを登録する。", 1.1);

    s.addText(
      "ブラウザから登録ページにアクセスし、メールアドレスとパスワードを設定します。" +
      "プランは「Free」から始めて、必要に応じて Standard / Pro にアップグレードできます。",
      { x: MARGIN, y: 2.3, w: CONTENT_W, h: 0.9, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    // URL Box
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: 3.5, w: CONTENT_W, h: 0.7, fill: { color: C.blueL } });
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: 3.5, w: 0.1, h: 0.7, fill: { color: C.blue } });
    s.addText("登録URL", { x: MARGIN + 0.3, y: 3.55, w: 1.5, h: 0.3, fontSize: 10, fontFace: FB, color: C.muted, charSpacing: 2, bold: true, margin: 0 });
    s.addText(`${APP_URL}/register`, { x: MARGIN + 0.3, y: 3.85, w: CONTENT_W - 0.5, h: 0.3, fontSize: 14, fontFace: FB, color: C.blueD, bold: true, margin: 0 });

    // Sub-steps
    const sub = [
      { n: "①", t: "「Free」プランを選択", d: "クレジットカード登録なしで開始できます。" },
      { n: "②", t: "店舗名・お名前・メール・パスワードを入力", d: "パスワードは8文字以上を推奨。" },
      { n: "③", t: "「無料で始める」ボタンをクリック", d: "登録完了後、自動でダッシュボードに遷移します。" },
    ];
    sub.forEach((it, i) => {
      const y = 4.5 + i * 0.75;
      s.addText(it.n, { x: MARGIN + 0.1, y, w: 0.4, h: 0.4, fontSize: 16, fontFace: FH, color: C.blue, bold: true, margin: 0 });
      s.addText(it.t, { x: MARGIN + 0.6, y, w: 5.0, h: 0.4, fontSize: 12.5, fontFace: FH, color: C.ink, bold: true, margin: 0 });
      s.addText(it.d, { x: MARGIN + 5.7, y: y + 0.05, w: 5.4, h: 0.5, fontSize: 11, fontFace: FB, color: C.body, margin: 0 });
    });

    note(s, p, "ok", "登録 → ダッシュボード表示までは、約 2分です。", MARGIN, 6.95, CONTENT_W);

    chrome(s, p, 3, TOTAL);
  }

  // ════════ 04 — Step 2: 店舗情報 ════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "STEP 2");
    heading(s, "店舗情報を登録する。", 1.1);

    s.addText(
      "ダッシュボード左メニューの「設定」を開き、店舗情報フォームに入力します。" +
      "ここで設定する内容は、お客様向けの予約ページにも表示されます。",
      { x: MARGIN, y: 2.3, w: CONTENT_W, h: 0.9, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    // Path
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: 3.4, w: CONTENT_W, h: 0.55, fill: { color: C.warmL } });
    s.addText("メニューの場所:  サイドバー →  設定  →  店舗情報", {
      x: MARGIN + 0.25, y: 3.4, w: CONTENT_W - 0.5, h: 0.55,
      fontSize: 12, fontFace: FB, color: "8A6D3B", valign: "middle", bold: true, margin: 0,
    });

    // Fields to fill
    const fields = [
      { l: "店舗名 *",    e: "Hair Salon NORTH TOKYO" },
      { l: "住所",        e: "東京都渋谷区神宮前1-2-3 アートビル2F" },
      { l: "電話番号",    e: "03-1234-5678" },
      { l: "店舗説明",    e: "神宮前のプライベート美容室。指名制中心。" },
    ];
    fields.forEach((f, i) => {
      const y = 4.3 + i * 0.55;
      s.addShape(s.__p?.shapes ? p.shapes.RECTANGLE : p.shapes.RECTANGLE, {
        x: MARGIN, y, w: CONTENT_W, h: 0.45, fill: { color: C.card }, line: { color: C.bdr, width: 0.4 },
      });
      s.addText(f.l, { x: MARGIN + 0.2, y, w: 2.3, h: 0.45, fontSize: 11, fontFace: FB, color: C.muted, valign: "middle", bold: true, margin: 0 });
      s.addText(`例: ${f.e}`, { x: MARGIN + 2.6, y, w: CONTENT_W - 2.8, h: 0.45, fontSize: 11, fontFace: FB, color: C.ink, valign: "middle", margin: 0 });
    });

    note(s, p, "info", "営業時間と定休日の設定は、初期値「平日10-19時 / 日曜定休」で運用しながら追って調整できます。", MARGIN, 6.95, CONTENT_W);

    chrome(s, p, 4, TOTAL);
  }

  // ════════ 05 — Step 3: メニュー登録 ════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "STEP 3");
    heading(s, "メニューを登録する。", 1.1);

    s.addText(
      "サイドバーの「メニュー」を開き、提供メニューを追加します。" +
      "メニュー名・料金・所要時間が必須項目です。",
      { x: MARGIN, y: 2.3, w: CONTENT_W, h: 0.9, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    // Sample table
    const headers = ["メニュー名", "カテゴリ", "料金", "所要時間"];
    const rows = [
      ["カット",         "cut",       "¥4,400",   "45分"],
      ["カット + カラー", "color",     "¥13,200",  "120分"],
      ["パーマ",         "perm",      "¥11,000",  "120分"],
      ["縮毛矯正",       "straight",  "¥22,000",  "180分"],
      ["トリートメント",  "treatment", "¥3,300",   "30分"],
    ];
    const ty = 3.4;
    const colW = [3.8, 2.2, 2.2, 2.4];

    let cx = MARGIN;
    headers.forEach((h, i) => {
      s.addShape(p.shapes.RECTANGLE, { x: cx, y: ty, w: colW[i], h: 0.55, fill: { color: C.blue } });
      s.addText(h, { x: cx + 0.15, y: ty, w: colW[i] - 0.3, h: 0.55, fontSize: 12, fontFace: FB, color: C.white, bold: true, valign: "middle", margin: 0 });
      cx += colW[i];
    });
    rows.forEach((r, ri) => {
      const ry = ty + 0.55 + ri * 0.5;
      let rx = MARGIN;
      r.forEach((cell, ci) => {
        s.addShape(p.shapes.RECTANGLE, { x: rx, y: ry, w: colW[ci], h: 0.5, fill: { color: ri % 2 === 0 ? C.bg : C.card }, line: { color: C.bdr, width: 0.3 } });
        s.addText(cell, { x: rx + 0.18, y: ry, w: colW[ci] - 0.36, h: 0.5, fontSize: 11.5, fontFace: FB, color: C.body, valign: "middle", margin: 0 });
        rx += colW[ci];
      });
    });

    note(s, p, "info", "HPB の CSV データがある場合は、「予約」画面の「HPB予約をインポート」から顧客と予約をまとめて取り込めます。", MARGIN, 6.95, CONTENT_W);

    chrome(s, p, 5, TOTAL);
  }

  // ════════ 06 — Step 4: スタッフ登録 ════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "STEP 4");
    heading(s, "スタッフを登録する。", 1.1);

    s.addText(
      "「設定」→「スタッフ」 (または「予約」→「スタッフ管理」) からスタッフ情報を追加します。" +
      "5階層 (Director / Top / Stylist / Junior / Assistant) と指名料を設定できます。",
      { x: MARGIN, y: 2.3, w: CONTENT_W, h: 1.0, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    const ranks = [
      { rank: "Director",  fee: "¥2,000", desc: "店長クラス、最上位指名" },
      { rank: "Top",       fee: "¥1,500", desc: "トップスタイリスト" },
      { rank: "Stylist",   fee: "¥1,000", desc: "通常スタイリスト" },
      { rank: "Junior",    fee: "¥500",   desc: "ジュニアスタイリスト" },
      { rank: "Assistant", fee: "—",      desc: "アシスタント (指名対象外)" },
    ];

    const ty = 3.6;
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: ty, w: CONTENT_W, h: 0.5, fill: { color: C.blue } });
    s.addText("階層", { x: MARGIN + 0.2, y: ty, w: 2.5, h: 0.5, fontSize: 12, fontFace: FB, color: C.white, bold: true, valign: "middle", margin: 0 });
    s.addText("指名料 (例)", { x: MARGIN + 2.7, y: ty, w: 2.5, h: 0.5, fontSize: 12, fontFace: FB, color: C.white, bold: true, valign: "middle", margin: 0 });
    s.addText("対象", { x: MARGIN + 5.2, y: ty, w: CONTENT_W - 5.4, h: 0.5, fontSize: 12, fontFace: FB, color: C.white, bold: true, valign: "middle", margin: 0 });

    ranks.forEach((r, i) => {
      const y = ty + 0.5 + i * 0.45;
      s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y, w: CONTENT_W, h: 0.45, fill: { color: i % 2 === 0 ? C.bg : C.card }, line: { color: C.bdr, width: 0.3 } });
      s.addText(r.rank, { x: MARGIN + 0.2, y, w: 2.5, h: 0.45, fontSize: 11.5, fontFace: FH, color: C.ink, bold: true, valign: "middle", margin: 0 });
      s.addText(r.fee, { x: MARGIN + 2.7, y, w: 2.5, h: 0.45, fontSize: 11.5, fontFace: FB, color: C.body, valign: "middle", margin: 0 });
      s.addText(r.desc, { x: MARGIN + 5.2, y, w: CONTENT_W - 5.4, h: 0.45, fontSize: 11, fontFace: FB, color: C.muted, valign: "middle", margin: 0 });
    });

    note(s, p, "info", "指名料は店舗ごとに自由に設定できます。指名予約時は自動で料金に加算されます。", MARGIN, 6.95, CONTENT_W);

    chrome(s, p, 6, TOTAL);
  }

  // ════════ 07 — Step 5: LINE接続 (Part 1: 公式アカウント) ════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "STEP 5  /  PART 1");
    heading(s, "LINE 公式アカウントを準備する。", 1.1);

    s.addText(
      "LINE Messaging API の利用には「LINE 公式アカウント」と「Messaging API チャネル」が必要です。" +
      "未作成の場合は、以下の3手順で作成します (5〜10分)。",
      { x: MARGIN, y: 2.3, w: CONTENT_W, h: 1.0, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    const steps = [
      {
        n: "①",
        title: "LINE for Business で公式アカウントを作成",
        url: "https://www.linebiz.com/jp/",
        body: "「公式アカウントを開設」→ 店舗名・カテゴリを入力。無料プランでOK。",
      },
      {
        n: "②",
        title: "LINE Developers Console にアクセス",
        url: "https://developers.line.biz/console/",
        body: "プロバイダー (会社名やオーナー名) を作成 → そのプロバイダー内に「Messaging API」チャネルを新規作成。",
      },
      {
        n: "③",
        title: "Messaging API チャネルから値を取得",
        url: "(同上画面の「Basic settings」「Messaging API」タブ)",
        body: "次の3つをコピー: Channel ID / Channel secret / Channel access token (long-lived)。",
      },
    ];
    steps.forEach((st, i) => {
      const y = 3.5 + i * 1.15;
      s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y, w: CONTENT_W, h: 1.0, fill: { color: C.bg }, line: { color: C.bdr, width: 0.4 } });
      s.addText(st.n, { x: MARGIN + 0.2, y: y + 0.1, w: 0.5, h: 0.4, fontSize: 16, fontFace: FH, color: C.blue, bold: true, margin: 0 });
      s.addText(st.title, { x: MARGIN + 0.7, y: y + 0.1, w: CONTENT_W - 1, h: 0.4, fontSize: 13, fontFace: FH, color: C.ink, bold: true, margin: 0 });
      s.addText(st.url, { x: MARGIN + 0.7, y: y + 0.45, w: CONTENT_W - 1, h: 0.3, fontSize: 10.5, fontFace: FB, color: C.blueD, margin: 0 });
      s.addText(st.body, { x: MARGIN + 0.7, y: y + 0.7, w: CONTENT_W - 1, h: 0.3, fontSize: 10.5, fontFace: FB, color: C.body, margin: 0 });
    });

    chrome(s, p, 7, TOTAL);
  }

  // ════════ 08 — Step 5: LINE接続 (Part 2: 取得した値の登録) ════════
  {
    const s = p.addSlide();
    s.background = { color: C.bg };
    eyebrow(s, "STEP 5  /  PART 2");
    heading(s, "取得した値を、HairSalonLink に登録する。", 1.1);

    s.addText(
      "ダッシュボード「設定」→「LINE 連携」フォームに、Step 5-Part1 で取得した3つの値を入力します。",
      { x: MARGIN, y: 2.3, w: CONTENT_W, h: 0.7, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    // Two columns: LINE side ↔ HairSalonLink side
    const cy = 3.2;
    const ch = 3.0;
    const cw = (CONTENT_W - 1.0) / 2;

    // Left: LINE side
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: cy, w: cw, h: ch, fill: { color: C.greenL }, line: { color: C.green, width: 1 } });
    s.addText("LINE Developers から取得", { x: MARGIN + 0.25, y: cy + 0.2, w: cw - 0.5, h: 0.35, fontSize: 12, fontFace: FB, color: "0F5C44", bold: true, charSpacing: 2, margin: 0 });
    const leftItems = [
      { l: "Channel ID",            v: "Basic settings タブ" },
      { l: "Channel secret",        v: "Basic settings タブ" },
      { l: "Channel access token",  v: "Messaging API タブ → Long-lived" },
    ];
    leftItems.forEach((it, i) => {
      const y = cy + 0.7 + i * 0.7;
      s.addText(it.l, { x: MARGIN + 0.25, y, w: cw - 0.5, h: 0.35, fontSize: 12.5, fontFace: FH, color: C.ink, bold: true, margin: 0 });
      s.addText(it.v, { x: MARGIN + 0.25, y: y + 0.35, w: cw - 0.5, h: 0.3, fontSize: 10.5, fontFace: FB, color: C.body, margin: 0 });
    });

    // Arrow in middle
    s.addImage({ data: ic.arrow, x: MARGIN + cw + 0.25, y: cy + ch / 2 - 0.3, w: 0.5, h: 0.5 });

    // Right: HairSalonLink side
    const rx = MARGIN + cw + 1.0;
    s.addShape(p.shapes.RECTANGLE, { x: rx, y: cy, w: cw, h: ch, fill: { color: C.blueL }, line: { color: C.blue, width: 1 } });
    s.addText("HairSalonLink で入力", { x: rx + 0.25, y: cy + 0.2, w: cw - 0.5, h: 0.35, fontSize: 12, fontFace: FB, color: C.blueD, bold: true, charSpacing: 2, margin: 0 });
    const rightItems = [
      { l: "Channel ID",   v: "そのまま貼り付け" },
      { l: "Channel Secret", v: "そのまま貼り付け" },
      { l: "Access Token", v: "そのまま貼り付け" },
    ];
    rightItems.forEach((it, i) => {
      const y = cy + 0.7 + i * 0.7;
      s.addText(it.l, { x: rx + 0.25, y, w: cw - 0.5, h: 0.35, fontSize: 12.5, fontFace: FH, color: C.ink, bold: true, margin: 0 });
      s.addText(it.v, { x: rx + 0.25, y: y + 0.35, w: cw - 0.5, h: 0.3, fontSize: 10.5, fontFace: FB, color: C.body, margin: 0 });
    });

    note(s, p, "warn", "保存後、LINE Developers の「Messaging API」 → 「Webhook URL」 に、設定画面に表示される Webhook URL を貼り付けて「Use webhook」をオンにしてください。", MARGIN, 6.95, CONTENT_W);

    chrome(s, p, 8, TOTAL);
  }

  // ════════ 09 — Step 6: テスト予約 ════════
  {
    const s = p.addSlide();
    s.background = { color: C.white };
    eyebrow(s, "STEP 6");
    heading(s, "テスト予約をして、動作確認する。", 1.1);

    s.addText(
      "公開予約URLにアクセスし、テスト顧客として予約を入れます。\n" +
      "ダッシュボードに予約が反映されること、LINE接続済みの場合は通知が届くことを確認します。",
      { x: MARGIN, y: 2.3, w: CONTENT_W, h: 1.0, fontSize: 13, fontFace: FB, color: C.body, lineSpacingMultiple: 1.7, margin: 0 }
    );

    // URL Box
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: 3.5, w: CONTENT_W, h: 0.7, fill: { color: C.blueL } });
    s.addShape(p.shapes.RECTANGLE, { x: MARGIN, y: 3.5, w: 0.1, h: 0.7, fill: { color: C.blue } });
    s.addText("予約ページURL (各店舗)", { x: MARGIN + 0.3, y: 3.55, w: 4, h: 0.3, fontSize: 10, fontFace: FB, color: C.muted, charSpacing: 2, bold: true, margin: 0 });
    s.addText(`${APP_URL}/book/<店舗のslug>`, { x: MARGIN + 0.3, y: 3.85, w: CONTENT_W - 0.5, h: 0.3, fontSize: 14, fontFace: FB, color: C.blueD, bold: true, margin: 0 });

    const checks = [
      { t: "メニューを選択 → 日時を選択 → 顧客情報入力 → 予約確定", ok: "→ ダッシュボード「予約」に表示されることを確認" },
      { t: "「顧客」画面で新規顧客が作成されたことを確認",          ok: "→ 顧客名・電話番号・予約履歴が紐づいているか" },
      { t: "「ダッシュボード」KPI が更新されたか確認",              ok: "→ 予約数・売上見込みなど" },
      { t: "(LINE接続済の場合) LINE 友だち追加 → 「予約」とメッセージ送信", ok: "→ Bot が予約URLを返信すれば成功" },
    ];
    checks.forEach((c, i) => {
      const y = 4.4 + i * 0.6;
      s.addImage({ data: ic.check, x: MARGIN + 0.1, y: y + 0.05, w: 0.25, h: 0.25 });
      s.addText(c.t, { x: MARGIN + 0.5, y, w: CONTENT_W - 0.5, h: 0.3, fontSize: 12, fontFace: FH, color: C.ink, bold: true, margin: 0 });
      s.addText(c.ok, { x: MARGIN + 0.5, y: y + 0.3, w: CONTENT_W - 0.5, h: 0.3, fontSize: 10.5, fontFace: FB, color: C.green, margin: 0 });
    });

    chrome(s, p, 9, TOTAL);
  }

  // ════════ 10 — 完了 + 日次運用 ════════
  {
    const s = p.addSlide();
    s.background = { color: C.navy };
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: 0, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });
    s.addShape(p.shapes.RECTANGLE, { x: 0, y: SLIDE_H - 0.08, w: SLIDE_W, h: 0.08, fill: { color: C.blue } });

    s.addText("DONE  /  DAILY OPERATIONS", {
      x: MARGIN, y: 1.2, w: CONTENT_W, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.navyT, charSpacing: 6, align: "center", bold: true, margin: 0,
    });
    s.addText("セットアップ完了。明日からの運用へ。", {
      x: MARGIN, y: 1.85, w: CONTENT_W, h: 0.7,
      fontSize: 32, fontFace: FH, color: C.white, align: "center",
    });
    s.addText("ここから先は、毎日の運用フロー。1日5分でOKです。", {
      x: MARGIN, y: 2.6, w: CONTENT_W, h: 0.5,
      fontSize: 14, fontFace: FB, color: C.navyT2, align: "center",
    });

    const daily = [
      { time: "朝 10:00", task: "ダッシュボードを開いて当日予約を確認" },
      { time: "施術中",   task: "予約画面でカルテを記入 (ブランド・比率・所感)" },
      { time: "終業後",   task: "売上自動集計を確認、必要ならクーポン配信" },
      { time: "週1回",    task: "「分析」画面で HPB→自社移行率をチェック" },
    ];
    const dy = 3.6;
    const dh = 0.85;
    daily.forEach((d, i) => {
      const y = dy + i * dh;
      s.addShape(p.shapes.RECTANGLE, { x: 1.5, y, w: SLIDE_W - 3, h: dh - 0.1, fill: { color: C.navyL } });
      s.addText(d.time, {
        x: 1.7, y, w: 1.8, h: dh - 0.1,
        fontSize: 13, fontFace: FH, color: C.warm, bold: true, valign: "middle", margin: 0,
      });
      s.addText(d.task, {
        x: 3.6, y, w: SLIDE_W - 5.2, h: dh - 0.1,
        fontSize: 12.5, fontFace: FB, color: C.white, valign: "middle", margin: 0,
      });
    });

    s.addText("お困りの際は、いつでもお問い合わせください。", {
      x: MARGIN, y: 7.4, w: CONTENT_W, h: 0.4,
      fontSize: 13, fontFace: FB, color: C.navyT2, align: "center",
    });
    s.addText("shibahara.724@gmail.com", {
      x: MARGIN, y: 7.7, w: CONTENT_W, h: 0.35,
      fontSize: 14, fontFace: FH, color: C.white, align: "center", bold: true,
    });
  }

  // Save
  const out = "C:\\Users\\shiba\\OneDrive\\Desktop\\サロン\\hair-salon-link\\HairSalonLink_導入手順書.pptx";
  await p.writeFile({ fileName: out });
  console.log("SAVED: " + out);
}

main().catch(e => { console.error(e); process.exit(1); });
