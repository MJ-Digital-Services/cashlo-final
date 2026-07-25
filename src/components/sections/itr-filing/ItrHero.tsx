"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ITRFilingAnimation from "./ITRFilingAnimation";

export default function ItrHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Income Tax Return Filing
            </p>
            <h1 data-reveal className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Understanding ITR Filing, Simplified
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
              A quick guide to income tax return types, required documents,
              and deadlines for FY 2025-26 (AY 2026-27) — everything you need
              to know before you file.
            </p>
          </div>

          {/* Animation */}
          <div data-reveal className="hidden lg:block">
            <ITRFilingAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}