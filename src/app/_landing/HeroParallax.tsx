'use client';

import { useEffect } from 'react';

/**
 * Slows down a target element so it parallaxes against the page scroll.
 * Pass the CSS selector to target.
 */
export default function HeroParallax({
  targetSelector,
  speed = 0.32,
}: {
  targetSelector: string;
  speed?: number;
}) {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(targetSelector);
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.3) return;
      el.style.transform = `translate3d(0, ${y * speed}px, 0) scale(${1 + y * 0.00012})`;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [targetSelector, speed]);

  return null;
}
