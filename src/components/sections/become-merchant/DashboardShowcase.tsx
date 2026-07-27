'use client';

import * as React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BookText, IndianRupee, Landmark, QrCode, TrendingUp, Wallet } from 'lucide-react';
import { cn, EASE } from './shared/tokens';
import { SectionHeader } from './shared/SectionHeader';
import { StaggerGroup, StaggerItem } from './shared/motion';

const WIDGETS = [
  { icon: IndianRupee, label: "Today's earnings", value: '₹1,284', tone: 'green' },
  { icon: Wallet, label: 'Settlement', value: '₹27,450 · 4:00 PM', tone: 'blue' },
  { icon: TrendingUp, label: 'Commission this month', value: '₹9,860', tone: 'green' },
  { icon: BookText, label: 'Khata pending', value: '₹4,120 · 9 customers', tone: 'blue' },
  { icon: Landmark, label: 'Loan leads', value: '3 approved', tone: 'blue' },
  { icon: QrCode, label: 'QR collections', value: '₹18,420 · 62 payments', tone: 'blue' },
];

export default function DashboardShowcase() {
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