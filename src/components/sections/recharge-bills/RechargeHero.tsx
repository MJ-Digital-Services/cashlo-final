"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import RechargeHeroAnimation from "./RechargeHeroAnimation";
import { Sparkles, Smartphone, Tv, Zap, Droplets, Car, Flame, Wifi } from "lucide-react";

const quickCategories = [
  { name: "Mobile", icon: Smartphone },
  { name: "DTH", icon: Tv },
  { name: "Electricity", icon: Zap },
  { name: "Water", icon: Droplets },
  { name: "FASTag", icon: Car },
  { name: "Gas", icon: Flame },
  { name: "Broadband", icon: Wifi },
];

export default function RechargeHero() {
  const scope = useScrollReveal();

  return (
    <section
      ref={scope}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-bg min-h-screen 2xl:min-h-0 flex flex-col justify-center pt-28 pb-16 sm:pt-36 sm:pb-24 transition-colors duration-300"
    >
      {/* React Bits / Aceternity SVG Geometric Dot-Grid Pattern Background (No Images) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* SVG Dot Grid Pattern */}
        <svg
          className="absolute inset-0 h-full w-full stroke-ink/10 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)] opacity-45"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-dot-grid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="-1"
            >
              <circle cx="2" cy="2" r="1.25" className="fill-brand/30 dark:fill-brand/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dot-grid)" />
        </svg>

        {/* Ambient Gradient Glow Orbs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-brand/10 dark:bg-brand/20 blur-[120px] opacity-70" />
        <div className="absolute top-1/3 right-1/4 w-[280px] h-[280px] rounded-full bg-indigo-500/10 blur-[80px] opacity-40" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2 lg:gap-14">
          {/* Left Column: Typography & Quick Badges */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Aceternity Style Eyebrow Badge */}
            <div
              data-reveal
              className="group relative inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur-xl transition-all hover:border-brand/40"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              <span>Recharge &amp; Bill Payments • BBPS Powered</span>
              <span className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" aria-hidden="true" />
            </div>

            {/* Display Headline */}
            <h1
              id="hero-heading"
              data-reveal
              className="mt-5 text-balance max-w-2xl text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              One Counter for Every Recharge &amp; Bill
            </h1>

            {/* Sub-Tagline */}
            <p
              data-reveal
              className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-[2px] text-brand opacity-90"
            >
              EARN COMMISSION ON EVERY PAYMENT VIA BBPS
            </p>

            {/* Lead Paragraph */}
            <p
              data-reveal
              className="mt-3 max-w-lg text-base sm:text-lg text-ink/70 leading-relaxed"
            >
              Mobile, DTH, electricity, gas, water, FASTag, and broadband — offer it all
              from your counter with instant settlement.
            </p>

            {/* Quick Category Badges */}
            <ul
              data-reveal
              aria-label="Quick recharge and bill payment categories"
              className="mt-7 flex flex-wrap justify-center lg:justify-start items-center gap-2.5 max-w-lg"
            >
              {quickCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li
                    key={cat.name}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-sm font-medium text-ink/80 backdrop-blur-md transition-all duration-300 hover:border-brand/40 hover:bg-card hover:text-brand hover:-translate-y-0.5 shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    <span>{cat.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Column: Form Component */}
          <div className="w-full flex justify-center lg:justify-end">
            {/* Form */}
            <RechargeHeroAnimation />
          </div>


        </div>
      </Container>
    </section>
  );
}

