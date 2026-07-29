"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Calculator, ArrowRight } from "lucide-react";
import { banks } from "@/lib/data/banks";


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
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-md"
          >
            <span className="flex h-12 w-full max-w-[140px] items-center justify-center">
              {b.logo ? (
                <Image
                  src={b.logo}
                  alt={`${b.name} logo`}
                  width={140}
                  height={48}
                  className="h-full w-auto max-w-full object-contain"
                />
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10">
                  <Calculator className="h-5 w-5 text-brand" strokeWidth={1.75} />
                </span>
              )}
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