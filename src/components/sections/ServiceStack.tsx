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
  bgImage?: string;
  personImage: string;
  badges: Badge[];
  trustPrefix?: string;
  trustHighlight?: string;
  trustSuffix?: string;
  // literal Tailwind classes (scale + transform origin) for the cutout,
  // tuned so the subject fills the art column
  personFit: string;
};

const chapters: Chapter[] = [
  {
    key: "recharge",
    eyebrow: "Har Service Par Commission",
    title: ["Earn more with", "every service"],
    desc: "Offer essential digital services to your customers and earn commission on every successful transaction.",
    bgImage: "/services/recharge-background.png",
    personImage: "/services/recharge-person.png",
    personFit: "origin-bottom scale-140",
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
    personImage: "/services/loans-handshake.png",
    personFit: "origin-center scale-125",
    badges: [
      { icon: User, label: ["Personal", "Loan"], color: "#3B82F6" },
      { icon: Landmark, label: ["Business", "Loan"], color: "#16A34A" },
      { icon: TrendingUp, label: ["Working", "Capital"], color: "#7C6FF0" },
      { icon: Wallet, label: ["Credit", "Line"], color: "#F59E0B" },
    ],
  },
];

function ChapterBadges({ badges }: { badges: Badge[] }) {
  // uniform grid (full rows of 4 on sm+) instead of a ragged flex-wrap
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 short:mt-5 short:gap-2.5">
      {badges.map(({ icon: Icon, label, color }) => (
        <div
          key={label.join(" ")}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:flex-col sm:gap-2 sm:py-4 sm:text-center short:gap-1.5 short:py-2.5"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl short:h-8 short:w-8"
            style={{ backgroundColor: `${color}1A` }}
          >
            <Icon className="h-[18px] w-[18px]" style={{ color }} strokeWidth={1.9} />
          </span>
          <span className="text-sm font-medium leading-[1.25] text-ink">
            {label[0]}
            {label[1] && (
              <>
                <br />
                {label[1]}
              </>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Cutout art (transparent PNGs with a soft glow). The column is masked so
   the art fades into the page on the left/bottom instead of ending on a
   hard edge; the mask also clips anything scaled past the column. */
const FADE_BOTTOM = "linear-gradient(to top, transparent 0%, #000 14%)";
const FADE_LEFT = "linear-gradient(to right, transparent 0%, #000 22%)";

function ChapterArt({
  c,
  className,
  fadeLeft = false, // desktop: art sits beside the text, so fade toward it
}: {
  c: Chapter;
  className: string;
  fadeLeft?: boolean;
}) {
  const mask = fadeLeft ? `${FADE_LEFT}, ${FADE_BOTTOM}` : FADE_BOTTOM;
  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskComposite: "intersect",
      }}
    >
      {c.bgImage && (
        <Image
          src={c.bgImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="scale-125 object-cover object-center opacity-70 blur-[3px]"
        />
      )}
      <Image
        src={c.personImage}
        alt=""
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className={`${c.personFit} object-contain object-bottom`}
      />
    </div>
  );
}

function ChapterGrid({ c }: { c: Chapter }) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_0.9fr] xl:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      {/* Left column */}
      <div className="relative z-10 max-w-2xl 2xl:-ml-16">
        <p className="text-base font-semibold uppercase tracking-wider text-[#0B7A56] dark:text-emerald-400">
          {c.eyebrow}
        </p>
        <h2 className="mt-3 text-[40px] leading-[1.12] font-bold tracking-tight text-ink lg:text-[44px] xl:text-[48px] 2xl:text-[52px] short:text-[36px] xl:short:text-[38px]">
          {c.title[0]}
          <br />
          {c.title[1]}
        </h2>
        <p className="mt-4 max-w-md text-[19px] leading-relaxed text-ink/65 short:mt-3 short:text-base">
          {c.desc}
        </p>

        <ChapterBadges badges={c.badges} />

        {c.trustPrefix && (
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-5 py-3.5 short:mt-4 short:py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0EA371]/10">
              <ShieldCheck className="h-4.5 w-4.5 text-[#0B7A56] dark:text-emerald-400" strokeWidth={2} />
            </span>
            <p className="text-sm text-ink/65">
              {c.trustPrefix}
              <span className="font-semibold text-[#0B7A56] dark:text-emerald-400">{c.trustHighlight}</span>
              {c.trustSuffix}
            </p>
          </div>
        )}
      </div>

      {/* Right column — desktop only */}
      <ChapterArt
        c={c}
        fadeLeft
        className="hidden h-[clamp(340px,calc(100vh-9rem),540px)] lg:block"
      />
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
    <section className="relative bg-tint-cool">
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
              className="absolute inset-0 flex items-center bg-tint-cool pt-20"
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
            <ChapterArt c={c} className="h-[300px] sm:h-[440px]" />

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0B7A56] dark:text-emerald-400">
                {c.eyebrow}
              </p>
              <h2 className="mt-3 text-[32px] font-bold leading-[1.15] tracking-tight text-ink">
                {c.title[0]}
                <br />
                {c.title[1]}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink/65">
                {c.desc}
              </p>

              <ChapterBadges badges={c.badges} />

              {c.trustPrefix && (
                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0EA371]/10">
                    <ShieldCheck className="h-4 w-4 text-[#0B7A56] dark:text-emerald-400" strokeWidth={2} />
                  </span>
                  <p className="text-sm text-ink/65">
                    {c.trustPrefix}
                    <span className="font-semibold text-[#0B7A56] dark:text-emerald-400">{c.trustHighlight}</span>
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