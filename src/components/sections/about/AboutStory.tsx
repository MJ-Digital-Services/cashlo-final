"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutStory() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-20 sm:py-24">
      <Container className="grid items-center gap-10 sm:grid-cols-[1.15fr_1fr] sm:gap-12 lg:gap-16">
        <div data-reveal className="relative mx-auto w-full max-w-xl sm:order-1 sm:max-w-none">
          <Image
            src="/illustrations/about/about-story.png"
            alt="Cashlo story illustration"
            width={720}
            height={630}
            className="h-auto w-full"
          />
        </div>
        <div data-reveal className="sm:order-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Our Story
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Banking shouldn&apos;t require a branch
          </h2>
          <div className="mt-4 space-y-4 text-ink/70">
            <p>
              Cashlo was built on a simple observation: for millions of
              people in rural and semi-urban India, the nearest ATM or bank
              branch is often kilometers away — but the nearest kirana store
              almost never is.
            </p>
            <p>
              Through UPI CashPoint, we turn that neighborhood store into a
              trusted cash withdrawal point, letting customers access their
              own money with just a UPI app — no card, no branch visit, no
              waiting.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}