"use client";

import { useMorphRules } from "@/hooks/useMorphRules";

const rules = [
  {
    num: "01",
    title: "Accept Any Payment",
    desc: "UPI, dynamic QR, and cash point withdrawals — all handled from one app.",
  },
  {
    num: "02",
    title: "Unlock New Income",
    desc: "Earn commission on recharges, bill payments, loans, and every service you offer.",
  },
  {
    num: "03",
    title: "Manage Your Business",
    desc: "Khata, GST, staff tracking, and reports — all in one place.",
  },
];

export default function ImportantRules() {
  const { scope, wrapRef, shapeRef } = useMorphRules();

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg md:h-screen">
      {/* ---------- Desktop: pinned morph scene ---------- */}
      <div className="relative hidden h-full flex-col items-center justify-center md:flex">
        {/* Heading */}
        <div
          data-morph-head
          className="absolute top-20 z-10 px-6 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Your Complete Business Companion
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Not Just Payments. A Complete Shop OS.
          </h2>
        </div>

        {/* Morphing shape + rule cards */}
        <div ref={wrapRef} className="morph-wrap">
          <svg viewBox="0 0 600 600">
            <path ref={shapeRef} />
          </svg>

          {rules.map((r) => (
            <div key={r.num} data-rule-card className="morph-card">
              <div className="text-lg font-bold text-brand/50">{r.num}</div>
              <h3 className="mt-2 font-semibold text-ink">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Final message inside the full-screen brand circle */}
        <div
          data-morph-final
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0"
        >
          <div className="max-w-3xl px-6 text-center text-white">
          <h3 className="text-5xl font-bold sm:text-6xl lg:text-7xl">
            Payment bhi. Kamai bhi.
          </h3>
          <p className="mt-5 whitespace-nowrap text-lg text-white/80 sm:text-xl">
            One app. Every way to grow your shop.
          </p>
          </div>
        </div>
      </div>

      {/* ---------- Mobile: simple cards ---------- */}
      <div className="px-6 py-20 md:hidden">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand">
        Your Complete Business Companion
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink">
        Not Just Payments. A Complete Shop OS.
      </h2>
        <div className="mt-8 space-y-4">
          {rules.map((r) => (
            <div
              key={r.num}
              data-mrule
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="text-xl font-bold text-brand/40">{r.num}</div>
              <h3 className="mt-3 font-semibold text-ink">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}