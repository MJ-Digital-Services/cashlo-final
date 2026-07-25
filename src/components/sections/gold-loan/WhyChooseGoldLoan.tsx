"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Zap,
  RefreshCcw,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Lock,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function WhyChooseGoldLoan() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-14 sm:py-20 lg:py-28">
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl">
          <p
            data-reveal
            className="text-xs font-semibold uppercase tracking-widest text-brand"
          >
            Why Cashlo
          </p>
          <h2
            data-reveal
            className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink"
          >
            Why Choose Our Gold Loan?
          </h2>
          <p
            data-reveal
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-ink/70 leading-relaxed"
          >
            Unlock high-value liquidity backed by bank-grade security, instant credit, and total flexibility over interest costs.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
          
          {/* Bento Card 1: Quick Disbursement (Span 7 md / 8 lg) */}
          <div
            data-reveal
            className="group relative md:col-span-7 lg:col-span-8 rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden hover:border-brand/30 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-brand/5"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl bg-brand/10 text-brand shrink-0">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 sm:px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Clock className="h-3.5 w-3.5" /> Fast Processing
                </span>
              </div>

              <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold text-ink">
                Instant Disbursement in 3 Minutes
              </h3>
              <p className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-ink/70 max-w-xl">
                Funds credited directly to your bank account as soon as your gold valuation and digital KYC are completed.
              </p>
            </div>

            {/* Micro-UI: Step Timeline Preview */}
            <div className="relative z-10 mt-6 rounded-xl sm:rounded-2xl border border-border/60 bg-surface/80 p-3.5 sm:p-4 md:p-5 backdrop-blur-xs">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-medium text-ink">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Gold Valuation</span>
                </div>

                <div className="hidden lg:block">
                  <ArrowRight className="h-4 w-4 text-ink/30 shrink-0" />
                </div>
                <div className="block lg:hidden pl-2 border-l-2 border-dashed border-emerald-500/40 h-2.5 my-0.5 ml-2" />

                <div className="flex items-center gap-2 font-medium text-ink">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Instant KYC</span>
                </div>

                <div className="hidden lg:block">
                  <ArrowRight className="h-4 w-4 text-ink/30 shrink-0" />
                </div>
                <div className="block lg:hidden pl-2 border-l-2 border-dashed border-brand/40 h-2.5 my-0.5 ml-2" />

                <div className="flex items-center gap-2 font-bold text-brand bg-brand/10 px-2.5 sm:px-3 py-1.5 rounded-xl border border-brand/20 shrink-0">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                  </span>
                  <span className="whitespace-nowrap">₹1,50,000 Credited</span>
                </div>
              </div>
            </div>

            {/* Ambient Accent Glow */}
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />
          </div>

          {/* Bento Card 2: 100% Insured & Secure (Span 5 md / 4 lg) */}
          <div
            data-reveal
            className="group relative md:col-span-5 lg:col-span-4 rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden hover:border-brand/30 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-brand/5"
          >
            <div className="relative z-10">
              <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl bg-brand/10 text-brand shrink-0">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
              </span>

              <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold text-ink">
                100% Secure & Insured
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/70">
                Your gold is locked in high-security bank vaults with end-to-end insurance protection until final loan repayment.
              </p>
            </div>

            {/* Micro-UI: Security Badges */}
            <div className="relative z-10 mt-6 space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-surface/80 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-medium text-ink/80">
                <Lock className="h-4 w-4 text-brand shrink-0" />
                <span>Bank-Grade Vault Storage</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-surface/80 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-medium text-ink/80">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% Insurance Coverage</span>
              </div>
            </div>

            {/* Ambient Accent Glow */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-brand/5 blur-2xl group-hover:bg-brand/10 transition-colors" />
          </div>

          {/* Bento Card 3: Overdraft Facility (Span 5 md / 4 lg) */}
          <div
            data-reveal
            className="group relative md:col-span-5 lg:col-span-4 rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden hover:border-brand/30 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-brand/5"
          >
            <div className="relative z-10">
              <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl bg-brand/10 text-brand shrink-0">
                <RefreshCcw className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
              </span>

              <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold text-ink">
                Smart Overdraft Facility
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/70">
                Withdraw only what you need, whenever required. Pay interest strictly on the active utilized amount.
              </p>
            </div>

            {/* Micro-UI: Credit Line Utilization Visualizer */}
            <div className="relative z-10 mt-6 rounded-xl sm:rounded-2xl border border-border/60 bg-surface/80 p-3.5 sm:p-4 space-y-2.5 sm:space-y-3">
              <div className="flex justify-between items-center text-xs font-medium">
                <span className="text-ink/60">Approved Limit</span>
                <span className="font-bold text-ink">₹2,00,000</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-border/60 overflow-hidden flex">
                <div className="h-full w-[25%] bg-brand rounded-full" />
                <div className="h-full w-[75%] bg-transparent" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-[11px] font-medium leading-tight">
                <span className="text-brand font-semibold">Used: ₹50,000 (Interest Paid)</span>
                <span className="text-emerald-600 dark:text-emerald-400">Zero Interest: ₹1,50,000</span>
              </div>
            </div>

            {/* Ambient Accent Glow */}
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-brand/5 blur-2xl group-hover:bg-brand/10 transition-colors" />
          </div>

          {/* Bento Card 4: Multipurpose Loan (Span 7 md / 8 lg) */}
          <div
            data-reveal
            className="group relative md:col-span-7 lg:col-span-8 rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden hover:border-brand/30 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-brand/5"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl sm:rounded-2xl bg-brand/10 text-brand shrink-0">
                  <Layers className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 sm:px-3 py-1 text-xs font-medium text-brand shrink-0">
                  <TrendingUp className="h-3.5 w-3.5" /> 100% Usage Freedom
                </span>
              </div>

              <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl font-bold text-ink">
                Multipurpose Loan
              </h3>
              <p className="mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-ink/70 max-w-xl">
                No restrictions on end-use. Utilize funds seamlessly for business capital, medical emergencies, education, or personal expenses.
              </p>
            </div>

            {/* Micro-UI: Usage Tag Cloud */}
            <div className="relative z-10 mt-6 flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5">
              {[
                { label: "Business Expansion", icon: "💼" },
                { label: "Medical Emergency", icon: "🏥" },
                { label: "Education Fees", icon: "🎓" },
                { label: "Working Capital", icon: "📈" },
                { label: "Personal Expense", icon: "✨" },
                { label: "Travel & Events", icon: "✈️" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl border border-border/60 bg-surface/80 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-ink/80 hover:border-brand/40 hover:bg-card transition-colors cursor-default"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              ))}
            </div>

            {/* Ambient Accent Glow */}
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand/5 blur-3xl group-hover:bg-brand/10 transition-colors" />
          </div>

        </div>
      </Container>
    </section>
  );
}
