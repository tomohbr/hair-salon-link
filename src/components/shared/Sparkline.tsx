// 軽量な SVG スパークライン
export default function Sparkline({ data, height = 32, color }: { data: number[]; height?: number; color?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(1, ...data);
  const min = Math.min(0, ...data);
  const w = 100;
  const h = height;
  const range = Math.max(1, max - min);
  const step = w / Math.max(1, data.length - 1);

  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return { x, y };
  });

  const path = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const fillPath = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg className="sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={color ? { '--accent': color } as React.CSSProperties : undefined}>
      <path d={fillPath} className="sparkline-fill" />
      <path d={path} />
    </svg>
  );
}
