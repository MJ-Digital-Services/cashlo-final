"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { User, Briefcase, TrendingUp, CreditCard } from "lucide-react";

const services = [
  { icon: User, label: "Personal Loan" },
  { icon: Briefcase, label: "Business Loan" },
  { icon: TrendingUp, label: "Working Capital" },
  { icon: CreditCard, label: "Credit Line" },
];

export default function LoanServices() {
  const revealScope = useScrollReveal();

  return (
    <section ref={revealScope} className="bg-bg py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy column */}
          <div>
            <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
              Loan Dilao. Commission Kamao.
            </p>
            <h2
              data-reveal
              className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              Help Customers. Earn More.
            </h2>
            <p data-reveal className="mt-5 text-lg leading-relaxed text-ink/60">
              Offer instant loan services to yourself and your customers.
              Cashlo enables eligible merchants to assist customers with loan
              applications while earning attractive commissions.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-2 gap-4">
            {services.map((s) => (
              <div
                key={s.label}
                data-reveal
                className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold text-ink">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}