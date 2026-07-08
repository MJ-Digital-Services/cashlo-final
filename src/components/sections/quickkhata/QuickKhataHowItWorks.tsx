"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    title: "Add a Customer",
    desc: "Enter their name and mobile number once to create their khata entry.",
  },
  {
    num: "02",
    title: "Log the Transaction",
    desc: "Record the amount they owe you, or the amount you owe them.",
  },
  {
    num: "03",
    title: "Collect & Settle",
    desc: "Send a reminder, collect the payment, and mark the entry as settled.",
  },
];

export default function QuickKhataHowItWorks() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <p
          data-reveal
          className="text-sm font-semibold uppercase tracking-wider text-brand"
        >
          How It Works
        </p>
        <h2
          data-reveal
          className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Three Steps to a Cleaner Ledger
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.num}
              data-reveal
              className="rounded-2xl border border-border p-6 transition-colors hover:border-brand/20"
            >
              <div className="text-xl font-bold text-brand/40">{s.num}</div>
              <h3 className="mt-3 font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}