'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Download, Headset } from 'lucide-react';
import { Reveal } from './shared/motion';
import { Button } from './shared/Button';

export default function FinalCta({ onContactSales }: { onContactSales: () => void }) {
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