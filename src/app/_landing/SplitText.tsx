'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Character-by-character reveal of text content. Preserves <br /> and <em>.
 * Triggers when scrolled into view.
 */
export default function SplitText({
  children,
  as: Tag = 'h1',
  className = '',
  stagger = 24,
}: {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** ms per character */
  stagger?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('split-in');
      return;
    }

    // Walk through text nodes and wrap each character in a span.
    let idx = 0;
    const wrap = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const text = node.textContent;
        const line = document.createElement('span');
        line.className = 'split-line';
        line.style.display = 'inline-block';
        line.style.overflow = 'hidden';
        line.style.verticalAlign = 'top';
        Array.from(text).forEach((c) => {
          if (c === ' ' || c === '　') {
            const ws = document.createElement('span');
            ws.style.display = 'inline-block';
            ws.style.width = '0.25em';
            ws.textContent = c;
            line.appendChild(ws);
            return;
          }
          const ch = document.createElement('span');
          ch.className = 'split-ch';
          ch.style.display = 'inline-block';
          ch.style.transform = 'translateY(110%)';
          ch.style.opacity = '0';
          ch.style.transition = 'transform 1.05s cubic-bezier(.22,1,.36,1), opacity .8s ease';
          ch.style.transitionDelay = `${idx * stagger}ms`;
          ch.textContent = c;
          line.appendChild(ch);
          idx++;
        });
        node.parentNode?.replaceChild(line, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const e = node as HTMLElement;
        if (e.tagName === 'BR') return;
        // Skip elements explicitly opting out (preserves background-clip gradients etc.)
        if (e.dataset.noSplit !== undefined) return;
        Array.from(e.childNodes).forEach(wrap);
      }
    };
    Array.from(el.childNodes).forEach(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll<HTMLElement>('.split-ch').forEach((s) => {
              s.style.transform = 'translateY(0)';
              s.style.opacity = '1';
            });
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    return () => io.disconnect();
  }, [stagger]);

  return (
    // @ts-expect-error JSX intrinsic union assignment is OK at runtime
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
