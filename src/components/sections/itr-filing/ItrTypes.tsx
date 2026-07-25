"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  User,
  Users,
  Briefcase,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";

type CategoryFilter = "all" | "salaried" | "investor" | "business" | "presumptive";

interface ItrType {
  id: string;
  form: string;
  name: string;
  category: CategoryFilter;
  complexity: string;
  estimatedTime: string;
  badgeStyle: string;
  accentBg: string;
  icon: React.ElementType;
  tagline: string;
  description: string;
  incomeLimit: string;
  keyIncludes: string[];
  exclusions: string;
}

const filterOptions: { label: string; value: CategoryFilter }[] = [
  { label: "All Forms", value: "all" },
  { label: "Salaried & Pension", value: "salaried" },
  { label: "Capital Gains & Property", value: "investor" },
  { label: "Business & Profession", value: "business" },
  { label: "Presumptive Scheme", value: "presumptive" },
];

const types: ItrType[] = [
  {
    id: "itr-1",
    form: "ITR-1",
    name: "Sahaj",
    category: "salaried",
    complexity: "Simple",
    estimatedTime: "~15 mins",
    badgeStyle: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    accentBg: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    icon: User,
    tagline: "For Resident Salaried Individuals & Pensioners",
    description: "Designed for individuals earning income from salary, pension, or single house property with straightforward finances.",
    incomeLimit: "Total Income ≤ ₹50 Lakhs",
    keyIncludes: [
      "Income from Salary or Pension",
      "One single House Property",
      "Other sources (Interest, Dividends, etc.)",
      "Agricultural income up to ₹5,000",
    ],
    exclusions: "Not applicable for Directors, Unlisted Share holdings, or Capital Gains.",
  },
  {
    id: "itr-2",
    form: "ITR-2",
    name: "Individuals & HUFs",
    category: "investor",
    complexity: "Detailed",
    estimatedTime: "~30 mins",
    badgeStyle: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    accentBg: "from-blue-500/10 via-blue-500/5 to-transparent",
    icon: Users,
    tagline: "For Capital Gains, Stocks & Foreign Assets",
    description: "For individuals & HUFs with capital gains from stocks or property, multiple houses, or foreign assets — without business income.",
    incomeLimit: "No Maximum Limit",
    keyIncludes: [
      "Capital Gains (Stocks, Mutual Funds, Crypto, Real Estate)",
      "Multiple House Properties",
      "Foreign Income & Foreign Assets",
      "Company Directors & Unlisted Equity holders",
    ],
    exclusions: "Cannot be used if you have income from Business or Profession.",
  },
  {
    id: "itr-3",
    form: "ITR-3",
    name: "Business & Profession",
    category: "business",
    complexity: "Comprehensive",
    estimatedTime: "~45 mins",
    badgeStyle: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400",
    accentBg: "from-purple-500/10 via-purple-500/5 to-transparent",
    icon: Briefcase,
    tagline: "For Proprietary Businesses, Freelancers & F&O",
    description: "Comprehensive form for individuals and HUFs deriving income from a business, profession, or intraday / F&O trading.",
    incomeLimit: "Audit & Non-Audit Cases",
    keyIncludes: [
      "Proprietary Business Income & Partnership Profits",
      "Freelance, Consulting & Professional Fees",
      "Futures & Options (F&O) & Intraday Trading",
      "Includes all income sources from ITR-1 & ITR-2",
    ],
    exclusions: "Requires detailed Financial Statements (P&L & Balance Sheet).",
  },
  {
    id: "itr-4",
    form: "ITR-4",
    name: "Sugam",
    category: "presumptive",
    complexity: "Fast-Track",
    estimatedTime: "~20 mins",
    badgeStyle: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    accentBg: "from-amber-500/10 via-amber-500/5 to-transparent",
    icon: Store,
    tagline: "For Presumptive Tax Scheme (Sec 44AD / 44ADA)",
    description: "Simplified filing for small business owners, traders, and professionals opting for presumptive income scheme to save audit hassles.",
    incomeLimit: "Turnover ≤ ₹2 Cr (Biz) / ₹50L (Prof)",
    keyIncludes: [
      "Presumptive Business Income @ 6% to 8% (Sec 44AD)",
      "Presumptive Professional Income @ 50% (Sec 44ADA)",
      "Resident Individuals, HUFs & Partnership Firms",
      "No complex bookkeeping or accounting audit required",
    ],
    exclusions: "Not applicable if carrying forward business losses or earning > ₹50L salary.",
  },
];

export default function ItrTypes() {
  const scope = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const filteredTypes = activeFilter === "all"
    ? types
    : types.filter((t) => t.category === activeFilter);

  return (
    <section ref={scope} className="relative bg-surface py-24 overflow-hidden">
      {/* Background Decorative Ambient Radial Gradient */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] bg-brand/5 blur-[120px] rounded-full" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Choosing the Right Form</span>
          </div>

          <h2 data-reveal className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Types of ITR Forms Explained
          </h2>

          <p data-reveal className="mt-4 text-base text-ink/70 sm:text-lg">
            Selecting the wrong form can cause your tax return to be declared defective by the IT Department.
            Explore which form matches your income profile.
          </p>
        </div>

        {/* Category Filter Pills (ShadcnBlocks Feature Bar) */}
        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-2 px-2">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-brand text-white shadow-md shadow-brand/25 scale-[1.02]"
                    : "bg-card border border-border text-ink/70 hover:text-ink hover:border-brand/40 hover:bg-card/80"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Feature Cards Grid (ShadcnBlocks Grid Style) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredTypes.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                data-reveal
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1"
              >
                {/* Subtle Hover Gradient Accent */}
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${t.accentBg} blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div>
                  {/* Top Bar: Icon, Form Code & Complexity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="grid h-11 w-11 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl border border-border bg-surface text-brand shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand/10">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink">
                            {t.form}
                          </h3>
                          <span className="text-xs sm:text-sm font-medium text-ink/60">
                            ({t.name})
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-brand">
                          {t.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${t.badgeStyle}`}>
                        {t.complexity}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink/50 whitespace-nowrap">
                        <Clock className="h-3 w-3 shrink-0" />
                        {t.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Form Description */}
                  <p className="mt-4 sm:mt-5 text-sm leading-relaxed text-ink/70">
                    {t.description}
                  </p>

                  {/* Income Limit Badge */}
                  <div className="mt-4 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-medium text-ink/80">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand" />
                    <span className="truncate">{t.incomeLimit}</span>
                  </div>

                  {/* Key Allowed Incomes Checklist */}
                  <div className="mt-6 space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                      Eligible Sources of Income:
                    </p>
                    <ul className="space-y-2">
                      {t.keyIncludes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug text-ink/80">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Exclusions Note */}
                <div className="mt-6 border-t border-border/60 pt-4">
                  <div className="flex items-start gap-2 text-[11px] leading-relaxed text-ink/50">
                    <Info className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <span>{t.exclusions}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
