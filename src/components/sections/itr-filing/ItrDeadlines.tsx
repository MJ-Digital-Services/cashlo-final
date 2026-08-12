"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileText,
  Building2,
  Globe,
  History,
  Sparkles,
  Percent,
  CheckCircle2,
} from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDateIso?: string;
  label?: string;
}

function getEndOfMonthIso(): string {
  const now = new Date();
  // day 0 of *next* month = last day of *this* month
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, "0");
  const dd = String(lastDay.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T23:59:59+05:30`;
}

function getEndOfMonthLabel(): string {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatted = lastDay.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `Time Remaining Until ${formatted}`;
}

export function CountdownTimer({
  targetDateIso,
  label,
}: CountdownTimerProps) {
  const resolvedTargetDateIso = targetDateIso ?? getEndOfMonthIso();
  const resolvedLabel = label ?? getEndOfMonthLabel();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(resolvedTargetDateIso).getTime();

    const calculateTime = () => {
      const now = Date.now();
      const difference = Math.max(0, targetDate - now);

      if (isNaN(difference) || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
        hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((difference / (1000 * 60)) % 60)),
        seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [resolvedTargetDateIso]);

  return (
    <div className="rounded-2xl border border-border bg-bg/80 p-6 text-center backdrop-blur-sm shadow-inner">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink/60 mb-4">
        <Clock className="h-4 w-4 text-brand" />
        <span>{resolvedLabel}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs">
          <span className="text-2xl font-black text-brand sm:text-4xl">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink/50 sm:text-xs">
            Days
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs">
          <span className="text-2xl font-black text-brand sm:text-4xl">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink/50 sm:text-xs">
            Hours
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs">
          <span className="text-2xl font-black text-brand sm:text-4xl">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink/50 sm:text-xs">
            Mins
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs">
          <span className="text-2xl font-black text-brand sm:text-4xl">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink/50 sm:text-xs">
            Secs
          </span>
        </div>
      </div>
    </div>
  );
}

interface DeadlineCard {
  id: string;
  category: string;
  taxpayerType: string;
  dueDate: string;
  monthYear: string;
  badge: string;
  badgeStyle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  description: string;
  isPrimary?: boolean;
}

const deadlineCategories: DeadlineCard[] = [
  {
    id: "non-audit",
    category: "Individual & Salaried",
    taxpayerType: "Non-Audit Cases (Salaried, HUFs, Small Businesses)",
    dueDate: "31st July",
    monthYear: "2026",
    badge: "Primary Due Date",
    badgeStyle: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: FileText,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "Standard statutory deadline for all individuals, salaried employees, and entities not requiring a tax audit.",
    isPrimary: true,
  },
  {
    id: "tax-audit",
    category: "Businesses & Audit",
    taxpayerType: "Tax Audit Cases (u/s 44AB, Companies, Partners)",
    dueDate: "31st October",
    monthYear: "2026",
    badge: "Audit Deadline",
    badgeStyle: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: Building2,
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "Mandatory filing date for accounts requiring tax audit reports under Section 44AB of the Income Tax Act.",
  },
  {
    id: "tp-cases",
    category: "Transfer Pricing",
    taxpayerType: "International & Specified Domestic Transactions",
    dueDate: "30th November",
    monthYear: "2026",
    badge: "TP Filing Date",
    badgeStyle: "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    icon: Globe,
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    description: "Extended deadline for taxpayers who are required to furnish Form 3CEB for international/domestic TP transactions.",
  },
  {
    id: "belated-revised",
    category: "Belated & Revised",
    taxpayerType: "Late Returns (u/s 139(4)) & Modifications (u/s 139(5))",
    dueDate: "31st December",
    monthYear: "2026",
    badge: "Final Cutoff",
    badgeStyle: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: History,
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    description: "Last opportunity to file missed returns or revise earlier submissions for FY 2025-26 (AY 2026-27) with late fees.",
  },
];

const penalties = [
  {
    title: "Sec 234F Late Fee",
    desc: "Late filing fee up to ₹5,000 (₹1,000 if total income is ≤ ₹5 Lakhs).",
    icon: ShieldAlert,
    color: "text-amber-500",
  },
  {
    title: "Sec 234A Interest",
    desc: "1% simple interest per month or part of a month on unpaid tax due.",
    icon: Percent,
    color: "text-rose-500",
  },
  {
    title: "Loss of Carry-Forward",
    desc: "Business, capital gains, or stock market losses cannot be carried forward.",
    icon: AlertTriangle,
    color: "text-orange-500",
  },
];

export default function ItrDeadlines() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-20 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-brand/5 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      <Container>
        {/* Header Block */}
        <div data-reveal className="mx-auto max-w-3xl text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand backdrop-blur-sm">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>TAX FILING CALENDAR • FY 2025-26 (AY 2026-27)</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Key ITR Filing Deadlines & Timelines
          </h2>
          <p className="mt-3 text-base text-ink/70 sm:text-lg">
            Stay compliant, avoid late filing penalties, and claim your tax refunds on time by tracking crucial statutory due dates.
          </p>
        </div>

        {/* Featured Hero Countdown Card */}
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-md mb-12"
        >
          {/* Subtle gradient border effect */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl border border-brand/20 bg-gradient-to-r from-brand/10 via-transparent to-emerald-500/10 opacity-70" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left side details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Filing Window Active
              </div>

              <div>
                <h3 className="text-2xl font-bold text-ink sm:text-3xl">
                  Salaried & Individual Due Date
                </h3>
                <p className="mt-2 text-sm text-ink/70 leading-relaxed">
                  The primary statutory deadline for individuals, salaried employees, and non-audit cases to file income tax returns for Assessment Year 2026-27.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-ink/80 pt-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No Audit Required</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Form 16 / ITR-1 / ITR-2 / ITR-4</span>
                </div>
              </div>
            </div>

            {/* Right side live countdown (Extracted Component) */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <CountdownTimer />
            </div>
          </div>
        </div>

        {/* Categorized Deadlines Grid */}
        <div data-reveal className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-ink flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand" />
              <span>Full Tax Calendar (FY 2025-26 / AY 2026-27)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {deadlineCategories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.isPrimary
                      ? "border-brand/40 bg-card shadow-md"
                      : "border-border bg-card/60 hover:bg-card"
                    }`}
                >
                  <div>
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`grid h-12 w-12 place-items-center rounded-xl border ${item.iconBg}`}>
                        <Icon className={`h-6 w-6 ${item.iconColor}`} strokeWidth={1.75} />
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${item.badgeStyle}`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Date display */}
                    <div className="mt-2">
                      <div className="text-2xl font-black text-ink group-hover:text-brand transition-colors">
                        {item.dueDate}
                      </div>
                      <div className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                        {item.monthYear}
                      </div>
                    </div>

                    {/* Taxpayer Category */}
                    <h4 className="mt-3 text-base font-bold text-ink">
                      {item.category}
                    </h4>
                    <p className="mt-1 text-xs font-medium text-ink/60">
                      {item.taxpayerType}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-ink/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consequences of Late Filing Callout Banner */}
        <div
          data-reveal
          className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 backdrop-blur-xs"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <AlertTriangle className="h-5 w-5" />
                <span>WHAT HAPPENS IF YOU MISS THE 31ST JULY DEADLINE?</span>
              </div>
              <h4 className="mt-2 text-xl font-bold text-ink">
                Avoid Late Fees, Penalties & Loss of Tax Benefits
              </h4>
              <p className="mt-1 text-sm text-ink/70">
                Filing your return after the statutory due date triggers automatic penal provisions under the Income Tax Act 1961.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-[600px] shrink-0">
              {penalties.map((pen, idx) => {
                const PenIcon = pen.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-card/80 p-4 backdrop-blur-xs flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <PenIcon className={`h-4 w-4 ${pen.color}`} />
                      <span className="text-xs font-bold text-ink">
                        {pen.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink/65 leading-snug">
                      {pen.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}