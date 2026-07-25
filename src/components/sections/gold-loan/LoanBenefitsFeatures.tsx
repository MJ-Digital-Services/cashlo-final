"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ChevronRight } from "lucide-react";

const tabs = [
  {
    label: "Loan Benefits",
    points: [
      { title: "Offerings", desc: "Term Loan, Overdraft, and Bullet repayment options available." },
      { title: "Interest Rates", desc: "Competitive rates on Term Loan, Overdraft, and EMI-based repayment." },
      { title: "Tenure", desc: "Gold loans available for tenure ranging from 6 to 42 months." },
    ],
  },
  {
    label: "Repayment Terms",
    points: [
      { title: "EMI Repayment", desc: "Pay fixed monthly installments covering principal and interest." },
      { title: "Bullet Repayment", desc: "Pay only interest during the tenure, principal at the end." },
      { title: "Overdraft", desc: "Pay interest only on the amount withdrawn, whenever you use it." },
    ],
  },
  {
    label: "Loan Processing",
    points: [
      { title: "Minimal Documentation", desc: "Just ID and address proof — no income proof required." },
      { title: "Instant Valuation", desc: "Gold is valued on the spot by a certified appraiser." },
      { title: "Same-Day Disbursal", desc: "Funds are credited the same day, right after approval." },
    ],
  },
  {
    label: "Terms & Conditions",
    points: [
      { title: "Loan-to-Value", desc: "Loan amount is capped at 75% of the gold's value, per RBI norms." },
      { title: "Foreclosure", desc: "No foreclosure charges on loans up to ₹50 lakh for eligible borrowers." },
      { title: "Auction on Default", desc: "Pledged gold may be auctioned if the loan isn't repaid as agreed." },
    ],
  },
];

export default function LoanBenefitsFeatures() {
  const scope = useScrollReveal();
  const [active, setActive] = useState(0);

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Everything You Need to Know
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Loan Benefits &amp; Features
        </h2>

        <div data-reveal className="mt-10 grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* Tab list */}
          <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActive(i)}
                className={`flex shrink-0 items-center justify-between gap-2 rounded-xl px-5 py-4 text-left text-sm font-semibold transition-colors lg:shrink ${
                  active === i
                    ? "bg-brand text-white"
                    : "border border-border bg-card text-ink hover:border-brand/30"
                }`}
              >
                {tab.label}
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="rounded-2xl bg-brand p-8 text-white">
            <h3 className="text-lg font-bold">{tabs[active].label}</h3>
            <div className="mt-5 space-y-4">
              {tabs[active].points.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-white/70" />
                  <p className="text-sm leading-relaxed text-white/90">
                    <span className="font-semibold text-white">{p.title}:</span> {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}