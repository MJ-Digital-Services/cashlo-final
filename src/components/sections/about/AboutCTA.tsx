"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AboutCTA() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-brand to-[#2A3EBE] px-8 py-14 sm:px-14 sm:py-20">
          {/* ambient glow orbs */}
          <div className="pointer-events-none absolute -left-16 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          {/* decorative illustration */}
          <Image
            src="/illustrations/about/about-cta.svg"
            alt=""
            width={320}
            height={320}
            className="pointer-events-none absolute -bottom-10 -right-10 hidden w-64 opacity-90 lg:block"
          />

          <div className="relative flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div
                data-reveal
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Join Cashlo
              </div>
              <h2
                data-reveal
                className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
              >
                Be Part of the Network
              </h2>
              <p
                data-reveal
                className="mt-4 max-w-md text-lg leading-relaxed text-white/80"
              >
                Join thousands of merchants already growing their business
                with Cashlo — and explore how distributors are building
                theirs alongside us.
              </p>
            </div>

            <div
              data-reveal
              className="flex w-full shrink-0 flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <Link
                href="/become-merchant"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
              >
                Become Merchant
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/become-distributor"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/70 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/15"
              >
                Become Distributor
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}