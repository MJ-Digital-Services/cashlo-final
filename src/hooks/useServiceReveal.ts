"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cascading reveal for a service grid: cards rise into place with a slight
 * alternating tilt, then their icon badge gives a small elastic "pop" —
 * distinct from the generic fade-up used elsewhere on the page.
 */
export function useServiceReveal() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
      if (!cards.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top 82%",
          toggleActions: "play none none none",
          once: true,
        },
        onComplete: () => {
          // hand transform back to the CSS `transition` class for hover states
          gsap.set(cards, { clearProps: "transition" });
        },
      });
      
      tl.set(cards, { transition: "none" }, 0)
        .fromTo(
        cards,
        {
          y: 46,
          opacity: 0,
          rotate: (i: number) => (i % 2 ? 3 : -3),
        },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: { each: 0.07, from: "start" },
        }
    ).fromTo(
        cards.map((c) => c.querySelector("[data-service-icon]")),
        { scale: 0.6 },
        { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.07 },
        "-=0.45"
      );
    },
    { scope }
  );

  return scope;
}