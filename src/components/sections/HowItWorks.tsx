"use client";

import { useBlindsSlideshow } from "@/hooks/useBlindsSlideshow";

const steps = [
  {
    num: "01",
    title: "Download the Cashlo App",
    desc: "Get started in minutes — download the app and create your merchant account.",
    img: "/howitworks/step-01.jpg",
  },
  {
    num: "02",
    title: "Complete KYC Verification",
    desc: "Verify your shop and identity with a simple, fast KYC process.",
    img: "/howitworks/step-02.jpg",
  },
  {
    num: "03",
    title: "Activate Your Services",
    desc: "Turn on the services you want to offer — payments, cash point, recharge, loans, and more.",
    img: "/howitworks/step-03.jpg",
  },
  {
    num: "04",
    title: "Start Accepting Payments & Earning Commission",
    desc: "Go live and start earning commission on every transaction, from day one.",
    img: "/howitworks/step-04.jpg",
  },
];

const SLATS = 12;

export default function HowItWorks() {
  const { scope, stageRef } = useBlindsSlideshow(steps.length);

  return (
    // z-10 + opaque content => this section slides OVER the pinned ring section
    <section ref={scope} className="relative z-10 bg-bg">
      {/* ---------- Desktop: pinned blinds slideshow ---------- */}
      <div ref={stageRef} className="relative hidden h-screen overflow-hidden md:block">
        {/* Slides (stacked; first on top) */}
        {steps.map((s) => (
          <div key={s.num} data-slide className="blind-slide absolute inset-0">
            {Array.from({ length: SLATS }).map((_, j) => (
              <div key={j} className="blind-slat">
                <div
                  className="blind-slat__img"
                  style={{
                    backgroundImage: `url(${s.img})`,
                    width: `${SLATS * 100}%`,
                    left: `-${j * 100}%`,
                  }}
                />
                {/* darkening lives inside the slat so it rotates with it */}
                <div className="absolute inset-0 bg-black/35" />
              </div>
            ))}
          </div>
        ))}

        {/* shared bottom gradient for text legibility */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* section label */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            How It Works
          </p>
        </div>

        {/* per-step text (crossfaded by the hook) */}
        {steps.map((s) => (
          <div
            key={s.num}
            data-slide-text
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
          >
            <div className="mx-auto max-w-7xl px-6 pb-16 lg:pb-20">
              <span className="text-6xl font-bold text-white/25">{s.num}</span>
              <h3 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {s.title}
              </h3>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/85">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Mobile: simple full-width stacked steps ---------- */}
      <div className="space-y-6 px-6 py-20 md:hidden">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-brand">
          How It Works
        </p>
        {steps.map((s) => (
          <article
            key={s.num}
            data-mstep
            className="relative h-[70vh] overflow-hidden rounded-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${s.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="text-4xl font-bold text-white/25">{s.num}</span>
              <h3 className="mt-1 text-2xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{s.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}