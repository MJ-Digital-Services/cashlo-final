"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QrCode, Landmark } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- data ---------------- */

const pillars = [
  {
    title: "Real-Time Settlement",
    desc: "Every transaction is protected through secure UPI payment infrastructure with encrypted processing.",
    tag: "< 2 SEC AVG",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
      </svg>
    ),
  },
  {
    title: "Secure & Reliable Platform",
    desc: "Cashlo follows applicable banking partner processes and operational guidelines.",
    tag: "RBI ALIGNED",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3z" />
        <path d="m9.5 12 2 2 3.5-4" />
      </svg>
    ),
  },
  {
    title: "Multiple Income Opportunities",
    desc: "Every payment travels through trusted UPI rails ensuring reliable, fast fund transfers.",
    tag: "UPI RAILS",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="5.5" />
        <path d="M17.5 8.2a5.5 5.5 0 1 1-6.9 8.4" />
        <path d="M7 9h4M9 7v4" />
      </svg>
    ),
  },
  {
    title: "One App for Complete Business",
    desc: "Merchant and customer information is handled with strict privacy and security standards.",
    tag: "PRIVACY FIRST",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 18.5h2" />
        <path d="M10 7h4M10 10.5h4M10 14h2.5" />
      </svg>
    ),
  },
];

/* ---------------- center visual ----------------
   A "live settlement" loop, one master 5s timeline shared by every
   element (same duration, different keyframe windows), so the whole
   scene stays in sync forever:
     1. comet-style pulses travel from the customer tile and the bank
        tile into the Cashlo hub, along the wire (not a plain dot)
     2. the hub pings + "Connected" chip lights
     3. a second pulse continues from the chip down into the dashboard
        (the wire terminates at the chip and resumes below it — it
        never visually crosses the "Connected" pill)
     4. dashboard bars fill and a "+₹12 kamai" chip pops
   Pure SVG + CSS. CSS transforms REPLACE attribute transforms, so every
   animated element is: outer <g transform=...> (position) wrapping an
   inner element animated from its own local origin. */

