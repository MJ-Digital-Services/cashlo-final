"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { LogIn, ClipboardList, BadgeCheck, Wallet } from "lucide-react";

const steps = [
  { num: "01", icon: LogIn, title: "Login to Cashlo App", desc: "Open the merchant app and select the Instant Loan service." },
  { num: "02", icon: ClipboardList, title: "Submit Customer Details", desc: "Enter the customer's basic KYC and income details for eligibility check." },
  { num: "03", icon: BadgeCheck, title: "Approval", desc: "The lending partner reviews and approves the application, often same-day." },
  { num: "04", icon: Wallet, title: "Disbursal & Commission", desc: "Funds are disbursed to the customer, and your commission is credited." },
];

export default function HowItWorks() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          How It Works
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Four Simple Steps
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num} data-reveal className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                <s.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="mt-5 text-2xl font-bold text-brand/40">{s.num}</div>
              <h3 className="mt-2 font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}