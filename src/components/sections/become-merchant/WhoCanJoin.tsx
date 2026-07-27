'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Building2, Cookie, CreditCard, Drill, HeartPulse, Landmark,
  Milk, Monitor, PencilRuler, ShoppingBasket, Smartphone, Store,
} from 'lucide-react';
import { StaggerGroup, StaggerItem } from './shared/motion';
import { SectionHeader } from './shared/SectionHeader';

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

export default function WhoCanJoin() {
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