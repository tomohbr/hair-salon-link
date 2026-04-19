'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker on the client.
 * Silently no-op if unsupported.
 */
export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    // Only register in production (dev runs on HTTP and won't serve sw correctly)
    if (window.location.hostname === 'localhost' && window.location.protocol !== 'https:') {
      // Still register for local https or PWA testing; skip for plain http localhost
    }
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch(() => {
        // Silent fail — PWA degrades gracefully to regular web app.
      });
  }, []);
  return null;
}
