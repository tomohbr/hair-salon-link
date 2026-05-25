'use client';

import { useEffect, useState } from 'react';

/** Thin brass hairline at the top of the page that fills as the user scrolls. */
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '1.5px',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #c9a675, #a37b47)',
        zIndex: 101,
        transition: 'width .12s linear',
        pointerEvents: 'none',
      }}
    />
  );
}
