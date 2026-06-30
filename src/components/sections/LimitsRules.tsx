"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const limits = [
  { label: "Per Transaction", value: "₹5,000" },
  { label: "Per Day", value: "₹10,000" },
  { label: "Per Month", value: "₹50,000" },
  { label: "Max Per Day", value: "2 Txns" },
];

const rules = [
  {
    num: "01",
    title: "Never Accept QR Screenshots",
    desc: "Always generate a fresh Dynamic QR for every transaction. Never use photos or shared QR codes.",
  },
  {
    num: "02",
    title: "Maintain a Withdrawal Register",
    desc: "Record customer name, mobile, amount, signature, and transaction reference (RRN) for every withdrawal.",
  },
  {
    num: "03",
    title: "Never Accept QR via WhatsApp",
    desc: "Customers must be physically present. Don't process withdrawals from QR images shared on messaging apps.",
  },
];

export default function LimitsRules() {
  const scope = useScrollReveal();

  return (
    <>
      {/* Section 1: Withdrawal Limits */}
      <section ref={scope} className="bg-bg py-24">
        <Container>
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            Withdrawal Limits
          </p>
          <h2
            data-reveal
            className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Clear, Transparent Limits
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {limits.map((l) => (
              <div
                key={l.label}
                data-reveal
                className="rounded-2xl bg-brand p-8 text-white"
              >
                <div className="text-4xl font-bold sm:text-5xl">{l.value}</div>
                <div className="mt-2 text-sm text-white/80">{l.label}</div>
              </div>
            ))}
          </div>

          <p data-reveal className="mt-6 text-xs leading-relaxed text-ink/50">
            A 30-minute cooling period applies between transactions. Limits may
            change based on applicable banking partner policies and regulatory
            requirements.
          </p>
        </Container>
      </section>

      {/* Section 2: Important Rules */}
      <section className="bg-bg pb-24">
        <Container>
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            Important Rules
          </p>
          <h2
            data-reveal
            className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            Three Rules Every Merchant Must Follow
          </h2>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {rules.map((r) => (
              <div
                key={r.num}
                data-reveal
                className="rounded-2xl border border-border p-6 transition-colors hover:border-brand/20"
              >
                <div className="text-xl font-bold text-brand/40">{r.num}</div>
                <h3 className="mt-3 font-semibold text-ink">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}