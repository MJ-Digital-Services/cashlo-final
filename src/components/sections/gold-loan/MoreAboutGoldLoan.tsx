"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

const sections = [
  {
    title: "Features of a Gold Loan",
    content:
      "Gold loans offer several attractive features designed to provide quick, convenient financial assistance. High loan amounts based on the value of the gold pledged, competitive interest rates, flexible repayment options (bullet, EMI, or overdraft), quick processing with minimal documentation, secure storage of the pledged gold, and no restrictions on how the funds are used — whether for education, medical expenses, business needs, or personal requirements.",
  },
  {
    title: "Gold Loan Valuation Methodology",
    content:
      "The gold's purity and weight are assessed by a certified appraiser at the time of pledge. The loan amount is calculated based on the current market rate of gold and the applicable Loan-to-Value (LTV) ratio, which is capped at 75% as per RBI guidelines. Only the net weight of gold (excluding stones and other embellishments) is considered for valuation.",
  },
  {
    title: "Invest in Digital Gold",
    content:
      "Customers who'd rather build gold savings than borrow against it can invest in 24K digital gold starting from as little as ₹10. The gold is stored securely with a trusted custodian, can be redeemed for cash or physical gold, and tracked anytime from the Cashlo app — a simple way for customers to start a gold-saving habit alongside their everyday transactions.",
  },
];

export default function MoreAboutGoldLoan() {
  const scope = useScrollReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Learn More
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          More About Gold Loan
        </h2>

        <div data-reveal className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
          {sections.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.title}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-ink">{s.title}</span>
                  <span className="shrink-0 text-brand">
                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm leading-relaxed text-ink/60">
                    {s.content}
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