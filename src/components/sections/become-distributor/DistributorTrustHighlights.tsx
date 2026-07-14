"use client";

import { Lock, MapPin, TrendingUp, Phone, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const highlights = [
  { icon: Lock, label: "One Distributor per PIN Code" },
  { icon: MapPin, label: "Exclusive Territory Allocation" },
  { icon: TrendingUp, label: "Merchant Commission Earnings" },
  { icon: Phone, label: "Direct Company Leads" },
  { icon: ShieldCheck, label: "Secure Online Payment" },
];

export default function DistributorTrustHighlights() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="border-y border-border bg-card py-10">
      <Container>
        <div data-reveal className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {highlights.map((h) => (
            <div key={h.label} className="flex flex-col items-center text-center">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                <h.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs font-medium text-ink/70">{h.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}