'use client';

import * as React from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import { Handshake, Headset } from 'lucide-react';
import { cn } from './shared/tokens';
import { Reveal } from './shared/motion';
import { SectionHeader } from './shared/SectionHeader';
import LeadForm from './LeadForm';

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

export default function LeadSection() {
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