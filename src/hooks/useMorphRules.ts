"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ---- Blob engine (adapted from the reference) ----
   A smooth closed curve through 8 points; morphing = tweening the radii. */
function blobPath(radii: number[], size: number, rot: number) {
  const N = radii.length;
  const cx = size / 2, cy = size / 2, R = size * 0.36;
  const pts = radii.map((r, i) => {
    const a = rot + (i / N) * Math.PI * 2;
    return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r];
  });
  let d = "";
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N], p1 = pts[i];
    const p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    if (!i) d = `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

const SHAPES = {
  blob:   [1, 0.88, 1.06, 0.9, 1.02, 0.86, 1.08, 0.9],
  star:   [1.18, 0.62, 1.18, 0.62, 1.18, 0.62, 1.18, 0.62],
  gem:    [1.22, 0.78, 0.95, 0.78, 1.22, 0.78, 0.95, 0.78],
  circle: [1, 1, 1, 1, 1, 1, 1, 1],
};
// brand-family shades, ending on exact brand (#445df0) for the CTA handoff
const COLORS = {
  light: [139, 156, 247],
  mid:   [91, 114, 245],
  deep:  [47, 68, 201],
  brand: [68, 93, 240],
};

export function useMorphRules() {
  const scope = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const shape = shapeRef.current;
      if (!wrap || !shape) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          "[data-rule-card]",
          scope.current!
        );

        // read the live theme's brand color once (light: #445df0, dark: #5b72f5)
        const v = getComputedStyle(document.documentElement)
          .getPropertyValue("--brand")
          .trim();
        const BRAND =
          v.startsWith("#") && v.length === 7
            ? [
                parseInt(v.slice(1, 3), 16),
                parseInt(v.slice(3, 5), 16),
                parseInt(v.slice(5, 7), 16),
              ]
            : COLORS.brand; // fallback

        // mutable morph state — the timeline tweens these arrays
        const S = { r: [...SHAPES.blob], rot: 0, c: [...COLORS.light], b: 0 };

        const tick = (time: number) => {
          const wob = reduce
            ? S.r
            : S.r.map((v, i) => v + Math.sin(time * 1.6 + i) * 0.015);
          shape.setAttribute("d", blobPath(wob, 600, S.rot));
        
          // Alpha ramps from translucent (lets the background image show through
          // during the blob/star/gem stages) up to fully opaque exactly as it
          // finishes becoming the solid brand circle in stage 5 — so there's no
          // visible "pop" when it needs to be opaque for the final CTA text.
          const alpha = 0.8 + S.b * 0.2;
          shape.style.fill =
            S.b >= 0.999
              ? "var(--brand)" // live CSS var — follows theme toggles automatically
              : `rgba(${S.c[0] | 0},${S.c[1] | 0},${S.c[2] | 0},${alpha.toFixed(2)})`;
        };
        gsap.ticker.add(tick);

        // scale needed for the circle to swallow the viewport
        let coverScale = 8;
        const computeCover = () => {
          const s = wrap.getBoundingClientRect().width * 0.72;
          coverScale =
            (Math.hypot(window.innerWidth, window.innerHeight) / s) * 1.25;
        };
        computeCover();
        ScrollTrigger.addEventListener("refreshInit", computeCover);

        gsap.set(cards, { opacity: 0, scale: 0.4 });

        if (reduce) {
          // static fallback: emerged cards around a brand circle, no pin
          S.r = [...SHAPES.circle];
          S.c = [...BRAND];
          gsap.set(cards[0], { opacity: 1, scale: 1, xPercent: -118 });
          gsap.set(cards[1], { opacity: 1, scale: 1, xPercent: 118 });
          gsap.set(cards[2], { opacity: 1, scale: 1, yPercent: 95 });
          return () => {
            gsap.ticker.remove(tick);
            ScrollTrigger.removeEventListener("refreshInit", computeCover);
          };
        }

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "+=460%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power2.inOut" },
        });

        master
          /* settle in as a soft blob */
          .from(wrap, { scale: 0.55, duration: 1 })

          /* heading clears out right after the blob settles in */
          // .to("[data-morph-head]", { opacity: 0, duration: 0.5 })

          /* STAGE 1 — rule 1 emerges LEFT */
          .to(cards[0], { opacity: 1, scale: 1, xPercent: -118, duration: 1, ease: "back.out(1.4)" }, "+=.3")

          /* STAGE 2 — morph to STAR, rule 2 RIGHT */
          .to(S.r, { endArray: SHAPES.star, duration: 1.4 }, "+=.5")
          .to(S,   { rot: 0.5, duration: 1.4 }, "<")
          .to(S.c, { endArray: COLORS.mid, duration: 1.4 }, "<")
          .to(cards[1], { opacity: 1, scale: 1, xPercent: 118, duration: 1, ease: "back.out(1.4)" }, "<+=.4")

          /* STAGE 3 — morph to GEM, rule 3 BELOW */
          .to(S.r, { endArray: SHAPES.gem, duration: 1.4 }, "+=.6")
          .to(S,   { rot: 1.1, duration: 1.4 }, "<")
          .to(S.c, { endArray: COLORS.deep, duration: 1.4 }, "<")
          .to(cards[2], { opacity: 1, scale: 1, yPercent: 95, duration: 1, ease: "back.out(1.4)" }, "<+=.4")

          /* STAGE 4 — absorb cards; shape becomes a BRAND CIRCLE */
          .to(cards, { xPercent: 0, yPercent: 0, scale: 0, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.in" }, "+=.7")
          .to(S.r, { endArray: SHAPES.circle, duration: 1.2 }, "<")
          .to(S.c, { endArray: BRAND, duration: 1.2 }, "<")
          .to(S, { rot: 1.6, b: 1, duration: 1.2 }, "<")

          /* STAGE 5 — the circle swallows the screen */
          .to(wrap, { scale: () => coverScale, duration: 2.2, ease: "power2.in" }, "+=.3")
          // .to(
          //   scope.current,
          //   { backgroundColor: `rgb(${BRAND.join(",")})`, duration: 0.6 },
          //   "<+=1.2"
          // )
          .fromTo(
            "[data-morph-final]",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=.9"
          )
          .to({}, { duration: 2 });

        return () => {
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener("refreshInit", computeCover);
        };
      });

      /* Mobile: plain cards, no morph */
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          "[data-mrule]",
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

  return { scope, wrapRef, shapeRef };
}