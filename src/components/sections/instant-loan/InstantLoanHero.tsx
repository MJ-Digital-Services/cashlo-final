"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function InstantLoanHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Instant Loan
        </p>
        <h1 data-reveal className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Loan Dilao. Commission Kamao.
        </h1>
        <p data-reveal className="mt-5 max-w-xl text-lg text-ink/60">
          Help your customers access instant personal and business loans with
          minimal paperwork, and earn attractive commission on every
          disbursal.
        </p>
      </Container>
    </section>
  );
}