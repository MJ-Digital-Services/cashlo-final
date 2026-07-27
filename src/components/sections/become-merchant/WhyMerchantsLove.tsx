'use client';

import * as React from 'react';
import { ArrowUpRight, BadgeCheck, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from './shared/tokens';
import { Reveal, StaggerGroup, StaggerItem } from './shared/motion';
import { SectionHeader } from './shared/SectionHeader';
import { GlassCard } from './shared/GlassCard';
import { Button } from './shared/Button';

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

export default function WhyMerchantsLove({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
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