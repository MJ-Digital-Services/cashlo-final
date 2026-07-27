'use client';

import * as React from 'react';
import { Banknote, Landmark, Lightbulb, BookText, QrCode, Smartphone, Sparkles } from 'lucide-react';
import { cn } from './shared/tokens';
import { Reveal, StaggerGroup, StaggerItem } from './shared/motion';
import { SectionHeader } from './shared/SectionHeader';
import { Button } from './shared/Button';

const SERVICES = [
  {
    icon: Banknote,
    title: 'UPI Cash Point',
    description:
      'Customers send you money on UPI and take cash from your counter. Your till becomes the neighbourhood ATM.',
    benefit: 'Earn on every withdrawal',
  },
  {
    icon: Smartphone,
    title: 'Mobile & DTH recharge',
    description:
      'Recharge every operator from one screen, for walk-in customers and regulars who call you.',
    benefit: 'Instant commission per recharge',
  },
  {
    icon: Lightbulb,
    title: 'Bill payments',
    description:
      'Electricity, water, gas, broadband, insurance premiums and FASTag, all paid at your shop.',
    benefit: 'Repeat footfall every month',
  },
  {
    icon: QrCode,
    title: 'Digital QR',
    description:
      'A Cashlo QR at your counter with instant voice confirmation, so you never miss a payment.',
    benefit: 'Zero-cost UPI collection',
  },
  {
    icon: Landmark,
    title: 'Loan marketplace',
    description:
      'Offer personal, business and gold loan options from partner lenders to customers you already know.',
    benefit: 'High-value payouts',
  },
  {
    icon: BookText,
    title: 'Smart Khata',
    description:
      'Replace the paper udhaar book. Track credit, send reminders on WhatsApp, get paid faster.',
    benefit: 'Recover dues on time',
  },
];

function ServiceCard({ service, index }: { service: (typeof SERVICES)[number]; index: number }) {
  const Icon = service.icon;
  return (
    <StaggerItem className="h-full">
      <div className="group relative h-full rounded-3xl bg-gradient-to-br from-[#3F5EF7]/25 via-[#8AA1FF]/10 to-transparent p-[1.5px] transition-transform duration-300 hover:-translate-y-2">
        <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-white p-7 shadow-[0_10px_40px_-24px_rgba(11,16,32,0.35)] transition-shadow duration-300 group-hover:shadow-[0_28px_60px_-24px_rgba(63,94,247,0.45)] dark:bg-[#101733]">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#3F5EF7]/12 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <div className="flex items-start justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F8FF] text-[#3F5EF7] transition-transform duration-300 group-hover:scale-110 dark:bg-white/[0.06]">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <span className="text-xs font-semibold tabular-nums text-slate-300 dark:text-white/20">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {service.description}
          </p>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#12B76A]/10 px-3 py-1.5 text-xs font-semibold text-[#0E9F5E]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {service.benefit}
          </p>
        </div>
      </div>
    </StaggerItem>
  );
}

export default function WhyJoin({ onBecomeMerchant }: { onBecomeMerchant: () => void }) {
  return (
    <section id="services" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24" aria-labelledby="why-join-heading">
      <SectionHeader
        eyebrow="Why join Cashlo"
        title={<span id="why-join-heading">Six services. One counter. One app.</span>}
        subtitle="Every service earns you a commission, and each one gives a customer a reason to walk back into your shop."
      />
      <StaggerGroup className="mx-auto mt-12 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.title} service={s} index={i} />
        ))}
      </StaggerGroup>
      <Reveal className="mt-10 text-center">
        <Button size="lg" onClick={onBecomeMerchant}>
          Start offering these services
        </Button>
      </Reveal>
    </section>
  );
}