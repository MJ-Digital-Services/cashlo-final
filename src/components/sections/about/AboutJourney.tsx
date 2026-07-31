"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useStepTimeline } from "@/hooks/useStepTimeline";

const milestones = [
  {
    year: "2024",
    title: "Cashlo Founded",
    description:
      "Started with a mission to bring cardless cash withdrawal to every retail store in India.",
    image: "/illustrations/about/journey/founded.png",
  },
  {
    year: "2026",
    title: "UPI CashPoint Launches",
    description:
      "Our flagship service goes live, turning the first wave of retailers into digital banking points.",
    image: "/illustrations/about/journey/upi-cashpoint.png",
  },
  {
    year: "2026",
    title: "QuickKhata Introduced",
    description:
      "Merchants get a digital ledger to track customer credit — no more paper khata books.",
    image: "/illustrations/about/journey/quickkhata.png",
  },
  {
    year: "2026",
    title: "Service Suite Expands",
    description:
      "Recharge, bill payments, travel, and insurance join the platform under one merchant app.",
    image: "/illustrations/about/journey/service-suite.png",
  },
  {
    year: "2026",
    title: "Scaling Nationwide",
    description:
      "Growing our merchant network across rural and semi-urban India, one neighborhood at a time.",
    image: "/illustrations/about/journey/scaling.png",
  },
];

export default function AboutJourney() {
  const { scope, trackRef } = useStepTimeline();

  return (
    <section ref={scope} className="bg-surface py-20 sm:py-24">
      <Container>
        <div data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Our Journey
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From One Store to a Network
          </h2>
        </div>

        <div ref={trackRef} className="relative mt-16">
          <div className="absolute left-3 top-1 bottom-1 w-px bg-border sm:left-6">
            <div
              data-fill
              className="absolute left-0 top-0 h-full w-full bg-brand"
            />
            <div
              data-pulse
              className="absolute -left-[5px] top-0 h-3 w-3 rounded-full bg-brand shadow-[0_0_16px_var(--color-brand)]"
            />
          </div>

          <div className="space-y-16">
            {milestones.map((m) => (
              <div
                key={m.title}
                data-row
                className="timeline-row relative grid gap-6 pl-12 sm:grid-cols-2 sm:items-center sm:gap-10 sm:pl-20"
              >
                <div className="tl-dot absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-ink/50 sm:left-3">
                  {m.year.slice(2)}
                </div>

                <div data-content>
                  <span className="text-xs font-semibold text-brand">
                    {m.year}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-ink">
                    {m.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-ink/60">
                    {m.description}
                  </p>
                </div>

                <div
                  data-content
                  className="relative h-52 sm:h-64"
                >
                  <Image
                    data-parallax-img
                    src={m.image}
                    alt={m.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}