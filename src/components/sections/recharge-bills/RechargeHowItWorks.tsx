"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { LogIn, ListChecks, UserSearch, Receipt, CheckCircle2 } from "lucide-react";

const steps = [
  { num: "01", icon: LogIn, title: "Login to Cashlo App", desc: "Open the Cashlo merchant app and log in with your registered account." },
  { num: "02", icon: ListChecks, title: "Pick a Service", desc: "Choose recharge, DTH, or a bill category from the app menu." },
  { num: "03", icon: UserSearch, title: "Enter Customer Details", desc: "Add the mobile number or consumer number to fetch the exact amount." },
  { num: "04", icon: Receipt, title: "Confirm & Collect Cash", desc: "Confirm the payment, collect cash from the customer, and process it instantly." },
  { num: "05", icon: CheckCircle2, title: "Instant Receipt", desc: "Both you and the customer get an instant digital receipt for the transaction." },
];

export default function RechargeHowItWorks() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          How It Works
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Five Simple Steps
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
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