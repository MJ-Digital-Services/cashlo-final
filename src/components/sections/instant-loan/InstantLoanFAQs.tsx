"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How quickly can a customer get an instant loan?",
    a: "Approval is often same-day once KYC and income details are submitted correctly. Actual disbursal timing depends on the lending partner's verification process.",
  },
  {
    q: "What loan amount can customers get?",
    a: "Loan amounts depend on the customer's income, credit profile, and the lending partner's policies. There's no fixed amount — it's assessed case by case.",
  },
  {
    q: "Is there a fee for using the EMI calculator?",
    a: "No, the EMI calculators are completely free to use for both merchants and their customers.",
  },
  {
    q: "How is commission calculated and paid?",
    a: "Commission is a percentage of the loan amount disbursed, credited to your Cashlo wallet after successful disbursal. Exact rates are visible inside the app.",
  },
  {
    q: "What if a customer's application gets rejected?",
    a: "Rejections can happen due to credit history or income mismatch. No commission is earned on rejected applications, and the customer can reapply once eligible.",
  },
];

export default function InstantLoanFAQs() {
  const scope = useScrollReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            FAQs
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-reveal>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-ink">{f.q}</span>
                  <span className="shrink-0 text-brand">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-ink/60">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}