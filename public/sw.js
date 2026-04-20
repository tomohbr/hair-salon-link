// HairSalonLink Service Worker
// v3: Self-healing — actively purges any cached HTML pages from old SW versions.
//
// Strategy:
// - Static assets (icons, manifest, _next/static): cache-first
// - HTML pages: NETWORK-ONLY (never cache, prevents stale auth pages)
// - API calls: NETWORK-ONLY (always fresh)

const CACHE = "hsl-v3";
const PRECACHE = [
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // 1. Drop all old caches except the current one
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));

      // 2. Self-heal: purge any HTML responses that might be lingering in current cache
      const cache = await caches.open(CACHE);
      const requests = await cache.keys();
      await Promise.all(
        requests.map(async (req) => {
          const url = new URL(req.url);
          // Remove anything that isn't an explicitly precached static asset
          const isStatic =
            PRECACHE.some((p) => url.pathname === p) ||
            url.pathname.startsWith("/_next/static/") ||
            url.pathname.startsWith("/icon-") ||
            url.pathname.startsWith("/apple-touch-icon") ||
            url.pathname.startsWith("/favicon");
          if (!isStatic) {
            await cache.delete(req);
          }
        })
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // API: never cache
  if (url.pathname.startsWith("/api/")) return;

  // Static assets: cache-first
  if (
    url.pathname.startsWith("/icon-") ||
    url.pathname.startsWith("/apple-touch-icon") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
      )
    );
    return;
  }

  // Everything else (HTML, RSC, dynamic routes): network-only
  // Do NOT intercept — let browser handle with full cookie/credentials.
});
