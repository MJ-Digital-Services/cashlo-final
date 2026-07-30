"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutHero() {
  const scope = useScrollReveal();

  return (
    <section
      ref={scope}
      className="relative h-screen w-full overflow-hidden bg-bg"
    >
      {/* Full-width background image */}
      <Image
        src="/illustrations/about/about-us-hero.jpg"
        alt="Cashlo retailer accepting payments at his shop counter"
        fill
        priority
        className="object-cover object-[75%_center] sm:object-[65%_center]"
      />

      {/* Extra scrim on small screens where the baked-in fade is too narrow
          to sit behind the stacked text safely */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/60 to-transparent sm:from-bg/95 sm:via-bg/10 sm:to-transparent" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6">
        <div className="max-w-xl">
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            About Cashlo
          </p>
          <h1
            data-reveal
            className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          >
            Turning Every Local Store Into a Digital Banking Point
          </h1>
          <p data-reveal className="mt-5 text-lg text-ink/60">
            We&apos;re building the financial rails that bring banking,
            payments, and everyday services within walking distance of every
            Indian household — starting with the retailer next door.
          </p>
        </div>
      </div>
    </section>
  );
}