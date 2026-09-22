"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Store,
  BookOpenText,
  Coins,
  Landmark,
  FileText,
  Smartphone,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    href: "/upi-cashpoint",
    icon: Store,
    title: "UPI CashPoint",
    desc: "Let customers withdraw cash using UPI at your shop and earn commission on every transaction.",
  },
  {
    href: "/quickkhata",
    icon: BookOpenText,
    title: "QuickKhata",
    desc: "Track customer and supplier credit digitally, with WhatsApp reminders — no more paper bahi-khatas.",
  },
  {
    href: "/services/gold-loan",
    icon: Coins,
    title: "Gold Loan",
    desc: "Offer instant gold loans with minimal documentation, or help customers invest in 24K digital gold.",
  },
  {
    href: "/services/instant-loan",
    icon: Landmark,
    title: "Instant Loan",
    desc: "Help customers apply for personal, business, and working capital loans with fast approval.",
  },
  {
    href: "/services/itr-filing",
    icon: FileText,
    title: "ITR Filing",
    desc: "Assist customers with income tax return filing, GST, and accounting services.",
  },
  {
    href: "/services/recharge-bills",
    icon: Smartphone,
    title: "Recharge & Bill Payments",
    desc: "Mobile recharge and 80+ BBPS-enabled billers — electricity, gas, water, DTH, and broadband.",
  },
];

export default function ServicesGrid() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-24">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              data-reveal
              className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                <s.icon className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h2 className="mt-5 text-lg font-bold tracking-tight text-ink">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{s.desc}</p>
              <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-brand">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
