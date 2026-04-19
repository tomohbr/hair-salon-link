const sharp = require("sharp");

// Brand: navy #1F5F80 with cream scissors glyph
const svgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1F5F80"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="#EBE1CF" stroke-width="4" opacity="0.15"/>
  <!-- Scissors glyph, simplified -->
  <g fill="#EBE1CF">
    <circle cx="180" cy="180" r="36" fill="none" stroke="#EBE1CF" stroke-width="22"/>
    <circle cx="180" cy="332" r="36" fill="none" stroke="#EBE1CF" stroke-width="22"/>
    <path d="M 216 212 L 380 380 M 216 300 L 380 132" stroke="#EBE1CF" stroke-width="22" stroke-linecap="round" fill="none"/>
  </g>
  <text x="256" y="460" font-family="Georgia, serif" font-size="42" font-weight="bold" fill="#EBE1CF" text-anchor="middle">HSL</text>
</svg>`;

const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1F5F80"/>
  <g fill="#EBE1CF">
    <circle cx="180" cy="180" r="36" fill="none" stroke="#EBE1CF" stroke-width="22"/>
    <circle cx="180" cy="332" r="36" fill="none" stroke="#EBE1CF" stroke-width="22"/>
    <path d="M 216 212 L 380 380 M 216 300 L 380 132" stroke="#EBE1CF" stroke-width="22" stroke-linecap="round" fill="none"/>
  </g>
</svg>`;

(async () => {
  await sharp(Buffer.from(svgIcon(192))).resize(192, 192).png().toFile("public/icon-192.png");
  await sharp(Buffer.from(svgIcon(512))).resize(512, 512).png().toFile("public/icon-512.png");
  await sharp(Buffer.from(appleTouchSvg)).resize(180, 180).png().toFile("public/apple-touch-icon.png");
  // Favicon 32x32 and 16x16
  await sharp(Buffer.from(appleTouchSvg)).resize(32, 32).png().toFile("public/favicon-32.png");
  await sharp(Buffer.from(appleTouchSvg)).resize(16, 16).png().toFile("public/favicon-16.png");
  console.log("Icons generated.");
})();
