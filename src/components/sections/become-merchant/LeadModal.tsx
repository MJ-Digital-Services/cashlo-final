'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/Dialog';
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
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        // bottom sheet on phones, centred card from sm up
        viewportClassName="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
        // The rounded panel clips (overflow-hidden) and an inner wrapper
        // scrolls: when the panel itself scrolled, the browser drew the
        // scrollbar inside it and squared off the right-hand corners.
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/60 bg-white shadow-2xl outline-none transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[ending-style]:translate-y-6 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:translate-y-10 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 sm:rounded-3xl dark:border-white/10 dark:bg-[#101733]"
      >
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8">
        <DialogClose
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:hover:bg-white/10"
        >
          <X className="h-5 w-5" aria-hidden />
        </DialogClose>
        <DialogTitle className="pr-10 text-2xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
          {kind === 'sales' ? 'Talk to a sales executive' : 'Find your nearest distributor'}
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {kind === 'sales'
            ? 'Share your details and we will call you back, usually within 30 minutes.'
            : 'Enter your PIN code and we will connect you to the Cashlo distributor closest to your shop.'}
        </DialogDescription>
        <div className="mt-6">
          <LeadForm kind={kind} compact onSuccess={onClose} />
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
