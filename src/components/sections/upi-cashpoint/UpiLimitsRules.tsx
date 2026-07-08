"use client";

import Image from "next/image";
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
    desc: "The Dynamic QR is for one-time use only. Never allow a screenshot or photo of it to be reused.",
    img: "/illustrations/upi-cashpoint/rules/rule-01.svg",
  },
  {
    num: "02",
    title: "Maintain a Withdrawal Register",
    desc: "Record customer name, mobile number, amount, signature, and transaction reference (RRN) for every withdrawal.",
    img: "/illustrations/upi-cashpoint/rules/rule-02.svg",
  },
  {
    num: "03",
    title: "Never Accept QR via WhatsApp",
    desc: "Customers must be physically present. Don't process withdrawals from QR images shared over messaging apps.",
    img: "/illustrations/upi-cashpoint/rules/rule-03.svg",
  },
];

export default function UpiLimitsRules() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        {/* Limits */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
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

            <div className="mt-10 grid grid-cols-2 gap-5">
              {limits.map((l) => (
                <div
                  key={l.label}
                  data-reveal
                  className="rounded-2xl bg-brand p-8 text-white"
                >
                  <div className="text-4xl font-bold sm:text-5xl">
                    {l.value}
                  </div>
                  <div className="mt-2 text-sm text-white/80">{l.label}</div>
                </div>
              ))}
            </div>

            <p data-reveal className="mt-6 text-xs leading-relaxed text-ink/50">
              2 transactions per day with a 30-minute cooling period between
              transactions. Limits may change based on applicable banking
              partner policies and regulatory requirements.
            </p>
          </div>

          <Image
            data-reveal
            src="/illustrations/upi-cashpoint/limits.svg"
            alt="Tracking savings and transaction limits"
            width={480}
            height={400}
            className="mx-auto h-auto w-full max-w-sm lg:max-w-none"
          />
        </div>

        {/* Rules */}
        <div className="mt-24">
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
                <div className="flex h-44 items-center justify-center">
                  <Image
                    src={r.img}
                    alt={r.title}
                    width={280}
                    height={220}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="mt-5 text-xl font-bold text-brand/40">
                  {r.num}
                </div>
                <h3 className="mt-3 font-semibold text-ink">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}