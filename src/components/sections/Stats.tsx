"use client";

import Container from "@/components/ui/Container";
import { useCountUp } from "@/hooks/useCountUp";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Stats() {
  const countScope = useCountUp();
  const revealScope = useScrollReveal();

  return (
    <section
      ref={countScope}
      className="bg-gradient-to-br from-brand to-brand-dark py-24"
    >
      <Container>
        {/* Eyebrow with a live pulse dot */}
        <div className="mb-12 flex items-center justify-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Growing Every Day
          </p>
        </div>

        {/* Bento grid */}
        <div
          ref={revealScope}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2"
        >
          {/* Featured — inverted white card spanning 2×2 */}
          <article
            data-reveal
            className="relative col-span-2 flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-8 lg:row-span-2"
          >
            {/* faded watermark number for depth */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-10 select-none text-[11rem] font-black leading-none text-brand/[0.06]"
            >
              1M
            </span>

            <span className="relative inline-flex w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Lifetime volume
            </span>

            <div className="relative mt-10">
              <div className="text-6xl font-bold tracking-tight text-brand sm:text-7xl">
                <span data-count="1" data-suffix="M+">
                  0
                </span>
              </div>
              <div className="mt-2 text-lg font-semibold text-ink">
                Successful Transactions
              </div>
              <p className="mt-1 text-sm text-ink/50">
                Processed securely on trusted UPI rails.
              </p>
            </div>
          </article>

          {/* 50,000+ — wide glass card */}
          <article
            data-reveal
            className="col-span-2 flex flex-col justify-center rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm transition hover:bg-white/[0.16]"
          >
            <div className="text-4xl font-bold text-white sm:text-5xl">
              <span data-count="50000" data-suffix="+">
                0
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-white/80">
              Registered Merchants
            </div>
          </article>

          {/* 100+ */}
          <article
            data-reveal
            className="flex flex-col justify-center rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm transition hover:bg-white/[0.16]"
          >
            <div className="text-4xl font-bold text-white">
              <span data-count="100" data-suffix="+">
                0
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-white/80">
              Cities Connected
            </div>
          </article>

          {/* 24×7 — static */}
          <article
            data-reveal
            className="flex flex-col justify-center rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm transition hover:bg-white/[0.16]"
          >
            <div className="text-4xl font-bold text-white">24×7</div>
            <div className="mt-2 text-sm font-medium text-white/80">
              Merchant Support
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}