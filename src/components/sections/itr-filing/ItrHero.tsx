"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ItrHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Income Tax Return Filing
        </p>
        <h1 data-reveal className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Understanding ITR Filing, Simplified
        </h1>
        <p data-reveal className="mt-5 max-w-xl text-lg text-ink/60">
          A quick guide to income tax return types, required documents, and
          deadlines for FY 2025-26 (AY 2026-27) — everything you need to know
          before you file.
        </p>
      </Container>
    </section>
  );
}