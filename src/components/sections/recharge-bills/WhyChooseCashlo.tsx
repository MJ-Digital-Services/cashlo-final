"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ShieldCheck, Clock3, TrendingUp, HeartHandshake } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "Secure & Trusted",
    desc: "Every transaction runs through BBPS with bank-grade security. No payment details are ever stored on your device.",
  },
  {
    icon: Clock3,
    title: "24×7 Availability",
    desc: "Recharge and pay bills for your customers anytime — high uptime, minimal downtime.",
  },
  {
    icon: TrendingUp,
    title: "Attractive Commission",
    desc: "Earn commission on every successful recharge and bill payment, credited straight to your wallet.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Support",
    desc: "Get help over call, WhatsApp, or in-app chat whenever you need it.",
  },
];

export default function WhyChooseCashlo() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Why Cashlo
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Built for Merchants You Can Trust
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div key={p.title} data-reveal className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                <p.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{p.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}