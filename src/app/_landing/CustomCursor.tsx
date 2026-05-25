'use client';

import { useEffect, useRef } from 'react';

/** Custom cursor follower with hover state expansion (desktop only). */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    document.body.classList.add('has-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Hover targets
    const hoverables = 'a, button, summary, [role="button"], input[type="range"]';
    const onEnter = () => document.body.classList.add('cursor-hover');
    const onLeave = () => document.body.classList.remove('cursor-hover');
    const els = document.querySelectorAll(hoverables);
    els.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      els.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      document.body.classList.remove('has-cursor', 'cursor-hover');
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '36px', height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(184, 138, 74, 0.5)',
          pointerEvents: 'none',
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'width .4s cubic-bezier(.22,1,.36,1), height .4s cubic-bezier(.22,1,.36,1), border-color .25s',
          zIndex: 199,
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#efe3c8',
          pointerEvents: 'none',
          transform: 'translate3d(-50%, -50%, 0)',
          transition: 'width .25s, height .25s, background .25s',
          mixBlendMode: 'difference',
          zIndex: 200,
          willChange: 'transform',
        }}
      />
      <style>{`
        body.has-cursor, body.has-cursor * { cursor: none !important; }
        body.cursor-hover .cursor-ring { width: 64px !important; height: 64px !important; border-color: rgba(184,138,74,0.85) !important; }
        body.cursor-hover .cursor-dot { width: 4px !important; height: 4px !important; background: #c9a675 !important; }
        @media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
          .cursor-dot, .cursor-ring { display: none !important; }
        }
      `}</style>
    </>
  );
}
