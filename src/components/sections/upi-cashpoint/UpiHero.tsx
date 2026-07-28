"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function UpiHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg pt-5 mt-13 sm:pt-4">
      <div className="relative aspect-[2.4/1] w-full min-h-[400px] lg:min-h-[540px]">
        {/* Full-width background image */}
        <Image
          src="/images/upi-cashpoint-hero.png"
          alt="Cashlo UPI Cash Point kiosk with merchant serving customers"
          fill
          priority
          className="object-cover object-[68%_15%] lg:object-[62%_15%]"
        />

        {/* Scrim for text legibility: light on the left, fading to clear over the kiosk */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 30%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 65%)",
          }}
        />

        {/* Text overlaid on the empty left side of the image */}
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div data-reveal className="max-w-md lg:max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">
                UPI CashPoint
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Empowering Merchants to Provide Seamless Cash Withdrawal
              </h1>
              <p className="mt-5 max-w-sm text-base text-ink/60 sm:text-lg">
                Give your customers instant cash using any UPI app — safely,
                quickly, and with zero cash handling risk.
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}