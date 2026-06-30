"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useLimitsStack } from "@/hooks/useLimitsStack";

const limits = [
  { label: "Per Transaction", prefix: "₹", target: 5000, suffix: "", img: "/limits/per-transaction.jpg" },
  { label: "Per Day", prefix: "₹", target: 10000, suffix: "", img: "/limits/per-day.jpg" },
  { label: "Per Month", prefix: "₹", target: 50000, suffix: "", img: "/limits/per-month.jpg" },
  { label: "Max Per Day", prefix: "", target: 2, suffix: " Txns", img: "/limits/max-txns.jpg" },
];

export default function WithdrawalLimits() {
  const { scope, pinRef, stackRef } = useLimitsStack();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <div ref={pinRef}>
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            Withdrawal Limits
          </p>
          <h2
            data-reveal
            className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Clear, Transparent Limits
          </h2>

          <div className="mt-10 flex justify-center">
            <div ref={stackRef} className="relative h-[34rem] w-[calc(2*32rem+2rem)] sm:h-[38rem]">
              {limits.map((l, i) => (
                <div
                  key={l.label}
                  data-card
                  data-index={i}
                  className="absolute left-1/2 top-1/2 h-56 w-[26rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl sm:h-64 sm:w-[32rem]"
                >
                  <Image
                    src={l.img}
                    alt={l.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-baseline text-3xl font-bold text-white sm:text-4xl">
                      <span>{l.prefix}</span>
                      <span data-value data-target={l.target}>
                        0
                      </span>
                      <span>{l.suffix}</span>
                    </div>
                    <div className="mt-1 text-sm text-white/80">{l.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p data-reveal className="mt-6 text-xs leading-relaxed text-ink/50">
          A 30-minute cooling period applies between transactions. Limits may
          change based on applicable banking partner policies and regulatory
          requirements.
        </p>
      </Container>
    </section>
  );
}