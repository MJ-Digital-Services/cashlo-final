'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from './tokens';

const fieldShell =
  'peer h-14 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 pt-5 text-[15px] text-[#0B1020] outline-none transition-colors duration-200 placeholder:text-transparent focus:border-[#3F5EF7] dark:border-white/12 dark:bg-white/[0.05] dark:text-white';

/**
 * Label sits in the floated position by default; `peer-placeholder-shown`
 * drops it back into the field when it's empty. Tailwind emits
 * placeholder-shown before focus, so the focus styles always win.
 */
const labelShell = [
  'pointer-events-none absolute left-4 top-1.5 origin-left text-[11px] font-semibold text-slate-500 transition-all duration-200 dark:text-slate-400',
  'peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-placeholder-shown:font-normal',
  'peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[#3F5EF7]',
].join(' ');

export function Field({
  id,
  label,
  error,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; id: string }) {
  return (
    <div className={cn('relative', className)}>
      <input
        id={id}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldShell, error && 'border-rose-400 focus:border-rose-500')}
        {...rest}
      />
      <label htmlFor={id} className={labelShell}>
        {label}
      </label>
      {/* animated focus underline */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#3F5EF7] transition-all duration-300 peer-focus:w-[92%]"
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}