"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2 } from "lucide-react";

const categories = [
  {
    title: "Identity & Basics",
    items: ["PAN Card", "Aadhaar Card", "Bank account details & IFSC code"],
  },
  {
    title: "Income Proof",
    items: ["Form 16 (from employer)", "Form 26AS", "Annual Information Statement (AIS) & TIS"],
  },
  {
    title: "For Business/Freelance Income",
    items: ["Financial statements", "GST returns (if applicable)", "Form 16A (TDS receivable)"],
  },
  {
    title: "Deductions & Exemptions",
    items: ["LIC/insurance premium receipts", "House rent receipts (if applicable)", "Investment & donation proofs (80C, 80G, etc.)"],
  },
];

export default function DocumentsChecklist() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Before You Start
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Documents You'll Need
        </h2>
        <p data-reveal className="mt-4 max-w-2xl text-lg text-ink/60">
          ITR is an annexure-less form — nothing gets attached — but keeping
          these ready makes filing faster and helps if the department asks
          for them later.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {categories.map((c) => (
            <div key={c.title} data-reveal className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-ink">{c.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}