import Link from 'next/link';

/**
 * 空状態表示
 * - icon: lucide アイコンなど
 * - title / description: 主要コピー
 * - action: 主要 CTA (任意)
 * - secondaryAction: 補助 CTA (任意)
 */
export default function EmptyState({
  icon, title, description, action, secondaryAction, tone = 'neutral',
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string } | { label: string; onClick: () => void };
  secondaryAction?: { label: string; href: string };
  tone?: 'neutral' | 'brand' | 'warning';
}) {
  const palette = {
    neutral: { bg: 'var(--surface-muted)', iconBg: 'var(--surface)', iconColor: 'var(--fg-subtle)' },
    brand:   { bg: 'var(--accent-surface)', iconBg: 'var(--surface)', iconColor: 'var(--accent)' },
    warning: { bg: 'var(--warning-surface)', iconBg: 'var(--surface)', iconColor: 'var(--warning)' },
  }[tone];

  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {icon && (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border"
          style={{ background: palette.iconBg, color: palette.iconColor, borderColor: 'var(--line)' }}
        >
          {icon}
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-stone-900" style={{ letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      {description && (
        <p className="text-[13px] text-stone-500 leading-relaxed mt-2 max-w-sm">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {action && (
            'href' in action ? (
              <Link href={action.href} className="btn-brand">{action.label}</Link>
            ) : (
              <button type="button" onClick={action.onClick} className="btn-brand">{action.label}</button>
            )
          )}
          {secondaryAction && (
            <Link href={secondaryAction.href} className="btn-outline">{secondaryAction.label}</Link>
          )}
        </div>
      )}
    </div>
  );
}
