'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Variant = 'up' | 'fade' | 'scale' | 'left' | 'right';

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  once = true,
}: {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const Comp = Tag as unknown as React.ElementType;

  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      data-reveal={variant}
      data-visible={visible ? 'true' : 'false'}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </Comp>
  );
}
