"use client";

import Container from "@/components/ui/Container";
import { useCardStack } from "@/hooks/useCardStack";
import {
  Smartphone,
  Zap,
  Tv,
  Car,
  Wifi,
  Flame,
  Droplet,
  CreditCard,
  Receipt,
  User,
  Briefcase,
  TrendingUp,
  Landmark,
} from "lucide-react";

const chapters = [
    {
    key: "recharge",
    eyebrow: "Har Service Par Commission",
    title: "Earn More with Every Service",
    desc: "Offer digital services to your customers and generate additional income. Every successful transaction helps you earn more.",
    image: "/services/recharge-bills1.jpg",
    imagePosition: "center 20%",
    textTheme: "dark",
    items: [
      { icon: Smartphone, label: "Mobile Recharge" },
      { icon: Zap, label: "Electricity Bills" },
      { icon: Tv, label: "DTH Recharge" },
      { icon: Car, label: "FASTag Recharge" },
      { icon: Wifi, label: "Broadband Bills" },
      { icon: Flame, label: "Gas Bills" },
      { icon: Droplet, label: "Water Bills" },
      { icon: CreditCard, label: "Credit Card Bills" },
      { icon: Receipt, label: "BBPS Services" },
    ],
  },
  {
    key: "loans",
    eyebrow: "Loan Dilao. Commission Kamao.",
    title: "Help Customers. Earn More.",
    desc: "Offer instant loan services to yourself and your customers. Cashlo enables eligible merchants to assist customers with loan applications while earning attractive commissions.",
    image: "/services/loan-services1.jpg",
    imagePosition: "center",
    textTheme: "dark",
    items: [
      { icon: User, label: "Personal Loan" },
      { icon: Briefcase, label: "Business Loan" },
      { icon: TrendingUp, label: "Working Capital" },
      { icon: Landmark, label: "Credit Line" },
    ],
  },
];

// Contrast here is set by the PHOTO behind each chapter, not the site's
// theme — deliberately fixed colors so they don't flip with .dark.
// (Same reasoning as the phone-mockup screens in HowItWorks and the
// illustration zone in PaymentAppFeatures.)
function ChapterContent({ c }: { c: (typeof chapters)[number] }) {
  const dark = c.textTheme === "dark";

  return (
    <div className="max-w-xl">
      <p
        className={
          "text-sm font-semibold uppercase tracking-wider " +
          (dark ? "text-slate-700" : "text-white/70")
        }
      >
        {c.eyebrow}
      </p>
      <h2
        className={
          "mt-3 text-4xl font-bold tracking-tight sm:text-5xl " +
          (dark ? "text-slate-900" : "text-white")
        }
      >
        {c.title}
      </h2>
      <p
        className={
          "mt-4 text-lg leading-relaxed " +
          (dark ? "text-slate-700" : "text-white/80")
        }
      >
        {c.desc}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {c.items.map((item) => (
          <span
            key={item.label}
            className={
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm " +
              (dark
                ? "border-brand/25 bg-brand/10 text-brand"
                : "border-brand/40 bg-brand/20 text-white")
            }
          >
            <item.icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ServiceStack() {
  const { scope, stageRef } = useCardStack(chapters.length);

  return (
    <section ref={scope} className="relative bg-bg">
      {/* ---------- Desktop: pinned stacked chapters ---------- */}
      <div
        ref={stageRef}
        className="relative hidden h-screen overflow-hidden md:block"
      >
        {/* Top fade — blends the previous section into this one; stays
            token-aware since it's blending with actual site background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 bg-gradient-to-b from-bg to-transparent lg:h-40" />

        {/* Side progress rail */}
        <div className="pointer-events-none absolute inset-y-0 right-8 z-30 hidden items-center lg:flex">
          <div className="flex flex-col gap-3">
            {chapters.map((c) => (
              <span
                key={c.key}
                data-rail-dot
                className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300 [&.active]:h-6 [&.active]:bg-white"
              />
            ))}
          </div>
        </div>

        {chapters.map((c, i) => {
          const dark = c.textTheme === "dark";
          return (
            <div
              key={c.key}
              data-chapter
              className="absolute inset-0"
              style={{ zIndex: i + 1 }}
            >
              <div
                  className="absolute inset-0 bg-[#0b0d12] bg-cover"
                  style={{ backgroundImage: `url(${c.image})`, backgroundPosition: c.imagePosition }}
                  />
              {dark ? (
                // Fixed white scrim — brightens toward the text corner
                // because THIS image is naturally light there, regardless
                // of site theme.
                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/25 to-transparent" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              )}
              {/* darkening layer used by useCardStack when the NEXT chapter arrives */}
              <div
                data-chapter-dim
                className="pointer-events-none absolute inset-0 bg-black opacity-0"
              />
              <div className="relative z-10 flex h-full items-center">
                <Container>
                  <ChapterContent c={c} />
                </Container>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Mobile: simple stacked sections ---------- */}
      <div className="space-y-6 px-6 py-20 md:hidden">
        {chapters.map((c) => {
          const dark = c.textTheme === "dark";
          return (
            <article
              key={c.key}
              className="relative overflow-hidden rounded-2xl"
            >
              <div
              className="absolute inset-0 bg-cover"
              style={{ backgroundImage: `url(${c.image})`, backgroundPosition: c.imagePosition }}
              />
              {dark ? (
                <div className="absolute inset-0 bg-gradient-to-t from-white/75 via-white/25 to-transparent" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              )}
              <div className="relative z-10 p-6 pt-40">
                <ChapterContent c={c} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}