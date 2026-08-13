"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  Search,
  Download,
  Store,
  ShieldCheck,
  TrendingUp,
  IndianRupee,
  Fingerprint,
  CreditCard,
  UserCircle2,
  CheckCircle2,
  Loader2,
  Bell,
  Wallet,
  Smartphone,
  QrCode,
  Users,
  Home,
  Grid3x3,
  FileText,
  User,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    key: "install",
    title: "Install Cashlo",
    desc: "Find Cashlo on the Play Store, install it, and it launches straight into the app.",
    tags: ["Search", "Install", "Download", "Launch"],
    icon: Download,
    floatingCards: [
      { icon: Store, label: "Shop details\nsubmitted" },
      { icon: ShieldCheck, label: "KYC\nverified" },
      { icon: IndianRupee, label: "Earnings\nactivated" },
    ],
  },
  {
    num: "02",
    key: "register",
    title: "Register Your Shop",
    desc: "Create your account and add your shop details to get started.",
    tags: ["Mobile number", "Shop details", "Address", "Submit"],
    icon: Store,
    floatingCards: [
      { icon: Smartphone, label: "Mobile\nverified" },
      { icon: Store, label: "Shop details\nsubmitted" },
      { icon: UserCircle2, label: "Profile\ncreated" },
    ],
  },
  {
    num: "03",
    key: "kyc",
    title: "Complete KYC",
    desc: "Verify your identity and business to keep everything secure.",
    tags: ["Aadhaar", "PAN", "Selfie", "Verify"],
    icon: ShieldCheck,
    floatingCards: [
      { icon: Fingerprint, label: "Aadhaar\nverified" },
      { icon: CreditCard, label: "PAN\nuploaded" },
      { icon: ShieldCheck, label: "Identity\nconfirmed" },
    ],
  },
  {
    num: "04",
    key: "activate",
    title: "Activate Services & Earn",
    desc: "Activate services and start earning commission on every transaction.",
    tags: [],
    icon: TrendingUp,
    floatingCards: [],
  },
];

function InstallScreen() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-ink/60">
        <span>‹</span>
        <span>Search</span>
      </div>
      <div className="mb-4 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2.5">
        <Search className="h-4 w-4 text-ink/40" />
        <span className="text-sm text-ink">Cashlo</span>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
        <Image src="/cashlo-icon.svg" alt="Cashlo" fill className="object-cover" />
      </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">Cashlo</div>
          <div className="text-xs text-ink/50">
            Finance · 4.8★ · MJ Digital Services
          </div>
        </div>
        <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">
          Get
        </span>
      </div>
    </div>
  );
}

