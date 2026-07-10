"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ContactHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 sm:grid-cols-2 sm:gap-16">
        <div>
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            Contact Us
          </p>
          <h1
            data-reveal
            className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          >
            We&apos;d Love to Hear From You
          </h1>
          <p data-reveal className="mt-5 max-w-xl text-lg text-ink/60">
            Questions about becoming a merchant, a service issue, or just
            feedback — reach out and our team will get back to you.
          </p>
        </div>
        <div data-reveal className="relative mx-auto w-full max-w-md">
          <Image
            src="/illustrations/contact/contact-hero.svg"
            alt="Contact us illustration"
            width={560}
            height={480}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}