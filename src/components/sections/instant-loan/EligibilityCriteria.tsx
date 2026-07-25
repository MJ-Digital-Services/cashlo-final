"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2 } from "lucide-react";

const criteria = [
  "Age between 21 and 60 years",
  "Stable monthly income (salaried or self-employed)",
  "Valid bank account in the applicant's name",
  "Reasonable credit history and repayment track record",
];

export default function EligibilityCriteria() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Who Can Apply
            </p>
            <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Eligibility Criteria
            </h2>
            <p data-reveal className="mt-4 text-lg leading-relaxed text-ink/60">
              Both salaried employees and self-employed individuals can apply.
              Eligibility is assessed on income stability rather than any
              single fixed requirement.
            </p>
          </div>

          <ul className="space-y-4">
            {criteria.map((c) => (
              <li
                key={c}
                data-reveal
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
                <span className="text-sm font-medium text-ink">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}