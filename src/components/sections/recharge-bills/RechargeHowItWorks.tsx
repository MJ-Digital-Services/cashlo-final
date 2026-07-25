"use client";

import { useState, useRef } from "react";
import Container from "@/components/ui/Container";
import {
  LogIn,
  ListChecks,
  UserSearch,
  Receipt,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    id: "step-1",
    icon: LogIn,
    title: "Login to Cashlo App",
    desc: "Open the Cashlo merchant app and log in securely using biometric authentication or your registered mobile number with 1-tap OTP verification.",
    badge: "Fast & Secure Access",
    pillLabel: "Login",
  },
  {
    num: "02",
    id: "step-2",
    icon: ListChecks,
    title: "Pick a Recharge or Bill Service",
    desc: "Select Mobile Recharge, DTH, Broadband, Fastag, or Electricity Bill Payment directly from your streamlined merchant dashboard.",
    badge: "Multiple Operators Supported",
    pillLabel: "Select Service",
  },
  {
    num: "03",
    id: "step-3",
    icon: UserSearch,
    title: "Enter Customer Details & Auto-Fetch",
    desc: "Type in the customer's mobile number or consumer ID. Cashlo instantly auto-fetches exact live bill amounts and recommended recharge plans.",
    badge: "Zero-Error Auto-Fetch",
    pillLabel: "Fetch Bill",
  },
  {
    num: "04",
    id: "step-4",
    icon: Receipt,
    title: "Confirm Payment & Collect Cash",
    desc: "Review final transaction summary with the customer, collect cash upfront, and tap once to process the payment instantly from your Cashlo wallet.",
    badge: "Real-Time Settlement",
    pillLabel: "Collect Cash",
  },
  {
    num: "05",
    id: "step-5",
    icon: CheckCircle2,
    title: "Instant Digital Receipt & Earnings",
    desc: "Generate and dispatch an instant SMS or WhatsApp receipt to the customer. Your merchant commission is credited to your wallet in real time.",
    badge: "Instant Commission Credited",
    pillLabel: "Get Receipt",
  },
];

export default function RechargeHowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = stepCardRefs.current.filter(Boolean) as HTMLDivElement[];
      triggersRef.current = [];

      cards.forEach((card, idx) => {
        const st = ScrollTrigger.create({
          trigger: card,
          start: "top 75%",
          end: "bottom 25%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveIndex(idx);
            }
          },
        });

        triggersRef.current[idx] = st;

        gsap.fromTo(
          card,
          {
            rotateX: 10,
            scale: 0.96,
            opacity: 0.25,
            y: 30,
          },
          {
            rotateX: 0,
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              end: "bottom 25%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const handleStepClick = (index: number) => {
    setActiveIndex(index);
    const st = triggersRef.current[index];

    if (st) {
      const targetScroll = st.start + (st.end - st.start) * 0.5;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else {
      const targetCard = stepCardRefs.current[index];
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const progressPercent = ((activeIndex + 1) / steps.length) * 100;

  return (
    <section ref={containerRef} aria-labelledby="how-it-works-heading" className="relative bg-surface py-16 lg:py-24">
      <Container>
        {/* Main Grid: Left Sticky Content + Right Steps */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          {/* Left Column - Sticky Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>How It Works</span>
            </div>

            <h2 id="how-it-works-heading" className="mt-3 text-3xl font-bold text-balance tracking-tight text-ink sm:text-4xl lg:text-4xl lg:leading-[1.15]">
              Five Simple Steps to Instant Recharges
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink/70">
              Serve your customers seamlessly, collect cash on the spot, and earn instant commissions directly into your Cashlo wallet.
            </p>

            {/* Progress Tracker */}
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand">
                <span>Step {steps[activeIndex].num} of 05</span>
                <span>{steps[activeIndex].badge}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border" role="progressbar" aria-valuenow={activeIndex + 1} aria-valuemin={1} aria-valuemax={5} aria-label="Step progress">
                <div
                  className="h-full bg-brand transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-6 mt-6">
              {/* Step Navigation Pills */}
              <div role="tablist" aria-label="Process step navigation" className="flex flex-wrap gap-2">
                {steps.map((s, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={s.num}
                      id={`step-tab-${s.id}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`step-card-${s.id}`}
                      onClick={() => handleStepClick(idx)}
                      type="button"
                      className={`cursor-pointer flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${isActive
                        ? "bg-brand text-white shadow-md shadow-brand/20 scale-105"
                        : "bg-card text-ink/60 hover:bg-card/80 hover:text-ink border border-border"
                        }`}
                    >
                      <span>{s.num}</span>
                      <span>{s.pillLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Scrollable 3D Step Cards */}
          <div className="flex flex-col gap-16 lg:gap-24 lg:col-span-7 py-4 [perspective:1000px]">
            {steps.map((s, idx) => {
              const isActive = activeIndex === idx;
              const IconComponent = s.icon;

              return (
                <div
                  key={s.num}
                  id={`step-card-${s.id}`}
                  role="tabpanel"
                  aria-labelledby={`step-tab-${s.id}`}
                  tabIndex={0}
                  aria-current={isActive ? "step" : undefined}
                  ref={(el) => {
                    stepCardRefs.current[idx] = el;
                  }}
                  onClick={() => handleStepClick(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStepClick(idx);
                    }
                  }}
                  className={`group relative cursor-pointer rounded-2xl border p-6 sm:p-7 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [transform-style:preserve-3d] [will-change:transform] ${isActive
                    ? "border-brand bg-card shadow-2xl shadow-brand/10"
                    : "border-border bg-card/60 hover:border-brand/40"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`grid h-12 w-12 flex-none place-items-center rounded-xl transition-all duration-300 ${isActive
                        ? "bg-brand text-white shadow-md shadow-brand/25 scale-105"
                        : "bg-brand/10 text-brand group-hover:bg-brand/20"
                        }`}
                    >
                      <IconComponent className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold tracking-wider transition-colors ${isActive ? "text-brand" : "text-ink/40"
                            }`}
                        >
                          STEP {s.num}
                        </span>
                        <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-brand border border-brand/20">
                          {s.badge}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold tracking-tight text-ink sm:text-xl">
                        {s.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink/75">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}