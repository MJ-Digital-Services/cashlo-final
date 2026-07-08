"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function UpiCTA() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-brand py-16">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div data-reveal>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Join?
          </h2>
          <p className="mt-2 text-white/80">
            Become a Cashlo merchant and start offering UPI CashPoint today.
          </p>
        </div>
        <Link
          data-reveal
          href="/become-merchant"
          className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90"
        >
          Become Merchant
        </Link>
      </Container>
    </section>
  );
}