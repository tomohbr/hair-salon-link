'use client';

import { useEffect } from 'react';

/**
 * NOTE: PWA registration is currently DISABLED to fix navigation issues caused by
 * stale Service Worker caches. This component instead actively unregisters any
 * existing SW and clears all caches on every page load — guaranteeing all users
 * end up in a clean, no-SW state.
 *
 * Once the password change feature is verified working for all users, we can
 * re-enable PWA with the v3 SW design.
 */
export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    (async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
        if (typeof caches !== 'undefined') {
          const keys = await caches.keys();
          for (const k of keys) await caches.delete(k);
        }
      } catch {
        // silent
      }
    })();
  }, []);
  return null;
}
