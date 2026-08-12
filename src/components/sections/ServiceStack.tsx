"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Smartphone,
  Zap,
  SatelliteDish,
  Flame,
  Droplet,
  Wifi,
  CreditCard,
  MoreHorizontal,
  ShieldCheck,
  User,
  Landmark,
  TrendingUp,
  Wallet,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Badge = { icon: typeof Smartphone; label: string[]; color: string };

type Chapter = {
  key: string;
  eyebrow: string;
  title: [string, string];
  desc: string;
  bgImage: string;
  personImage: string;
  badges: Badge[];
  trustPrefix?: string;
  trustHighlight?: string;
  trustSuffix?: string;
  bgScale?: string; // Tailwind scale class, e.g. "scale-140"
  personScale?: string;
  personOffset?: string; // Tailwind translate classes
  // true = this is a full rectangular photo (no built-in transparency),
  // so its edges get faded into the page background via a mask instead
  // of relying on object-contain + a transparent PNG.
  bgMask?: boolean;
};

const chapters: Chapter[] = [
  {
    key: "recharge",
    eyebrow: "Har Service Par Commission",
    title: ["Earn more with", "every service"],
    desc: "Offer essential digital services to your customers and earn commission on every successful transaction.",
    bgImage: "/services/recharge-background.png",
    personImage: "/services/recharge-person.png",
    bgScale: "scale-140",
    personScale: "scale-200",
    personOffset: "translate-x-6 -translate-y-6",
    badges: [
      { icon: Smartphone, label: ["Mobile", "Recharge"], color: "#0EA371" },
      { icon: SatelliteDish, label: ["DTH", "Recharge"], color: "#64748B" },
      { icon: Zap, label: ["Electricity", "Bills"], color: "#F59E0B" },
      { icon: Flame, label: ["Gas", "Bills"], color: "#EF4444" },
      { icon: Droplet, label: ["Water", "Bills"], color: "#3B82F6" },
      { icon: Wifi, label: ["Broadband", "Bills"], color: "#7C6FF0" },
      { icon: CreditCard, label: ["FASTag", "Recharge"], color: "#16A34A" },
      { icon: MoreHorizontal, label: ["More", "Services"], color: "#94A3B8" },
    ],
    trustPrefix: "Secure transactions. Instant settlements. Trusted by ",
    trustHighlight: "10,000+",
    trustSuffix: " partners.",
  },
  {
    key: "loans",
    eyebrow: "Loan Dilao. Commission Kamao.",
    title: ["Help Customers.", "Earn More."],
    desc: "Offer instant loan services to yourself and your customers. Cashlo enables eligible merchants to assist customers with loan applications while earning attractive commissions.",
    bgImage: "/services/loans-background.png",
    personImage: "/services/loans-handshake.png",
    bgScale: "scale-125",
    personScale: "scale-180",
    personOffset: "",
    bgMask: true,
    badges: [
      { icon: User, label: ["Personal Loan"], color: "#3B82F6" },
      { icon: Landmark, label: ["Business Loan"], color: "#16A34A" },
      { icon: TrendingUp, label: ["Working Capital"], color: "#7C6FF0" },
      { icon: Wallet, label: ["Credit Line"], color: "#F59E0B" },
    ],
  },
];

