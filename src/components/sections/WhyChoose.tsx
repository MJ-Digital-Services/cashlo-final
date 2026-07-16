"use client";

import { useRingCarousel } from "@/hooks/useRingCarousel";

const benefits = [
  {
    title: "Digital Payments",
    desc: "Accept payments from any UPI app with a dynamic QR and instant settlement.",
    img: "/cards/why-income.jpg",
  },
  {
    title: "UPI Cash Point",
    desc: "Let customers withdraw cash and earn commission on every eligible transaction.",
    img: "/cards/why-footfall.jpg",
  },
  {
    title: "Recharge & Bill Payments",
    desc: "Offer mobile, DTH, FASTag, and utility bill payments — earn on every transaction.",
    img: "/cards/why-settlement.jpg",
  },
  {
    title: "Loan Services",
    desc: "Help customers access personal and business loans while earning commission.",
    img: "/cards/why-investment.jpg",
  },
  {
    title: "Quick Khata",
    desc: "Track customer and supplier credit digitally — no more paper registers.",
    img: "/cards/why-onboarding.jpg",
  },
  {
    title: "GST & Accounting",
    desc: "Manage GST registration, filing, and ITR without the hassle.",
    img: "/cards/why-easy.jpg",
  },
];

function CardContent({ b }: { b: (typeof benefits)[number] }) {
  return (
    <>
      <div
        role="img"
        aria-label={b.title}
        className="absolute inset-0 bg-[#1a1d26] bg-cover bg-center"
        style={{ backgroundImage: `url(${b.img})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-xl font-semibold text-white">{b.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{b.desc}</p>
      </div>
    </>
  );
}

export default function WhyChoose() {
  const { scope, pinRef, stageRef, ringRef } = useRingCarousel(benefits.length);

  return (
    <section ref={scope} className="relative z-0">
      <div
        ref={pinRef}
        className="relative flex flex-col overflow-hidden bg-bg md:h-screen"
      >
        {/* Heading */}
        <div className="mx-auto max-w-2xl px-6 pt-24 pb-8 text-center md:pt-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Har Dukaan Ki Extra Income
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          More Than Just a Payment App
        </h2>
        <p className="mt-4 text-base text-ink/60">
          Most payment apps only help you accept money. Cashlo helps you earn money.
        </p>
        </div>

        {/* Desktop: 3D ring */}
        <div
          ref={stageRef}
          className="ring-stage hidden flex-1 items-center justify-center md:flex"
        >
          <div ref={ringRef} className="ring3d h-[520px] w-[400px]">
            {benefits.map((b) => (
              <article
                key={b.title}
                className="ring3d__card h-[520px] w-[400px] overflow-hidden rounded-2xl"
              >
                <CardContent b={b} />
              </article>
            ))}
          </div>
        </div>

        {/* Mobile: horizontal scroll-snap row */}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-16 md:hidden">
          {benefits.map((b) => (
            <article
              key={b.title}
              data-mcard
              className="relative h-[420px] w-[80vw] shrink-0 snap-center overflow-hidden rounded-2xl shadow-lg"
            >
              <CardContent b={b} />
            </article>
          ))}
        </div>
      </div>

      {/* Hold: keeps the pinned ring on screen before the curtain arrives */}
      <div aria-hidden className="hidden md:block md:h-[70vh]" />
    </section>
  );
}