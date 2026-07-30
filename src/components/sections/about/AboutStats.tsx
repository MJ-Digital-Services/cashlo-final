"use client";

import Container from "@/components/ui/Container";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { value: 5000, suffix: "+", label: "Merchants Onboarded" },
  { value: 200, suffix: "+", label: "Cities & Towns" },
  { value: 20, prefix: "₹", suffix: "Cr+", label: "Monthly Transaction Value" },
  { value: 99, suffix: "%", label: "Transaction Success Rate" },
];

export default function AboutStats() {
  const scope = useCountUp();

  return (
    <section
      ref={scope}
      className="relative overflow-hidden bg-bg py-20 sm:py-24"
    >
      {/* ambient blobs — from the "impact" section's .blob1 / .blob2 */}
      <div className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-16 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />

      <Container className="relative">
        <div className="mb-12 max-w-xl sm:mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Business Impact
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Numbers that keep growing
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-ink/5 bg-white/70 p-6 text-center shadow-sm backdrop-blur-sm sm:p-8 sm:text-left"
            >
              <p
                data-count={s.value}
                data-prefix={s.prefix ?? ""}
                data-suffix={s.suffix ?? ""}
                className="text-3xl font-bold text-brand sm:text-[2.75rem]"
              >
                0
              </p>
              <p className="mt-2 text-sm font-medium text-ink/60 sm:mt-3">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}