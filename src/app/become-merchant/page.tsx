'use client';

/**
 * Become a Cashlo Merchant
 * app/become-merchant/page.tsx
 *
 * Single-file production page. Next.js App Router + TypeScript + Tailwind
 * + Framer Motion + Lucide React. Navbar and footer come from your existing
 * layout and are untouched.
 *
 * Forms POST to /api/leads (route handler included separately).
 *
 * Contents:
 *   1. Design tokens, motion primitives, buttons, dropdown, toasts, fields
 *   2. Hero — cinematic merchant story banner, then centred copy
 *   3. Quick action cards, lead modal, sales + distributor forms
 *   4. Why join, benefits bento, who can join
 *   5. Interactive earnings calculator
 *   6. How it works, dashboard showcase, why merchants stay
 *   7. Testimonial carousel, FAQ accordion
 *   8. Final CTA, registration form, sticky mobile CTA
 *   9. Page composition (default export)
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import {
  AlertCircle, ArrowRight, ArrowUpRight, BadgeCheck, Banknote, BarChart3, BookText,
  Building2, Check, ChevronDown, ChevronLeft, ChevronRight, Clock4, Cookie, CreditCard,
  Download, Drill, FileCheck2, Handshake, Headphones, Headset, HeartPulse, IndianRupee,
  Landmark, Lightbulb, Loader2, Lock, MapPin, Milk, Minus, Monitor, PencilRuler,
  PhoneCall, Plus, QrCode, Quote, ScanFace, Search, ShieldCheck, ShoppingBasket,
  Smartphone, Sparkles, Star, Store, Timer, TrendingUp, UserPlus, Users, Wallet, X, Zap,
} from 'lucide-react';

/* ==================================================================
   1. Design tokens, motion primitives, buttons, form fields
   ================================================================== */
/**
 * Shared design primitives for the "Become a Cashlo Merchant" page.
 * Every color / radius / spacing value here mirrors the existing Cashlo site
 * so the page drops in without a visual seam.
 */


/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

const BRAND = {
  primary: '#3F5EF7',
  primaryDeep: '#2A43D6',
  primaryInk: '#1B2A8A',
  soft: '#E8EDFF',
  veryLight: '#F5F8FF',
  gray: '#EEF1F6',
  ink: '#0B1020',
  money: '#12B76A',
} as const;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/** Indian currency formatting: ₹1,24,500 */
function inr(value: number) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

/* ------------------------------------------------------------------ */
/* Motion primitives                                                   */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article';
};

