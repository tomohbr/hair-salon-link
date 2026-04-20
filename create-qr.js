// HairSalonLink QR コード生成
// - 各URLの個別 PNG (高解像度・印刷OK)
// - 3つのQRコードをまとめた A4 縦の PDF / PPTX

const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const BASE = "https://hair-salon-link-production.up.railway.app";

const QR_TARGETS = [
  {
    label: "ランディングページ",
    sub: "サービス紹介・料金・申込",
    url: `${BASE}/`,
    file: "QR_LP.png",
  },
  {
    label: "サンプル店舗の予約ページ",
    sub: "実際の予約導線を体験",
    url: `${BASE}/book/hair-salon-demo`,
    file: "QR_BookingDemo.png",
  },
  {
    label: "ログイン",
    sub: "管理画面 (運営者・店舗オーナー用)",
    url: `${BASE}/login`,
    file: "QR_Login.png",
  },
];

const OUT_DIR = "qr";

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

  // 1. 各 URL の高解像度 PNG を生成
  const qrBase64 = [];
  for (const t of QR_TARGETS) {
    const filePath = path.join(OUT_DIR, t.file);
    await QRCode.toFile(filePath, t.url, {
      errorCorrectionLevel: "M",
      type: "png",
      width: 800,
      margin: 2,
      color: { dark: "#1F5F80", light: "#FFFFFF" },
    });
    const dataUrl = await QRCode.toDataURL(t.url, {
      errorCorrectionLevel: "M",
      width: 600,
      margin: 1,
      color: { dark: "#1F5F80", light: "#FFFFFF" },
    });
    qrBase64.push(dataUrl.replace(/^data:image\/png;base64,/, "image/png;base64,"));
    console.log(`✓ Generated: ${filePath}`);
  }

  // 2. A4 縦の印刷用 PowerPoint
  const pres = new pptxgen();
  pres.defineLayout({ name: "A4_PORTRAIT", width: 8.27, height: 11.69 });
  pres.layout = "A4_PORTRAIT";
  pres.author = "HairSalonLink";
  pres.title = "HairSalonLink QRコード一覧";

  const C = {
    navy: "0F1C2E", blue: "1F5F80", blueL: "E5EDF2",
    ink: "1A1A1A", body: "3D3D3D", muted: "6E6E6E", light: "A5A5A5",
    bg: "F5F3EF", card: "FFFFFF", bdr: "D9D3CA",
  };

  const slide = pres.addSlide();
  slide.background = { color: C.bg };

  // ヘッダー
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 8.27, h: 0.06, fill: { color: C.blue } });
  slide.addText("HairSalonLink", {
    x: 0.5, y: 0.4, w: 7.27, h: 0.5,
    fontSize: 22, fontFace: "Georgia", color: C.navy, bold: true, align: "center", margin: 0,
  });
  slide.addText("スマートフォンで QR コードをスキャンしてください", {
    x: 0.5, y: 0.9, w: 7.27, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });

  // 3つのQRコードを縦並びで
  QR_TARGETS.forEach((t, i) => {
    const y = 1.6 + i * 3.3;
    // カード背景
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 7.27, h: 3.0,
      fill: { color: C.card }, line: { color: C.bdr, width: 0.5 },
    });
    // 左: QR画像 (2.4 inch)
    slide.addImage({ data: qrBase64[i], x: 0.8, y: y + 0.3, w: 2.4, h: 2.4 });
    // 右: 説明
    slide.addText(`${i + 1}.`, {
      x: 3.5, y: y + 0.3, w: 0.5, h: 0.5,
      fontSize: 28, fontFace: "Georgia", color: C.blue, bold: true, margin: 0,
    });
    slide.addText(t.label, {
      x: 4.0, y: y + 0.3, w: 3.7, h: 0.5,
      fontSize: 18, fontFace: "Georgia", color: C.ink, bold: true, valign: "middle", margin: 0,
    });
    slide.addText(t.sub, {
      x: 3.5, y: y + 0.85, w: 4.2, h: 0.4,
      fontSize: 12, fontFace: "Calibri", color: C.body, margin: 0,
    });
    // URL (小さく)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 3.5, y: y + 1.4, w: 4.2, h: 0.45,
      fill: { color: C.blueL },
    });
    slide.addText(t.url, {
      x: 3.55, y: y + 1.4, w: 4.1, h: 0.45,
      fontSize: 9.5, fontFace: "Calibri", color: C.blue, valign: "middle", margin: 0,
      breakLine: false,
    });
    // 補足
    slide.addText("※ スキャンしたら、表示される URL をタップしてアクセス", {
      x: 3.5, y: y + 1.95, w: 4.2, h: 0.3,
      fontSize: 9, fontFace: "Calibri", color: C.muted, margin: 0,
    });
  });

  // フッター
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 11.0, w: 7.27, h: 0,
    line: { color: C.bdr, width: 0.5 },
  });
  slide.addText("HairSalonLink — 美容室向け顧客管理 SaaS  |  お問い合わせ: shibahara.724@gmail.com", {
    x: 0.5, y: 11.1, w: 7.27, h: 0.3,
    fontSize: 9, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 11.63, w: 8.27, h: 0.06, fill: { color: C.blue } });

  const outPptx = "HairSalonLink_QRコード.pptx";
  await pres.writeFile({ fileName: outPptx });
  console.log(`\n✓ Saved: ${outPptx}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
