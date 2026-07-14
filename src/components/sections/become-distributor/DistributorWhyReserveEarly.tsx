"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function DistributorWhyReserveEarly() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-brand py-16 sm:py-20">
      <Container className="mx-auto max-w-2xl text-center">
        <div data-reveal>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Why Reserve Early?
          </h2>
          <p className="mt-4 text-white/80">
            Only one distributor is allowed for each PIN Code. Once your preferred area is booked, it
            will not be available again. Reserve your territory before someone else secures it.
          </p>
          <a
            href="#reserve"
            className="mt-7 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand shadow-sm transition-transform hover:scale-[1.03]"
          >
            Reserve My PIN Code
          </a>
        </div>
      </Container>
    </section>
  );
}