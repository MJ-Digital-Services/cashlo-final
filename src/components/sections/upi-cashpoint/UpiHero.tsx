"use client";

import Image from "next/image";
import { Landmark, BadgeCheck, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const trustBadges = [
  { icon: Landmark, label: "Regulated by RBI" },
  { icon: BadgeCheck, label: "Approved by NPCI" },
  { icon: ShieldCheck, label: "Trusted & Secure" },
];

export default function UpiHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg pt-5 mt-13 sm:pt-4">
      {/* Phones: image banner, then text below it on the page background.
          lg+: text overlaid on the empty left side of a wide image. */}
      <div className="relative w-full lg:aspect-[2.4/1] lg:min-h-[540px]">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
          <Image
            src="/images/upi-cashpoint-hero.jpg"
            alt="Cashlo UPI Cash Point kiosk with merchant serving customers"
            fill
            priority
            // dark mode: tone the bright daytime photo down so it sits in
            // the dark page instead of glaring out of it
            className="object-cover object-[68%_15%] lg:object-[62%_15%] dark:brightness-[0.78] dark:saturate-[0.9]"
          />

          {/* Scrim for text legibility: page-colored on the left, fading to
              clear over the kiosk. Light mode: the photo's white sky already
              matches the page, so a translucent scrim is enough. */}
          <div
            className="absolute inset-0 hidden lg:block dark:lg:hidden"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--bg) 90%, transparent) 0%, color-mix(in srgb, var(--bg) 75%, transparent) 30%, color-mix(in srgb, var(--bg) 25%, transparent) 50%, transparent 65%)",
            }}
          />
          {/* Dark mode: a translucent scrim over the white sky reads as a
              muddy grey band, so go fully page-colored behind the text and
              ease out over many stops (no visible step) before the kiosk. */}
          <div
            className="absolute inset-0 hidden dark:lg:block"
            style={{
              background:
                "linear-gradient(90deg, var(--bg) 0%, var(--bg) 26%, color-mix(in srgb, var(--bg) 92%, transparent) 33%, color-mix(in srgb, var(--bg) 72%, transparent) 41%, color-mix(in srgb, var(--bg) 45%, transparent) 49%, color-mix(in srgb, var(--bg) 20%, transparent) 57%, transparent 66%)",
            }}
          />
          {/* Dark mode: melt the photo's top/bottom edges into the page so
              it doesn't end on a hard bright line under the navbar or above
              the next section (phones too, where text sits below it). */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              background:
                "linear-gradient(to bottom, var(--bg) 0%, transparent 14%, transparent 80%, var(--bg) 100%)",
            }}
          />
        </div>

        <div className="relative py-8 sm:py-10 lg:absolute lg:inset-0 lg:flex lg:items-center lg:py-0">
        <Container>
  <div className="lg:translate-y-10 2xl:-translate-x-8">
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

    {/* Trust badges — own width, not constrained by the max-w-md text column above */}
    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 sm:w-max sm:max-w-none sm:flex-nowrap">
      {trustBadges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
            <Icon size={16} strokeWidth={2.25} className="text-brand" />
          </div>
          <span className="whitespace-nowrap text-sm font-semibold text-ink sm:text-base">
            {label}
          </span>
        </div>
      ))}
    </div>
  </div>
</Container>
        </div>
      </div>
    </section>
  );
}