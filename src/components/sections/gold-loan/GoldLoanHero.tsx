"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2, Coins, Sparkles, Wallet } from "lucide-react";
import GoldHeroAnimation from "./GoldHeroAnimation";

const checklist = [
  "Attractive Interest Rates",
  "No Foreclosure Charges on Small Loans",
  "Quick Disbursal, Minimal Paperwork",
];

const trustBadges = [
  {
    icon: Coins,
    title: "Instant Gold Loan",
    desc: "Quick approval with minimal paperwork.",
  },
  {
    icon: Sparkles,
    title: "Invest in 24K Digital Gold",
    desc: "Start investing anytime with small amounts.",
  },
  {
    icon: Wallet,
    title: "Earn Commission on Every Transaction",
    desc: "Generate additional income from every successful service.",
  },
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
              Unlock the Power of Gold.
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
              Offer your customers instant gold loans with minimal documentation
               or help them start investing in 24K Digital Gold from as little as ₹10. 
               Earn attractive commissions on every successful transaction while expanding your shop's income.
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

          <div data-reveal className="hidden lg:block">
            <GoldHeroAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}