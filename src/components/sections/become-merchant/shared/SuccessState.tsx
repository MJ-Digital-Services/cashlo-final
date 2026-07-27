'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { EASE } from './tokens';
import { Button } from './Button';

export function SuccessState({
  title,
  message,
  onReset,
  resetLabel = 'Send another request',
}: {
  title: string;
  message: string;
  onReset: () => void;
  resetLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex flex-col items-center justify-center gap-4 py-10 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#12B76A]/12 text-[#12B76A]"
      >
        <Check className="h-8 w-8" strokeWidth={3} aria-hidden />
      </motion.span>
      <h3 className="text-xl font-bold tracking-tight text-[#0B1020] dark:text-white">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {message}
      </p>
      <Button variant="secondary" onClick={onReset} className="mt-2">
        {resetLabel}
      </Button>
    </motion.div>
  );
}