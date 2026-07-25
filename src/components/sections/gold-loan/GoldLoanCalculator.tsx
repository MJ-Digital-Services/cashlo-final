"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sparkles, Coins } from "lucide-react";

// Approximate 24K gold rate per gram (₹). Indicative only — actual valuation
// happens at the point of pledge based on live rates and purity checks.
const RATE_24K_PER_GRAM = 10783;
const PURITY_FACTOR: Record<string, number> = {
  "24k": 1,
  "22k": 0.9167,
  "18k": 0.75,
};
const LTV_RATIO = 0.75; // RBI-mandated max loan-to-value on gold loans

export default function GoldLoanCalculator() {
  const scope = useScrollReveal();
  const [carat, setCarat] = useState("24k");
  const [weight, setWeight] = useState("50");

  const { goldValue, eligibleLoan } = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const ratePerGram = RATE_24K_PER_GRAM * (PURITY_FACTOR[carat] ?? 1);
    const value = w * ratePerGram;
    return {
      goldValue: Math.round(value),
      eligibleLoan: Math.round(value * LTV_RATIO),
    };
  }, [carat, weight]);

  return (
    <section ref={scope} className="relative bg-bg py-20 lg:py-28 overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-96 w-96 rounded-full bg-brand/5 blur-3xl" />

      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            data-reveal
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand"
          >
            <Coins className="h-3.5 w-3.5" />
            Know Before You Pledge
          </p>
          <h2
            data-reveal
            className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Gold Loan Calculator
          </h2>
          <p data-reveal className="mt-4 text-base text-ink/60 sm:text-lg">
            Find out how much your customer could borrow against their gold, instantly.
          </p>
        </div>

        {/* Layout Grid */}
        <div
          data-reveal
          className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:items-stretch"
        >
          {/* Inputs Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div>
              <h3 className="text-base font-bold text-ink sm:text-lg">Enter Gold Details</h3>

              {/* Purity Field */}
              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                  Purity
                </label>
                <div className="mt-2 flex gap-2.5">
                  {Object.keys(PURITY_FACTOR).map((c) => {
                    const isSelected = carat === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCarat(c)}
                        className={`flex-1 rounded-2xl border py-3 text-sm font-bold uppercase transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-brand bg-brand text-white shadow-sm"
                            : "border-border bg-bg text-ink/60 hover:border-brand/40 hover:text-ink"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight Field */}
              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
                  Weight (grams)
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-bg px-4 py-3.5 text-base font-semibold text-ink transition-all focus:border-brand focus:bg-card focus:outline-none focus:ring-2 focus:ring-brand/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter weight in grams"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/40">
                    grams
                  </span>
                </div>
              </div>
            </div>

            {/* Note */}
            <p className="mt-6 pt-5 border-t border-border/50 text-xs leading-relaxed text-ink/40">
              *Indicative rate: ₹{RATE_24K_PER_GRAM.toLocaleString("en-IN")}/g for 24K gold.
              Final valuation happens at the point of pledge.
            </p>
          </div>

          {/* Result Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-dark to-slate-900 p-6 text-white shadow-xl sm:p-8">
            {/* Background Decorative Blur */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-brand/30 blur-2xl" />

            <div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-md shadow-inner">
                <Sparkles className="h-6 w-6 text-yellow-300" strokeWidth={1.75} />
              </div>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                  Estimated Gold Value
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  ₹{goldValue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                Eligible Loan Amount (up to 75%)
              </p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                ₹{eligibleLoan.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}