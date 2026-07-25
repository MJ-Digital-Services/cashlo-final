"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Wallet, TrendingDown, FileCheck, ShieldAlert } from "lucide-react";

const benefits = [
  {
    icon: Wallet,
    title: "Faster Refunds",
    desc: "Filing on time means quicker processing of any tax refund owed to you.",
  },
  {
    icon: TrendingDown,
    title: "Carry Forward Losses",
    desc: "Business or capital losses can only be carried forward to future years if the return is filed on time.",
  },
  {
    icon: FileCheck,
    title: "Loan & Visa Applications",
    desc: "ITR receipts are commonly required as proof of income for loan approvals and visa applications.",
  },
  {
    icon: ShieldAlert,
    title: "Avoid Penalties",
    desc: "Missing the deadline can mean late fees, interest charges, and other compliance issues.",
  },
];

export default function WhyFileITR() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Why It Matters
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Why File Your ITR On Time
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} data-reveal className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                <b.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{b.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}