'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';
type Toast = {
  id: string;
  variant: ToastVariant;
  message: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
};
type ToastInput = Omit<Toast, 'id'>;

type ToastContextValue = {
  toast: (t: ToastInput) => void;
  success: (message: string, opts?: Partial<ToastInput>) => void;
  error: (message: string, opts?: Partial<ToastInput>) => void;
  warning: (message: string, opts?: Partial<ToastInput>) => void;
  info: (message: string, opts?: Partial<ToastInput>) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <Toaster>');
  return ctx;
}

export default function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((t: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...t, id, duration: t.duration ?? 4500 }].slice(-5));
    if ((t.duration ?? 4500) > 0) {
      setTimeout(() => dismiss(id), t.duration ?? 4500);
    }
  }, [dismiss]);

  const success = useCallback((message: string, opts?: Partial<ToastInput>) => toast({ variant: 'success', message, ...opts }), [toast]);
  const error = useCallback((message: string, opts?: Partial<ToastInput>) => toast({ variant: 'error', message, ...opts }), [toast]);
  const warning = useCallback((message: string, opts?: Partial<ToastInput>) => toast({ variant: 'warning', message, ...opts }), [toast]);
  const info = useCallback((message: string, opts?: Partial<ToastInput>) => toast({ variant: 'info', message, ...opts }), [toast]);

  const value: ToastContextValue = { toast, success, error, warning, info, dismiss };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

const VARIANT_CONFIG: Record<ToastVariant, {
  bg: string; border: string; iconBg: string; iconColor: string; icon: React.ComponentType<{ className?: string }>;
}> = {
  success: { bg: '#ffffff', border: '#d1fae5', iconBg: '#dcfce7', iconColor: '#16a34a', icon: CheckCircle2 },
  error:   { bg: '#ffffff', border: '#fecaca', iconBg: '#fee2e2', iconColor: '#dc2626', icon: XCircle },
  warning: { bg: '#ffffff', border: '#fde68a', iconBg: '#fef3c7', iconColor: '#d97706', icon: AlertCircle },
  info:    { bg: '#ffffff', border: '#bae6fd', iconBg: '#e0f2fe', iconColor: '#0284c7', icon: Info },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const cfg = VARIANT_CONFIG[toast.variant];
  const Icon = cfg.icon;
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3 p-3.5 pr-9 min-w-[280px] max-w-[420px] rounded-xl
        transition-all duration-300
        ${entering ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'}
      `}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        boxShadow: 'var(--shadow-xl)',
      }}
      role="status"
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.iconBg, color: cfg.iconColor }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-stone-900 leading-snug">{toast.message}</div>
        {toast.description && (
          <div className="text-[11.5px] text-stone-500 mt-0.5 leading-relaxed">{toast.description}</div>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="mt-2 inline-flex items-center text-[11.5px] font-medium text-stone-900 underline underline-offset-2 hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-2.5 right-2 text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-md"
        aria-label="閉じる"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
