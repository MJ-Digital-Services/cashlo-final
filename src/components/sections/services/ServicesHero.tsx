"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2 } from "lucide-react";

const checklist = [
  "Zero Setup Cost",
  "Instant Commission Payouts",
  "One App, Every Service",
];

export default function ServicesHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            Everything Under One Roof
          </p>
          <h1 data-reveal className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Our Services
          </h1>
          <p data-reveal className="mt-5 text-lg text-ink/60">
            From cash withdrawal to loans, bill payments to tax filing — offer
            your customers everything they need and earn commission on every
            transaction.
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {checklist.map((item) => (
              <li key={item} data-reveal className="flex items-center gap-2 text-sm font-medium text-ink">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-brand" strokeWidth={1.75} />
                {item}
              </li>
            ))}
          </ul>

          <Link
            data-reveal
            href="/become-distributor"
            className="mt-8 inline-flex items-center rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Become Merchant
          </Link>
        </div>
      </Container>
    </section>
  );
}
