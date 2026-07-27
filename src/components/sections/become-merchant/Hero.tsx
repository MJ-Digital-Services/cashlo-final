'use client';

import * as React from 'react';
import { ArrowRight, BadgeCheck, Download, IndianRupee, ShieldCheck, Timer } from 'lucide-react';
import { Reveal } from './shared/motion';
import { Button } from './shared/Button';

const HERO_FEATURES = [
  { icon: BadgeCheck, label: 'Easy KYC' },
  { icon: ShieldCheck, label: 'Secure platform' },
  { icon: Timer, label: 'Fast approval' },
  { icon: IndianRupee, label: 'Daily earnings' },
];

export default function Hero({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
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