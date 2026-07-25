"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2 } from "lucide-react";
import GoldHeroAnimation from "./GoldHeroAnimation";

const checklist = [
  "Attractive Interest Rates",
  "No Foreclosure Charges on Small Loans",
  "Quick Disbursal, Minimal Paperwork",
];

export default function GoldLoanHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Gold Loan &amp; Digital Gold
            </p>
            <h1 data-reveal className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Sona Rakho, Paisa Pao — Instantly
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
              Help your customers unlock quick funds against their gold, or
              start investing in digital gold — all from your shop.
            </p>

            <ul className="mt-8 space-y-3">
              {checklist.map((item) => (
                <li key={item} data-reveal className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              data-reveal
              href="/become-distributor"
              className="mt-8 inline-flex items-center rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Become Merchant
            </Link>
          </div>

          <div data-reveal className="hidden lg:block">
            <GoldHeroAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}