'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker on the client and forces update checks.
 * - Registers /sw.js (with no-cache header so browser always fetches latest)
 * - Calls reg.update() on every page load to detect new SW versions immediately
 * - When a new SW takes control, reload the page once to clear stale state
 */
export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let reloaded = false;
    const onControllerChange = () => {
      if (reloaded) return;
      reloaded = true;
      // Avoid infinite reload loops by guarding against redundant reloads
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        // Force a check for new SW version on every load
        reg.update().catch(() => {});
      })
      .catch(() => {
        // Silent fail
      });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);
  return null;
}