function SettlementScene() {
  return (
    <svg viewBox="0 0 420 440" className="tg-scene" aria-hidden>
      <defs>
        <pattern id="tgDots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="var(--border)" />
        </pattern>

        <linearGradient id="tgHub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5E7BFF" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>

        {/* comet gradients — bright "head" fading into a transparent tail */}
        <linearGradient id="tgPulseL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="tgPulseR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tgPulseV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--mint, #12C286)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--mint, #12C286)" stopOpacity="1" />
        </linearGradient>

        {/* comet head — bright core fading to transparent, radial */}
        <radialGradient id="tgCometHead" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="40%" stopColor="var(--brand)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tgCometHeadMint" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="40%" stopColor="var(--mint, #12C286)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--mint, #12C286)" stopOpacity="0" />
        </radialGradient>

        {/* two-pass bloom — tight core glow + wider soft halo, looks much richer than a single blur */}
        <filter id="tgCometGlow" x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="tight" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="4.2" result="wide" />
        <feMerge>
            <feMergeNode in="wide" />
            <feMergeNode in="tight" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
        </filter>

        {/* progress-bar fills */}
        <linearGradient id="tgBarGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--brand)" />
          <stop offset="1" stopColor="#5E7BFF" />
        </linearGradient>
        <linearGradient id="tgBarGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--mint, #12C286)" />
          <stop offset="1" stopColor="#5EE0B5" />
        </linearGradient>

        <filter id="tgGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="420" height="440" fill="url(#tgDots)" opacity="0.55" />

      {/* connector rails — split above/below the Connected chip so the
          wire visually terminates at it instead of running through it */}
      <g stroke="var(--border)" strokeWidth="1.5">
        <line x1="102" y1="110" x2="176" y2="110" />
        <line x1="318" y1="110" x2="244" y2="110" />
        <line x1="210" y1="146" x2="210" y2="183" />
        {/* <line x1="210" y1="209" x2="210" y2="242" /> */}
      </g>

      {/* customer app tile (left) */}
      <g transform="translate(70,110)">
        <rect x="-32" y="-32" width="64" height="64" rx="16" className="tg-tile" />
        <g transform="translate(-14,-14)" className="tg-tile-icon">
          <QrCode size={28} strokeWidth={1.8} />
        </g>
        <text y="52" textAnchor="middle" className="tg-label">Customer</text>
      </g>

      {/* bank tile (right) */}
      <g transform="translate(350,110)">
        <rect x="-32" y="-32" width="64" height="64" rx="16" className="tg-tile" />
        <g transform="translate(-14,-14)" className="tg-tile-icon">
          <Landmark size={28} strokeWidth={1.8} />
        </g>
        <text y="52" textAnchor="middle" className="tg-label">Bank</text>
      </g>

      <g transform="translate(210,110)">
        <circle r="44" className="tg-ring" />

        <g className="tg-hub">
            <rect
            x="-36"
            y="-36"
            width="72"
            height="72"
            rx="18"
            fill="url(#tgHub)"
            />

            <image
            href="/cashlo-rupee-symbol.png"
            x="-36"
            y="-36"
            width="72"
            height="72"
            preserveAspectRatio="xMidYMid slice"
            />
        </g>
        </g>

      {/* traveling pulses — a glowing "comet" moving along each rail,
          not a plain dot */}
      <g transform="translate(102,110)">
        <rect className="tg-pulse tg-pulse--l" x="0" y="-2" width="30" height="4" rx="2" fill="url(#tgPulseL)" filter="url(#tgGlow)" />
      </g>
      <g transform="translate(288,110)">
        <rect className="tg-pulse tg-pulse--r" x="0" y="-2" width="30" height="4" rx="2" fill="url(#tgPulseR)" filter="url(#tgGlow)" />
      </g>
      <g transform="translate(210,146)">
        <rect className="tg-pulse tg-pulse--v1" x="-2" y="0" width="4" height="26" rx="2" fill="url(#tgPulseV)" filter="url(#tgGlow)" />
      </g>
      {/* <g transform="translate(210,209)">
        <rect className="tg-pulse tg-pulse--v2" x="-2" y="0" width="4" height="26" rx="2" fill="url(#tgPulseV)" filter="url(#tgGlow)" />
      </g> */}

      {/* Connected chip — plain outline pill, no dot, lighter weight */}
      <g transform="translate(210,196)" className="tg-conn">
        <rect x="-46" y="-13" width="92" height="26" rx="13" fill="var(--bg)" stroke="var(--brand)" strokeWidth="1.3" />
        <text x="0" y="4" textAnchor="middle" className="tg-chip-text">Connected</text>
      </g>

      {/* merchant dashboard */}
      <g transform="translate(52,256)">
        <rect width="316" height="158" rx="16" className="tg-card" />
        <circle cx="22" cy="22" r="4" fill="#FF6B7A" />
        <circle cx="36" cy="22" r="4" fill="#FFC94D" />
        <circle cx="50" cy="22" r="4" fill="var(--mint, #12C286)" />
        <text x="20" y="58" className="tg-title">Aaj ki Kamai</text>

        <text x="20" y="86" className="tg-sub">Payments</text>
        <rect x="20" y="94" width="276" height="8" rx="4" className="tg-track" />
        <rect x="20" y="94" width="276" height="8" rx="4" fill="url(#tgBarGrad1)" filter="url(#tgGlow)" className="tg-bar tg-bar--1" />
        <text x="296" y="101" textAnchor="end" className="tg-bar-label tg-bar-label--1">82%</text>

        <text x="20" y="122" className="tg-sub">Commission</text>
        <rect x="20" y="130" width="276" height="8" rx="4" className="tg-track" />
        <rect x="20" y="130" width="276" height="8" rx="4" fill="url(#tgBarGrad2)" filter="url(#tgGlow)" className="tg-bar tg-bar--2" />
        <text x="296" y="137" textAnchor="end" className="tg-bar-label tg-bar-label--2">61%</text>

        {/* commission chip pops in */}
        <g transform="translate(252,52)">
          <g className="tg-pop">
            <rect x="-58" y="-15" width="116" height="30" rx="15" fill="var(--mint, #12C286)" />
            <text y="4.5" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#fff" fontFamily="var(--font-mono), monospace">
              + ₹12 kamai
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ---------------- section ---------------- */

export default function TrustGrid() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.from("[data-tg-reveal]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        clearProps: "all",
        scrollTrigger: { trigger: scope.current, start: "top 72%", once: true },
      });
    },
    { scope }
  );

  const Card = ({ p }: { p: (typeof pillars)[number] }) => (
    <article data-tg-reveal className="tg-card-el group rounded-2xl bg-surface p-7">
      <div className="tg-icon text-brand">{p.icon}</div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">{p.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">{p.desc}</p>
      <span className="tg-tag">{p.tag}</span>
    </article>
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg py-24 md:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div data-tg-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Trusted by Growing Businesses Across India
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Aapka Vishwas, Hamari Zimmedari
          </h2>
          <p className="mt-4 text-base text-ink/60">
            From your customer&apos;s app to your account — watch a payment make
            the trip, and the kamai land with it.
          </p>
        </div>

        {/* lg:items-center removed — columns now stretch to equal height,
            so the middle panel matches the height of the stacked side cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-stretch">
          {/* left cards */}
          <div className="flex flex-col gap-6 md:order-2 lg:order-1">
            <Card p={pillars[0]} />
            <Card p={pillars[1]} />
          </div>

          {/* center animated panel — flex-centers the SVG inside whatever
              height the row ends up being */}
          <div
            data-tg-reveal
            className="tg-panel order-1 flex items-center justify-center rounded-3xl bg-surface md:col-span-2 lg:order-2 lg:col-span-1"
          >
            <SettlementScene />
          </div>

          {/* right cards */}
          <div className="flex flex-col gap-6 md:order-3 lg:order-3">
            <Card p={pillars[2]} />
            <Card p={pillars[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}