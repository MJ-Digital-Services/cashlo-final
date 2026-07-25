"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Clock3, TrendingUp, HeartHandshake, Shield, Zap, Wallet, PhoneCall, CheckCircle2 } from "lucide-react";

export default function WhyChooseCashlo() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} aria-labelledby="why-choose-heading" className="bg-bg py-20">
      <Container>
        {/* Section Header */}
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Why Choose Cashlo
          </span>
          <h2 id="why-choose-heading" className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Engineered for High-Reliability Retailers
          </h2>
          <p className="mt-2.5 text-base text-ink/70">
            An enterprise-ready payment platform built to increase merchant footfall and maximize daily profits.
          </p>
        </div>

        {/* Tight Staggered Bento Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          
          {/* Card 1: Secure & Trusted (Top Left - Spans 2 Columns) */}
          <div
            data-reveal
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 md:col-span-2"
          >
            <div className="grid h-full gap-5 md:grid-cols-12 md:items-stretch">
              <div className="flex flex-col justify-between md:col-span-7">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                    <Shield className="h-3.5 w-3.5" />
                    Bank-Grade BBPS Protocol
                  </div>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                    100% Secure & BBPS Verified
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    Every bill payment and mobile recharge is processed directly via official NPCI Bharat BillPay rails with end-to-end 256-bit encryption. Zero data retention on local devices.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5 text-xs font-medium text-ink/70">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> 256-bit Encrypted
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> NPCI Compliant
                  </span>
                </div>
              </div>

              {/* Framed Graphic - Height adjusted for object-cover */}
              <div className="relative min-h-[220px] w-full overflow-hidden rounded-2xl border border-border/80 bg-surface/60 p-1.5 shadow-inner md:col-span-5 md:min-h-[240px]">
                <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-xl bg-card">
                  <Image
                    src="/illustrations/recharge-bills/secure-trusted-v2.jpg"
                    alt="Secure & Trusted BBPS Transactions"
                    fill
                    sizes="(max-width: 768px) 100vw, 35vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 24x7 Availability (Top Right - Spans 1 Column) */}
          <div
            data-reveal
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 md:col-span-1"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Clock3 className="h-4.5 w-4.5" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Live Uptime
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">
                24×7 Instant Availability
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                Process customer bills and top-ups round-the-clock without server drop-offs.
              </p>
            </div>

            {/* Framed Graphic - Height adjusted to h-52 md:h-56 for object-cover */}
            <div className="mt-4 relative h-52 w-full overflow-hidden rounded-2xl border border-border/80 bg-surface/60 p-1.5 shadow-inner md:h-56">
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
                <Image
                  src="/illustrations/recharge-bills/availability-247-v3.jpg"
                  alt="24x7 High Availability Clock"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Attractive Commission (Bottom Left - Spans 1 Column) */}
          <div
            data-reveal
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 md:col-span-1"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <Wallet className="h-3 w-3" />
                  Realtime Credit
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold tracking-tight text-ink">
                Highest Margin Commission
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                Enjoy industry-best commission rates credited straight to your digital wallet.
              </p>
            </div>

            {/* Framed Graphic - Height adjusted to h-52 md:h-56 for object-cover */}
            <div className="mt-4 relative h-52 w-full overflow-hidden rounded-2xl border border-border/80 bg-surface/60 p-1.5 shadow-inner md:h-56">
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
                <Image
                  src="/illustrations/recharge-bills/attractive-commission-v2.jpg"
                  alt="Attractive Merchant Commission"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Dedicated Support (Bottom Right - Spans 2 Columns) */}
          <div
            data-reveal
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 md:col-span-2"
          >
            <div className="grid h-full gap-5 md:grid-cols-12 md:items-stretch">
              {/* Framed Graphic on Left - Height adjusted for object-cover */}
              <div className="order-2 relative min-h-[220px] w-full overflow-hidden rounded-2xl border border-border/80 bg-surface/60 p-1.5 shadow-inner md:order-1 md:col-span-5 md:min-h-[240px]">
                <div className="relative h-full min-h-[210px] w-full overflow-hidden rounded-xl bg-card">
                  <Image
                    src="/illustrations/recharge-bills/dedicated-support.jpg"
                    alt="Dedicated Customer & Merchant Support"
                    fill
                    sizes="(max-width: 768px) 100vw, 35vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="order-1 flex flex-col justify-between md:order-2 md:col-span-7">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600">
                    <HeartHandshake className="h-3.5 w-3.5" />
                    Priority Merchant Support
                  </div>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                    Dedicated 1-on-1 Merchant Care
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    Never worry about stuck payments. Get direct access to our specialist support team via phone call, WhatsApp, or instant in-app chat.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs font-medium text-ink">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
                    <PhoneCall className="h-3.5 w-3.5 text-brand" /> Direct Helpline
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand" /> WhatsApp Care
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}