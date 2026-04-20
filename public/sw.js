// HairSalonLink Service Worker
// Strategy:
// - Static assets (icons, manifest, _next/static): cache-first
// - HTML pages: NETWORK-ONLY (never cache to avoid stale auth pages)
// - API calls: NETWORK-ONLY (always fresh)
//
// v2: Removed HTML caching to fix auth-protected page redirect issues.

const CACHE = "hsl-v2";
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
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin GET
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // API: never cache
  if (url.pathname.startsWith("/api/")) {
    return; // let browser handle normally
  }

  // Static assets (icons, manifest): cache-first
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
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
      )
    );
    return;
  }

  // HTML pages: NEVER cache. Always go to network.
  // This avoids serving stale auth-protected pages (e.g. /account redirecting to /login).
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    return; // browser handles fetch normally with cookies
  }
});
