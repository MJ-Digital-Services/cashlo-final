"use client";

import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import {
  Store,
  BookOpenText,
  ArrowRight,
  TrendingUp,
  Users,
  Zap,
  FileSpreadsheet,
  Bell,
  Share2,
} from "lucide-react";

const teasers = [
  {
    key: "cashpoint",
    href: "/upi-cashpoint",
    icon: Store,
    eyebrow: "Ab Aapki Dukaan Banegi Cash Point",
    title: "Turn Your Shop into a Cash Point",
    desc: "Allow customers to withdraw cash using UPI while earning commission on every eligible transaction.",
    highlights: [
      { icon: TrendingUp, label: "Earn Commission" },
      { icon: Users, label: "More Footfall" },
      { icon: Zap, label: "Instant Settlement" },
    ],
    cta: "Explore UPI Cash Point",
    image: "/services/cashpoint-merchant.png",
  },
  {
    key: "khata",
    href: "/quickkhata",
    icon: BookOpenText,
    eyebrow: "Udhaar Ka Digital Hisaab",
    title: "Simple Digital Credit Management",
    desc: "Track customer and supplier transactions with ease. Never lose your credit records again.",
    highlights: [
      { icon: FileSpreadsheet, label: "Digital Ledger" },
      { icon: Bell, label: "Payment Reminders" },
      { icon: Share2, label: "WhatsApp Sharing" },
    ],
    cta: "Explore Quick Khata",
    image: "/services/quickkhata-phone.png",
  },
];

export default function ServiceTeasers() {
  return (
    <section className="bg-[#F9F4F4] py-24">
      <Container className="max-w-screen-2xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            More Ways to Grow
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Built for Your Whole Business
          </h2>
          <p className="mt-3 text-base text-ink/60">
            Powerful tools to help you serve more customers and grow your income.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {teasers.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              className="group flex items-stretch gap-4 rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Left — content */}
              <div className="flex flex-1 flex-col justify-center p-8 sm:p-10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <t.icon className="h-6 w-6" strokeWidth={1.75} />
                </span>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-brand">
                  {t.eyebrow}
                </p>
                <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-[28px]">
                  {t.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/60">
                  {t.desc}
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  {t.highlights.map((h) => (
                    <span
                      key={h.label}
                      className="flex items-center gap-2 text-sm text-ink/70"
                    >
                      <h.icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
                      {h.label}
                    </span>
                  ))}
                </div>

                <span className="mt-8 flex items-center gap-2 text-sm font-semibold text-brand">
                  {t.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>

              {/* Right — photo, rounded on all four sides */}
              <div className="relative hidden w-[48%] shrink-0 overflow-hidden rounded-2xl sm:block">
                <Image
                  src={t.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}