"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import InstantLoanHeroAnimation from "./InstantLoanHeroAnimation";

export default function InstantLoanHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Instant Loan
            </p>
            <h1 data-reveal className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Loan Dilao. Commission Kamao.
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
              Help your customers access instant personal and business loans
              with minimal paperwork, and earn attractive commission on every
              disbursal.
            </p>
          </div>

          {/* Animation */}
          <div data-reveal className="hidden lg:block">
            <InstantLoanHeroAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}