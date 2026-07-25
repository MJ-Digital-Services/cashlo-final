"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Smartphone } from "lucide-react";

const operators = [
  { name: "Airtel", type: "Prepaid" },
  { name: "Jio", type: "Prepaid" },
  { name: "VI", type: "Prepaid" },
  { name: "BSNL", type: "Prepaid" },
  { name: "MTNL", type: "Prepaid" },
  { name: "Airtel", type: "Postpaid" },
  { name: "Vi", type: "Postpaid" },
  { name: "Jio", type: "Postpaid" },
  { name: "BSNL", type: "Postpaid" },
];

export default function OperatorGrid() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            All Major Operators
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Recharge Any Number, Any Operator
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 sm:grid-cols-5">
          {operators.map((op, i) => (
            <div
              key={`${op.name}-${op.type}-${i}`}
              data-reveal
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                <Smartphone className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold text-ink">{op.name}</span>
              <span className="text-xs text-ink/50">{op.type}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}