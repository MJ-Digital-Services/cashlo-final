'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, X } from 'lucide-react';
import { cn, EASE } from './tokens';

type ToastItem = { id: number; title: string; body?: string; tone: 'success' | 'error' };

const ToastContext = React.createContext<(t: Omit<ToastItem, 'id'>) => void>(() => {});

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[120] flex flex-col items-center gap-2.5 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end sm:px-0"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-[0_28px_60px_-24px_rgba(11,16,32,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-[#141C3D]/95"
            >
              <span
                className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
                  t.tone === 'success' ? 'bg-[#12B76A]/12 text-[#0E9F5E]' : 'bg-rose-500/10 text-rose-600',
                )}
              >
                {t.tone === 'success' ? (
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                ) : (
                  <AlertCircle className="h-4 w-4" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                  {t.title}
                </span>
                {t.body && (
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {t.body}
                  </span>
                )}
              </span>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                aria-label="Dismiss notification"
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}