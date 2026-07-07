"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE_SPEED = 14;   // degrees per second
const HOVER_SPEED = 4;   // slowed, not stopped
const CARD_W = 400;      // must match the card width class below

/**
 * Full-viewport pinned 3D ring.
 * - Cards sit on a circle: rotateY(i * step) translateZ(radius) via inline CSS.
 * - GSAP ticker spins the ring; hover lerps the speed down (never to 0).
 * - Cards facing away are dimmed based on their angle to the viewer.
 * - Ticker only runs while the section is on screen (ScrollTrigger toggles it).
 */
export function useRingCarousel(count: number) {
  const scope = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null); // perspective wrapper
  const ringRef = useRef<HTMLDivElement>(null);  // rotating ring

  useGSAP(
    () => {
      const stage = stageRef.current;
      const ring = ringRef.current;
      if (!stage || !ring) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ring3d__card", ring);
        if (!cards.length) return;

        const step = 360 / count;
        // radius so neighboring cards don't overlap, plus breathing room
        const radius = CARD_W / 2 / Math.tan(Math.PI / count) + 140;

        // Place each card on the circle (CSS transform => correct order:
        // center, rotate onto the ring, push outward)
        cards.forEach((card, i) => {
          card.style.transform = `translate(-50%, -50%) rotateY(${
            i * step
          }deg) translateZ(${radius}px)`;
        });

        let angle = 0;
        let speed = BASE_SPEED;
        let targetSpeed = reduce ? 0 : BASE_SPEED;

        const dim = () => {
            cards.forEach((card, i) => {
                const a = gsap.utils.wrap(-180, 180, i * step + angle);
                const t = Math.cos((a * Math.PI) / 180); // 1 front, -1 back
                // fully invisible by ~80° rotation, so no edge-on slivers
                const o = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.15, 1, 0, 1, t));
                gsap.set(card, { opacity: o, visibility: o === 0 ? "hidden" : "visible" });
            });
        };

        const tick = (_t: number, deltaTime: number) => {
          speed += (targetSpeed - speed) * 0.06; // eases between speeds
          angle -= speed * (deltaTime / 1000);   // negative = right-to-left
          gsap.set(ring, { rotationY: angle });
          dim();
        };

        // initial paint even before the ticker starts
        dim();

        // Pin the full-viewport section briefly, spin only while visible
        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 1.7,
          pin: pinRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          onToggle: (self) => {
            if (self.isActive) gsap.ticker.add(tick);
            else gsap.ticker.remove(tick);
          },
        });
        // also spin while merely visible (before/after the pin)
        const vis = ScrollTrigger.create({
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            gsap.ticker.remove(tick);
            if (self.isActive) gsap.ticker.add(tick);
          },
        });

        // Hover slows, leave restores
        const slow = () => { if (!reduce) targetSpeed = HOVER_SPEED; };
        const restore = () => { if (!reduce) targetSpeed = BASE_SPEED; };
        stage.addEventListener("pointerenter", slow);
        stage.addEventListener("pointerleave", restore);

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          vis.kill();
          stage.removeEventListener("pointerenter", slow);
          stage.removeEventListener("pointerleave", restore);
          cards.forEach((c) => (c.style.transform = ""));
        };
      });

      /* Mobile: no 3D, simple stagger on the scroll-snap row */
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          "[data-mcard]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
          }
        );
      });
    },
    { scope }
  );

  return { scope, pinRef, stageRef, ringRef };
}