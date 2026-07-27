'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { EASE } from './shared/tokens';
import LeadForm, { type FormKind } from './LeadForm';

export default function LeadModal({
  open,
  kind,
  onClose,
}: {
  open: boolean;
  kind: FormKind;
  onClose: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('input, select, button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0B1020]/55 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/60 bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8 dark:border-white/10 dark:bg-[#101733]"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:hover:bg-white/10"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <h2
              id="lead-modal-title"
              className="pr-10 text-2xl font-extrabold tracking-tight text-[#0B1020] dark:text-white"
            >
              {kind === 'sales' ? 'Talk to a sales executive' : 'Find your nearest distributor'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {kind === 'sales'
                ? 'Share your details and we will call you back, usually within 30 minutes.'
                : 'Enter your PIN code and we will connect you to the Cashlo distributor closest to your shop.'}
            </p>
            <div className="mt-6">
              <LeadForm kind={kind} compact />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}