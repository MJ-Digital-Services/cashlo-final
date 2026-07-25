"use client";

import { useState } from "react";
import { Smartphone, ChevronDown } from "lucide-react";

const operators = ["Airtel", "Jio", "VI", "BSNL", "MTNL"];
const circles = [
  "Delhi/NCR", "Mumbai", "Kolkata", "Maharashtra", "Uttar Pradesh (E)",
  "Uttar Pradesh (W)", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan",
];

export default function RechargeForm() {
  const [mode, setMode] = useState<"prepaid" | "postpaid">("prepaid");

  return (
    <div
      data-reveal
      className="mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      {/* Tabs */}
      <div className="flex gap-2 rounded-full bg-surface p-1">
        {(["prepaid", "postpaid"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold capitalize transition-colors ${
              mode === m
                ? "bg-brand text-white"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Mobile number */}
      <div className="mt-6">
        <label className="text-xs font-medium text-ink/60">Mobile Number</label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-bg px-4 py-3">
          <Smartphone className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.75} />
          <input
            type="tel"
            placeholder="Enter 10 digit mobile number"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            disabled
          />
        </div>
      </div>

      {/* Operator + Circle */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-ink/60">Operator</label>
          <div className="relative mt-1.5">
            <select
              disabled
              className="w-full appearance-none rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink/60 focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>Select Operator</option>
              {operators.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-ink/60">Circle</label>
          <div className="relative mt-1.5">
            <select
              disabled
              className="w-full appearance-none rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink/60 focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>Select Circle</option>
              {circles.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="mt-4">
        <label className="text-xs font-medium text-ink/60">Amount</label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-bg px-4 py-3">
          <span className="text-sm text-ink/40">₹</span>
          <input
            type="text"
            placeholder="Enter amount"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            disabled
          />
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-full bg-brand py-3.5 text-sm font-semibold text-white opacity-90"
      >
        Proceed to Recharge
      </button>

      <p className="mt-3 text-center text-xs text-ink/40">
        Available through the Cashlo Merchant App
      </p>
    </div>
  );
}