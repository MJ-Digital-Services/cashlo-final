"use client";

import Container from "@/components/ui/Container";
import {
  LayoutGrid,
  Users,
  TrendingUp,
  Zap,
  ShieldCheck,
  Building2,
} from "lucide-react";

const values = [
  {
    icon: LayoutGrid,
    title: "One App for Complete Business",
    desc: "Every tool a shop needs, without juggling five different apps.",
  },
  {
    icon: Users,
    title: "More Services = More Customers",
    desc: "Offer more, and give people more reasons to walk in.",
  },
  {
    icon: TrendingUp,
    title: "Every Transaction Creates Extra Income",
    desc: "Commission on payments, recharges, bookings and more.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    desc: "Money reaches the merchant's account right away, every time.",
  },
  {
    icon: ShieldCheck,
    title: "Simple & Secure",
    desc: "Bank-grade security, wrapped in an interface anyone can use.",
  },
  {
    icon: Building2,
    title: "Business Growth Made Easy",
    desc: "From a single counter to a full digital business, one step at a time.",
  },
];

export default function WhyMerchantLovesCashlo() {
  return (
    <section className="bg-[#F5F7FF] py-20 sm:py-28">
      <Container>
        <div className="mb-14 max-w-xl sm:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Why Merchants Love Cashlo
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            More than an app. A business partner.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="group relative rounded-3xl border border-ink/5 bg-white/70 p-8 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand shadow-[0_10px_22px_rgba(68,94,241,0.3)]">
                <v.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink/60">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}