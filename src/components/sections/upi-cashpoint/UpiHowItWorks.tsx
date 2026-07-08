"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    title: "Login to the Cashlo App",
    desc: "Open the Cashlo merchant app and log in with your registered account.",
    img: "/illustrations/upi-cashpoint/how-it-works/step-01.svg",
  },
  {
    num: "02",
    title: "Select UPI CashPoint",
    desc: "Choose the UPI CashPoint / Cashout option from the app menu.",
    img: "/illustrations/upi-cashpoint/how-it-works/step-02.svg",
  },
  {
    num: "03",
    title: "Enter Amount & Mobile Number",
    desc: "Enter the withdrawal amount and the customer's registered mobile number.",
    img: "/illustrations/upi-cashpoint/how-it-works/step-03.svg",
  },
  {
    num: "04",
    title: "Customer Scans the Dynamic QR",
    desc: "Ask the customer to scan the one-time Dynamic QR using any UPI app.",
    img: "/illustrations/upi-cashpoint/how-it-works/step-04.svg",
  },
  {
    num: "05",
    title: "Hand Over Cash",
    desc: "Once the transaction is successful, give the cash to the customer.",
    img: "/illustrations/upi-cashpoint/how-it-works/step-05.svg",
  },
];

export default function UpiHowItWorks() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <p
          data-reveal
          className="text-sm font-semibold uppercase tracking-wider text-brand"
        >
          How It Works
        </p>
        <h2
          data-reveal
          className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Five Simple Steps
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <div
              key={s.num}
              data-reveal
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-44 items-center justify-center">
                <Image
                  src={s.img}
                  alt={s.title}
                  width={280}
                  height={220}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="mt-5 text-2xl font-bold text-brand/40">
                {s.num}
              </div>
              <h3 className="mt-2 font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}