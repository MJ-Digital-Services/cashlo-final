"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrubbed reveal: [data-scrub] elements start tiny (scale 0) and invisible,
 * then grow to full size as the user scrolls. Reverses on scroll up because
 * the animation is tied to scroll position (scrub).
 */
export function useScrubScale() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-scrub]");
      if (!items.length) return;

      gsap.fromTo(
        items,
        { scale: 0, opacity: 0, y: -120 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: scope.current,
            start: "top 85%",   // animation begins as section nears viewport
            end: "top 35%",     // fully formed by the time it's higher up
            scrub: true,        // 👈 ties progress to the scrollbar
          },
        }
      );
    },
    { scope }
  );

  return scope;
}