"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Briefcase, Store, CheckCircle2 } from "lucide-react";

const salaried = [
  "PAN Card & Aadhaar Card",
  "Last 3 months' salary slips",
  "Last 6 months' bank statement",
];

const selfEmployed = [
  "PAN Card & Aadhaar Card",
  "Business proof (GST/registration certificate)",
  "Last 6 months' bank statement",
];

export default function DocumentsRequired() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            Get Started
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Documents Required
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div data-reveal className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand">
                <Briefcase className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <h3 className="font-semibold text-ink">Salaried</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {salaried.map((doc) => (
                <li key={doc} className="flex items-center gap-2.5 text-sm text-ink/70">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand">
                <Store className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <h3 className="font-semibold text-ink">Self-Employed</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {selfEmployed.map((doc) => (
                <li key={doc} className="flex items-center gap-2.5 text-sm text-ink/70">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}