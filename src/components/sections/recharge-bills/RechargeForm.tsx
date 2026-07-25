"use client";

import { useState } from "react";
import { Smartphone, ChevronDown, CheckCircle2, ShieldCheck, Zap, ArrowRight } from "lucide-react";

const operators = ["Airtel", "Jio", "VI", "BSNL", "MTNL"];
const circles = [
  "Delhi/NCR", "Mumbai", "Kolkata", "Maharashtra", "Uttar Pradesh (E)",
  "Uttar Pradesh (W)", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan",
];

export default function RechargeForm() {
  const [mode, setMode] = useState<"prepaid" | "postpaid">("prepaid");

  return (
    <div
      className="group/form relative mx-auto w-full max-w-md rounded-2xl border border-border/80 bg-card/70 p-5 shadow-2xl backdrop-blur-xl sm:p-6 text-left transition-all duration-150 hover:border-brand/40 hover:shadow-brand/10"
    >
      {/* Top edge glow beam */}
      <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent transition-opacity duration-150 opacity-60 group-hover/form:opacity-100" />

      {/* Tabs */}
      <div role="tablist" aria-label="Recharge Type" className="flex gap-1.5 rounded-xl bg-surface/80 p-1 border border-border/60">
        {(["prepaid", "postpaid"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            id={`tab-${m}`}
            aria-selected={mode === m}
            aria-controls="recharge-form-panel"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              mode === m
                ? "bg-brand text-white shadow-sm"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {m}
          </button>
        ))}
      </div>


      <form
        id="recharge-form-panel"
        role="tabpanel"
        aria-labelledby={`tab-${mode}`}
        onSubmit={(e) => e.preventDefault()}
        className="mt-4 space-y-3"
      >
        {/* Mobile number field */}
        <div>
          <label htmlFor="mobile-number" className="block text-[10px] font-bold uppercase tracking-wider text-brand ml-0.5 mb-1">
            Mobile Number
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-surface/50 px-3.5 py-2.5 focus-within:border-brand focus-within:bg-bg focus-within:shadow-[0_0_15px_rgba(68,93,240,0.12)] transition-all">
            <Smartphone className="h-4 w-4 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />
            <input
              id="mobile-number"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-transparent text-xs font-semibold text-ink placeholder:text-ink/40 focus:outline-none"
              disabled
              aria-disabled="true"
            />
          </div>
        </div>

        {/* Operator + Circle */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="operator-select" className="block text-[10px] font-bold uppercase tracking-wider text-brand ml-0.5 mb-1">
              Operator
            </label>
            <div className="relative">
              <select
                id="operator-select"
                disabled
                aria-disabled="true"
                className="w-full appearance-none rounded-xl border border-border/80 bg-surface/50 px-3.5 py-2.5 text-xs font-medium text-ink/80 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>Select Operator</option>
                {operators.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/50" aria-hidden="true" />
            </div>
          </div>

          <div>
            <label htmlFor="circle-select" className="block text-[10px] font-bold uppercase tracking-wider text-brand ml-0.5 mb-1">
              Circle
            </label>
            <div className="relative">
              <select
                id="circle-select"
                disabled
                aria-disabled="true"
                className="w-full appearance-none rounded-xl border border-border/80 bg-surface/50 px-3.5 py-2.5 text-xs font-medium text-ink/80 focus:outline-none"
                defaultValue=""
              >
                <option value="" disabled>Select Circle</option>
                {circles.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/50" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount-input" className="block text-[10px] font-bold uppercase tracking-wider text-brand ml-0.5 mb-1">
            Amount
          </label>
          <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-surface/50 px-3.5 py-2.5 focus-within:border-brand focus-within:bg-bg transition-all">
            <span className="text-xs font-bold text-brand" aria-hidden="true">₹</span>
            <input
              id="amount-input"
              type="text"
              placeholder="Enter plan amount"
              className="w-full bg-transparent text-xs font-semibold text-ink placeholder:text-ink/40 focus:outline-none"
              disabled
              aria-disabled="true"
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="group/btn relative flex w-full items-center justify-center gap-2 cursor-not-allowed rounded-xl bg-brand py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-dark hover:shadow-brand/30"
        >
          <span>Proceed to Recharge</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
        </button>
      </form>

      {/* Trust badges */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-border/60 text-[10px] font-semibold text-ink/60">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
          Instant Settlement
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
          High Commission
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          BBPS Assured
        </span>
      </div>
    </div>
  );
}




