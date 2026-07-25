"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CashloHeroAnimation from "@/components/sections/CashloHeroAnimation";

export default function UpiHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              UPI CashPoint
            </p>
            <h1 data-reveal className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Empowering Merchants to Provide Seamless Cash Withdrawal
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
              Give your customers instant cash using any UPI app — safely,
              quickly, and with zero cash handling risk.
            </p>
          </div>

          {/* Animation */}
          <div data-reveal className="hidden lg:block">
            <CashloHeroAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}