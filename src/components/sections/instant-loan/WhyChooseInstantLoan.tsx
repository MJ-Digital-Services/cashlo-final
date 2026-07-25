"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Zap, FileText, CalendarRange, PiggyBank } from "lucide-react";

const features = [
  { icon: Zap, title: "Quick Approval", desc: "Fast eligibility checks and approval, often within the same day." },
  { icon: FileText, title: "Minimal Documentation", desc: "Just basic KYC and income proof — no lengthy paperwork." },
  { icon: CalendarRange, title: "Flexible Tenure", desc: "Repayment options tailored to the customer's monthly cash flow." },
  { icon: PiggyBank, title: "Attractive Commission", desc: "Earn a percentage on every loan successfully disbursed." },
];

export default function WhyChooseInstantLoan() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Why Cashlo
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Why Choose Us?
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} data-reveal className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}