function RegisterScreen() {
  const fields = [
    { icon: Store, label: "Shop name", value: "Sharma General Store" },
    { icon: User, label: "Owner name", value: "Ravi Sharma" },
    { icon: Smartphone, label: "Mobile number", value: "+91 98765 43210", verified: true },
    { icon: FileText, label: "Category", value: "Grocery" },
  ];
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-1 flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-xs font-bold text-white">
          C
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">Cashlo</div>
          <div className="text-[10px] text-ink/50">Shop Registration</div>
        </div>
      </div>
      <div className="mt-3 text-sm font-semibold text-ink">
        Let&apos;s set up your shop
      </div>
      <p className="mb-3 text-xs text-ink/50">
        Add your details to create your Cashlo account
      </p>
      <div className="space-y-2">
        {fields.map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5"
          >
            <f.icon className="h-4 w-4 shrink-0 text-ink/40" />
            <div className="flex-1">
              <div className="text-[10px] text-ink/40">{f.label}</div>
              <div className="text-xs font-medium text-ink">{f.value}</div>
            </div>
            {f.verified && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                Verified
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-brand py-3 text-center text-xs font-semibold text-white">
        Submit &amp; Continue
      </div>
    </div>
  );
}

function KycScreen() {
  const rows = [
    { icon: Fingerprint, label: "Aadhaar Number", sub: "XXXXXXXX1234", status: "Verified" },
    { icon: CreditCard, label: "PAN Card", sub: "ABCDE1234F", status: "Uploaded" },
    { icon: UserCircle2, label: "Selfie Verification", sub: "Selfie matched successfully", status: "Completed" },
    { icon: ShieldCheck, label: "Business Verification", sub: "Verifying your business details", status: "In Progress" },
  ];
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-ink/60">‹</span>
        <div className="text-sm font-bold text-brand">CASHLO</div>
        <ShieldCheck className="h-4 w-4 text-brand" />
      </div>
      <div className="mt-3 text-sm font-semibold text-ink">Complete your KYC</div>
      <p className="mb-3 text-xs text-ink/50">
        Verify your identity and business details to keep your account secure.
      </p>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5"
          >
            <r.icon className="h-4 w-4 shrink-0 text-brand" />
            <div className="flex-1">
              <div className="text-xs font-medium text-ink">{r.label}</div>
              <div className="text-[10px] text-ink/40">{r.sub}</div>
            </div>
            {r.status === "In Progress" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-brand py-3 text-center text-xs font-semibold text-white">
        Verify &amp; Continue
      </div>
    </div>
  );
}

function ActivateScreen() {
  const services = [
    { icon: QrCode, label: "AEPS" },
    { icon: Users, label: "Money Transfer" },
    { icon: CreditCard, label: "PAN Card" },
    { icon: Smartphone, label: "Mobile Recharge" },
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="text-sm font-bold text-brand">CASHLO</div>
        <Bell className="h-4 w-4 text-ink/50" />
      </div>
      <div className="mx-4 rounded-2xl bg-brand p-4 text-white">
        <div className="text-[10px] text-white/70">Available Balance</div>
        <div className="mt-1 flex items-center gap-2 text-xl font-bold">
          ₹12,680.50
          <IndianRupee className="h-4 w-4" />
        </div>
        <div className="mt-1 text-[10px] text-white/60">Wallet Balance</div>
      </div>
      <div className="mt-3 px-4 text-xs font-semibold text-ink">
        Today&apos;s Overview
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 px-4">
        <div className="rounded-xl border border-border bg-surface p-2.5">
          <div className="text-[10px] text-ink/50">Transactions</div>
          <div className="text-sm font-bold text-ink">28</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-2.5">
          <div className="text-[10px] text-ink/50">Earnings</div>
          <div className="text-sm font-bold text-ink">₹2,340.00</div>
        </div>
      </div>
      <div className="mt-3 px-4 text-xs font-semibold text-ink">
        Popular Services
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2 px-4">
        {services.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="text-center text-[8px] leading-tight text-ink/50">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-around border-t border-border px-4 py-2.5">
        {[Home, Grid3x3, FileText, Wallet, User].map((Icon, i) => (
          <Icon
            key={i}
            className={`h-4 w-4 ${i === 0 ? "text-brand" : "text-ink/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

const SCREENS = [InstallScreen, RegisterScreen, KycScreen, ActivateScreen];

function FloatingCards({ step }: { step: (typeof STEPS)[number] }) {
  if (step.floatingCards.length === 0) return null;

  const CARD_HEIGHT = 64;
  const GAP = 56;
  const STAGGER_X = 36;
  const LINE_INSET = 28; // how far in from each card's left edge the line connects

  const offsetFor = (i: number) => (i % 2 === 1 ? STAGGER_X : 0);

  const totalHeight =
    step.floatingCards.length * CARD_HEIGHT +
    (step.floatingCards.length - 1) * GAP;

  // Line x-position tracks each card's own left-edge offset directly —
  // same coordinate space as marginLeft below, not an arbitrary guess.
  const points = step.floatingCards.map((_, i) => ({
    x: STAGGER_X + offsetFor(i) + LINE_INSET,
    y: i * (CARD_HEIGHT + GAP) + CARD_HEIGHT / 2,
  }));

  return (
    <div className="pointer-events-none absolute -right-16 top-4 hidden flex-col gap-14 xl:flex xl:-right-28 2xl:-right-40">
      <svg
        className="absolute left-0 top-0 -z-10 overflow-visible"
        width={STAGGER_X + LINE_INSET + 20}
        height={totalHeight}
        viewBox={`0 0 ${STAGGER_X + LINE_INSET + 20} ${totalHeight}`}
      >
        <path
  d={(() => {
    if (points.length < 2) return "";
    const get = (i: number) =>
      points[Math.max(0, Math.min(points.length - 1, i))];
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = get(i - 1);
      const p1 = get(i);
      const p2 = get(i + 1);
      const p3 = get(i + 2);
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  })()}
  fill="none"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeDasharray="4 5"
  strokeLinecap="round"
  className="text-brand/40"
/>
      </svg>

      {step.floatingCards.map((c, i) => (
        <div
          key={c.label}
          className="relative flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg"
          style={{ marginLeft: STAGGER_X + offsetFor(i) }}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
            <c.icon className="h-4 w-4" />
          </span>
          <span className="whitespace-pre-line text-xs font-semibold leading-tight text-ink">
            {c.label}
          </span>
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
        </div>
      ))}
    </div>
  );
}

function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card px-6 py-4 lg:mt-8 lg:py-5 xl:mt-10 xl:py-6">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <span
              className={`grid h-11 w-11 place-items-center rounded-full border-2 transition-colors ${
                i === activeStep
                  ? "border-brand bg-brand text-white"
                  : "border-border text-ink/40"
              }`}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <span
              className={`text-xs font-medium ${
                i === activeStep ? "text-brand" : "text-ink/40"
              }`}
            >
              {s.key === "install"
                ? "Install"
                : s.key === "register"
                ? "Register"
                : s.key === "kyc"
                ? "KYC"
                : "Activate & earn"}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`mx-3 h-px flex-1 ${
                i < activeStep ? "bg-brand" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepList({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-col gap-6">
      {STEPS.map((s, i) => {
        const active = i === activeStep;
        return (
          <div
            key={s.key}
            className={`rounded-2xl border-l-[3px] px-5 py-3 transition-all duration-300 lg:px-6 lg:py-4 xl:py-5 ${
              active
                ? "border-brand bg-card shadow-sm"
                : "border-transparent"
            }`}
          >
            <div className="flex items-start gap-4">
              <span
                className={`text-3xl font-extrabold leading-none ${
                  active ? "text-brand" : "text-ink/25"
                }`}
              >
                {s.num}
              </span>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    active ? "text-lg text-ink" : "text-base text-ink/70"
                  }`}
                >
                  {s.title}
                </h3>
                {active && (
                  <>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                      {s.desc}
                    </p>
                    {s.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-brand bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinRef.current,
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              STEPS.length - 1,
              Math.floor(self.progress * STEPS.length)
            );
            setActiveStep(idx);
          },
        });

        return () => st.kill();
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const Screen = SCREENS[activeStep];
  const step = STEPS[activeStep];

  return (
    <section ref={sectionRef} className="relative overflow-x-clip bg-bg pt-4 lg:pt-6 xl:pt-10">
      {/* ---------- Desktop: explicit-height scroll track, sticky-pinned content ---------- */}
      <div
        className="relative hidden lg:block"
        style={{ height: `${STEPS.length * 100}vh` }}
      >
        <div ref={pinRef} className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-brand">
              How Cashlo Works
            </span>
            <h2 className="mt-3 whitespace-nowrap text-3xl font-bold tracking-tight text-ink lg:text-4xl 2xl:text-5xl">
                From download to{" "}
                <span className="text-brand">daily earnings</span>
              </h2>
              <p className="mt-2 text-sm text-ink/60 lg:mt-3 lg:text-base">
                A simple journey for every merchant — install, register,
                verify, and start earning commission on every transaction.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_1.1fr] items-center gap-10 lg:mt-10 xl:mt-16">
              <div>
                <StepList activeStep={activeStep} />
                <Stepper activeStep={activeStep} />
              </div>

              <div className="relative flex justify-center">
                <FloatingCards step={step} />
                <div className="relative h-[clamp(420px,62vh,600px)] w-[clamp(210px,31vh,300px)] rounded-[40px] border-[6px] border-ink bg-bg shadow-2xl">
                  <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-ink" />
                  <div className="h-full overflow-hidden rounded-[34px] p-2 pt-8">
                    <Screen />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Mobile: plain stacked steps, no pin/scroll-driven swap ---------- */}
      <div className="px-6 py-20 lg:hidden">
        <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-brand">
          How Cashlo Works
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          From download to{" "}
          <span className="text-brand">daily earnings</span>
        </h2>
        <p className="mt-3 text-base text-ink/60">
          A simple journey for every merchant — install, register, verify,
          and start earning commission on every transaction.
        </p>

        <div className="mt-10 space-y-6">
          {STEPS.map((s, i) => {
            const Screen = SCREENS[i];
            return (
              <div
                key={s.key}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-extrabold text-brand">
                    {s.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1 text-sm text-ink/60">{s.desc}</p>
                  </div>
                </div>
                <div className="relative mx-auto mt-5 h-[420px] w-[220px] overflow-hidden rounded-[28px] border-[5px] border-ink bg-bg">
                  <Screen />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}