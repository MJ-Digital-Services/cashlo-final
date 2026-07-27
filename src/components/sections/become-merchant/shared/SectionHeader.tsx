'use client';

import * as React from 'react';
import { Reveal } from './motion';
import { cn } from './tokens';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
}) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-[#3F5EF7]/15 bg-[#F5F8FF] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#3F5EF7] dark:border-white/10 dark:bg-white/5">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0B1020] sm:text-4xl lg:text-[2.75rem] dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}