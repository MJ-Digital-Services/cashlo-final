"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { User, Users, Briefcase, Store } from "lucide-react";

const types = [
  {
    icon: User,
    form: "ITR-1",
    name: "Sahaj",
    desc: "For resident individuals with salary/pension income, one house property, and other sources (interest, etc.) up to ₹50 lakh total income.",
  },
  {
    icon: Users,
    form: "ITR-2",
    name: "For Individuals & HUFs",
    desc: "For those with capital gains, more than one house property, or foreign income/assets — but no income from business or profession.",
  },
  {
    icon: Briefcase,
    form: "ITR-3",
    name: "For Business & Profession",
    desc: "For individuals and HUFs with income from a proprietary business or profession, including freelancers and consultants.",
  },
  {
    icon: Store,
    form: "ITR-4",
    name: "Sugam",
    desc: "For those opting for presumptive taxation — small businesses, traders, and professionals with turnover under the prescribed limit.",
  },
];

export default function ItrTypes() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Choosing the Right Form
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Types of ITR Forms
        </h2>
        <p data-reveal className="mt-4 max-w-2xl text-lg text-ink/60">
          The Income Tax Department offers different forms based on income
          source and type of taxpayer. Filing the wrong form can lead to a
          defective return, so it helps to know which one applies.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {types.map((t) => (
            <div key={t.form} data-reveal className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                  <t.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{t.form}</h3>
                  <p className="text-xs font-medium text-ink/50">{t.name}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">{t.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}