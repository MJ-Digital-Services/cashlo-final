"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import gsap from "gsap";
import confetti from "canvas-confetti";

const STORAGE_KEY = "cashlo_launch_seen_v1";

export default function LaunchAnnouncement() {
  const [show, setShow] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return;
    }
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!show || !overlayRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.92, y: 24 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(1.7)",
          delay: 0.08,
          onComplete: fireConfetti,
        }
      );
    });

    return () => ctx.revert();
  }, [show]);

  const fireConfetti = () => {
    const colors = ["#5B2D8E", "#7C3AED", "#F59E0B", "#EC4899", "#A78BFA"];

    // left cone — bursts up and to the right
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      startVelocity: 45,
      origin: { x: 0.08, y: 0.85 },
      colors,
      zIndex: 300,
    });

    // right cone — bursts up and to the left
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      startVelocity: 45,
      origin: { x: 0.92, y: 0.85 },
      colors,
      zIndex: 300,
    });

    // a couple of follow-up bursts so it doesn't feel like a single pop
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 65,
        spread: 45,
        startVelocity: 35,
        origin: { x: 0.1, y: 0.85 },
        colors,
        zIndex: 300,
      });
      confetti({
        particleCount: 30,
        angle: 115,
        spread: 45,
        startVelocity: 35,
        origin: { x: 0.9, y: 0.85 },
        colors,
        zIndex: 300,
      });
    }, 250);
  };

  const handleClose = () => {
    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 12,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: () => {
        setShow(false);
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
        } catch {}
      },
    });
  };

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 opacity-0"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl opacity-0"
      >
        {/* radial burst background image */}
        <Image
          src="/launch/bg.png"
          alt=""
          fill
          priority
          className="object-cover -z-10"
        />

        {/* cones — mirrored, bottom corners */}
        <Image
        src="/launch/cone.png"
        alt=""
        width={140}
        height={140}
        className="pointer-events-none absolute -bottom-2 -left-15 w-36 sm:w-60"
        />
        <Image
        src="/launch/cone.png"
        alt=""
        width={140}
        height={140}
        className="pointer-events-none absolute -bottom-2 -right-15 w-36 sm:w-60 -scale-x-100"
        />

        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink/60 shadow-md hover:text-ink transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 px-8 pb-10 pt-10 text-center sm:px-12">
        <p className="text-4xl font-bold tracking-tight">
        <span className="text-[#1a1030]">cash</span>
        <span className="text-[#5B2D8E]">lo</span>
        </p>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#5B2D8E]/25 bg-[#5B2D8E]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-[#5B2D8E]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#5B2D8E]" />
        Live Today
        </span>

        <h2 className="mt-4 text-6xl font-extrabold leading-none tracking-tight text-[#1a1030] sm:text-8xl">
        We&apos;re <span className="text-[#5B2D8E]">Live!</span>
        </h2>

          <p className="mt-4 text-xl text-[#1a1030]">
            <span className="font-semibold text-[#5B2D8E]">Cashlo</span> is
            officially launching today.
          </p>
          <p className="mt-1 mx-auto max-w-sm text-md text-[#1a1030]/60">
            Your smarter way to manage digital payments and grow your business.
            </p>

          <div className="mt-6 flex items-center justify-center gap-5 text-left text-xs font-medium text-[#1a1030]/80 sm:gap-8 sm:text-sm">
  <div className="flex items-center gap-2">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5B2D8E]/10 text-[#5B2D8E]">
      <Zap size={16} />
    </span>
    <span className="whitespace-nowrap">
      Fast
      <br />
      Transactions
    </span>
  </div>
  <div className="h-8 w-px bg-[#1a1030]/10" />
  <div className="flex items-center gap-2">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5B2D8E]/10 text-[#5B2D8E]">
      <ShieldCheck size={16} />
    </span>
    <span className="whitespace-nowrap">
      Secure
      <br />& Reliable
    </span>
  </div>
  <div className="h-8 w-px bg-[#1a1030]/10" />
  <div className="flex items-center gap-2">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5B2D8E]/10 text-[#5B2D8E]">
      <TrendingUp size={16} />
    </span>
    <span className="whitespace-nowrap">
      Grow Your
      <br />
      Business
    </span>
  </div>
</div>

<button
  onClick={handleClose}
  className="mt-8 mx-auto block rounded-xl bg-[#5B2D8E] px-12 py-4.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
>
  Explore Cashlo →
</button>

          <button
            onClick={handleClose}
            className="mt-4 text-sm font-medium text-[#5B2D8E]/70 underline decoration-dotted underline-offset-4 hover:text-[#5B2D8E]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}