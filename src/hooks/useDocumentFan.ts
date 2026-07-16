"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

/**
 * Folder-reveal interaction: documents sit stacked behind a folder front
 * flap, peeking out the top. On hover (or tap on touch devices) the flap
 * tilts open (rotationX) and the documents fan out above it like cards
 * being pulled from a folder.
 */
export function useDocumentFan() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stack = scope.current;
      if (!stack) return;

      const front = stack.querySelector<HTMLElement>("[data-doc-front]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-doc-card]");
      if (!cards.length) return;

      const mid = (cards.length - 1) / 2;
      const layout = cards.map((_, i) => {
        const offset = i - mid;
        return {
          x: offset * 100,
          y: -150 - Math.abs(offset) * 8,
          rotate: offset * 6,
        };
      });

      // idle: only a small sliver pokes above the flap's top edge —
      // the rest of each card sits behind the flap, hidden by DOM stacking
      gsap.set(cards, {
        x: (i: number) => (i - mid) * 6,
        y: -14,
        rotate: (i: number) => (i % 2 ? 3 : -3),
        zIndex: (i: number) => i,
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out", duration: 0.55 },
      });

      tl.to(cards, {
        x: (i: number) => layout[i].x,
        y: (i: number) => layout[i].y,
        rotation: (i: number) => layout[i].rotate,
        stagger: 0.06,
      });

      tl.to(front, { rotationX: -28, duration: 0.5, ease: "power2.out" }, "<");

      let open = false;
      const play = () => {
        open = true;
        tl.play();
      };
      const reverse = () => {
        open = false;
        tl.reverse();
      };
      const onTap = (e: TouchEvent) => {
        e.preventDefault();
        open ? reverse() : play();
      };

      stack.addEventListener("mouseenter", play);
      stack.addEventListener("mouseleave", reverse);
      stack.addEventListener("touchstart", onTap, { passive: false });
      stack.addEventListener("focus", play);
      stack.addEventListener("blur", reverse);

      return () => {
        stack.removeEventListener("mouseenter", play);
        stack.removeEventListener("mouseleave", reverse);
        stack.removeEventListener("touchstart", onTap);
        stack.removeEventListener("focus", play);
        stack.removeEventListener("blur", reverse);
      };
    },
    { scope }
  );

  return scope;
}