"use client";

import Container from "@/components/ui/Container";
import { useScrubScale } from "@/hooks/useScrubScale";
import { useHorizontalCards } from "@/hooks/useHorizontalCards";

const pillars = [
  {
    title: "100% Secure",
    desc: "Every transaction is protected through secure UPI payment infrastructure with encrypted processing.",
    img: "/cards/secure.jpg",
  },
  {
    title: "RBI Compliant Process",
    desc: "Cashlo follows applicable banking partner processes and operational guidelines.",
    img: "/cards/guidelines.jpg",
  },
  {
    title: "Bank-grade Security",
    desc: "Every payment travels through trusted UPI rails ensuring reliable, fast fund transfers.",
    img: "/cards/money-transfer.jpg",
  },
  {
    title: "Data Protection",
    desc: "Merchant and customer information is handled with strict privacy and security standards.",
    img: "/cards/data-protection.jpg",
  },
];

export default function Trust() {
  const headingScope = useScrubScale();
  const { scope, pinRef, trackRef } = useHorizontalCards();

  return (
    <section ref={scope} className="bg-white">
      <div
        ref={pinRef}
        className="relative overflow-hidden md:flex md:h-screen md:flex-col"
      >
        {/* Heading — extra top padding so the floating navbar clears it */}
        <Container>
          <div
            ref={headingScope}
            className="mx-auto max-w-2xl pt-28 pb-12 text-center md:pt-32 md:pb-0"
          >
            <h2
              data-scrub
              className="text-4xl font-bold tracking-tight text-ink sm:text-5xl"
            >
              Trusted by Dukandaars Everywhere
            </h2>
            <p data-scrub className="mt-3 text-lg font-medium text-brand">
              Aapka Vishwas, Hamari Zimmedari
            </p>
            <p data-scrub className="mt-4 text-base text-ink/60">
              Every transaction on Cashlo is protected using secure banking
              infrastructure and trusted UPI payment systems — a safe,
              transparent experience for merchants and customers alike.
            </p>
          </div>
        </Container>

        {/* Cards row */}
        <div className="flex md:flex-1 md:items-center md:overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-full flex-col gap-6 px-6 md:w-auto md:flex-row md:flex-nowrap md:px-[10vw] md:will-change-transform"
          >
            {pillars.map((p) => (
              <article
                key={p.title}
                data-card
                className="group relative h-[440px] w-full overflow-hidden rounded-2xl shadow-sm md:w-[360px] md:shrink-0"
              >
                {/* Image */}
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Grey-to-transparent shade for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                {/* Text pinned to the bottom, on top of the shade */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {p.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}