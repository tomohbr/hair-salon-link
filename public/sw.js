// HairSalonLink Service Worker — KILL SWITCH
//
// This SW does ONE thing only: self-unregister and clear all caches.
// Purpose: ensure any browser with an old buggy SW gets clean state on next /sw.js fetch.

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Drop all caches
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {}

      // Take control then unregister self
      try {
        await self.clients.claim();
      } catch {}

      try {
        await self.registration.unregister();
      } catch {}

      // Reload all controlled pages so they fetch fresh from network
      try {
        const allClients = await self.clients.matchAll({ type: "window" });
        for (const client of allClients) {
          client.navigate(client.url);
        }
      } catch {}
    })()
  );
});

// Pass through all fetches (do not intercept anything)
self.addEventListener("fetch", () => {
  return;
});
