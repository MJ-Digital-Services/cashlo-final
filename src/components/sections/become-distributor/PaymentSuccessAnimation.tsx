"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

type PaymentStatus = "processing" | "success";

interface PaymentSuccessAnimationProps {
  status: PaymentStatus;
}

// Brand hex is needed here because SVG strokes/fills and dynamically-created
// confetti particles can't consume Tailwind token classes directly.
const BRAND = "#445df0";
const CONFETTI_COLORS = [BRAND, "#8b9cf7", "#ffb020", "#2dd4bf"];
const CONFETTI_COUNT = 24; // deliberately small — smooth on budget Android

export function PaymentSuccessAnimation({
  status,
}: PaymentSuccessAnimationProps) {
  const scope = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ---------- PROCESSING PHASE ----------
      if (status === "processing") {
        if (prefersReducedMotion) {
          // Static branded ring, no motion
          gsap.set(".pulse-ring", { opacity: 0.35, scale: 1 });
          return;
        }

        // Calm "sonar" pulse: two rings expanding outward from a static ring,
        // staggered by half a cycle. Transform/opacity only — GPU friendly.
        gsap.fromTo(
          ".pulse-ring",
          { scale: 0.72, opacity: 0.55 },
          {
            scale: 1.18,
            opacity: 0,
            duration: 1.8,
            ease: "power1.out",
            repeat: -1,
            stagger: 0.9,
            transformOrigin: "50% 50%",
          }
        );
        return;
      }

      // ---------- SUCCESS PHASE ----------
      const check = checkRef.current;
      if (!check) return;

      const checkLength = check.getTotalLength();

      if (prefersReducedMotion) {
        // Skip straight to the final static state: checkmark fully visible,
        // no draw animation, no confetti.
        gsap.set(".success-circle", { scale: 1, transformOrigin: "50% 50%" });
        gsap.set(check, { strokeDasharray: checkLength, strokeDashoffset: 0 });
        gsap.set(".success-text", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline();

      // 1. Circle scales in with a slight overshoot
      tl.fromTo(
        ".success-circle",
        { scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.5, ease: "back.out(2.2)" }
      );

      // 2. Checkmark draws itself in via stroke-dashoffset
      tl.fromTo(
        check,
        { strokeDasharray: checkLength, strokeDashoffset: checkLength },
        { strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut" },
        "-=0.15"
      );

      // 3. Confetti burst, slightly overlapping the end of the draw
      tl.call(fireConfetti, [], "-=0.2");

      // 4. Label fades up
      tl.fromTo(
        ".success-text",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.1"
      );

      function fireConfetti() {
        const container = confettiRef.current;
        if (!container) return;

        for (let i = 0; i < CONFETTI_COUNT; i++) {
          const particle = document.createElement("div");
          const size = gsap.utils.random(5, 9);
          const isCircle = i % 3 === 0;

          particle.style.position = "absolute";
          particle.style.left = "50%";
          particle.style.top = "50%";
          particle.style.width = `${size}px`;
          particle.style.height = `${isCircle ? size : size * 0.55}px`;
          particle.style.borderRadius = isCircle ? "9999px" : "1px";
          particle.style.backgroundColor =
            CONFETTI_COLORS[i % CONFETTI_COLORS.length];
          particle.style.willChange = "transform, opacity";
          container.appendChild(particle);

          // Radiate outward with a downward drift, tumble, and fade
          const angle =
            (i / CONFETTI_COUNT) * Math.PI * 2 + gsap.utils.random(-0.35, 0.35);
          const distance = gsap.utils.random(55, 115);

          gsap.fromTo(
            particle,
            { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance + gsap.utils.random(15, 45),
              rotation: gsap.utils.random(-270, 270),
              scale: gsap.utils.random(0.35, 0.8),
              opacity: 0,
              duration: gsap.utils.random(0.8, 1.3),
              ease: "power2.out",
              onComplete: () => particle.remove(),
            }
          );
        }
      }

      // Cleanup any in-flight particles if the component unmounts mid-burst
      return () => {
        confettiRef.current?.replaceChildren();
      };
    },
    { scope, dependencies: [status], revertOnUpdate: true }
  );

  return (
    <div
      ref={scope}
      className="flex flex-col items-center gap-5"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-24 w-24">
        {/* Confetti layer */}
        <div
          ref={confettiRef}
          className="pointer-events-none absolute inset-0 overflow-visible"
          aria-hidden="true"
        />

        {status === "processing" ? (
          <svg viewBox="0 0 52 52" className="h-full w-full" aria-hidden="true">
            {/* Static anchor ring */}
            <circle
              cx="26"
              cy="26"
              r="18"
              fill="none"
              stroke={BRAND}
              strokeWidth="2"
              opacity="0.3"
            />
            {/* Expanding sonar rings */}
            <circle
              className="pulse-ring"
              cx="26"
              cy="26"
              r="21"
              fill="none"
              stroke={BRAND}
              strokeWidth="1.5"
            />
            <circle
              className="pulse-ring"
              cx="26"
              cy="26"
              r="21"
              fill="none"
              stroke={BRAND}
              strokeWidth="1.5"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 52 52" className="h-full w-full" aria-hidden="true">
            <circle
              className="success-circle"
              cx="26"
              cy="26"
              r="24"
              fill={BRAND}
            />
            <path
              ref={checkRef}
              d="M15 27l7.5 7.5L37 19"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {status === "processing" ? (
        <p className="text-sm text-ink/60">Verifying your payment…</p>
      ) : (
        <p className="success-text text-sm font-medium text-ink">
          Payment successful
        </p>
      )}
    </div>
  );
}