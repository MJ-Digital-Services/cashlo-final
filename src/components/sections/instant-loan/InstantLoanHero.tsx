"use client";

import Link from "next/link";
import { Coins, Zap, Landmark } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import InstantLoanHeroAnimation from "./InstantLoanHeroAnimation";

const trustBadges = [
  {
    icon: Coins,
    title: "High Commission",
    desc: "Earn on every successful loan disbursal.",
  },
  {
    icon: Zap,
    title: "Instant Approval",
    desc: "Fast digital process with minimal paperwork.",
  },
  {
    icon: Landmark,
    title: "Trusted Lending Partners",
    desc: "Loans from RBI-compliant financial institutions.",
  },
];

export default function InstantLoanHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Instant Loan
            </p>
            <h1 data-reveal className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Offer Loans. Grow Your Income.
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
            Help your customers get instant personal and business loans through 
            a quick digital process. Earn attractive commission on every 
            successful loan disbursal while expanding your business with zero investment.
            </p>

            <div data-reveal className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/become-merchant"
                className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                Start Earning Today
              </Link>
            </div>

            {/* Trust badges */}
            <div data-reveal className="mt-10 grid gap-5 sm:grid-cols-3">
              {trustBadges.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <Icon size={18} strokeWidth={2.25} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animation */}
          <div data-reveal className="hidden lg:block">
            <InstantLoanHeroAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}