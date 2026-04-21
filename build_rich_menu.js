// HairSalonLink LINE リッチメニュー画像生成
// 出力: 2500x1686 (Large) / 1200x810 / 800x540 の3サイズ
// 4ボタン構成: 予約 / メニュー / スタイル / アクセス
// フォント: Windows 同梱の Yu Mincho / Yu Gothic を利用（SVG の font-family で参照）
// ウォーターマーク一切なし

const sharp = require('sharp');
const fs = require('fs');

// ── ブランド色 ──
const BG = '#0c0a09';
const BG_GRAD = '#140f0c';
const BORDER = '#2a2320';
const BRAND = '#c9a96e';
const IVORY = '#ebe1cf';
const MUTED = '#7a6d5c';

// ── SVG アイコン（全部 stroke: BRAND, strokeWidth: 絶対値で指定） ──
const icons = {
  calendar: (size) => `
    <g transform="translate(${-size/2},${-size/2})">
      <rect x="${size*0.05}" y="${size*0.18}" width="${size*0.9}" height="${size*0.78}"
            rx="${size*0.05}" ry="${size*0.05}"
            fill="none" stroke="${BRAND}" stroke-width="${size*0.04}"/>
      <line x1="${size*0.3}" y1="${size*0.05}" x2="${size*0.3}" y2="${size*0.28}"
            stroke="${BRAND}" stroke-width="${size*0.04}" stroke-linecap="round"/>
      <line x1="${size*0.7}" y1="${size*0.05}" x2="${size*0.7}" y2="${size*0.28}"
            stroke="${BRAND}" stroke-width="${size*0.04}" stroke-linecap="round"/>
      <line x1="${size*0.05}" y1="${size*0.38}" x2="${size*0.95}" y2="${size*0.38}"
            stroke="${BRAND}" stroke-width="${size*0.03}"/>
      <!-- dots -->
      <circle cx="${size*0.28}" cy="${size*0.58}" r="${size*0.04}" fill="${BRAND}"/>
      <circle cx="${size*0.5}" cy="${size*0.58}" r="${size*0.04}" fill="${BRAND}"/>
      <circle cx="${size*0.72}" cy="${size*0.58}" r="${size*0.04}" fill="${BRAND}"/>
      <circle cx="${size*0.28}" cy="${size*0.76}" r="${size*0.04}" fill="${BRAND}"/>
      <circle cx="${size*0.5}" cy="${size*0.76}" r="${size*0.04}" fill="${BRAND}"/>
    </g>
  `,

  list: (size) => `
    <g transform="translate(${-size/2},${-size/2})">
      <!-- bullets -->
      <rect x="${size*0.08}" y="${size*0.18}" width="${size*0.12}" height="${size*0.12}"
            fill="none" stroke="${BRAND}" stroke-width="${size*0.035}"/>
      <rect x="${size*0.08}" y="${size*0.44}" width="${size*0.12}" height="${size*0.12}"
            fill="none" stroke="${BRAND}" stroke-width="${size*0.035}"/>
      <rect x="${size*0.08}" y="${size*0.70}" width="${size*0.12}" height="${size*0.12}"
            fill="none" stroke="${BRAND}" stroke-width="${size*0.035}"/>
      <!-- lines -->
      <line x1="${size*0.3}" y1="${size*0.24}" x2="${size*0.92}" y2="${size*0.24}"
            stroke="${BRAND}" stroke-width="${size*0.035}" stroke-linecap="round"/>
      <line x1="${size*0.3}" y1="${size*0.5}" x2="${size*0.85}" y2="${size*0.5}"
            stroke="${BRAND}" stroke-width="${size*0.035}" stroke-linecap="round"/>
      <line x1="${size*0.3}" y1="${size*0.76}" x2="${size*0.92}" y2="${size*0.76}"
            stroke="${BRAND}" stroke-width="${size*0.035}" stroke-linecap="round"/>
    </g>
  `,

  scissors: (size) => `
    <g transform="translate(${-size/2},${-size/2})">
      <circle cx="${size*0.25}" cy="${size*0.22}" r="${size*0.14}"
              fill="none" stroke="${BRAND}" stroke-width="${size*0.04}"/>
      <circle cx="${size*0.25}" cy="${size*0.78}" r="${size*0.14}"
              fill="none" stroke="${BRAND}" stroke-width="${size*0.04}"/>
      <line x1="${size*0.36}" y1="${size*0.30}" x2="${size*0.95}" y2="${size*0.80}"
            stroke="${BRAND}" stroke-width="${size*0.04}" stroke-linecap="round"/>
      <line x1="${size*0.36}" y1="${size*0.70}" x2="${size*0.95}" y2="${size*0.20}"
            stroke="${BRAND}" stroke-width="${size*0.04}" stroke-linecap="round"/>
    </g>
  `,

  pin: (size) => `
    <g transform="translate(${-size/2},${-size/2})">
      <path d="M${size*0.5} ${size*0.08}
               C ${size*0.25} ${size*0.08}, ${size*0.2} ${size*0.38}, ${size*0.5} ${size*0.75}
               C ${size*0.8} ${size*0.38}, ${size*0.75} ${size*0.08}, ${size*0.5} ${size*0.08}
               Z"
            fill="none" stroke="${BRAND}" stroke-width="${size*0.04}" stroke-linejoin="round"/>
      <circle cx="${size*0.5}" cy="${size*0.32}" r="${size*0.09}"
              fill="none" stroke="${BRAND}" stroke-width="${size*0.04}"/>
      <ellipse cx="${size*0.5}" cy="${size*0.86}" rx="${size*0.12}" ry="${size*0.03}"
               fill="${BRAND}"/>
    </g>
  `,
};

