"use client";

import { ShieldCheck, Zap, Smartphone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import QuickKhataPhoneDemo from "./QuickKhataPhoneDemo";

const trustBadges = [
  {
    icon: ShieldCheck,
    title: "100% Secure Records",
    desc: "Your customer and transaction data is safely stored in the cloud.",
  },
  {
    icon: Zap,
    title: "Easy to Use",
    desc: "Create entries in seconds with a simple, clean interface.",
  },
  {
    icon: Smartphone,
    title: "Access Anytime",
    desc: "Manage your udhaar from anywhere using your mobile.",
  },
];

export default function QuickKhataHero() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-bg pb-16 pt-40 sm:pt-44">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            QuickKhata
          </p>
          <h1
            data-reveal
            className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          >
            Your Udhaar, Smarter & Organized.
          </h1>
          <p data-reveal className="mt-5 max-w-xl text-lg text-ink/60">
          Replace your traditional paper khata with Cashlo QuickKhata. 
          Track customer credit, supplier payments, payment history, and 
          outstanding balances in one secure place. Send payment reminders, 
          access records anytime, and never lose an entry again.
          </p>
          <div data-reveal className="mt-8 flex flex-wrap gap-4">
            <a
              href="/become-merchant"
              className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Become Merchant
            </a>
          </div>

          {/* Trust badges */}
          <div data-reveal className="mt-10 grid gap-5 sm:grid-cols-3">
            {trustBadges.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <Icon size={18} strokeWidth={2.25} className="text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="order-1 lg:order-2">
          <QuickKhataPhoneDemo />
        </div>
      </div>
    </section>
  );
}