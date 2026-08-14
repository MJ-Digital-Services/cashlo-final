'use client';

import * as React from 'react';
import { Download, Handshake, Headset, MapPin, PhoneCall, QrCode, Star } from 'lucide-react';
import { GlassCard } from './shared/GlassCard';
import { Button } from './shared/Button';
import { StaggerGroup, StaggerItem } from './shared/motion';

export default function QuickActions({
  onContactSales,
  onContactDistributor,
}: {
  onContactSales: () => void;
  onContactDistributor: () => void;
}) {
  return (
    <section className="relative px-5 pb-16 sm:px-8 bg-[#f9fafb]" aria-label="Quick actions">
      <StaggerGroup className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        <StaggerItem>
          <GlassCard className="group h-full p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3F5EF7]/10 text-[#3F5EF7] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
              <Headset className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
              Talk to a sales person
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Leave your number and get a callback within 30 minutes. We will walk you through
              services, commission and paperwork.
            </p>
            <Button className="mt-6 w-full" onClick={onContactSales} icon={<PhoneCall className="h-4 w-4" />}>
              Request a call
            </Button>
          </GlassCard>
        </StaggerItem>

        <StaggerItem>
          <GlassCard className="group h-full p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#12B76A]/12 text-[#0E9F5E] transition-transform duration-300 group-hover:rotate-[8deg] group-hover:scale-110">
              <Handshake className="h-6 w-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
              Contact a distributor
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Prefer help in person? Find the Cashlo distributor nearest to your shop for onboarding
              and day-to-day support.
            </p>
            <Button
              variant="secondary"
              className="mt-6 w-full"
              onClick={onContactDistributor}
              icon={<MapPin className="h-4 w-4" />}
            >
              Connect distributor
            </Button>
          </GlassCard>
        </StaggerItem>

        <StaggerItem>
          <GlassCard className="group h-full p-7">
            <div id="download-app" className="scroll-mt-28">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3F5EF7]/10 text-[#3F5EF7] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Download className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-[#0B1020] dark:text-white">
                Download the Cashlo app
              </h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/10">
                  <QrCode className="h-16 w-16 text-[#0B1020]" strokeWidth={1.2} aria-hidden />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-1 font-semibold text-[#0B1020] dark:text-white">
                    4.6
                    <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" aria-hidden />
                  </p>
                  <p className="text-xs">Scan to install on Android</p>
                </div>
              </div>
              <a
                href="https://play.google.com/store"
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0B1020] text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2"
              >
                <Download className="h-4 w-4" aria-hidden />
                Get it on Google Play
              </a>
            </div>
          </GlassCard>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}