"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PiggyBank } from "lucide-react";

export default function InterestRateBanner() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface pb-24">
      <Container>
        <div
          data-reveal
          className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
              <PiggyBank className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="font-semibold text-ink">Affordable Interest Rates</h3>
              <p className="mt-0.5 text-sm text-ink/60">Get your customers the best rates on gold loans</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-2xl font-bold text-ink sm:text-3xl">Starting from 11.91%* p.a.</p>
            <p className="mt-0.5 text-xs text-ink/40">*Terms &amp; conditions apply</p>
          </div>
        </div>
      </Container>
    </section>
  );
}