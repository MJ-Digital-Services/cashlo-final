"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  "Choose your Area PIN Code",
  "Fill your Details",
  "Verify your Email via OTP",
  "Pay \u20b91,100 PIN Reservation Fee",
  "Your PIN Code Gets Reserved",
  "Complete KYC",
  "Start Onboarding Merchants and Earn Commissions",
];

export default function DistributorHowItWorks() {
  const scope = useScrollReveal();

  return (
    <section id="how-it-works" ref={scope} className="scroll-mt-24 bg-bg py-20 sm:py-24">
      <Container className="mx-auto max-w-3xl">
        <div data-reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Getting Started</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">How It Works</h2>
        </div>

        <ol data-reveal className="mt-12 space-y-4">
          {steps.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm font-medium text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}