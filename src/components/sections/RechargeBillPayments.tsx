"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Smartphone, Zap, Tv, Car, Wifi, Flame, Droplet, CreditCard, Receipt } from "lucide-react";
import { useServiceReveal } from "@/hooks/useServiceReveal";

const services = [
    { icon: Smartphone, label: "Mobile Recharge" },
    { icon: Zap, label: "Electricity Bills" },
    { icon: Tv, label: "DTH Recharge" },
    { icon: Car, label: "FASTag Recharge" },
    { icon: Wifi, label: "Broadband Bills" },
    { icon: Flame, label: "Gas Bills" },
    { icon: Droplet, label: "Water Bills" },
    { icon: CreditCard, label: "Credit Card Bills" },
    { icon: Receipt, label: "BBPS Services" },
];

export default function RechargeBillPayments() {
    const gridScope = useServiceReveal();

  return (
    <section className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            Har Service Par Commission
          </p>
          <h2
            data-reveal
            className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Earn More with Every Service
          </h2>
          <p data-reveal className="mt-4 text-lg text-ink/60">
            Offer digital services to your customers and generate additional
            income.
          </p>
        </div>

        <div
            ref={gridScope}
            className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3"
            >
            {services.map((s) => (
                <div
                key={s.label}
                data-service-card
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-md"
                >
                <span
                    data-service-icon
                    className="grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand"
                >
                    <s.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-ink">{s.label}</span>
                </div>
            ))}
        </div>

        <p data-reveal className="mt-10 text-center text-base font-medium text-brand">
          Every successful transaction helps you earn more.
        </p>
      </Container>
    </section>
  );
}