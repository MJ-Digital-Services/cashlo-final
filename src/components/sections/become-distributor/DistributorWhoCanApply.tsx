"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const personas = [
  "Retailers",
  "Wholesalers",
  "Business Owners",
  "Sales Professionals",
  "Freelancers",
  "Entrepreneurs",
  "Field Sales Executives",
  "Anyone looking for recurring income",
];

export default function DistributorWhoCanApply() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-20 sm:py-24">
      <Container className="mx-auto max-w-3xl text-center">
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Eligibility</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Who Can Become a Distributor?
          </h2>
        </div>

        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
          {personas.map((p) => (
            <span
              key={p}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink"
            >
              {p}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}