"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  PiggyBank,
  Percent,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

export default function InterestRateBanner() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="relative overflow-hidden bg-surface py-12 sm:py-16">
      <Container>
        <div
          data-reveal
          className="group relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 sm:p-8 md:p-10"
        >
          {/* Subtle Ambient Background Glows */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/10 blur-3xl transition-opacity duration-500 group-hover:bg-brand/15" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          {/* Grid Layout: Left Info & Features / Right Highlight Stat Card */}
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Content (Span 7) */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* Eyebrow Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand">
                <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
                <Percent className="h-3.5 w-3.5" />
                <span>Lowest Interest Rate Guarantee</span>
              </div>

              {/* Headline & Description */}
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                Maximum Value with Unbeatable Gold Loan Rates
              </h3>
              <p className="mt-3 text-sm text-ink/70 sm:text-base leading-relaxed">
                Empower your financial needs with transparent pricing, instant approval, and flexible monthly interest options designed for maximum savings.
              </p>

              {/* Feature Highlights */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-ink/80 border border-border/60">
                  <Zap className="h-4 w-4 text-brand shrink-0" />
                  <span>Instant Approval in 30 Mins</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-ink/80 border border-border/60">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Zero Hidden Charges</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-ink/80 border border-border/60">
                  <PiggyBank className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Flexible Tenure (3–24 mos)</span>
                </div>
              </div>
            </div>

            {/* Right Highlight Stat Card (Span 5) */}
            <div className="flex flex-col items-center lg:col-span-5 lg:items-end">
              <div className="w-full rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 via-surface to-brand/10 p-6 text-center sm:p-8 lg:text-right shadow-sm relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Rates Starting From</span>
                </div>

                <div className="flex items-baseline justify-center gap-1 lg:justify-end">
                  <span className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                    11.91%
                  </span>
                  <span className="text-sm font-semibold text-ink/60">* p.a.</span>
                </div>

                <p className="mt-1 text-xs font-medium text-brand">
                  Equivalent to ~0.99% monthly interest
                </p>

                {/* Call to Action Button */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3">
                  <Link
                    href="#calculator"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30"
                  >
                    <span>Calculate EMI</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <p className="mt-3 text-[11px] text-ink/40">
                  *Standard terms & conditions apply. Rates subject to gold purity & loan amount.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

