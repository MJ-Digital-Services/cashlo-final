"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sparkles } from "lucide-react";

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
    const ratePerGram = RATE_24K_PER_GRAM * PURITY_FACTOR[carat];
    const value = w * ratePerGram;
    return {
      goldValue: Math.round(value),
      eligibleLoan: Math.round(value * LTV_RATIO),
    };
  }, [carat, weight]);

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            Know Before You Pledge
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Gold Loan Calculator
          </h2>
          <p data-reveal className="mt-4 text-lg text-ink/60">
            Find out how much your customer could borrow against their gold,
            instantly.
          </p>
        </div>

        <div data-reveal className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-ink">Enter Gold Details</h3>

            <div className="mt-5">
              <label className="text-xs font-medium text-ink/60">Purity</label>
              <div className="mt-1.5 flex gap-2">
                {Object.keys(PURITY_FACTOR).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCarat(c)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold uppercase transition-colors ${
                      carat === c
                        ? "border-brand bg-brand text-white"
                        : "border-border bg-bg text-ink/60 hover:text-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs font-medium text-ink/60">Weight (grams)</label>
              <input
                type="number"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-ink/40">
              *Indicative rate: ₹{RATE_24K_PER_GRAM.toLocaleString("en-IN")}/g for 24K gold.
              Final valuation happens at the point of pledge.
            </p>
          </div>

          {/* Result */}
          <div className="flex flex-col justify-center rounded-2xl bg-brand p-6 text-white">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-4 text-sm text-white/80">Estimated Gold Value</p>
            <p className="text-2xl font-bold">₹{goldValue.toLocaleString("en-IN")}</p>

            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="text-sm text-white/80">Eligible Loan Amount (up to 75%)</p>
              <p className="text-3xl font-bold">₹{eligibleLoan.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}