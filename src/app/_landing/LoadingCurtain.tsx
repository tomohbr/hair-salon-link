'use client';

import { useEffect, useState } from 'react';

/** First-paint curtain that lifts up to reveal the LP. */
export default function LoadingCurtain() {
  const [out, setOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setRemoved(true);
      return;
    }
    const lift = () => {
      setOut(true);
      setTimeout(() => setRemoved(true), 1100);
    };
    const t = setTimeout(lift, document.readyState === 'complete' ? 900 : 1200);
    return () => clearTimeout(t);
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden
      className={`curtain ${out ? 'curtain-out' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#14100c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        transition: 'transform 1s cubic-bezier(.7,0,.3,1), opacity .9s ease-out',
        transformOrigin: 'top',
        opacity: out ? 0 : 1,
        transform: out ? 'translateY(-101%)' : 'translateY(0)',
      }}
    >
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '34px',
          color: '#efe3c8',
          letterSpacing: '0.04em',
          animation: 'curtainMark 1.6s cubic-bezier(.22,1,.36,1) forwards',
        }}
      >
        HairSalonLink
      </div>
      <style>{`
        @keyframes curtainMark {
          0%   { opacity: 0; letter-spacing: 0.22em; transform: translateY(8px); }
          40%  { opacity: 1; }
          100% { opacity: 1; letter-spacing: 0.04em; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
