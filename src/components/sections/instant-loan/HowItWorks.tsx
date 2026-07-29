"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    image: "/instant-loan/howitworks/loan_step1_login.png",
    title: "Login to Cashlo App",
    desc: "Open the merchant app and select the Instant Loan service.",
  },
  {
    num: "02",
    image: "/instant-loan/howitworks/loan_step2_details.png",
    title: "Submit Customer Details",
    desc: "Enter the customer's basic KYC and income details for eligibility check.",
  },
  {
    num: "03",
    image: "/instant-loan/howitworks/loan_step3_approval.png",
    title: "Approval",
    desc: "The lending partner reviews and approves the application, often same-day.",
  },
  {
    num: "04",
    image: "/instant-loan/howitworks/loan_step4_disbursal.png",
    title: "Disbursal & Commission",
    desc: "Funds are disbursed to the customer, and your commission is credited.",
  },
];

export default function HowItWorks() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg py-24">
      <Container>
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          How It Works
        </p>
        <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Four Simple Steps
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.num}
              data-reveal
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[4/3] w-full bg-surface">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-contain p-2"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-brand text-xs font-bold text-white shadow-sm">
                  {s.num}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}