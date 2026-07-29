"use client";

import { UserPlus, Users, Wrench, Clock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CashloMerchantJourney from "./CashloMerchantJourney";

const trustBadges = [
  { icon: UserPlus, label: "Merchant Onboarding" },
  { icon: Users, label: "Distributor Support" },
  { icon: Wrench, label: "Technical Assistance" },
  { icon: Clock, label: "Response Within 24 Hours" },
];

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
            Let&apos;s Grow Your Shop Together
          </h1>
          <p data-reveal className="mt-5 max-w-xl text-lg text-ink/60">
          Whether you're looking to become a Cashlo Merchant, activate UPI Cash Point, join as a Distributor, 
          or need help with your account, our dedicated team is here to assist you. Reach out today and we'll help you get started quickly.
          </p>

          {/* Trust badges */}
          <ul
            data-reveal
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                <Icon className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal className="relative mx-auto w-full max-w-md">
          <CashloMerchantJourney />
        </div>
      </div>
    </section>
  );
}