"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the cards row and slides it right -> left as you scroll.
 * The track starts with the first card just off the right edge and ends
 * with the LAST card dead-center. A short "hold" tween keeps that last
 * card centered for a beat before the pin releases into the next section.
 *
 * Desktop (>=768px): pinned horizontal parade.
 * Mobile  (<768px):  plain vertical stagger, no pin (pinning is janky on touch).
 */
export function useHorizontalCards() {
  const scope = useRef<HTMLDivElement>(null); // <section>
  const pinRef = useRef<HTMLDivElement>(null); // viewport that gets pinned
  const trackRef = useRef<HTMLDivElement>(null); // flex row that moves

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!pin || !track) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", track);
      if (!cards.length) return;

      const mm = gsap.matchMedia();

      /* ---------- Desktop: pinned right -> left parade ---------- */
      mm.add("(min-width: 768px)", () => {
        const first = cards[0];
        const last = cards[cards.length - 1];

        // first card sits exactly off the right edge
        const startX = () => window.innerWidth - first.offsetLeft;
        // last card sits dead-center
        const endX = () =>
          window.innerWidth / 2 - (last.offsetLeft + last.offsetWidth / 2);

        const movePx = Math.abs(startX() - endX());
        const pausePx = Math.min(window.innerHeight * 0.45, 420); // the "hold"

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + (Math.abs(startX() - endX()) + pausePx),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1) slide the whole row across
        tl.fromTo(track, { x: startX }, { x: endX, duration: movePx });
        // 2) brief pause — last card stays centered, then it releases
        tl.to({}, { duration: pausePx });
      });

      /* ---------- Mobile: simple stagger, no pin ---------- */
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: pin, start: "top 75%", once: true },
          }
        );
      });
    },
    { scope }
  );

  return { scope, pinRef, trackRef };
}