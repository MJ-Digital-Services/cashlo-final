"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/ui/Container";
import { Zap, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const operators = [
  {
    name: "Airtel",
    type: "Prepaid & Postpaid",
    icon: "/icons/recharge/operators/airtel.svg",
  },
  {
    name: "Jio",
    type: "Prepaid & Postpaid",
    icon: "/icons/recharge/operators/jio.svg",
  },
  {
    name: "VI",
    type: "Prepaid & Postpaid",
    icon: "/icons/recharge/operators/vi.svg",
  },
  {
    name: "BSNL",
    type: "Prepaid & Postpaid",
    icon: "/icons/recharge/operators/bsnl.webp",
  },
  {
    name: "MTNL",
    type: "Prepaid & Postpaid",
    icon: "/icons/recharge/operators/mtnl.svg",
  },
];


export default function OperatorGrid() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!scope.current) return;

      const headers = gsap.utils.toArray<HTMLElement>("[data-reveal-header]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-operator-card]");
      const icons = gsap.utils.toArray<HTMLElement>("[data-operator-icon]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: () => {
          gsap.set([...cards, ...icons], { clearProps: "transform,transition" });
        },
      });

      tl.set(cards, { transition: "none" })
        .fromTo(
          headers,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.05 }
        )
        .fromTo(
          cards,
          { y: 25, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.05,
          },
          "-=0.2"
        )
        .fromTo(
          icons,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(1.4)",
            stagger: 0.05,
          },
          "<+=0.05"
        );
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      aria-labelledby="operator-grid-heading"
      className="relative overflow-hidden bg-brand py-14 sm:py-20 text-white transition-colors"
    >
      {/* Background radial glow & gradient elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/25 dark:from-brand/20 dark:to-black/40" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 dark:bg-brand/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-dark/50 dark:bg-brand/15 blur-3xl" aria-hidden="true" />

      <Container className="relative z-10">
        {/* Header section */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            data-reveal-header
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 dark:bg-white/[0.08] px-3.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md shadow-inner"
          >
            <span>All Major Operators</span>
          </div>

          <h2
            id="operator-grid-heading"
            data-reveal-header
            className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            Recharge Any Number, Any Operator
          </h2>

          <p
            data-reveal-header
            className="mt-2.5 max-w-lg mx-auto text-xs sm:text-sm text-white/80 dark:text-white/70 leading-relaxed"
          >
            Instant mobile recharges &amp; bill payments across all Indian networks
            with maximum speed and 100% reliability.
          </p>
        </div>

        {/* Operator Grid List */}
        <ul
          role="list"
          aria-label="Supported mobile operators"
          className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5 lg:gap-5"
        >
          {operators.map((op, i) => (
            <li
              key={`${op.name}-${i}`}
              data-operator-card
              className="group relative flex flex-col items-center justify-between rounded-2xl border border-white/15 dark:border-white/10 bg-white/10 dark:bg-white/[0.06] p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/40 dark:hover:border-white/25 hover:bg-white/20 dark:hover:bg-white/[0.12] hover:shadow-xl hover:shadow-black/20"
            >
              {/* Logo wrapper */}
              <div
                data-operator-icon
                className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-white p-2.5 shadow-md shadow-black/10 transition-transform duration-300 group-hover:scale-105"
              >
                <Image
                  src={op.icon}
                  alt={`${op.name} operator logo`}
                  width={38}
                  height={38}
                  className="h-9 w-9 object-contain"
                />
              </div>

              {/* Operator Title & Type */}
              <div className="mt-3 flex flex-col items-center">
                <span className="text-sm font-bold text-white transition-colors">
                  {op.name}
                </span>
                <span className="mt-0.5 text-[11px] text-white/75 dark:text-white/60">{op.type}</span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

