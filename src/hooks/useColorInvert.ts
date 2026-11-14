"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven color inversion. Drives a single CSS var (--edge) that moves
 * the chevron's baseline up the stage. Above the edge = blue fill + white text;
 * below = the base blue-on-white. As --edge shrinks, blue retracts upward and
 * the text flips white -> blue from the top down.
 */
export function useColorInvert() {
  const scope = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const proxy = { edge: 120 }; // blue covers the whole stage until the sweep is set up
      const apply = () => stage.style.setProperty("--edge", proxy.edge + "%");
      apply();

      // respect reduced-motion: skip the sweep, settle on the white end-state
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        proxy.edge = -25;
        apply();
        return;
      }

      // Start is keyed to the headline itself (not the stage's padded box) so
      // the sweep begins at the same moment on every screen size.
      const headline = stage.querySelector("h2") ?? stage;
      const lineHeight = () =>
        parseFloat(getComputedStyle(headline).lineHeight) || 0;

      // The chevron's centre tip sits DIP% (of the stage height) above its
      // sides — keep in sync with `calc(var(--edge) - 14%)` in globals.css.
      const DIP = 14;

      // Edge value that puts the chevron's tip right under the headline's
      // first line. At the trigger start that line's bottom is exactly the
      // screen's bottom edge, so the wave enters from the bottom of the
      // screen the moment you scroll on — instead of starting off-screen
      // below the stage (at 120%) and only showing up once it had already
      // climbed to the subtitle. Everything below the tip is off-screen at
      // that point, so starting there causes no visible jump.
      const startEdge = () => {
        const off =
          headline.getBoundingClientRect().top - stage.getBoundingClientRect().top;
        return ((off + lineHeight()) / stage.offsetHeight) * 100 + DIP;
      };

      gsap.fromTo(
        proxy,
        { edge: startEdge },
        {
          edge: -25, // end: blue fully retracted above the stage
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            // The stage scrolls in fully blue (white text); the wipe starts
            // as soon as the headline's FIRST LINE has fully risen into view
            // at the bottom of the screen (its top one line-height above the
            // bottom edge — the line height changes per breakpoint, so it's
            // read live), and finishes as the stage leaves the top.
            trigger: headline,
            start: () => `top bottom-=${lineHeight()}`,
            endTrigger: stage,
            end: "bottom top",
            scrub: 0.8, // eases the edge after the scroll instead of snapping
            invalidateOnRefresh: true, // re-reads startEdge/lineHeight on resize
            // a refresh (resize/rotation) re-renders the tween silently, so
            // onUpdate doesn't fire — push the re-fitted edge to the CSS var
            onRefresh: apply,
          },
        }
      );
      apply(); // fromTo renders its start value immediately; sync the CSS var
    },
    { scope }
  );

  return { scope, stageRef };
}