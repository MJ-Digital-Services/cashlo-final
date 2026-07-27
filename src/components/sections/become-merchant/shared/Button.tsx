'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from './tokens';

type Ripple = { id: number; x: number; y: number };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'onDark';
  size?: 'md' | 'lg';
  icon?: React.ReactNode;
};

const buttonBase =
  'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight transition-[transform,box-shadow,background-color,color] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0B1020] disabled:cursor-not-allowed disabled:opacity-60';

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#3F5EF7] text-white shadow-[0_10px_30px_-10px_rgba(63,94,247,0.7)] hover:bg-[#2A43D6] hover:shadow-[0_16px_40px_-12px_rgba(63,94,247,0.75)]',
  secondary:
    'border border-slate-200 bg-white text-[#0B1020] hover:border-[#3F5EF7]/40 hover:text-[#3F5EF7] dark:border-white/15 dark:bg-white/[0.06] dark:text-white',
  ghost:
    'text-[#0B1020] hover:bg-[#F5F8FF] dark:text-white dark:hover:bg-white/10',
  onDark:
    'bg-white text-[#1B2A8A] hover:bg-[#F5F8FF] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', icon, className, children, onClick, ...rest },
    ref,
  ) {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const reduce = useReducedMotion();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!reduce) {
        const rect = e.currentTarget.getBoundingClientRect();
        const id = Date.now();
        setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        window.setTimeout(() => setRipples((r) => r.filter((d) => d.id !== id)), 600);
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          buttonBase,
          buttonVariants[variant],
          size === 'lg' ? 'h-14 px-8 text-base' : 'h-12 px-6 text-[15px]',
          className,
        )}
        {...rest}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute h-4 w-4 animate-[ripple_600ms_ease-out] rounded-full bg-current opacity-25"
            style={{ left: r.x - 8, top: r.y - 8 }}
          />
        ))}
        {icon && (
          <span className="transition-transform duration-200 group-hover:-rotate-6">{icon}</span>
        )}
        <span className="relative">{children}</span>
      </button>
    );
  },
);