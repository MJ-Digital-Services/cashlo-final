"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function FaqCTA() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="relative overflow-hidden bg-brand py-16">
      <Image
        src="/illustrations/faq/faq-cta.svg"
        alt=""
        width={280}
        height={280}
        className="pointer-events-none absolute -bottom-8 -right-8 hidden w-56 opacity-90 sm:block"
      />
      <Container className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div data-reveal>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Still Have Questions?
          </h2>
          <p className="mt-2 text-white/80">
            Our support team is here to help with anything not covered above.
          </p>
        </div>
        <Link
          data-reveal
          href="/contact"
          className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-white/90"
        >
          Contact Support
        </Link>
      </Container>
    </section>
  );
}