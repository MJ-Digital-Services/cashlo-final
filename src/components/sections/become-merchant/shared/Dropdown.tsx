'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, Check, ChevronDown, Search } from 'lucide-react';
import { cn, EASE } from './tokens';

/* ---------------- Searchable dropdown ----------------
   Trigger button + filterable listbox. Typing narrows the list, arrows move
   the highlight, Enter commits, Escape closes and returns focus to the trigger. */

export function Dropdown({
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