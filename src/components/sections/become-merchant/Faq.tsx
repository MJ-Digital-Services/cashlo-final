'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn, EASE } from './shared/tokens';
import { Reveal } from './shared/motion';
import { SectionHeader } from './shared/SectionHeader';
import { becomeMerchantFaqs as FAQS } from '@/lib/data/faqs/become-merchant';

export default function Faq() {
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