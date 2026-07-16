"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sticky stacked "chapters" (Stripe-style feature walkthrough).
 * Each [data-chapter] rises over the previous one as you scroll; the
 * outgoing chapter scales down, blurs, and darkens beneath the new one.
 * A side rail ([data-rail-dot]) tracks which chapter is active.
 */
export function useCardStack(count: number) {
  const scope = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage || count < 2) return;

      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-rail-dot]");
      if (!chapters.length) return;

      // starting state: first chapter in place, rest parked below the fold
      gsap.set(chapters[0], { yPercent: 0, scale: 1, filter: "blur(0px)" });
      gsap.set(chapters.slice(1), { yPercent: 100 });
      dots[0]?.classList.add("active");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: `+=${(count - 1) * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (count - 1));
            dots.forEach((d, i) => d.classList.toggle("active", i === idx));
          },
        },
        defaults: { ease: "power2.inOut" },
      });

      for (let i = 1; i < chapters.length; i++) {
        const dim = chapters[i - 1].querySelector<HTMLElement>(
          "[data-chapter-dim]"
        );
        tl.to(chapters[i - 1], { scale: 0.92, filter: "blur(6px)", duration: 1 }, i - 1)
          .to(dim, { opacity: 0.55, duration: 1 }, i - 1)
          .to(chapters[i], { yPercent: 0, duration: 1 }, i - 1);
      }

      return () => {
        dots.forEach((d) => d.classList.remove("active"));
      };
    },
    { scope }
  );

  return { scope, stageRef };
}