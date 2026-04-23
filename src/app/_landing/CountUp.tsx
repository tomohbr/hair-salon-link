'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Animates a numeric value into view. Format is handled by a render prop
 * so we can support "¥4,980〜", "30分", etc.
 */
export default function CountUp({
  to,
  durationMs = 1400,
  format,
  className,
}: {
  to: number;
  durationMs?: number;
  format: (n: number) => string;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setN(to);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (t: number) => {
            const p = Math.min(1, (t - start) / durationMs);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {format(n)}
    </span>
  );
}