// ── 1枚の画像をつくる（指定サイズ） ──
function makeSvg(w, h) {
  // レイアウト: 2x2 グリッド
  const cellW = w / 2;
  const cellH = h / 2;
  // アイコンサイズ：セルの短辺 20%
  const iconSize = Math.min(cellW, cellH) * 0.22;
  // 日本語フォントサイズ：セルの短辺 10.5%
  const jaFontSize = Math.round(Math.min(cellW, cellH) * 0.105);
  // 英字フォントサイズ：セルの短辺 3%
  const enFontSize = Math.round(Math.min(cellW, cellH) * 0.033);
  const enLetterSpacing = Math.round(enFontSize * 0.3);

  // 各セルの中央座標
  const cells = [
    { cx: cellW * 0.5, cy: cellH * 0.5, icon: 'calendar', ja: '予約', en: 'BOOK' },
    { cx: cellW * 1.5, cy: cellH * 0.5, icon: 'list', ja: 'メニュー', en: 'MENU' },
    { cx: cellW * 0.5, cy: cellH * 1.5, icon: 'scissors', ja: 'スタイル', en: 'STYLE' },
    { cx: cellW * 1.5, cy: cellH * 1.5, icon: 'pin', ja: 'アクセス', en: 'ACCESS' },
  ];

  // アイコン中心 y: セル中心より上にずらす
  const iconDY = -Math.min(cellW, cellH) * 0.14;
  // 日本語位置: セル中心より少し下
  const jaDY = Math.min(cellW, cellH) * 0.09;
  // 英字: 日本語の下
  const enDY = jaDY + jaFontSize * 0.85;

  const cellsSvg = cells.map((c) => {
    const iconSvg = icons[c.icon](iconSize);
    return `
      <g transform="translate(${c.cx},${c.cy + iconDY})">
        ${iconSvg}
      </g>
      <text x="${c.cx}" y="${c.cy + jaDY}" font-family="Yu Mincho, Noto Serif JP, Hiragino Mincho ProN, serif"
            font-size="${jaFontSize}" fill="${IVORY}" text-anchor="middle"
            dominant-baseline="central" font-weight="700">${c.ja}</text>
      <text x="${c.cx}" y="${c.cy + enDY + enFontSize * 0.5}" font-family="Yu Gothic, Segoe UI, sans-serif"
            font-size="${enFontSize}" fill="${MUTED}" text-anchor="middle"
            dominant-baseline="central" letter-spacing="${enLetterSpacing}">${c.en}</text>
    `;
  }).join('\n');

  // グラデーション背景 + 極細仕切り線
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stop-color="${BG_GRAD}"/>
          <stop offset="100%" stop-color="${BG}"/>
        </radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      <!-- 縦仕切り -->
      <line x1="${w/2}" y1="${h*0.06}" x2="${w/2}" y2="${h*0.94}"
            stroke="${BORDER}" stroke-width="1" stroke-opacity="0.9"/>
      <!-- 横仕切り -->
      <line x1="${w*0.04}" y1="${h/2}" x2="${w*0.96}" y2="${h/2}"
            stroke="${BORDER}" stroke-width="1" stroke-opacity="0.9"/>
      ${cellsSvg}
    </svg>
  `;
}

// ── 3サイズ出力 ──
const sizes = [
  { w: 2500, h: 1686, name: 'RichMenu_2500x1686' },
  { w: 1200, h: 810, name: 'RichMenu_1200x810' },
  { w: 800, h: 540, name: 'RichMenu_800x540' },
];

(async () => {
  for (const s of sizes) {
    const svg = makeSvg(s.w, s.h);
    const out = `HairSalonLink_${s.name}.png`;
    await sharp(Buffer.from(svg), { density: 300 })
      .resize(s.w, s.h, { fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toFile(out);
    const bytes = fs.statSync(out).size;
    console.log(`✅ ${out}  —  ${(bytes / 1024).toFixed(1)} KB  (${s.w}x${s.h})`);
  }
})();
