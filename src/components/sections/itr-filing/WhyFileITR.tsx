"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Zap,
  TrendingUp,
  BadgeCheck,
  ShieldAlert,
  Award,
  Clock,
  Shield,
  Percent,
} from "lucide-react";

interface Benefit {
  title: string;
  badge: string;
  badgeStyle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  highlight: string;
  desc: string;
}

const benefits: Benefit[] = [
  {
    title: "Faster Tax Refunds",
    badge: "Direct Credit",
    badgeStyle: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: Zap,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    highlight: "Direct Bank Transfer",
    desc: "Filing early ensures your return is e-verified and processed quickly, placing excess TDS refunds straight into your account.",
  },
  {
    title: "Carry Forward Losses",
    badge: "Tax Saver",
    badgeStyle: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: TrendingUp,
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    highlight: "Up to 8 Assessment Years",
    desc: "Business, capital gains, or stock market losses can only be set off against future income if filed before the statutory due date.",
  },
  {
    title: "Seamless Loan & Visa Approvals",
    badge: "Income Proof",
    badgeStyle: "border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    icon: BadgeCheck,
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    highlight: "Official Financial Record",
    desc: "Banks and embassies require 2 to 3 years of ITR acknowledgements as authoritative proof of income for loans and visas.",
  },
  {
    title: "Avoid Penalties & Interest",
    badge: "Compliance",
    badgeStyle: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: ShieldAlert,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    highlight: "Save up to ₹5,000 Late Fee",
    desc: "Filing past due dates triggers mandatory late fees under Section 234F alongside 1% monthly interest on tax dues under Section 234A.",
  },
];

const highlights = [
  {
    icon: Clock,
    label: "Timely Processing",
    val: "Filing in ~15 Mins",
  },
  {
    icon: Shield,
    label: "Loss Carry Forward",
    val: "Up to 8 Years",
  },
  {
    icon: Percent,
    label: "Section 234F Relief",
    val: "Zero Late Fee Risk",
  },
];

export default function WhyFileITR() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="relative overflow-hidden bg-surface py-24">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-brand/5 blur-3xl">
        <div className="h-[500px] w-[900px] rounded-full bg-brand/10" />
      </div>

      <Container>
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            data-reveal
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Key Advantages</span>
          </div>

          <h2
            data-reveal
            className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Why File Your ITR On Time
          </h2>

          <p data-reveal className="mt-4 text-base text-ink/70 sm:text-lg">
            Punctual filing unlocks financial benefits, protects your capital gains, and safeguards your financial profile against statutory penalties.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                data-reveal
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5"
              >
                {/* Subtle Hover Gradient Accent */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/5 transition-transform duration-500 group-hover:scale-150" />

                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border ${b.iconBg} ${b.iconColor} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${b.badgeStyle}`}
                    >
                      {b.badge}
                    </span>
                  </div>

                  {/* Title & Highlight Pill */}
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">
                    {b.title}
                  </h3>

                  <div className="mt-2 inline-block rounded-md bg-bg px-2.5 py-1 text-xs font-medium text-ink/70 border border-border/60">
                    {b.highlight}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-ink/65 sm:text-sm">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Metrics / Value Highlights Strip */}
        <div
          data-reveal
          className="mt-12 overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-border/60">
            {highlights.map((h, i) => {
              const HIcon = h.icon;
              return (
                <div
                  key={h.label}
                  className={`flex items-center gap-4 ${
                    i !== 0 ? "sm:pl-6" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <HIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-ink/50">
                      {h.label}
                    </div>
                    <div className="text-sm font-bold text-ink sm:text-base">
                      {h.val}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}