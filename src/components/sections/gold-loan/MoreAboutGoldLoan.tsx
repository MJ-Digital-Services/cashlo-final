"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Coins,
  Scale,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Lock,
  Percent,
  Smartphone,
  HelpCircle,
  Clock,
  Building2,
  Gem,
} from "lucide-react";

// Tab Data definition with rich icons and details
const tabs = [
  {
    id: "features",
    label: "Features & Benefits",
    icon: Coins,
  },
  {
    id: "valuation",
    label: "Valuation Methodology",
    icon: Scale,
  },
  {
    id: "digital-gold",
    label: "Digital Gold Savings",
    icon: Sparkles,
  },
];

export default function MoreAboutGoldLoan() {
  const scope = useScrollReveal();
  const [activeTab, setActiveTab] = useState("features");

  return (
    <section ref={scope} className="relative overflow-hidden py-16 sm:py-24">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Comprehensive Guide</span>
          </div>

          <h2
            data-reveal
            className="text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl"
          >
            More About Gold Loans
          </h2>

          <p
            data-reveal
            className="mt-3.5 text-sm sm:text-base md:text-lg leading-relaxed text-ink/70 max-w-2xl mx-auto"
          >
            Explore how gold loans work, understand RBI-backed valuation methodology, or start building gold savings effortlessly with 24K digital gold.
          </p>
        </div>

        {/* Shadcn Blocks Inspired Rounded Segmented Pill Navigation */}
        <div data-reveal className="mt-8 sm:mt-12 flex justify-center w-full">
          <div className="flex max-w-full overflow-x-auto justify-start sm:justify-center p-1 scrollbar-none">
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs shrink-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${isActive
                        ? "text-brand"
                        : "text-ink/60 hover:text-ink hover:bg-surface/50"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-full bg-surface border border-brand/20 shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-brand" : "text-ink/50"}`} />
                      <span>{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div data-reveal className="mt-8 sm:mt-10">
          <AnimatePresence mode="wait">
            {/* TAB 1: FEATURES & BENEFITS */}
            {activeTab === "features" && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {/* Feature Card 1 */}
                <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Percent className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink">High Loan Value</h3>
                    <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
                      Unlock maximum liquidity backed by up to 75% of your gold’s true market value, as per RBI guidelines.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Up to 75% LTV Ratio</span>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink">Flexible Repayments</h3>
                    <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
                      Choose from Bullet repayment, monthly interest EMI, or overdraft options tailored to your cash flow.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-brand">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>3–24 Month Tenures</span>
                  </div>
                </div>

                {/* Feature Card 3 */}
                <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink">Quick Disbursement</h3>
                    <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
                      Minimal documentation and instant digital verification get funds deposited directly into your bank account in 30 mins.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>30-Min Fast Approval</span>
                  </div>
                </div>

                {/* Feature Card 4 */}
                <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-ink">Vault Security & Zero End-Use Limit</h3>
                    <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
                      Your pledged gold is stored in bank-grade secure vaults with 100% insurance. Use your loan for medical, business, or personal needs.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    <span>100% Insured Storage</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: VALUATION & LTV METHODOLOGY */}
            {activeTab === "valuation" && (
              <motion.div
                key="valuation"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
              >
                {/* Left Side: 3-Step Valuation Flow (Span 8) */}
                <div className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand">
                      <Scale className="h-4 w-4" />
                      <span>Transparent Appraisal Process</span>
                    </div>
                    <h3 className="mt-2 text-xl sm:text-2xl font-bold text-ink">
                      How Your Gold Valuation & LTV is Calculated
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
                      Cashlo follows strict Reserve Bank of India (RBI) guidelines to ensure total accuracy, zero hidden appraisal fees, and maximum value for your gold assets.
                    </p>

                    {/* Step-by-Step Cards */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Step 1 */}
                      <div className="rounded-2xl border border-border/60 bg-surface/60 p-4 relative overflow-hidden">
                        <span className="absolute right-3 top-2 text-3xl font-extrabold text-ink/5">01</span>
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand mb-3 font-bold text-sm">
                          1
                        </div>
                        <h4 className="text-sm font-bold text-ink">Purity & Net Weight</h4>
                        <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                          Certified appraisers test gold purity (18K–24K). Stones and embellishments are excluded to calculate net gold weight.
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="rounded-2xl border border-border/60 bg-surface/60 p-4 relative overflow-hidden">
                        <span className="absolute right-3 top-2 text-3xl font-extrabold text-ink/5">02</span>
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 font-bold text-sm">
                          2
                        </div>
                        <h4 className="text-sm font-bold text-ink">Daily Market Rate</h4>
                        <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                          The gross gold value is calculated using real-time daily market bullion rates for maximum accuracy.
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="rounded-2xl border border-border/60 bg-surface/60 p-4 relative overflow-hidden">
                        <span className="absolute right-3 top-2 text-3xl font-extrabold text-ink/5">03</span>
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3 font-bold text-sm">
                          3
                        </div>
                        <h4 className="text-sm font-bold text-ink">75% LTV Cap</h4>
                        <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                          Your final eligible loan amount is calculated up to the maximum regulatory limit of 75% of the total gold value.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/60">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>RBI Mandate Compliant</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-brand" />
                      <span>Bank Partner Assessed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-amber-500" />
                      <span>Zero Appraisal Charge</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Key Rules Stat Card (Span 4) */}
                <div className="lg:col-span-4 rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/5 via-card to-brand/10 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand mb-4">
                      <Gem className="h-3.5 w-3.5" />
                      <span>Valuation Metrics</span>
                    </div>

                    <h4 className="text-xl font-bold text-ink">Loan-to-Value (LTV) Cap</h4>
                    <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                      As mandated by the RBI, gold loans can be sanctioned up to 75% of the appraised gold market value.
                    </p>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between rounded-xl bg-surface p-3 text-xs border border-border/60">
                        <span className="text-ink/70 font-medium">Eligible Purity</span>
                        <span className="font-bold text-ink">18K – 24K Gold</span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-surface p-3 text-xs border border-border/60">
                        <span className="text-ink/70 font-medium">Regulatory LTV Limit</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Up to 75%</span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-surface p-3 text-xs border border-border/60">
                        <span className="text-ink/70 font-medium">Non-Gold Deductions</span>
                        <span className="font-bold text-ink">Stones & Gems Excluded</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand/20">
                    <Link
                      href="#calculator"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-brand-dark cursor-pointer"
                    >
                      <span>Check Your Gold Value</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: INVEST IN DIGITAL GOLD */}
            {activeTab === "digital-gold" && (
              <motion.div
                key="digital-gold"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card to-brand/5 p-6 sm:p-8 md:p-10 shadow-xs"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column (Span 7) */}
                  <div className="lg:col-span-7">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Gold Savings Habit</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                      Invest in 24K Digital Gold from ₹10
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm md:text-base leading-relaxed text-ink/70">
                      Rather than borrowing against gold, start building long-term wealth by purchasing 24K 99.9% pure digital gold. Track your holdings anytime in the Cashlo app and convert to physical gold or cash whenever you wish.
                    </p>

                    {/* Bullet Points Grid */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 rounded-xl bg-surface p-3 border border-border/60 text-ink">
                        <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Start micro-savings from ₹10</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-surface p-3 border border-border/60 text-ink">
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>100% Secure Insured Vaults</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-surface p-3 border border-border/60 text-ink">
                        <TrendingUp className="h-4 w-4 text-brand shrink-0" />
                        <span>Sell for cash at live market rates</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-surface p-3 border border-border/60 text-ink">
                        <Coins className="h-4 w-4 text-amber-500 shrink-0" />
                        <span>Redeem for physical 24K coins</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: App & Vault Badge Card (Span 5) */}
                  <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
                    <div className="w-full rounded-2xl border border-border bg-surface/90 p-6 shadow-sm text-center lg:text-left space-y-4">
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-ink">Cashlo App Savings</h4>
                          <p className="text-[11px] text-ink/60">Automated daily & weekly gold SIPs</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Vault Custodians</span>
                        <div className="mt-1 flex items-center justify-center gap-3 text-xs font-bold text-ink">
                          <span>MMTC-PAMP</span>
                          <span>•</span>
                          <span>Augmont Gold</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Help & Assistance Card */}
        <div data-reveal className="mt-12 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ink">Have questions about your gold valuation?</h4>
              <p className="text-xs text-ink/70">Our certified appraisers offer free doorstep or branch evaluations.</p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand/30 hover:text-brand cursor-pointer"
          >
            <span>Talk to an Expert</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}