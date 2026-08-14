"use client";

import Image from "next/image";
import { Users, Percent, Headphones, ArrowRight, Phone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const perks = [
  {
    icon: Users,
    title: "Expand Your Network",
    desc: "Onboard more local merchants in your area.",
  },
  {
    icon: Percent,
    title: "Earn Recurring Commission",
    desc: "Grow your income with every active merchant.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Get training, tools, and priority support.",
  },
];

export default function DistributorHero() {
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
        min-[320px]:top-250
        min-[375px]:top-230
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
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            Become a Distributor
          </p>
          <h1
            data-reveal
            className="mt-4 max-w-2xl text-5xl font-bold tracking-tight text-ink sm:text-6xl"
          >
            Grow Your Business as a{" "}
            <span className="text-brand">Cashlo</span> Distributor
          </h1>
          <p data-reveal className="mt-6 max-w-xl text-xl text-ink/60">
            Help local merchants join the Cashlo network, expand financial
            access in your area, and earn recurring commission through
            onboarding and ongoing support.
          </p>

          {/* CTA buttons */}
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/become-distributor/reserve"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Become a Distributor
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#talk-to-team"
              className="inline-flex items-center gap-2 rounded-lg border border-brand px-7 py-3.5 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              Talk to Our Team
              <Phone className="h-5 w-5" />
            </a>
          </div>

          {/* Perk cards */}
          <ul
            data-reveal
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3"
          >
            {perks.map(({ icon: Icon, title, desc }) => (
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
            src="/images/become-distributor/become-distributor-hero.png"
            alt="Cashlo distributor helping merchants join the Cashlo network"
            width={1536}
            height={1024}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}