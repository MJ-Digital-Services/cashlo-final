"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import RechargeForm from "./RechargeForm";

export default function RechargeHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-20 pt-40 sm:pt-44">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Recharge &amp; Bill Payments
            </p>
            <h1 data-reveal className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              One Counter for Every Recharge and Bill
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
              Mobile, DTH, electricity, gas, water, FASTag, and broadband —
              offer it all from your shop and earn commission on every
              payment via Bharat Bill Payment System (BBPS).
            </p>
          </div>

          {/* Form */}
          <RechargeForm />
        </div>
      </Container>
    </section>
  );
}