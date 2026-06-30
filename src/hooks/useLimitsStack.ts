"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Withdrawal limits "deck of cards" reveal.
 *
 * Desktop (>=768px):
 *  - Page-load state: 4 cards stacked dead-center, each with a slight
 *    rotation/offset so it reads as a messy deck, not flat duplicates.
 *  - Pinned scroll phase 1: cards peel off the stack with an overlapping
 *    cascade (rotation -> 0, x -> final row offset).
 *  - Pinned scroll phase 2: once landed, the ₹ values count up together.
 *
 * Mobile (<768px):
 *  - No stacking, no pin (pinning + heavy transforms are janky on touch).
 *    Cards reset to normal flow and just fade/stagger up once, with a
 *    simple non-scrubbed count-up alongside.
 */
export function useLimitsStack() {
  const scope = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stack = stackRef.current;
      const pin = pinRef.current;
      if (!stack || !pin) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", stack);
      if (!cards.length) return;

      const values = gsap.utils.toArray<HTMLElement>("[data-value]", stack);

      const mm = gsap.matchMedia();

      /* ---------------- Desktop: stacked deck -> peel -> count-up ---------------- */
      mm.add("(min-width: 768px)", () => {
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        // -- Phase 0: instant starting "deck of cards" state --
        const stackOffsets = [-8, 4, -4, 8]; // degrees, per card index
        cards.forEach((card, i) => {
          gsap.set(card, {
            rotation: stackOffsets[i] ?? 0,
            y: i * -6,
            x: 0,
            zIndex: i,
          });
        });

        if (reduce) {
          // skip straight to the settled, counted-up end state
          cards.forEach((card) => gsap.set(card, { rotation: 0, y: 0, x: 0 }));
          values.forEach((v) => {
            v.textContent = v.getAttribute("data-target");
          });
          return;
        }

        const cardWidth = 512;
        const cardHeight = 256;
        const gap = 32; // bumped from 24
        const colSpacing = cardWidth + gap;
        const rowSpacing = cardHeight + gap;

        const gridPositions = [
        { x: -colSpacing / 2, y: -rowSpacing / 2 },
        { x: colSpacing / 2, y: -rowSpacing / 2 },
        { x: -colSpacing / 2, y: rowSpacing / 2 },
        { x: colSpacing / 2, y: rowSpacing / 2 },
        ];

        // -- Phase 1 + 2: one scrubbed, pinned timeline --
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top 10%",
            end: "+=2000",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
            tl.to(
                card,
                {
                rotation: 0,
                x: gridPositions[i]?.x ?? 0,
                y: gridPositions[i]?.y ?? 0,
                zIndex: 10 + i,
                duration: 1,
                ease: "power2.out",
                },
                i === 0 ? 0 : "<0.3"
            );
        });

        if (values.length) {
          tl.to(
            values,
            {
              textContent: (_i: number, target: Element) =>
                target.getAttribute("data-target") || "0",
              duration: 1,
              snap: { textContent: 1 },
              stagger: 0.15,
              ease: "power1.out",
            },
            "+=0.2"
          );
        }
      });

      /* ---------------- Mobile: simple, no pin ---------------- */
      mm.add("(max-width: 767px)", () => {
        // cards go back to normal stacking/flow visually — just reset
        // any transform so they don't look stuck mid-stack on touch
        gsap.set(cards, { rotation: 0, x: 0, y: 0, zIndex: "auto" });

        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduce) {
          values.forEach((v) => {
            v.textContent = v.getAttribute("data-target");
          });
          return;
        }

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
            onComplete: () => {
              if (!values.length) return;
              gsap.to(values, {
                textContent: (_i: number, target: Element) =>
                  target.getAttribute("data-target") || "0",
                duration: 1,
                snap: { textContent: 1 },
                stagger: 0.15,
                ease: "power1.out",
              });
            },
          }
        );
      });
    },
    { scope }
  );

  return { scope, pinRef, stackRef };
}