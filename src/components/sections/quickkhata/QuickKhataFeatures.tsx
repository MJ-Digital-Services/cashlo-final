"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    num: "01",
    title: "Add Customers in Seconds",
    desc: "Save a customer's name and number once — reuse it for every future transaction.",
    img: "/illustrations/quickkhata/features/add-customer.svg",
  },
  {
    num: "02",
    title: "Log Every Transaction",
    desc: "Record what a customer owes you or what you owe them, with a running balance.",
    img: "/illustrations/quickkhata/features/log-transaction.svg",
  },
  {
    num: "03",
    title: "Set Collection Reminders",
    desc: "Add a collection date and send a one-tap reminder — no more chasing payments manually.",
    img: "/illustrations/quickkhata/features/reminders.svg",
  },
  {
    num: "04",
    title: "Export Your Ledger",
    desc: "Download your full khata anytime for your own records or to share with customers.",
    img: "/illustrations/quickkhata/features/export.svg",
  },
];

export default function QuickKhataFeatures() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <p
          data-reveal
          className="text-sm font-semibold uppercase tracking-wider text-brand"
        >
          Why QuickKhata
        </p>
        <h2
          data-reveal
          className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
        >
          Everything Your Paper Khata Couldn&apos;t Do
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.num}
              data-reveal
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-44 items-center justify-center">
                <Image
                  src={f.img}
                  alt={f.title}
                  width={280}
                  height={220}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="mt-5 text-2xl font-bold text-brand/40">
                {f.num}
              </div>
              <h3 className="mt-2 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}