"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How do I offer recharge and bill payment services to customers?",
    a: "Log in to the Cashlo merchant app, select the recharge or bill payment option, enter your customer's details, collect cash, and confirm the payment. You'll both get an instant receipt.",
  },
  {
    q: "Which operators and billers are supported?",
    a: "All major mobile operators (Airtel, Jio, VI, BSNL, MTNL) along with 80+ BBPS-enabled billers for electricity, gas, water, DTH, and broadband.",
  },
  {
    q: "How much commission do I earn per transaction?",
    a: "Commission varies by service and biller, and is credited directly to your Cashlo wallet after every successful transaction. Exact rates are visible inside the app.",
  },
  {
    q: "What happens if a transaction fails?",
    a: "Failed transactions are auto-reversed and reflected in your transaction history. If cash was collected but the payment failed, funds are not deducted from your wallet.",
  },
  {
    q: "Is there a limit on how many transactions I can do in a day?",
    a: "No, there's no cap on the number of recharge or bill payment transactions you can process for your customers.",
  },
];

export default function RechargeFAQs() {
  const scope = useScrollReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={scope} aria-labelledby="faqs-heading" className="bg-bg py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            FAQs
          </p>
          <h2 id="faqs-heading" data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Common Questions
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-5xl divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-reveal>
                <button
                  type="button"
                  id={`faq-button-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl"
                >
                  <span className="text-sm font-semibold text-ink">{f.q}</span>
                  <span className="shrink-0 text-brand" aria-hidden="true">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="px-6 pb-5 text-sm leading-relaxed text-ink/60"
                  >
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