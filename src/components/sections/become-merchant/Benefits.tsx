'use client';

import * as React from 'react';
import { BarChart3, Building2, Clock4, Headphones, ShieldCheck, TrendingUp, Users, Wallet } from 'lucide-react';
import { cn } from './shared/tokens';
import { StaggerGroup, StaggerItem } from './shared/motion';
import { SectionHeader } from './shared/SectionHeader';
import { GlassCard } from './shared/GlassCard';
import { CountUp } from './shared/CountUp';

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

export default function Benefits() {
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