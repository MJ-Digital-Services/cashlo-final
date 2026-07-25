"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CalendarClock } from "lucide-react";

export default function ItrDeadlines() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-24">
      <Container>
        <div
          data-reveal
          className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
              <CalendarClock className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="font-semibold text-ink">ITR Filing Deadline</h3>
              <p className="mt-0.5 text-sm text-ink/60">FY 2025-26 (AY 2026-27), non-audit cases</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-2xl font-bold text-ink sm:text-3xl">31st July 2026</p>
            <p className="mt-0.5 text-xs text-ink/40">Belated/revised returns may still be filed after, with late fees</p>
          </div>
        </div>
      </Container>
    </section>
  );
}