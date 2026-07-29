"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FileText, Zap, Wallet } from "lucide-react";
import ITRFilingAnimation from "./ITRFilingAnimation";

const trustBadges = [
  {
    icon: FileText,
    title: "Paperless ITR Filing",
    desc: "Simple document upload and digital process.",
  },
  {
    icon: Zap,
    title: "Fast & Accurate Filing",
    desc: "Quick verification with expert assistance.",
  },
  {
    icon: Wallet,
    title: "Earn on Every Filing",
    desc: "Generate extra income by offering ITR services.",
  },
];

export default function ItrHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Income Tax Return (ITR) Filing
            </p>
            <h1 data-reveal className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              File ITR. Earn More.
            </h1>
            <p data-reveal className="mt-5 max-w-md text-lg text-ink/60">
              Help individuals and businesses file their Income Tax Returns quickly 
              and accurately through Cashlo. Offer paperless ITR filing, 
              faster processing, and earn commission on every successful filing—without tax expertise.
            </p>

            <div data-reveal className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/become-merchant"
                className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                Become Merchant
              </Link>
            </div>

            {/* Trust badges */}
            <div data-reveal className="mt-10 grid gap-5 sm:grid-cols-3">
              {trustBadges.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <Icon size={18} strokeWidth={2.25} className="text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animation */}
          <div data-reveal className="hidden lg:block">
            <ITRFilingAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}