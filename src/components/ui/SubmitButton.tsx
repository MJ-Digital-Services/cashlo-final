"use client";

import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export function SubmitButton({
  loading = false,
  loadingText,
  children,
  variant = "primary",
  className = "",
  disabled,
  ...rest
}: SubmitButtonProps) {
  const scope = useRef<HTMLButtonElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!loading) return;

      if (shineRef.current) {
        gsap.fromTo(
          shineRef.current,
          { xPercent: -130 },
          { xPercent: 230, duration: 1.4, ease: "power1.inOut", repeat: -1 }
        );
      }
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          rotation: 360,
          duration: 0.9,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      }
    },
    { scope, dependencies: [loading] }
  );

  const base =
    "relative overflow-hidden w-full rounded-full px-7 py-3.5 text-sm font-semibold shadow-sm transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "border border-border text-ink transition-colors hover:border-brand hover:text-brand",
  };

  return (
    <button
      ref={scope}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <div
          ref={shineRef}
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-white/25"
          aria-hidden="true"
        />
      )}
      {loading && (
        <svg ref={ringRef} viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="42 100"
            opacity="0.9"
          />
        </svg>
      )}
      <span className="relative z-10">{loading && loadingText ? loadingText : children}</span>
    </button>
  );
}