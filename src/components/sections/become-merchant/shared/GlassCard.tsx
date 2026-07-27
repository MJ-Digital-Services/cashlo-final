'use client';

import * as React from 'react';
import { cn } from './tokens';

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_8px_30px_-12px_rgba(11,16,32,0.12)] backdrop-blur-xl',
        'dark:border-white/10 dark:bg-white/[0.04]',
        hover &&
          'transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-[#3F5EF7]/30 hover:shadow-[0_24px_60px_-20px_rgba(63,94,247,0.35)]',
        className,
      )}
    >
      {/* glass reflection */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-white/70 to-transparent dark:from-white/10"
      />
      {children}
    </div>
  );
}