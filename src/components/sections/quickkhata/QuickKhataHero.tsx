"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import PhoneFrame from "./PhoneFrame";

export default function QuickKhataHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            QuickKhata
          </p>
          <h1
            data-reveal
            className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          >
            Your Udhaar, Organized.
          </h1>
          <p data-reveal className="mt-5 max-w-xl text-lg text-ink/60">
            Replace your paper khata with a digital ledger. Track what
            customers owe you, what you owe them, and never lose a
            transaction again.
          </p>
          <div data-reveal className="mt-8 flex flex-wrap gap-4">
            <a
              href="/become-merchant"
              className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Become Merchant
            </a>
          </div>
        </div>

        <div data-reveal className="order-1 lg:order-2">
          <PhoneFrame
            src="/screenshots/quickkhata-app.png"
            alt="QuickKhata ledger showing customer balances"
          />
        </div>
      </div>
    </section>
  );
}