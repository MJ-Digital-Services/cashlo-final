"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  CheckCircle2,
  FileCheck,
  UserCheck,
  Receipt,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";

interface DocumentCategory {
  title: string;
  badge: string;
  badgeStyle: string;
  icon: React.ElementType;
  description: string;
  items: {
    name: string;
    tag?: string;
  }[];
}

const categories: DocumentCategory[] = [
  {
    title: "Identity & Basics",
    badge: "Mandatory",
    badgeStyle: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: UserCheck,
    description: "Core verification details required for all taxpayer profiles.",
    items: [
      { name: "PAN Card", tag: "Primary ID" },
      { name: "Aadhaar Card", tag: "Link Required" },
      { name: "Bank Account Details & IFSC", tag: "For Refund" },
    ],
  },
  {
    title: "Income Proofs",
    badge: "Auto-Populated",
    badgeStyle: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: Receipt,
    description: "Employer & tax credit records reflecting total gross income.",
    items: [
      { name: "Form 16", tag: "From Employer" },
      { name: "Form 26AS", tag: "Tax Credit" },
      { name: "Annual Information Statement (AIS) & TIS", tag: "IT Portal" },
    ],
  },
  {
    title: "For Business & Freelance",
    badge: "If Applicable",
    badgeStyle: "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    icon: Briefcase,
    description: "Financial summaries for self-employed professionals & business owners.",
    items: [
      { name: "Financial Statements (P&L, Balance Sheet)", tag: "Accounts" },
      { name: "GST Returns (Monthly / Quarterly)", tag: "GSTR-3B / 1" },
      { name: "Form 16A (TDS Certificate)", tag: "Client TDS" },
    ],
  },
  {
    title: "Deductions & Exemptions",
    badge: "Tax Savers",
    badgeStyle: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: ShieldCheck,
    description: "Investment receipts and expense proofs to reduce tax liability.",
    items: [
      { name: "LIC & Health Insurance Receipts", tag: "Sec 80C & 80D" },
      { name: "House Rent Receipts & Agreement", tag: "HRA Exemption" },
      { name: "Investment & Donation Proofs", tag: "Sec 80C, 80G" },
    ],
  },
];

export default function DocumentsChecklist() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg py-24">
      {/* Background Subtle Accents */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 text-brand/5 blur-3xl">
        <div className="h-[400px] w-[800px] rounded-full bg-brand/10" />
      </div>

      <Container>
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            data-reveal
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand"
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Preparation Checklist</span>
          </div>

          <h2
            data-reveal
            className="mt-4 text-3xl text-balance font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Documents You'll Need Before Filing
          </h2>

          <p data-reveal className="mt-4 text-base text-ink/70 sm:text-lg">
            ITR is an annexure-less filing process — no physical attachments are required.
            Keeping these documents handy ensures seamless filing and accurate reporting.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                data-reveal
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 transition-all duration-300 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5"
              >
                {/* Decorative Subtle Radial Gradient on Hover */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/5 transition-transform duration-500 group-hover:scale-150" />

                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-brand shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-brand/30">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-ink">
                          {c.title}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.badgeStyle}`}
                    >
                      {c.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-ink/60 sm:text-sm">
                    {c.description}
                  </p>

                  {/* Checklist Items */}
                  <ul className="mt-6 space-y-3">
                    {c.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-bg/50 px-3.5 py-2.5 text-sm font-medium text-ink/80 transition-colors group-hover:border-border"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CheckCircle2
                            className="h-4 w-4 shrink-0 text-brand"
                            strokeWidth={2}
                          />
                          <span className="truncate text-ink/90">{item.name}</span>
                        </div>
                        {item.tag && (
                          <span className="ml-2 shrink-0 rounded-md bg-card px-2 py-0.5 text-[11px] font-medium text-ink/50 border border-border/60">
                            {item.tag}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shadcnblocks Pro-Tip Banner */}
        <div
          data-reveal
          className="mt-10 overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-r from-brand/10 via-brand/5 to-transparent p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-base font-bold text-ink sm:text-lg">
                  Pro-Tip: Auto-Populated Tax Credit Data
                  <span className="inline-flex items-center gap-1 text-xs font-normal text-brand">
                    <Info className="h-3.5 w-3.5" /> Portal Feature
                  </span>
                </h4>
                <p className="mt-1 text-sm text-ink/70">
                  Form 26AS and AIS (Annual Information Statement) are directly pre-filled on the Income Tax Portal.
                  Linking your Aadhaar with PAN ensures instant data population without manual entry errors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}