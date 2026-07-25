"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Calculator, ArrowRight } from "lucide-react";

const banks = [
  { name: "HDFC Bank", slug: "hdfc-bank-emi-calculator" },
  { name: "SBI", slug: "sbi-emi-calculator" },
  { name: "ICICI Bank", slug: "icici-bank-emi-calculator" },
  { name: "Axis Bank", slug: "axis-bank-emi-calculator" },
  { name: "Kotak Mahindra Bank", slug: "kotak-mahindra-bank-emi-calculator" },
  { name: "Bank of Baroda", slug: "bank-of-baroda-emi-calculator" },
  { name: "Punjab National Bank", slug: "punjab-national-bank-emi-calculator" },
  { name: "Canara Bank", slug: "canara-bank-emi-calculator" },
  { name: "IndusInd Bank", slug: "indusind-bank-emi-calculator" },
  { name: "Tata Capital", slug: "tata-capital-emi-calculator" },
];

export default function EmiCalculatorsPromo() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            Plan Before You Apply
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Check the EMI Before Applying
          </h2>
          <p data-reveal className="mt-4 text-lg text-ink/60">
            Use our free EMI calculators to help customers estimate their
            monthly installment for any of these lenders before they apply.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {banks.map((b) => (
            <Link
              key={b.slug}
              href={`/calculators/${b.slug}`}
              data-reveal
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                <Calculator className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-ink">{b.name}</span>
              <span className="flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Calculate <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        <div data-reveal className="mt-8 text-center">
          <Link
            href="/calculators/emi-calculator"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            View All Calculators
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}