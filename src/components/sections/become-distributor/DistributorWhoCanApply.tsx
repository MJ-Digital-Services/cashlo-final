"use client";

import {
  Store,
  ShoppingBasket,
  Warehouse,
  Building2,
  TrendingUp,
  Rocket,
  Laptop,
  Users,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const personas: { label: string; icon: LucideIcon }[] = [
  { label: "Retailers", icon: Store },
  { label: "Grocery Shop Owners", icon: ShoppingBasket },
  { label: "Wholesalers", icon: Warehouse },
  { label: "Business Owners", icon: Building2 },
  { label: "Sales Professionals", icon: TrendingUp },
  { label: "Entrepreneurs", icon: Rocket },
  { label: "Freelancers", icon: Laptop },
  { label: "Field Sales Executives", icon: Users },
  { label: "Anyone Looking for Recurring Income", icon: Repeat },
];

export default function DistributorWhoCanApply() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-20 sm:py-24">
      <Container className="mx-auto max-w-3xl text-center">
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Eligibility</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Who Can Become a Distributor?
          </h2>
        </div>

        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
          {personas.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="group flex items-center gap-2.5 rounded-full border border-border bg-card py-2 pl-2.5 pr-5 text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Icon size={14} strokeWidth={2.25} />
              </span>
              {label}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}