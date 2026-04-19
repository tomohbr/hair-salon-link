// HairSalonLink Service Worker
// Strategy:
// - Static assets (icons, manifest): cache-first
// - App shell (HTML pages): network-first with cache fallback
// - API calls: network-only (never cache, always fresh)

const CACHE = "hsl-v1";
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

  // App shell (HTML): network-first, fallback to cache
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((c) => c || caches.match("/")))
    );
    return;
  }
});
