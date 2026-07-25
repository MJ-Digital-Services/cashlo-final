"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is a Gold Loan?",
    a: "A loan taken against gold or jewellery is known as a gold loan. The customer hands over their gold in return for a specific amount, offering a quick and straightforward way to obtain funds with minimal documentation and flexible tenure.",
  },
  {
    q: "Who is eligible for a Gold Loan?",
    a: "Any individual aged 18 or above who owns eligible gold jewellery or ornaments and can provide valid identity and address proof can apply for a gold loan.",
  },
  {
    q: "What documents are required to apply?",
    a: "Any one valid identity proof (Aadhaar, PAN, passport, voter ID, or driving licence) along with an address proof is sufficient to apply.",
  },
  {
    q: "When should a customer apply for a Gold Loan?",
    a: "A gold loan is a good option whenever a customer needs quick funds without going through a lengthy approval process — for medical needs, business expenses, education, or any personal requirement.",
  },
  {
    q: "What happens if a Gold Loan is not repaid?",
    a: "If the loan isn't repaid within the agreed tenure, the pledged gold may be auctioned by the lender to recover the outstanding amount, as per the loan agreement.",
  },
  {
    q: "How is the Gold Loan repaid?",
    a: "Repayment can be made through EMIs, bullet repayment (interest paid periodically, principal at the end), or an overdraft facility — whichever suits the customer's cash flow.",
  },
];

export default function GoldLoanFAQs() {
  const scope = useScrollReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={scope} className="bg-surface py-24">
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