"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  QrCode,
  BookOpenText,
  ArrowRight,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Clock,
  FileSpreadsheet,
  Bell,
  Share2,
} from "lucide-react";

const teasers = [
  {
    key: "cashpoint",
    href: "/upi-cashpoint",
    icon: QrCode,
    eyebrow: "Ab Aapki Dukaan Banegi Cash Point",
    title: "Turn Your Shop into a Cash Point",
    desc: "Allow customers to withdraw cash using UPI while earning commission on every eligible transaction.",
    highlights: [
      { icon: TrendingUp, label: "Earn Commission" },
      { icon: Users, label: "More Footfall" },
      { icon: Zap, label: "Instant Settlement" },
    ],
    cta: "Explore UPI Cash Point",
    accent: "from-blue-500/15 to-brand/5",
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
    accent: "from-mint/15 to-brand/5",
  },
];

export default function ServiceTeasers() {
  return (
    <section className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            More Ways to Grow
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Built for Your Whole Business
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {teasers.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${t.accent} bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-10`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-md">
                <t.icon className="h-6 w-6" strokeWidth={1.75} />
              </span>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand">
                {t.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {t.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink/60">
                {t.desc}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {t.highlights.map((h) => (
                  <span
                    key={h.label}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-medium text-ink/70"
                  >
                    <h.icon className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} />
                    {h.label}
                  </span>
                ))}
              </div>

              <span className="mt-8 flex items-center gap-2 text-sm font-semibold text-brand">
                {t.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}