function ChapterBadges({ badges }: { badges: Badge[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {badges.map(({ icon: Icon, label, color }) => (
        <div
          key={label.join(" ")}
          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}1A` }}
          >
            <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.9} />
          </span>
          <span className="whitespace-nowrap text-[15px] font-medium leading-[1.25] text-slate-800">
            {label.length === 2 ? (
              <>
                {label[0]}
                <br />
                {label[1]}
              </>
            ) : (
              label[0]
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function ChapterImage({ c }: { c: Chapter }) {
  return (
    <div className="relative h-[420px] w-full overflow-hidden sm:h-[480px]">
      {c.bgMask ? (
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse farthest-side at 50% 45%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse farthest-side at 50% 45%, black 55%, transparent 100%)",
          }}
        >
          <Image
            src={c.bgImage}
            alt=""
            fill
            className="scale-110 object-cover object-center blur-[3px]"
          />
        </div>
      ) : (
        <Image
          src={c.bgImage}
          alt=""
          fill
          className="scale-110 object-contain object-center blur-[3px]"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 h-[92%]">
        <Image
          src={c.personImage}
          alt=""
          fill
          className="scale-110 object-contain object-bottom"
        />
      </div>
    </div>
  );
}

function ChapterGrid({ c }: { c: Chapter }) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      {/* Left column */}
      <div className="max-w-2xl lg:-ml-16">
        <p className="text-base font-semibold uppercase tracking-wider text-[#0EA371]">
          {c.eyebrow}
        </p>
        <h2 className="mt-3 text-[48px] font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-[52px]">
          {c.title[0]}
          <br />
          {c.title[1]}
        </h2>
        <p className="mt-4 max-w-md text-[19px] leading-relaxed text-slate-500">
          {c.desc}
        </p>

        <ChapterBadges badges={c.badges} />

        {c.trustPrefix && (
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-5 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0EA371]/10">
              <ShieldCheck className="h-4.5 w-4.5 text-[#0EA371]" strokeWidth={2} />
            </span>
            <p className="text-sm text-slate-600">
              {c.trustPrefix}
              <span className="font-semibold text-[#0EA371]">{c.trustHighlight}</span>
              {c.trustSuffix}
            </p>
          </div>
        )}
      </div>

      {/* Right column — desktop-only, uses this chapter's tuned scale/offset values */}
      <div className="relative hidden h-[560px] w-full overflow-visible lg:block">
        {c.bgMask ? (
          <div
            className="absolute inset-0"
            style={{
              maskImage:
                "radial-gradient(ellipse farthest-side at 50% 45%, black 55%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse farthest-side at 50% 45%, black 55%, transparent 100%)",
            }}
          >
            <Image
              src={c.bgImage}
              alt=""
              fill
              className={`${c.bgScale ?? "scale-110"} object-cover object-center blur-[3px]`}
            />
          </div>
        ) : (
          <Image
            src={c.bgImage}
            alt=""
            fill
            className={`${c.bgScale ?? "scale-110"} object-contain object-center blur-[3px]`}
          />
        )}

        <div className={`absolute inset-x-0 bottom-0 h-[92%] ${c.personOffset ?? ""}`}>
          <Image
            src={c.personImage}
            alt=""
            fill
            className={`${c.personScale ?? "scale-110"} object-contain object-bottom`}
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default function ServiceStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const els = chapterRefs.current.filter(Boolean) as HTMLDivElement[];
        if (els.length < 2) return;

        gsap.set(els.slice(1), { yPercent: 100 });

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: stageRef.current,
          scrub: 1,
          anticipatePin: 1,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        els.slice(1).forEach((el, i) => {
          tl.to(el, { yPercent: 0, ease: "none" }, i);
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-[#F3F7FC]">
      {/* Desktop: pinned, chapters slide up and cover one another */}
      <div
        ref={containerRef}
        className="relative hidden lg:block"
        style={{ height: `${chapters.length * 100}vh` }}
      >
        <div ref={stageRef} className="relative h-screen overflow-hidden">
          {chapters.map((c, i) => (
            <div
              key={c.key}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              className="absolute inset-0 flex items-center bg-[#F3F7FC]"
              style={{ zIndex: i + 1 }}
            >
              <Container>
                <ChapterGrid c={c} />
              </Container>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: image first (contained, no overflow), then text — no
          absolute/oversized elements that could bleed over the heading */}
      <div className="space-y-16 px-6 py-16 lg:hidden">
        {chapters.map((c) => (
          <div key={c.key}>
            <ChapterImage c={c} />

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0EA371]">
                {c.eyebrow}
              </p>
              <h2 className="mt-3 text-[32px] font-bold leading-[1.15] tracking-tight text-slate-900">
                {c.title[0]}
                <br />
                {c.title[1]}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-500">
                {c.desc}
              </p>

              <ChapterBadges badges={c.badges} />

              {c.trustPrefix && (
                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0EA371]/10">
                    <ShieldCheck className="h-4 w-4 text-[#0EA371]" strokeWidth={2} />
                  </span>
                  <p className="text-sm text-slate-600">
                    {c.trustPrefix}
                    <span className="font-semibold text-[#0EA371]">{c.trustHighlight}</span>
                    {c.trustSuffix}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}