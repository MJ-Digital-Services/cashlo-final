"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function RechargeCTA() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} aria-labelledby="recharge-cta-heading" className="bg-brand py-16">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div data-reveal>
          <h2 id="recharge-cta-heading" className="text-2xl font-bold text-white sm:text-3xl">
            Start Earning on Every Bill
          </h2>
          <p className="mt-2 text-white/80">
            Become a Cashlo merchant and offer recharge &amp; bill payments today.
          </p>
        </div>
        <Link
          data-reveal
          href="/become-distributor"
          aria-label="Become a Cashlo merchant to offer recharge and bill payments"
          className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Become Merchant
        </Link>
      </Container>
    </section>
  );
}