'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn, EASE } from './shared/tokens';
import { Reveal } from './shared/motion';
import { SectionHeader } from './shared/SectionHeader';

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