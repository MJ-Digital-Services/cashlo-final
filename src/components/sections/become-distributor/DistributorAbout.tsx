"use client";

import { MapPin, Users, PhoneCall, Repeat, LayoutGrid } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const benefits = [
  {
    icon: MapPin,
    title: "Exclusive Territory",
    description: "Your selected PIN Code is reserved only for you.",
  },
  {
    icon: Users,
    title: "Merchant Onboarding Rights",
    description: "Merchants onboarded by you remain under your distributor network.",
  },
  {
    icon: PhoneCall,
    title: "Direct Company Leads",
    description:
      "Any merchant inquiry received by Cashlo from your reserved PIN Code will be shared directly with you.",
  },
  {
    icon: Repeat,
    title: "Recurring Income",
    description: "Earn distributor commission whenever your merchants perform transactions.",
  },
  {
    icon: LayoutGrid,
    title: "Multiple Income Opportunities",
    description: "UPI Cash Point, Recharge, Bill Payments, FASTag, Credit Card Bill Payment and more.",
  },
];

export default function DistributorAbout() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-20 sm:py-24">
      <Container className="mx-auto max-w-4xl">
        <div data-reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Why Become a Distributor?
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-ink/60">
            As a Cashlo Distributor, your responsibility is to expand the Cashlo merchant network in your
            assigned territory. You will onboard shopkeepers and retailers and help them start using
            Cashlo services. Every active merchant increases your earning potential.
          </p>
        </div>

        <div data-reveal className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-ink">{b.title}</p>
                <p className="mt-1 text-sm text-ink/60">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}