/** Scroll-reveal wrapper that quietly disables itself for reduced-motion users. */
function Reveal({ children, delay = 0, y = 24, className, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Staggered list container — pair with <StaggerItem>. */
function StaggerGroup({
  children,
  className,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? undefined : stagger}
      initial={reduce ? undefined : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={reduce ? undefined : fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Count-up hook                                                       */
/* ------------------------------------------------------------------ */

/**
 * Animates from whatever is currently on screen to `target`. Deliberately not
 * gated on visibility, so it can never get stuck at a stale value — this drives
 * the earnings calculator, which has to read true at all times.
 */
function useAnimatedNumber(target: number, duration = 650) {
  const reduce = useReducedMotion();
  const [value, setValue] = React.useState(target);
  const fromRef = React.useRef(target);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (reduce) {
      fromRef.current = target;
      setValue(target);
      return;
    }
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = p < 1 ? from + (target - from) * eased : target;
      fromRef.current = next;
      setValue(next);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, reduce]);

  return value;
}

/** True once the element has been seen; falls back to true where IntersectionObserver is missing. */
function useSeen(ref: React.RefObject<Element>, margin = '-60px') {
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return seen;
}

/** Counts up the first time it scrolls into view. */
function CountUp({
  to,
  format = (n: number) => Math.round(n).toLocaleString('en-IN'),
  className,
}: {
  to: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref);
  const value = useAnimatedNumber(seen ? to : 0, 1100);
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section chrome                                                      */
/* ------------------------------------------------------------------ */

function SectionHeader({
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

/* ------------------------------------------------------------------ */
/* Glass surface                                                       */
/* ------------------------------------------------------------------ */

function GlassCard({
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

/* ------------------------------------------------------------------ */
/* Button with ripple                                                  */
/* ------------------------------------------------------------------ */

type Ripple = { id: number; x: number; y: number };

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */

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

function Field({
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

/* ---------------- Searchable dropdown ----------------
   Trigger button + filterable listbox. Typing narrows the list, arrows move
   the highlight, Enter commits, Escape closes and returns focus to the trigger. */

function Dropdown({
  id,
  label,
  options,
  value,
  onChange,
  onBlur,
  error,
  className,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [highlight, setHighlight] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const close = React.useCallback(
    (focusTrigger = true) => {
      setOpen(false);
      onBlur?.();
      if (focusTrigger) triggerRef.current?.focus();
    },
    [onBlur],
  );

  // reset the search each time it opens, and start on the current selection
  React.useEffect(() => {
    if (!open) return;
    setQuery('');
    setHighlight(Math.max(0, options.indexOf(value)));
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open, options, value]);

  React.useEffect(() => {
    if (open) listRef.current?.children[highlight]?.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  React.useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', onDocPointer);
    return () => document.removeEventListener('mousedown', onDocPointer);
  }, [open, onBlur]);

  const commit = (option: string) => {
    onChange(option);
    close();
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab') {
      setOpen(false);
      onBlur?.();
      return;
    }
    if (filtered.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? highlight + 1 : highlight - 1;
      setHighlight((next + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit(filtered[highlight]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setHighlight(filtered.length - 1);
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  const floated = Boolean(value) || open;

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'flex h-14 w-full items-center justify-between gap-2 rounded-2xl border bg-white/80 px-4 pt-5 text-left text-[15px] outline-none transition-colors duration-200 focus-visible:border-[#3F5EF7] focus-visible:ring-2 focus-visible:ring-[#3F5EF7]/25 dark:bg-white/[0.05]',
          error ? 'border-rose-400' : 'border-slate-200 dark:border-white/12',
          open && !error && 'border-[#3F5EF7]',
        )}
      >
        <span className="truncate text-[#0B1020] dark:text-white">{value}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: EASE }}>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        </motion.span>
      </button>

      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-4 transition-all duration-200',
          floated
            ? 'top-1.5 text-[11px] font-semibold text-[#3F5EF7]'
            : 'top-4 text-[15px] text-slate-500 dark:text-slate-400',
        )}
      >
        {label}
      </label>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_60px_-24px_rgba(11,16,32,0.45)] dark:border-white/10 dark:bg-[#141C3D]"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 px-3.5 py-2.5 dark:border-white/10">
              <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded
                aria-controls={`${id}-listbox`}
                aria-autocomplete="list"
                aria-activedescendant={filtered[highlight] ? `${id}-option-${highlight}` : undefined}
                aria-label={`Search ${label.toLowerCase()}`}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlight(0);
                }}
                onKeyDown={onListKeyDown}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="w-full bg-transparent text-sm text-[#0B1020] outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <ul
              ref={listRef}
              id={`${id}-listbox`}
              role="listbox"
              aria-label={label}
              className="max-h-56 overflow-y-auto p-1.5"
            >
              {filtered.length === 0 && (
                <li className="px-3.5 py-3 text-sm text-slate-500">No matches for “{query}”</li>
              )}
              {filtered.map((option, i) => {
                const selected = option === value;
                return (
                  <li
                    key={option}
                    id={`${id}-option-${i}`}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => commit(option)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-100',
                      i === highlight
                        ? 'bg-[#F5F8FF] text-[#1B2A8A] dark:bg-white/10 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300',
                      selected && 'font-semibold',
                    )}
                  >
                    <span className="truncate">{option}</span>
                    {selected && <Check className="h-4 w-4 shrink-0 text-[#3F5EF7]" aria-hidden />}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------- Toasts ---------------- */

type ToastItem = { id: number; title: string; body?: string; tone: 'success' | 'error' };

const ToastContext = React.createContext<(t: Omit<ToastItem, 'id'>) => void>(() => {});

function useToast() {
  return React.useContext(ToastContext);
}

function ToastProvider({ children }: { children: React.ReactNode }) {
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

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

type FormErrors = Record<string, string>;

const validators = {
  required: (v: string, label: string) => (v.trim() ? '' : `${label} is required`),
  mobile: (v: string) =>
    /^[6-9]\d{9}$/.test(v.trim()) ? '' : 'Enter a valid 10-digit mobile number',
  email: (v: string) =>
    !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address',
  pin: (v: string) => (/^[1-9]\d{5}$/.test(v.trim()) ? '' : 'Enter a valid 6-digit PIN code'),
};

/* ------------------------------------------------------------------ */
/* Success state                                                       */
/* ------------------------------------------------------------------ */

function SuccessState({
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

/* ------------------------------------------------------------------ */
/* Shared data                                                         */
/* ------------------------------------------------------------------ */

const INDIAN_STATES = [
  // 28 states
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // 8 union territories
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const BUSINESS_TYPES = [
  'Kirana Store', 'Medical Store', 'Mobile Shop', 'CSC Centre', 'Jan Seva Kendra',
  'General Store', 'Electronics Shop', 'Dairy & Dairy Booth', 'Stationery Shop', 'Cosmetic Shop',
  'Hardware Shop', 'Clothing Store', 'Restaurant / Cafe', 'Sweet Shop', 'Bakery', 'Petrol Pump',
  'Other',
];

/* ==================================================================
   2. Hero
   ================================================================== */

/* ---------------- Hero ---------------- */

const HERO_FEATURES = [
  { icon: BadgeCheck, label: 'Easy KYC' },
  { icon: ShieldCheck, label: 'Secure platform' },
  { icon: Timer, label: 'Fast approval' },
  { icon: IndianRupee, label: 'Daily earnings' },
];

function Hero({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  return (
    <section className="relative bg-white px-5 pb-16 pt-16 sm:px-8 lg:pb-20 lg:pt-20 dark:bg-[#0B1020]" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal delay={0.05}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#3F5EF7]/15 bg-[#F5F8FF] px-3.5 py-1.5 text-xs font-semibold text-[#3F5EF7] dark:border-white/10 dark:bg-white/5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3F5EF7]/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3F5EF7]" />
              </span>
              Become a Cashlo Merchant
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1
              id="hero-heading"
              className="mt-4 text-[1.8rem] font-extrabold leading-[1.12] tracking-tight text-[#0B1020] sm:text-[2.35rem] lg:text-[2.75rem] dark:text-white"
            >
              Turn your shop into <span className="text-[#3F5EF7]">a smart business hub</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] font-semibold leading-snug text-[#1B2A8A] sm:text-base dark:text-[#B9C6FF]">
              Accept UPI payments, give cash withdrawals, offer financial services and earn more
              every day.
            </p>
            <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px] dark:text-slate-300">
              Cashlo turns every retail shop into a complete Digital Financial Service Centre, so
              you can serve your neighbourhood with more services and earn commission on each one.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={onBecomeMerchant} icon={<ArrowRight className="h-4 w-4" />}>
                Become a merchant
              </Button>
              <Button
                size="lg"
                variant="secondary"
                icon={<Download className="h-4 w-4" />}
                onClick={() => document.getElementById('download-app')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Download app
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {HERO_FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300"
                >
                  <Icon className="h-3.5 w-3.5 text-[#12B76A]" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   3. Quick action cards, lead modal, sales + distributor forms
   ================================================================== */
/* ------------------------------------------------------------------ */
/* Submission                                                          */
/* ------------------------------------------------------------------ */

type LeadPayload = Record<string, unknown>;

/** Posts to /api/leads. Swap the endpoint for your CRM webhook. */
async function submitLead(payload: LeadPayload) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Could not send your request');
  return res.json().catch(() => ({}));
}

/* ------------------------------------------------------------------ */
/* Lead form (shared by sales / distributor / modal)                   */
/* ------------------------------------------------------------------ */

type FormKind = 'sales' | 'distributor';

const FORM_CONFIG = {
  sales: {
    formType: 'contact-sales',
    submitLabel: 'Request callback',
    successTitle: 'Callback requested',
    successMessage:
      'A Cashlo sales executive will call you on the number you shared, usually within 30 minutes during business hours.',
    toastBody: 'We will call you within 30 minutes.',
  },
  distributor: {
    formType: 'contact-distributor',
    submitLabel: 'Connect now',
    successTitle: 'Distributor matched',
    successMessage:
      'We are locating the nearest Cashlo distributor for your PIN code. You will get their details on WhatsApp shortly.',
    toastBody: 'Distributor details are on the way.',
  },
} as const;

function LeadForm({ kind, compact = false }: { kind: FormKind; compact?: boolean }) {
  const config = FORM_CONFIG[kind];
  const [values, setValues] = React.useState<Record<string, string>>({
    fullName: '',
    mobile: '',
    email: '',
    shopName: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const notify = useToast();

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((err) => (err[key] ? { ...err, [key]: '' } : err));
  };

  const validate = () => {
    const next: FormErrors = {
      fullName: validators.required(values.fullName, 'Full name'),
      mobile: validators.mobile(values.mobile),
      email: validators.email(values.email),
      shopName: validators.required(values.shopName, 'Shop name'),
    };
    if (kind === 'sales') {
      next.city = validators.required(values.city, 'City');
      next.state = validators.required(values.state, 'State');
    } else {
      next.pincode = validators.pin(values.pincode);
    }
    const cleaned = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    setErrors(cleaned);
    return Object.keys(cleaned).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      await submitLead({ ...values, formType: config.formType });
      setStatus('done');
      notify({ tone: 'success', title: config.successTitle, body: config.toastBody });
    } catch {
      setStatus('error');
      notify({ tone: 'error', title: 'Could not send your request', body: 'Please try again in a moment.' });
    }
  };

  const reset = () => {
    setValues({
      fullName: '', mobile: '', email: '', shopName: '', city: '', state: '', pincode: '',
    });
    setErrors({});
    setStatus('idle');
  };

  if (status === 'done') {
    return (
      <SuccessState
        title={config.successTitle}
        message={config.successMessage}
        onReset={reset}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
        <Field
          id={`${kind}-name`}
          label="Full name"
          autoComplete="name"
          value={values.fullName}
          onChange={set('fullName')}
          error={errors.fullName}
        />
        <Field
          id={`${kind}-mobile`}
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          value={values.mobile}
          onChange={set('mobile')}
          error={errors.mobile}
        />
      </div>
      <Field
        id={`${kind}-email`}
        label="Email address (optional)"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={set('email')}
        error={errors.email}
      />
      <Field
        id={`${kind}-shop`}
        label="Shop name"
        autoComplete="organization"
        value={values.shopName}
        onChange={set('shopName')}
        error={errors.shopName}
      />

      {kind === 'sales' ? (
        <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
          <Field
            id="sales-city"
            label="City"
            autoComplete="address-level2"
            value={values.city}
            onChange={set('city')}
            error={errors.city}
          />
          <Dropdown
            id="sales-state"
            label="State"
            options={INDIAN_STATES}
            value={values.state}
            onChange={(state) => {
              setValues((v) => ({ ...v, state }));
              setErrors((err) => (err.state ? { ...err, state: '' } : err));
            }}
            error={errors.state}
          />
        </div>
      ) : (
        <Field
          id="distributor-pin"
          label="PIN code"
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          value={values.pincode}
          onChange={set('pincode')}
          error={errors.pincode}
        />
      )}

      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          We could not send your request. Check your connection and try again, or call 1800-000-000.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === 'sending'} className="w-full">
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending
          </>
        ) : (
          config.submitLabel
        )}
      </Button>
      <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        By submitting you agree to be contacted by Cashlo about merchant onboarding.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

function LeadModal({
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

/* ------------------------------------------------------------------ */
/* Quick action cards                                                  */
/* ------------------------------------------------------------------ */

function QuickActions({
  onContactSales,
  onContactDistributor,
}: {
  onContactSales: () => void;
  onContactDistributor: () => void;
}) {
  return (
    <section className="relative px-5 pb-16 sm:px-8" aria-label="Quick actions">
      <StaggerGroup className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        <StaggerItem>
          <GlassCard className="group h-full p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3F5EF7]/10 text-[#3F5EF7] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
              <Headset className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
              Talk to a sales person
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Leave your number and get a callback within 30 minutes. We will walk you through
              services, commission and paperwork.
            </p>
            <Button className="mt-6 w-full" onClick={onContactSales} icon={<PhoneCall className="h-4 w-4" />}>
              Request a call
            </Button>
          </GlassCard>
        </StaggerItem>

        <StaggerItem>
          <GlassCard className="group h-full p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#12B76A]/12 text-[#0E9F5E] transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-110">
              <Handshake className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
              Contact a distributor
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Prefer help in person? Find the Cashlo distributor nearest to your shop for onboarding
              and day-to-day support.
            </p>
            <Button
              variant="secondary"
              className="mt-6 w-full"
              onClick={onContactDistributor}
              icon={<MapPin className="h-4 w-4" />}
            >
              Connect distributor
            </Button>
          </GlassCard>
        </StaggerItem>

        <StaggerItem>
          <GlassCard className="group h-full p-7">
            <div id="download-app" className="scroll-mt-28">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3F5EF7]/10 text-[#3F5EF7] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Download className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
                Download the Cashlo app
              </h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/10">
                  <QrCode className="h-16 w-16 text-[#0B1020]" strokeWidth={1.2} aria-hidden />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-1 font-semibold text-[#0B1020] dark:text-white">
                    4.6
                    <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" aria-hidden />
                  </p>
                  <p className="text-xs">Scan to install on Android</p>
                </div>
              </div>
              <a
                href="https://play.google.com/store"
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B1020] text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2"
              >
                <Download className="h-4 w-4" aria-hidden />
                Get it on Google Play
              </a>
            </div>
          </GlassCard>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}

/* ---------------- Side-by-side lead section ----------------
   Highest-intent section on the page, so it carries the most visual
   weight: tinted glass, a live blur behind each card, and a lift on hover.
   Sales reads blue, distributor reads green. */

const LEAD_ACCENT = {
  blue: {
    ring: 'hover:border-[#3F5EF7]/45',
    glow: 'hover:shadow-[0_40px_90px_-32px_rgba(63,94,247,0.55)]',
    surface: 'from-[#F7F9FF] via-white to-[#EEF3FF] dark:from-[#141C3D] dark:via-[#101733] dark:to-[#141C3D]',
    blob: 'bg-[#3F5EF7]/25',
    chip: 'bg-[#3F5EF7]/10 text-[#3F5EF7]',
    rule: 'from-[#3F5EF7] to-[#8AA1FF]',
  },
  green: {
    ring: 'hover:border-[#12B76A]/45',
    glow: 'hover:shadow-[0_40px_90px_-32px_rgba(18,183,106,0.45)]',
    surface: 'from-[#F5FCF8] via-white to-[#ECFAF3] dark:from-[#0F2A20] dark:via-[#101733] dark:to-[#0F2A20]',
    blob: 'bg-[#12B76A]/22',
    chip: 'bg-[#12B76A]/12 text-[#0E9F5E]',
    rule: 'from-[#12B76A] to-[#5EE9A8]',
  },
} as const;

function LeadCard({
  accent,
  chip,
  chipIcon,
  title,
  note,
  children,
  delay = 0,
}: {
  accent: keyof typeof LEAD_ACCENT;
  chip: string;
  chipIcon: React.ReactNode;
  title: string;
  note: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const a = LEAD_ACCENT[accent];

  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={cn(
          'group relative h-full overflow-hidden rounded-[1.75rem] border border-white/70 bg-gradient-to-br backdrop-blur-xl',
          'shadow-[0_24px_60px_-30px_rgba(11,16,32,0.35)] transition-all duration-500',
          'hover:-translate-y-2 dark:border-white/10',
          a.surface,
          a.ring,
          a.glow,
        )}
      >
        {/* top rule — the only piece of pure colour on the card */}
        <span className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', a.rule)} />

        {/* slow ambient blur, brightens on hover */}
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { x: [0, 26, 0], y: [0, -18, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className={cn(
            'pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-[70px] transition-opacity duration-500 group-hover:opacity-100',
            a.blob,
          )}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent dark:from-white/[0.06]"
        />

        <div className="relative p-8 sm:p-10 lg:p-11">
          <span className={cn('inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-tight', a.chip)}>
            {chipIcon}
            {chip}
          </span>
          <h3 className="mt-5 text-[1.75rem] font-extrabold leading-tight tracking-tight text-[#0B1020] sm:text-3xl dark:text-white">
            {title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{note}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </Reveal>
  );
}

function LeadSection() {
  return (
    <section
      id="lead-forms"
      className="relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 lg:py-28"
      aria-labelledby="lead-forms-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-[#F5F8FF] to-white dark:from-[#0B1020] dark:via-[#0E1533] dark:to-[#0B1020]"
      />
      <SectionHeader
        eyebrow="Two ways to start"
        title={<span id="lead-forms-heading">Get a callback, or meet a distributor near you</span>}
        subtitle="Both routes end the same way: your shop live on Cashlo, usually within 48 hours of KYC."
      />

      <div className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 lg:grid-cols-2 lg:gap-7">
        <LeadCard
          accent="blue"
          chip="Contact sales"
          chipIcon={<Headset className="h-3.5 w-3.5" aria-hidden />}
          title="Request a callback"
          note="Average callback time: under 30 minutes, 9 AM to 8 PM."
        >
          <LeadForm kind="sales" />
        </LeadCard>

        <LeadCard
          accent="green"
          chip="Contact distributor"
          chipIcon={<Handshake className="h-3.5 w-3.5" aria-hidden />}
          title="Connect with a distributor"
          note="Get in-person onboarding, training and local support in your language."
          delay={0.1}
        >
          <LeadForm kind="distributor" />
        </LeadCard>
      </div>
    </section>
  );
}

/* ==================================================================
   4. Why join, benefits bento, who can join
   ================================================================== */

/* ------------------------------------------------------------------ */
/* Why join — service cards                                            */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    icon: Banknote,
    title: 'UPI Cash Point',
    description:
      'Customers send you money on UPI and take cash from your counter. Your till becomes the neighbourhood ATM.',
    benefit: 'Earn on every withdrawal',
  },
  {
    icon: Smartphone,
    title: 'Mobile & DTH recharge',
    description:
      'Recharge every operator from one screen, for walk-in customers and regulars who call you.',
    benefit: 'Instant commission per recharge',
  },
  {
    icon: Lightbulb,
    title: 'Bill payments',
    description:
      'Electricity, water, gas, broadband, insurance premiums and FASTag, all paid at your shop.',
    benefit: 'Repeat footfall every month',
  },
  {
    icon: QrCode,
    title: 'Digital QR',
    description:
      'A Cashlo QR at your counter with instant voice confirmation, so you never miss a payment.',
    benefit: 'Zero-cost UPI collection',
  },
  {
    icon: Landmark,
    title: 'Loan marketplace',
    description:
      'Offer personal, business and gold loan options from partner lenders to customers you already know.',
    benefit: 'High-value payouts',
  },
  {
    icon: BookText,
    title: 'Smart Khata',
    description:
      'Replace the paper udhaar book. Track credit, send reminders on WhatsApp, get paid faster.',
    benefit: 'Recover dues on time',
  },
];

function ServiceCard({ service, index }: { service: (typeof SERVICES)[number]; index: number }) {
  const Icon = service.icon;
  return (
    <StaggerItem className="h-full">
      <div className="group relative h-full rounded-3xl bg-gradient-to-br from-[#3F5EF7]/25 via-[#8AA1FF]/10 to-transparent p-[1.5px] transition-transform duration-300 hover:-translate-y-2">
        <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-white p-7 shadow-[0_10px_40px_-24px_rgba(11,16,32,0.35)] transition-shadow duration-300 group-hover:shadow-[0_28px_60px_-24px_rgba(63,94,247,0.45)] dark:bg-[#101733]">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#3F5EF7]/12 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F8FF] text-[#3F5EF7] transition-transform duration-300 group-hover:scale-110 dark:bg-white/[0.06]">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <span className="text-xs font-semibold tabular-nums text-slate-300 dark:text-white/20">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {service.description}
          </p>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#12B76A]/10 px-3 py-1.5 text-xs font-semibold text-[#0E9F5E]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {service.benefit}
          </p>
        </div>
      </div>
    </StaggerItem>
  );
}

function WhyJoin({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  return (
    <section id="services" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="why-join-heading">
      <SectionHeader
        eyebrow="Why join Cashlo"
        title={<span id="why-join-heading">Six services. One counter. One app.</span>}
        subtitle="Every service earns you a commission, and each one gives a customer a reason to walk back into your shop."
      />
      <StaggerGroup className="mx-auto mt-12 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} service={s} index={i} />
        ))}
      </StaggerGroup>
      <Reveal className="mt-10 text-center">
        <Button size="lg" onClick={onBecomeMerchant}>
          Start offering these services
        </Button>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Benefits — bento grid                                               */
/* ------------------------------------------------------------------ */

const BENTO = [
  {
    icon: Wallet,
    title: 'Multiple income sources',
    body: 'Six commission streams running alongside your regular sales, from one login.',
    span: 'sm:col-span-2 lg:col-span-2 lg:row-span-2',
    feature: true,
  },
  { icon: Users, title: 'More footfall', body: 'Services bring new customers to your door.' },
  { icon: TrendingUp, title: 'Earn from regulars', body: 'Monetise the customers you already serve.' },
  {
    icon: Clock4,
    title: 'Fast settlement',
    body: 'Money in your bank account, not stuck in a wallet.',
    span: 'sm:col-span-2',
  },
  { icon: ShieldCheck, title: 'Secure platform', body: 'Encrypted, PIN-protected, audit-ready.' },
  { icon: Building2, title: 'Business growth', body: 'Turn a shop into a service centre.' },
  { icon: Headphones, title: 'Dedicated support', body: 'Help in your language, 7 days a week.' },
  { icon: BarChart3, title: 'Reports & analytics', body: 'See what earns most, day by day.' },
];

function Benefits() {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="benefits-heading">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F5F8FF] via-white to-[#F5F8FF] dark:from-[#0E1533] dark:via-[#0B1020] dark:to-[#0E1533]"
      />
      <SectionHeader
        eyebrow="What you get"
        title={<span id="benefits-heading">Built for the way a shop actually runs</span>}
      />
      <StaggerGroup className="mx-auto mt-12 grid max-w-6xl auto-rows-[minmax(140px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENTO.map((tile) => {
          const Icon = tile.icon;
          return (
            <StaggerItem key={tile.title} className={cn('h-full', tile.span)}>
              <GlassCard
                className={cn(
                  'flex h-full flex-col justify-between p-6',
                  tile.feature && 'bg-gradient-to-br from-[#3F5EF7] to-[#2A43D6] text-white',
                )}
              >
                <span
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-2xl',
                    tile.feature ? 'bg-white/15 text-white' : 'bg-[#3F5EF7]/10 text-[#3F5EF7]',
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className={cn(tile.feature ? 'mt-8' : 'mt-5')}>
                  <h3
                    className={cn(
                      'font-bold tracking-tight',
                      tile.feature
                        ? 'text-2xl text-white'
                        : 'text-base text-[#0B1020] dark:text-white',
                    )}
                  >
                    {tile.title}
                  </h3>
                  <p
                    className={cn(
                      'mt-1.5 text-sm leading-relaxed',
                      tile.feature ? 'text-white/80' : 'text-slate-600 dark:text-slate-300',
                    )}
                  >
                    {tile.body}
                  </p>
                  {tile.feature && (
                    <p className="mt-6 text-sm text-white/70">
                      Merchants running all six services average{' '}
                      <span className="font-bold text-white">
                        <CountUp to={11800} format={(n) => `₹${Math.round(n).toLocaleString('en-IN')}`} />
                      </span>{' '}
                      extra per month.
                    </p>
                  )}
                </div>
              </GlassCard>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Who can join                                                        */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { icon: ShoppingBasket, label: 'Kirana store' },
  { icon: HeartPulse, label: 'Medical store' },
  { icon: Landmark, label: 'CSC centre' },
  { icon: Smartphone, label: 'Mobile shop' },
  { icon: Monitor, label: 'Electronics' },
  { icon: Store, label: 'General store' },
  { icon: Drill, label: 'Hardware' },
  { icon: PencilRuler, label: 'Stationery' },
  { icon: Milk, label: 'Dairy' },
  { icon: Cookie, label: 'Cosmetics' },
  { icon: Building2, label: 'Jan Seva Kendra' },
  { icon: CreditCard, label: 'Retail shop' },
];

function WhoCanJoin() {
  const reduce = useReducedMotion();
  return (
    <section className="px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="who-heading">
      <SectionHeader
        eyebrow="Who can join"
        title={<span id="who-heading">If you have a shop and a smartphone, you qualify</span>}
        subtitle="No new licence, no extra hardware, no minimum turnover. Cashlo works on the counter you already have."
      />
      <StaggerGroup
        amount={0.1}
        className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <StaggerItem key={c.label}>
              <motion.div
                whileHover={reduce ? undefined : { scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group flex h-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition-colors duration-300 hover:border-[#3F5EF7] hover:shadow-[0_18px_40px_-24px_rgba(63,94,247,0.6)] dark:border-white/10 dark:bg-white/[0.04]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F8FF] text-[#3F5EF7] transition-colors duration-300 group-hover:bg-[#3F5EF7] group-hover:text-white dark:bg-white/[0.06]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-sm font-semibold tracking-tight text-[#0B1020] dark:text-white">
                  {c.label}
                </span>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

/* ==================================================================
   5. Interactive earnings calculator
   ================================================================== */

type CalcService = {
  id: string;
  label: string;
  icon: React.ElementType;
  /** average commission the merchant keeps per transaction, in rupees */
  perTxn: number;
  /** typical share of the shop's daily service transactions */
  share: number;
};

const CALC_SERVICES: CalcService[] = [
  { id: 'cash', label: 'UPI Cash Point', icon: Banknote, perTxn: 11, share: 3 },
  { id: 'recharge', label: 'Recharge', icon: Smartphone, perTxn: 6, share: 2.5 },
  { id: 'bills', label: 'Bill payments', icon: Lightbulb, perTxn: 9, share: 2 },
  { id: 'loans', label: 'Loans', icon: Landmark, perTxn: 900, share: 0.06 },
  { id: 'qr', label: 'QR collection', icon: QrCode, perTxn: 2.5, share: 4 },
];

const RAMP = [0.5, 0.68, 0.82, 0.93, 1, 1.08];

/** Pure, so the numbers can be reasoned about (and tested) on their own. */
function computeEarnings(selectedIds: string[], customersPerDay: number) {
  const active = CALC_SERVICES.filter((s) => selectedIds.includes(s.id));
  const shareTotal = active.reduce((sum, s) => sum + s.share, 0);
  const breakdown = active.map((s) => {
    const dailyTxns = shareTotal > 0 ? (customersPerDay * s.share) / shareTotal : 0;
    return { id: s.id, label: s.label, icon: s.icon, dailyTxns, monthly: dailyTxns * s.perTxn * 30 };
  });
  const monthly = breakdown.reduce((sum, b) => sum + b.monthly, 0);
  return { breakdown, monthly, daily: monthly / 30 };
}

function EarningsCalculator({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = React.useState<string[]>(['cash', 'recharge', 'qr']);
  const [customers, setCustomers] = React.useState(40);

  // Recomputed on every change — selecting a chip or dragging the slider
  // updates the headline, the daily figure, the breakdown and the graph at once.
  const { breakdown, monthly, daily } = React.useMemo(
    () => computeEarnings(selected, customers),
    [selected, customers],
  );

  const shownMonthly = useAnimatedNumber(monthly);
  const shownDaily = useAnimatedNumber(daily);
  const peak = Math.max(...RAMP) * monthly;

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  return (
    <section id="earnings" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="earnings-heading">
      <SectionHeader
        eyebrow="Earnings calculator"
        title={<span id="earnings-heading">See what your counter could earn</span>}
        subtitle="Pick the services you want to offer and set how many customers you serve a day. Figures are indicative averages, not a guarantee."
      />

      <div className="mx-auto mt-12 max-w-6xl">
        <GlassCard hover={false} className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
          {/* ---- Controls ---- */}
          <div className="p-7 sm:p-9">
            <fieldset>
              <legend className="text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                Services you will offer
              </legend>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {CALC_SERVICES.map((s) => {
                  const Icon = s.icon;
                  const on = selected.includes(s.id);
                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(s.id)}
                      whileTap={reduce ? undefined : { scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B1020]',
                        on
                          ? 'border-[#3F5EF7] bg-[#3F5EF7] text-white shadow-[0_10px_24px_-12px_rgba(63,94,247,0.8)]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#3F5EF7]/40 hover:text-[#3F5EF7] dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-300',
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {s.label}
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-9">
              <div className="flex items-baseline justify-between">
                <label htmlFor="customers" className="text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                  Service customers per day
                </label>
                <motion.span
                  key={customers}
                  initial={reduce ? false : { scale: 1.25, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="text-2xl font-extrabold tabular-nums text-[#3F5EF7]"
                >
                  {customers}
                </motion.span>
              </div>
              <input
                id="customers"
                type="range"
                min={5}
                max={150}
                step={5}
                value={customers}
                onChange={(e) => setCustomers(Number(e.target.value))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#E8EDFF] accent-[#3F5EF7] dark:bg-white/10"
                aria-describedby="customers-hint"
                aria-valuetext={`${customers} customers per day`}
              />
              <p id="customers-hint" className="mt-2 flex justify-between text-xs text-slate-500">
                <span>5 a day</span>
                <span>150 a day</span>
              </p>
            </div>

            <div className="mt-8 space-y-2.5">
              <AnimatePresence initial={false} mode="popLayout">
                {breakdown.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl bg-[#F5F8FF] px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300"
                  >
                    Select at least one service to see an estimate.
                  </motion.p>
                ) : (
                  breakdown.map((b) => {
                    const Icon = b.icon;
                    return (
                      <motion.div
                        key={b.id}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex items-center justify-between rounded-2xl bg-[#F5F8FF] px-4 py-3 text-sm dark:bg-white/[0.04]"
                      >
                        <span className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                          <Icon className="h-4 w-4 text-[#3F5EF7]" aria-hidden />
                          {b.label}
                          <span className="hidden text-xs text-slate-400 sm:inline">
                            ~{b.dailyTxns.toFixed(0)}/day
                          </span>
                        </span>
                        <span className="font-bold tabular-nums text-[#0B1020] dark:text-white">
                          {inr(b.monthly)}
                          <span className="ml-1 font-medium text-slate-400">/mo</span>
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ---- Result ---- */}
          <div className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-[#1B2A8A] via-[#2A43D6] to-[#3F5EF7] p-7 text-white sm:p-9 lg:rounded-l-none lg:rounded-r-3xl">
            <span aria-hidden className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
              Estimated monthly earnings
            </p>
            <p className="mt-3 text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">
              {inr(shownMonthly)}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
              <TrendingUp className="h-4 w-4" aria-hidden />
              <span className="tabular-nums">{inr(shownDaily)}</span> a day in commission
            </p>

            {/* six-month ramp — columns are full height so the percentage
                heights below actually resolve */}
            <div className="mt-9">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Typical ramp-up, first 6 months
              </p>
              <div
                className="mt-4 flex h-40 items-end gap-2.5"
                role="img"
                aria-label={`Projected monthly earnings reaching ${inr(monthly * 1.08)} by month six`}
              >
                {RAMP.map((r, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col justify-end">
                    <motion.div
                      animate={{ height: peak > 0 ? `${(r * monthly * 100) / peak}%` : '2%' }}
                      initial={false}
                      transition={{ duration: 0.55, ease: EASE, delay: reduce ? 0 : i * 0.04 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-white/25 to-white/80"
                      style={{ minHeight: 6 }}
                    />
                    <span className="mt-2 text-center text-[10px] font-medium text-white/50">
                      M{i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="onDark" size="lg" className="mt-8 w-full" onClick={onBecomeMerchant}>
              Start earning this
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-white/55">
              Estimates use average commission rates across active Cashlo merchants. Actual earnings
              depend on your location, footfall and service mix.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ==================================================================
   6. How it works, dashboard showcase, why merchants stay
   ================================================================== */
/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: Download,
    title: 'Download the app',
    body: 'Install Cashlo from the Play Store on the phone you already use at the shop.',
    meta: '2 minutes',
  },
  {
    icon: UserPlus,
    title: 'Register your shop',
    body: 'Enter your name, shop name and mobile number. Verify with an OTP.',
    meta: '3 minutes',
  },
  {
    icon: ScanFace,
    title: 'Complete KYC',
    body: 'Upload Aadhaar, PAN and a shop photo straight from your camera.',
    meta: '5 minutes',
  },
  {
    icon: FileCheck2,
    title: 'Get verified',
    body: 'Our team checks your documents and activates your merchant account.',
    meta: 'Within 48 hours',
  },
  {
    icon: IndianRupee,
    title: 'Start earning',
    body: 'Print your QR, switch on services and take your first transaction the same day.',
    meta: 'Day one',
  },
];

/**
 * One step. Reports back when it crosses the middle of the viewport so the
 * parent can track which step is current; steps already passed stay lit.
 */
function TimelineStep({
  step,
  index,
  state,
  onEnter,
}: {
  step: (typeof STEPS)[number];
  index: number;
  state: 'past' | 'current' | 'future';
  onEnter: (i: number) => void;
}) {
  const ref = React.useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // Narrow band across the middle of the screen: whichever step is in it, is current.
  const inBand = useInView(ref, { margin: '-45% 0px -45% 0px' });
  const Icon = step.icon;

  React.useEffect(() => {
    if (inBand) onEnter(index);
  }, [inBand, index, onEnter]);

  const lit = state !== 'future';

  return (
    <li ref={ref} className="relative pb-9 pl-[68px] last:pb-0 sm:pl-[76px]">
      <motion.span
        animate={
          reduce
            ? undefined
            : {
                scale: state === 'current' ? 1.06 : 1,
                borderColor: state === 'current' ? 'rgba(63,94,247,0.55)' : 'rgba(255,255,255,0.7)',
              }
        }
        transition={{ duration: 0.45, ease: EASE }}
        className={cn(
          'absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-2xl border bg-white transition-[background-color,color,box-shadow] duration-500 sm:h-16 sm:w-16 dark:bg-[#101733]',
          state === 'current'
            ? 'text-white shadow-[0_18px_40px_-16px_rgba(63,94,247,0.85)]'
            : lit
              ? 'text-[#3F5EF7] shadow-[0_14px_34px_-20px_rgba(63,94,247,0.6)]'
              : 'text-slate-300 shadow-none dark:text-white/25',
        )}
      >
        {/* the fill is a layer, so the icon colour can cross-fade cleanly */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: state === 'current' ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3F5EF7] to-[#2A43D6]"
        />
        <motion.span
          animate={reduce ? undefined : { rotate: state === 'current' ? [0, -8, 0] : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative"
        >
          <Icon className="h-6 w-6" aria-hidden />
        </motion.span>
      </motion.span>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.55, ease: EASE }}
        className="pt-1.5"
      >
        <motion.div
          animate={{ opacity: lit ? 1 : 0.42 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-500',
              lit ? 'text-[#3F5EF7]' : 'text-slate-400',
            )}
          >
            Step {index + 1} · {step.meta}
          </span>
          <h3 className="mt-1.5 text-xl font-bold tracking-tight text-[#0B1020] dark:text-white">
            {step.title}
          </h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {step.body}
          </p>
        </motion.div>
      </motion.div>
    </li>
  );
}

function HowItWorks() {
  const reduce = useReducedMotion();
  const listRef = React.useRef<HTMLOListElement>(null);
  const [active, setActive] = React.useState(0);

  // Steps never un-light: once you have passed one, it stays part of your progress.
  const handleEnter = React.useCallback((i: number) => {
    setActive((prev) => (i > prev ? i : prev));
  }, []);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 80%', 'end 55%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="how-heading">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-[#F5F8FF] to-white dark:from-[#0B1020] dark:via-[#0E1533] dark:to-[#0B1020]"
      />
      <SectionHeader
        eyebrow="How it works"
        title={<span id="how-heading">Live in five steps, most of it done from your phone</span>}
      />

      <ol ref={listRef} className="relative mx-auto mt-14 max-w-3xl">
        <span
          aria-hidden
          className="absolute left-[27px] top-2 h-[calc(100%-2rem)] w-[2px] rounded-full bg-slate-200 dark:bg-white/10 sm:left-[31px]"
        />
        <motion.span
          aria-hidden
          style={{ scaleY: reduce ? 1 : fill }}
          className="absolute left-[27px] top-2 h-[calc(100%-2rem)] w-[2px] origin-top rounded-full bg-gradient-to-b from-[#3F5EF7] via-[#3F5EF7] to-[#12B76A] shadow-[0_0_12px_rgba(63,94,247,0.55)] sm:left-[31px]"
        />

        {STEPS.map((step, i) => (
          <TimelineStep
            key={step.title}
            step={step}
            index={i}
            state={i === active ? 'current' : i < active ? 'past' : 'future'}
            onEnter={handleEnter}
          />
        ))}
      </ol>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/* Dashboard showcase                                                  */
/* ------------------------------------------------------------------ */

const WIDGETS = [
  { icon: IndianRupee, label: "Today's earnings", value: '₹1,284', tone: 'green' },
  { icon: Wallet, label: 'Settlement', value: '₹27,450 · 4:00 PM', tone: 'blue' },
  { icon: TrendingUp, label: 'Commission this month', value: '₹9,860', tone: 'green' },
  { icon: BookText, label: 'Khata pending', value: '₹4,120 · 9 customers', tone: 'blue' },
  { icon: Landmark, label: 'Loan leads', value: '3 approved', tone: 'blue' },
  { icon: QrCode, label: 'QR collections', value: '₹18,420 · 62 payments', tone: 'blue' },
];

function DashboardShowcase() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section className="px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="dashboard-heading">
      <SectionHeader
        eyebrow="Merchant dashboard"
        title={<span id="dashboard-heading">Every rupee, accounted for</span>}
        subtitle="Open the app or the web dashboard and see exactly what came in, what settled and what you earned."
      />

      <div ref={ref} className="mx-auto mt-12 grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* laptop + phone */}
        <motion.div style={reduce ? undefined : { y }} className="relative">
          <div className="relative rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-[0_40px_90px_-40px_rgba(11,16,32,0.45)] dark:border-white/10 dark:bg-[#101733]">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B2A8A] via-[#2A43D6] to-[#3F5EF7] p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Cashlo merchant
                </span>
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-[#5EE9A8]" />
                </span>
              </div>
              <p className="mt-6 text-xs text-white/60">Balance available to settle</p>
              <p className="text-4xl font-extrabold tracking-tight text-white">₹27,450.00</p>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {WIDGETS.slice(0, 4).map((w, i) => {
                  const Icon = w.icon;
                  return (
                    <motion.div
                      key={w.label}
                      initial={reduce ? false : { opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 px-3.5 py-3 backdrop-blur"
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg',
                          w.tone === 'green' ? 'bg-[#12B76A]/25 text-[#5EE9A8]' : 'bg-white/15 text-white',
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[10px] text-white/60">{w.label}</span>
                        <span className="block text-[13px] font-bold text-white">{w.value}</span>
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
          <span
            aria-hidden
            className="mx-auto mt-1.5 block h-2.5 w-2/3 rounded-b-2xl bg-slate-200 dark:bg-white/10"
          />

          {/* phone overlap */}
          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-8 -right-2 hidden w-[150px] rounded-[1.4rem] border border-white/60 bg-white p-2 shadow-[0_30px_60px_-24px_rgba(11,16,32,0.5)] sm:block dark:border-white/10 dark:bg-[#101733]"
          >
            <div className="rounded-[1.1rem] bg-[#F5F8FF] p-3 dark:bg-white/[0.04]">
              <p className="text-[10px] font-semibold text-slate-500">Commission credited</p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-[#0E9F5E]">+₹18.50</p>
              <div className="mt-3 space-y-1.5">
                {[70, 45, 88].map((w, i) => (
                  <span
                    key={i}
                    className="block h-1.5 rounded-full bg-[#3F5EF7]/25"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* widget list */}
        <StaggerGroup className="space-y-3">
          {WIDGETS.map((w) => {
            const Icon = w.icon;
            return (
              <StaggerItem key={w.label}>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 transition-colors duration-300 hover:border-[#3F5EF7]/40 dark:border-white/10 dark:bg-white/[0.04]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F8FF] text-[#3F5EF7] dark:bg-white/[0.06]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                      {w.label}
                    </span>
                    <span className="block truncate text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                      {w.value}
                    </span>
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why merchants love Cashlo                                           */
/* ------------------------------------------------------------------ */

const LOVE = [
  {
    icon: TrendingUp,
    title: 'Income that adds up',
    body: 'Commission on every service, credited daily and settled straight to your bank account.',
    accent: 'from-[#3F5EF7] to-[#6C86FF]',
  },
  {
    icon: BadgeCheck,
    title: 'Trust at the counter',
    body: 'Instant receipts and voice confirmation, so customers leave sure their payment went through.',
    accent: 'from-[#12B76A] to-[#5EE9A8]',
  },
  {
    icon: Sparkles,
    title: 'No extra investment',
    body: 'No new machine, no deposit, no monthly fee. Your existing phone and counter are enough.',
    accent: 'from-[#2A43D6] to-[#3F5EF7]',
  },
  {
    icon: Lock,
    title: 'Simple and secure',
    body: 'PIN-locked transactions, encrypted data and a support team you can actually reach.',
    accent: 'from-[#1B2A8A] to-[#3F5EF7]',
  },
];

function WhyMerchantsLove({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="love-heading">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F5F8FF] to-white dark:from-[#0E1533] dark:to-[#0B1020]"
      />
      <SectionHeader
        eyebrow="Why merchants stay"
        title={<span id="love-heading">Four reasons shopkeepers keep the app open all day</span>}
      />
      <StaggerGroup className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2">
        {LOVE.map((item) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={item.title} className="h-full">
              <GlassCard className="group h-full p-8">
                <span
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-105',
                    item.accent,
                  )}
                >
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl font-bold tracking-tight text-[#0B1020] dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.body}
                </p>
              </GlassCard>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
      <Reveal className="mt-10 text-center">
        <Button variant="secondary" size="lg" onClick={onBecomeMerchant} icon={<ArrowUpRight className="h-4 w-4" />}>
          Become a merchant
        </Button>
      </Reveal>
    </section>
  );
}

/* ==================================================================
   7. Testimonial carousel, FAQ accordion
   ================================================================== */
/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

type Testimonial = {
  name: string;
  city: string;
  business: string;
  rating: number;
  quote: string;
  /** Drop a real photo in /public/merchants/ and set the path here. */
  image?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ramesh Gupta',
    city: 'Kanpur, UP',
    business: 'Kirana store',
    rating: 5,
    quote:
      'Villagers used to travel 6 km to the nearest ATM. Now they come to my shop for cash and buy groceries on the way out. My daily sale went up along with the commission.',
  },
  {
    name: 'Sunita Devi',
    city: 'Patna, Bihar',
    business: 'General store',
    rating: 5,
    quote:
      'Smart Khata ended my udhaar arguments. The reminder goes on WhatsApp, the customer pays, and nobody has to feel bad about asking.',
  },
  {
    name: 'Imran Sheikh',
    city: 'Nagpur, Maharashtra',
    business: 'Mobile shop',
    rating: 4,
    quote:
      'Recharge and bill payment run all day between phone sales. I earn around ₹9,000 extra a month without hiring anyone or buying a machine.',
  },
  {
    name: 'Anitha Reddy',
    city: 'Warangal, Telangana',
    business: 'Medical store',
    rating: 5,
    quote:
      'Settlement lands in my bank the same evening. That reliability is why I stopped using the other app I had.',
  },
];

function Avatar({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  if (t.image) {
    return (
      <Image
        src={t.image}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 rounded-full object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3F5EF7] to-[#1B2A8A] text-base font-bold text-white"
    >
      {initials}
    </span>
  );
}

function Testimonials() {
  const reduce = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => window.clearInterval(id);
  }, [paused, reduce]);

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  const t = TESTIMONIALS[index];

  return (
    <section className="px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="testimonials-heading">
      <SectionHeader
        eyebrow="Merchant stories"
        title={<span id="testimonials-heading">Shopkeepers, in their own words</span>}
      />

      <div
        className="mx-auto mt-12 max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="relative min-h-[300px] sm:min-h-[260px]"
          aria-live="polite"
          aria-atomic="true"
          aria-roledescription="carousel"
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_-30px_rgba(11,16,32,0.4)] backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <Quote
                aria-hidden
                className="absolute right-7 top-7 h-12 w-12 text-[#3F5EF7]/10"
                strokeWidth={1.5}
              />
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    className={cn(
                      'h-4 w-4',
                      i < t.rating ? 'fill-[#F5A623] text-[#F5A623]' : 'text-slate-300',
                    )}
                  />
                ))}
              </div>
              <blockquote className="mt-5 text-lg font-medium leading-relaxed tracking-tight text-[#0B1020] dark:text-white">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4">
                <Avatar t={t} />
                <span>
                  <span className="block font-bold tracking-tight text-[#0B1020] dark:text-white">
                    {t.name}
                  </span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400">
                    {t.business} · {t.city}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous story"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#3F5EF7] hover:text-[#3F5EF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.name}
                onClick={() => setIndex(i)}
                aria-label={`Show story ${i + 1} of ${TESTIMONIALS.length}`}
                aria-current={i === index}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2',
                  i === index ? 'w-7 bg-[#3F5EF7]' : 'w-2 bg-slate-300 dark:bg-white/20',
                )}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next story"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#3F5EF7] hover:text-[#3F5EF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-300"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

const FAQS = [
  {
    q: 'What documents do I need to become a Cashlo merchant?',
    a: 'Aadhaar, PAN, a bank account in your name and a photo of your shop. If you have a GST number or shop licence, add it during KYC to unlock higher transaction limits.',
  },
  {
    q: 'Is there any joining fee or monthly charge?',
    a: 'No joining fee and no monthly rental. You run Cashlo on your existing smartphone, and you earn commission on the services you provide.',
  },
  {
    q: 'How long does approval take?',
    a: 'Most merchants are verified within 48 hours of submitting complete KYC. You will get an SMS and an in-app notification the moment your account goes live.',
  },
  {
    q: 'When do I receive my money?',
    a: 'Collections settle to your bank account on the same day for transactions before the cut-off, and the next working day after it. Commission is credited daily to your Cashlo balance.',
  },
  {
    q: 'Do I need extra hardware or a POS machine?',
    a: 'No. A smartphone with internet is enough. You can also print your Cashlo QR and put a soundbox on the counter if you want audio confirmation.',
  },
  {
    q: 'What if a transaction fails or gets stuck?',
    a: 'Raise a ticket from the app and support tracks it end to end. Failed transactions are auto-reversed, and the team follows up in your language until it is closed.',
  },
];

function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 lg:py-24"
      aria-labelledby="faq-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-[#F5F8FF] dark:from-[#0B1020] dark:to-[#0E1533]"
      />
      <SectionHeader eyebrow="FAQ" title={<span id="faq-heading">Questions before you sign up</span>} />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={item.q} delay={i * 0.04}>
              <div
                className={cn(
                  'overflow-hidden rounded-2xl border bg-white/80 backdrop-blur transition-colors duration-300 dark:bg-white/[0.04]',
                  isOpen
                    ? 'border-[#3F5EF7]/40 shadow-[0_18px_46px_-28px_rgba(63,94,247,0.6)]'
                    : 'border-slate-200 dark:border-white/10',
                )}
              >
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3F5EF7]"
                  >
                    <span className="text-base font-bold tracking-tight text-[#0B1020] dark:text-white">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
                        isOpen ? 'bg-[#3F5EF7] text-white' : 'bg-[#F5F8FF] text-[#3F5EF7] dark:bg-white/10',
                      )}
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4" aria-hidden />
                      ) : (
                        <Plus className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ==================================================================
   8. Final CTA, registration form, sticky mobile CTA
   ================================================================== */
/* ------------------------------------------------------------------ */
/* Final CTA band                                                      */
/* ------------------------------------------------------------------ */

function FinalCta({ onContactSales }: { onContactSales: () => void }) {
  const reduce = useReducedMotion();

  return (
    <section className="px-5 pb-4 pt-10 sm:px-8" aria-labelledby="final-cta-heading">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1B2A8A] via-[#2A43D6] to-[#3F5EF7] px-7 py-14 text-center sm:px-12 sm:py-20">
          {!reduce && (
            <motion.span
              aria-hidden
              animate={{ x: ['-20%', '120%'] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/10 blur-xl"
            />
          )}
          <span
            aria-hidden
            className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />
          <span
            aria-hidden
            className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-[#5EE9A8]/15 blur-3xl"
          />

          <h2
            id="final-cta-heading"
            className="relative mx-auto max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl"
          >
            Ready to start earning more?
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Join thousands of shopkeepers building smarter businesses with Cashlo. Registration is
            free, and most shops go live within 48 hours.
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="onDark"
              size="lg"
              onClick={() =>
                document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Become a merchant
            </Button>
            <a
              href="https://play.google.com/store"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download app
            </a>
            <button
              onClick={onContactSales}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold text-white/90 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Headset className="h-4 w-4" aria-hidden />
              Contact sales
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Registration form                                                   */
/* ------------------------------------------------------------------ */

const SERVICE_OPTIONS = [
  { id: 'UPI Cash Point', icon: Banknote },
  { id: 'Recharge', icon: Smartphone },
  { id: 'Bill Payment', icon: Lightbulb },
  { id: 'Loan Services', icon: Landmark },
  { id: 'Smart Khata', icon: BookText },
  { id: 'Digital QR', icon: QrCode },
];

const EMPTY = {
  fullName: '',
  mobile: '',
  email: '',
  shopName: '',
  businessType: '',
  city: '',
  state: '',
  pincode: '',
};

/** Single source of truth for the form's validity — drives both the errors and the submit button. */
function validateRegistration(v: typeof EMPTY): FormErrors {
  const next: FormErrors = {
    fullName: validators.required(v.fullName, 'Full name'),
    mobile: validators.mobile(v.mobile),
    email: validators.email(v.email),
    shopName: validators.required(v.shopName, 'Shop name'),
    businessType: validators.required(v.businessType, 'Business type'),
    city: validators.required(v.city, 'City'),
    state: validators.required(v.state, 'State'),
    pincode: validators.pin(v.pincode),
  };
  return Object.fromEntries(Object.entries(next).filter(([, msg]) => msg));
}

function RegistrationForm() {
  const [values, setValues] = React.useState(EMPTY);
  const [services, setServices] = React.useState<string[]>(['UPI Cash Point', 'Digital QR']);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const notify = useToast();
  const reduce = useReducedMotion();
  const router = useRouter();
  // Belt and braces against a double submit: the button is disabled while
  // sending, and this ref blocks a second call even if one slips past it.
  const inFlight = React.useRef(false);

  React.useEffect(() => {
    router.prefetch('/become-merchant/success');
  }, [router]);

  const errors = React.useMemo(() => validateRegistration(values), [values]);
  const isValid = Object.keys(errors).length === 0;
  // Only surface an error once the field has been visited.
  const shown = (key: keyof typeof EMPTY) => (touched[key] ? errors[key] : undefined);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const blur = (key: keyof typeof EMPTY) => () => setTouched((t) => ({ ...t, [key]: true }));

  const setChoice = (key: 'businessType' | 'state') => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const toggleService = (id: string) =>
    setServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;

    if (!isValid) {
      setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
      const first = Object.keys(errors)[0];
      document.getElementById(`reg-${first}`)?.focus();
      notify({
        tone: 'error',
        title: 'Check the highlighted fields',
        body: 'A few details are still missing.',
      });
      return;
    }

    inFlight.current = true;
    setStatus('sending');

    // Exactly the shape the backend expects for a merchant lead.
    const lead = {
      name: values.fullName.trim(),
      mobile: values.mobile.trim(),
      email: values.email.trim(),
      shopName: values.shopName.trim(),
      businessType: values.businessType,
      city: values.city.trim(),
      state: values.state,
      pinCode: values.pincode.trim(),
      selectedServices: services,
      source: 'Become Merchant Page',
    };

    try {
      await submitLead(lead);
      setStatus('done');
      notify({
        tone: 'success',
        title: 'Merchant lead created',
        body: 'Taking you to your confirmation…',
      });
      setValues(EMPTY);
      setServices([]);
      setTouched({});
      router.push('/become-merchant/success');
    } catch {
      inFlight.current = false;
      setStatus('error');
      notify({
        tone: 'error',
        title: 'Could not submit',
        body: 'Check your connection and try again, or call 1800-000-000.',
      });
    }
  };

  return (
    <section id="register" className="scroll-mt-24 px-5 py-16 sm:px-8 lg:py-20" aria-labelledby="register-heading">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <GlassCard hover={false} className="p-7 sm:p-10">
            <>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#3F5EF7]/10 px-3 py-1 text-xs font-semibold text-[#3F5EF7]">
                  Free registration
                </span>
                <h2 id="register-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1020] dark:text-white">
                  Register your shop
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Fill this once. Our team handles the rest and calls you for KYC.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="reg-fullName" label="Full name" autoComplete="name" value={values.fullName} onChange={set('fullName')} onBlur={blur('fullName')} error={shown('fullName')} />
                    <Field id="reg-mobile" label="Mobile number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" value={values.mobile} onChange={set('mobile')} onBlur={blur('mobile')} error={shown('mobile')} />
                    <Field id="reg-email" label="Email address (optional)" type="email" autoComplete="email" value={values.email} onChange={set('email')} onBlur={blur('email')} error={shown('email')} />
                    <Field id="reg-shopName" label="Shop name" autoComplete="organization" value={values.shopName} onChange={set('shopName')} onBlur={blur('shopName')} error={shown('shopName')} />
                  </div>

                  <Dropdown
                    id="reg-businessType"
                    label="Business type"
                    options={BUSINESS_TYPES}
                    value={values.businessType}
                    onChange={setChoice('businessType')}
                    onBlur={blur('businessType')}
                    error={shown('businessType')}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="reg-city" label="City" autoComplete="address-level2" value={values.city} onChange={set('city')} onBlur={blur('city')} error={shown('city')} />
                    <Dropdown
                      id="reg-state"
                      label="State"
                      options={INDIAN_STATES}
                      value={values.state}
                      onChange={setChoice('state')}
                      onBlur={blur('state')}
                      error={shown('state')}
                    />
                  </div>

                  <Field id="reg-pincode" label="PIN code" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={values.pincode} onChange={set('pincode')} onBlur={blur('pincode')} error={shown('pincode')} />

                  <fieldset className="pt-2">
                    <legend className="text-sm font-bold tracking-tight text-[#0B1020] dark:text-white">
                      Services you want to offer
                    </legend>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Pick any number. You can switch services on or off later from the app.
                    </p>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {SERVICE_OPTIONS.map((s) => {
                        const Icon = s.icon;
                        const on = services.includes(s.id);
                        return (
                          <motion.label
                            key={s.id}
                            whileTap={reduce ? undefined : { scale: 0.98 }}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all duration-200',
                              on
                                ? 'border-[#3F5EF7] bg-[#F5F8FF] text-[#1B2A8A] shadow-[0_10px_26px_-18px_rgba(63,94,247,0.9)] dark:bg-[#3F5EF7]/15 dark:text-white'
                                : 'border-slate-200 text-slate-600 hover:border-[#3F5EF7]/40 dark:border-white/10 dark:text-slate-300',
                            )}
                          >
                            <input type="checkbox" checked={on} onChange={() => toggleService(s.id)} className="peer sr-only" />
                            <span
                              aria-hidden
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#3F5EF7] peer-focus-visible:ring-offset-2',
                                on ? 'border-[#3F5EF7] bg-[#3F5EF7] text-white' : 'border-slate-300 dark:border-white/20',
                              )}
                            >
                              <AnimatePresence>
                                {on && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </span>
                            <Icon className="h-4 w-4 text-[#3F5EF7]" aria-hidden />
                            {s.id}
                          </motion.label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {status === 'error' && (
                    <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                      We could not submit your registration. Please try again, or call 1800-000-000.
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isValid || status === 'sending' || status === 'done'}
                    className="mt-2 w-full"
                  >
                    {status === 'sending' || status === 'done' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        {status === 'done' ? 'Redirecting' : 'Submitting'}
                      </>
                    ) : (
                      'Get started'
                    )}
                  </Button>
                  <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {isValid
                      ? 'No joining fee. No monthly rental. Cancel any time.'
                      : 'Fill in your details above to continue.'}
                  </p>
                </form>
            </>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/* Sticky mobile CTA                                                   */
/* ------------------------------------------------------------------ */

function StickyMobileCta({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ y: visible ? 0 : 120, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/60 bg-white/85 px-4 py-3 backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-[#0B1020]/90"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex gap-2.5">
        <Button className="flex-1" onClick={onBecomeMerchant}>
          Become merchant
        </Button>
        <a
          href="https://play.google.com/store"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-[15px] font-semibold text-[#0B1020] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download app
        </a>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/* Page                                                               */
/* ================================================================== */

export default function BecomeMerchantPage() {
  const [modal, setModal] = React.useState<'sales' | 'distributor' | null>(null);

  const scrollToRegister = React.useCallback(() => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  const openSales = React.useCallback(() => setModal('sales'), []);
  const openDistributor = React.useCallback(() => setModal('distributor'), []);

  return (
    <ToastProvider>
      <main className="relative bg-white pb-24 lg:pb-0 dark:bg-[#0B1020]">
        <Hero onBecomeMerchant={scrollToRegister} />
        <QuickActions onContactSales={openSales} onContactDistributor={openDistributor} />
        <LeadSection />
        <WhyJoin onBecomeMerchant={scrollToRegister} />
        <EarningsCalculator onBecomeMerchant={scrollToRegister} />
        <Benefits />
        <WhoCanJoin />
        <HowItWorks />
        <DashboardShowcase />
        <WhyMerchantsLove onBecomeMerchant={scrollToRegister} />
        <Testimonials />
        <Faq />
        <FinalCta onContactSales={openSales} />
        <RegistrationForm />

        <StickyMobileCta onBecomeMerchant={scrollToRegister} />
        <LeadModal open={modal !== null} kind={modal ?? 'sales'} onClose={() => setModal(null)} />
      </main>
    </ToastProvider>
  );
}
