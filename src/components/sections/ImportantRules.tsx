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
  const { scope, wrapRef, shapeRef, tintRef } = useMorphRules();

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg md:h-screen">
      {/* Full-bleed sketch, faint watermark behind everything */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: "url(/images/important-rules-bg.png)" }}
        aria-hidden="true"
      />

      {/* ---------- Desktop: pinned morph scene ---------- */}
      <div className="relative hidden h-full flex-col items-center justify-center md:flex">
        {/* Heading — sits on its own small frosted panel, not the full image,
            so it doesn't collide with the sketch's own "CASHLO" wordmark
            behind it, while everything else in the illustration stays visible */}
        <div
          data-morph-head
          className="absolute top-20 z-10 mx-auto max-w-2xl rounded-2xl bg-bg/80 px-8 py-5 text-center shadow-sm backdrop-blur-md"
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
            <defs>
              <clipPath id="morphClip">
                <use href="#morphShapePath" />
              </clipPath>
            </defs>

            {/* Invisible master path — its `d` drives the clip AND the tint below */}
            <path id="morphShapePath" ref={shapeRef} fill="none" />

            {/* The sketch illustration, only visible inside the current shape outline */}
            <image
              href="/images/important-rules-bg.png"
              x="0"
              y="0"
              width="600"
              height="600"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#morphClip)"
            />

            {/* Color tint on top of the clipped image — ramps to fully
                opaque brand as the shape becomes the final circle */}
            <use href="#morphShapePath" ref={tintRef} />
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
          <h3 className="text-6xl font-bold sm:text-7xl lg:text-8xl">
            Payment bhi. Kamai bhi.
          </h3>
          <p className="mt-5 whitespace-nowrap text-lg text-white/80 sm:text-xl">
            One app. Every way to grow your shop.
          </p>
          </div>
        </div>
      </div>

      {/* ---------- Mobile: simple cards ---------- */}
      <div className="relative px-6 py-20 md:hidden">
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