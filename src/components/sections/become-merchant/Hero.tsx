"use client";

import Image from "next/image";
import {
  Store,
  CreditCard,
  Grid2x2,
  TrendingUp,
  Phone,
  ArrowRight,
  Wallet,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const quickFeatures = [
  {
    icon: CreditCard,
    title: "Accept Payments",
    desc: "Accept UPI, card & wallet payments instantly.",
  },
  {
    icon: Grid2x2,
    title: "Offer Services",
    desc: "Provide recharges, bill payments & more.",
  },
  {
    icon: TrendingUp,
    title: "Earn More Daily",
    desc: "Get higher commissions and grow your business.",
  },
];

const sideStats = [
  {
    icon: TrendingUp,
    title: "High Earnings",
    desc: "Earn up to ₹35 commission per transaction",
    tone: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: Wallet,
    title: "Multiple Services",
    desc: "Recharges, bill payments, tickets & more",
    tone: "text-brand bg-brand/10",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Secure",
    desc: "100% secure transactions and settlements",
    tone: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "24/7 merchant support whenever you need",
    tone: "text-violet-500 bg-violet-500/10",
  },
];

export default function Hero({
  onBecomeMerchant,
}: {
  onBecomeMerchant: () => void;
}) {
  const scope = useScrollReveal();

  return (
    <section
      ref={scope}
      className="relative flex min-h-[calc(100dvh-80px)] items-center overflow-hidden bg-bg pb-16 pt-20"
    >
      {/* Soft background blob — large rounded shape behind the illustration */}
      <svg
        className="pointer-events-none absolute z-0 h-[500px] w-[720px] text-brand/[0.07]
        right-[-200px] top-45
        min-[320px]:top-260
        min-[375px]:top-250
        min-[425px]:top-220 min-[425px]:h-[600px]
        min-[1440px]:right-[-20px]
        min-[2560px]:right-140
        sm:top-1/2 sm:h-[720px] sm:-translate-y-1/2"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M420,120 C500,170 540,270 520,360 C500,450 420,520 320,530 C220,540 120,490 90,400 C60,310 100,200 190,140 C280,80 340,70 420,120 Z"
        />
      </svg>

      {/* Soft wave hugging the bottom of the section */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 w-full text-[#f9fafb]"
        viewBox="0 0 1440 200"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,120 C240,180 480,60 720,90 C960,120 1200,200 1440,140 L1440,200 L0,200 Z"
        />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 sm:grid-cols-2 sm:gap-16">
        <div>
          <p
            data-reveal
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-brand"
          >
            <Store className="h-4 w-4" />
            Become a Merchant
          </p>
          <h1
            data-reveal
            className="mt-4 max-w-2xl text-5xl font-bold tracking-tight text-ink sm:text-6xl"
          >
            Turn Your Shop Into a{" "}
            <span className="text-brand">Digital Service Point</span>
          </h1>
          <p data-reveal className="mt-6 max-w-xl text-xl text-ink/60">
            Join Cashlo and unlock a world of digital payments and services.
            Accept payments, offer essential services, and grow your
            neighborhood income — every single day.
          </p>

          {/* CTA buttons */}
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={onBecomeMerchant}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Become a Merchant
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#talk-to-team"
              className="inline-flex items-center gap-2 rounded-lg border border-brand px-7 py-3.5 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              Talk to Our Team
              <Phone className="h-5 w-5" />
            </a>
          </div>

          {/* Quick feature cards */}
          <ul
            data-reveal
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3"
          >
            {quickFeatures.map(({ icon: Icon, title, desc }) => (
              <li
                key={title}
                className="rounded-xl border border-border bg-card p-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
                  <Icon className="h-4.5 w-4.5 text-brand" strokeWidth={1.9} />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/55">{desc}</p>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="relative mx-auto w-full max-w-3xl xl:max-w-4xl">
          <Image
            src="/images/become-merchant/become-merchant-hero.png"
            alt="Cashlo merchant accepting a digital payment at his shop counter"
            width={1536}
            height={1024}
            priority
            className="h-auto w-full object-contain"
          />

          {/* Floating stat cards — desktop only, room-dependent */}
          <div className="pointer-events-none absolute -right-4 top-6 hidden w-52 flex-col gap-3 xl:-right-10 xl:flex">
            {sideStats.map(({ icon: Icon, title, desc, tone }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-3 shadow-lg"
              >
                <div className="flex items-start gap-2.5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-ink/55">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}