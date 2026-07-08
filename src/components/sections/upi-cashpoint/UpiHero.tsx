"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function UpiHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <div className="mx-auto w-full max-w-7xl px-6">
        <p
          data-reveal
          className="text-sm font-semibold uppercase tracking-wider text-brand"
        >
          UPI CashPoint
        </p>
        <h1
          data-reveal
          className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-ink sm:text-5xl"
        >
          Empowering Merchants to Provide Seamless Cash Withdrawal
        </h1>
        <p
          data-reveal
          className="mt-5 max-w-xl text-lg text-ink/60"
        >
          Give your customers instant cash using any UPI app — safely,
          quickly, and with zero cash handling risk.
        </p>
      </div>
    </section>
  );
}