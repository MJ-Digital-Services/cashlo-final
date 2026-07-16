"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useColorInvert } from "@/hooks/useColorInvert";

const HEADLINE = "Har Payment Banega Kamai Ka Mauka";
const SUBLINE =
  "Join thousands of smart shopkeepers who are growing their business with Cashlo. Start your digital business journey today.";

export default function DownloadCTA() {
  const { scope, stageRef } = useColorInvert();

  return (
    <section ref={scope} className="overflow-hidden bg-bg pb-24">
      {/* Full-bleed inversion stage — text blocks inside stay centered */}
      <div ref={stageRef} className="invert-stage relative">
        {/* Base layer — brand text on page bg */}
        <div className="px-6 py-16 text-center sm:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-5xl font-bold tracking-tight text-brand sm:text-7xl lg:text-8xl">
              {HEADLINE}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-brand/80 sm:text-xl">
              {SUBLINE}
            </p>
          </div>
        </div>

        {/* Overlay — brand bg + identical WHITE text, clipped to the chevron */}
        <div className="invert-overlay" aria-hidden>
          <div className="px-6 py-16 text-center sm:py-24">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
                {HEADLINE}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85 sm:text-xl">
                {SUBLINE}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <Container>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/download"
            className="rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
          >
            Download App
          </Link>
          <Link
            href="/become-merchant"
            className="rounded-full border border-brand/30 px-7 py-3.5 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            Become Merchant
          </Link>
        </div>
      </Container>
    </section>
  );
}