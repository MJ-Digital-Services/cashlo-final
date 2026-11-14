'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/Dialog';
import { Button } from './Button';

/*
 * Confirmation dialog shown after a lead is sent. Lives in a provider (not
 * inside the form) because the form usually sits in LeadModal, which closes
 * — and unmounts the form — the moment the lead goes through.
 */

export type LeadSuccess = {
  title: string;
  message: string;
  /** "What happens next", in order. */
  steps: { title: string; body: string }[];
};

const LeadSuccessContext = React.createContext<(success: LeadSuccess) => void>(() => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('useLeadSuccess() used outside <LeadSuccessProvider>; no confirmation shown.');
  }
});

export const useLeadSuccess = () => React.useContext(LeadSuccessContext);

export function LeadSuccessProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  // kept after closing so the content doesn't vanish mid close-animation
  const [success, setSuccess] = React.useState<LeadSuccess | null>(null);

  const show = React.useCallback((next: LeadSuccess) => {
    setSuccess(next);
    setOpen(true);
  }, []);

  return (
    <LeadSuccessContext.Provider value={show}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-white/60 bg-white p-7 text-center shadow-2xl outline-none transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 sm:p-9 dark:border-white/10 dark:bg-[#101733]">
          {success && <SuccessBody key={success.title + success.message} success={success} />}
        </DialogContent>
      </Dialog>
    </LeadSuccessContext.Provider>
  );
}

function SuccessBody({ success }: { success: LeadSuccess }) {
  const reduce = useReducedMotion();

  return (
    <>
      {/* soft green glow behind the badge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(18,183,106,0.16),transparent)]"
      />

      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        {!reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#12B76A]/20"
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.25 }}
          />
        )}
        <motion.span
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#12B76A] text-white shadow-[0_12px_30px_-10px_rgba(18,183,106,0.8)]"
          initial={reduce ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.1 }}
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden>
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.35 }}
            />
          </svg>
        </motion.span>
      </div>

      <DialogTitle className="relative mt-6 text-2xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
        {success.title}
      </DialogTitle>
      <DialogDescription className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {success.message}
      </DialogDescription>

      {success.steps.length > 0 && (
        <div className="relative mt-7 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-left dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            What happens next
          </p>
          <ol className="mt-4 space-y-4">
            {success.steps.map((step, i) => (
              <motion.li
                key={step.title}
                className="flex gap-3"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.45 + i * 0.1 }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3F5EF7]/10 text-xs font-bold text-[#3F5EF7] dark:bg-[#3F5EF7]/20 dark:text-[#9DB0FF]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#0B1020] dark:text-white">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      )}

      <DialogClose
        render={<Button size="lg" icon={<Check className="h-4 w-4" strokeWidth={3} aria-hidden />} className="relative mt-7 w-full" />}
      >
        Done
      </DialogClose>
    </>
  );
}
