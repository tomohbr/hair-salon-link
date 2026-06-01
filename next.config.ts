import type { NextConfig } from "next";

const securityHeaders = [
  // 1 年間 HTTPS を強制 (preload 申請も可)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // クリックジャッキング防止
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // MIME スニッフィング防止
  { key: "X-Content-Type-Options", value: "nosniff" },
  // クロスサイト Referer 漏洩抑制
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 強力な権限の自動付与を遮断
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self), interest-cohort=()" },
  // XSS 旧来対策 (新ブラウザは無視するが古い環境向け)
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ── すべてのページにセキュリティヘッダ ──
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Service Worker は常に最新を取得 (キャッシュ問題を防ぐ)
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600" },
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
    ];
  },
};

export default nextConfig;
