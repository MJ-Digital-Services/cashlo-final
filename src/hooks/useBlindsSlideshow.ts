"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned full-viewport slideshow with venetian-blinds transitions.
 * - Slides stacked: slide 0 on top, last at the bottom.
 * - Each transition rotates the current slide's slats open
 *   (rotationX -95, staggered from center) revealing the next slide.
 * - [data-slide-text] blocks crossfade in sync.
 */
export function useBlindsSlideshow(count: number) {
  const scope = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", stage);
        const texts = gsap.utils.toArray<HTMLElement>("[data-slide-text]", stage);
        if (slides.length < 2) return;

        // stacking: first slide on top
        slides.forEach((s, i) => (s.style.zIndex = String(count - i)));

        gsap.set(texts, { autoAlpha: 0, y: 40 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "+=" + count * 100 + "%", // one viewport of scroll per step
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 0; i < count - 1; i++) {
          const slats = slides[i].querySelectorAll<HTMLElement>(".blind-slat");
          const label = `step${i}`;

          tl.addLabel(label, "+=0.45"); // hold each slide for a beat

          // outgoing text
          tl.to(texts[i], { autoAlpha: 0, y: -40, duration: 0.3 }, label);

          // blinds open — the reference effect
          if (reduce) {
            tl.to(slides[i], { autoAlpha: 0, duration: 0.6 }, label);
          } else {
            tl.to(
              slats,
              {
                rotationX: -95,
                autoAlpha: 0,
                transformOrigin: "top center",
                ease: "power2.inOut",
                duration: 1,
                stagger: { each: 0.045, from: "center" },
              },
              label
            );
          }

          // incoming text
          tl.fromTo(
            texts[i + 1],
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
            label + "+=0.55"
          );
        }
        tl.to({}, { duration: 0.5 }); // hold the last slide before unpin
      });

      /* Mobile: no pin, simple fade-up per step */
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-mstep]", stage.parentElement!).forEach((el) => {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            }
          );
        });
      });
    },
    { scope }
  );

  return { scope, stageRef };
}