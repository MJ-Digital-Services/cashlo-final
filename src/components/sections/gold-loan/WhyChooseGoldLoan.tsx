"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Zap, RefreshCcw, ShieldCheck, Layers } from "lucide-react";

const features = [
  { icon: Zap, title: "Quick Disbursement", desc: "Funds credited within minutes of gold valuation and KYC." },
  { icon: RefreshCcw, title: "Overdraft Facility", desc: "Withdraw only what's needed and pay interest on that amount." },
  { icon: ShieldCheck, title: "Secure & Convenient", desc: "Gold is insured and securely stored until the loan is repaid." },
  { icon: Layers, title: "Multipurpose Loan", desc: "Use the funds for anything — medical, business, or personal needs." },
];

export default function WhyChooseGoldLoan() {
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