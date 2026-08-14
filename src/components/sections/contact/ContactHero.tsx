"use client";

import Image from "next/image";
import { UserPlus, Users, Wrench, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const trustBadges = [
  { icon: UserPlus, label: "Merchant Onboarding" },
  { icon: Users, label: "Distributor Support" },
  { icon: Wrench, label: "Technical Assistance" },
  { icon: Clock, label: "Response Within 24 Hours" },
];

export default function ContactHero() {
  const scope = useScrollReveal();

  return (
    <section
      ref={scope}
      className="relative flex min-h-[calc(100dvh-80px)] items-center overflow-hidden bg-bg pb-16 pt-20"
    >
      {/* Soft background blob — large rounded shape behind the illustration */}
      <svg
        className="pointer-events-none absolute z-0 h-[500px] w-[720px] text-brand/[0.07]
        right-[-200px] top-45
        min-[320px]:top-180
        min-[375px]:top-170
        min-[425px]:top-140 min-[425px]:h-[600px]
        min-[1440px]:right-[-20px]
        min-[2560px]:right-140
        sm:top-1/2 sm:h-[720px] sm:-translate-y-1/2"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M420,120 C500,170 540,270 520,360 C500,450 420,520 320,530 C220,540 120,490 90,400 C60,310 100,200 190,140 C280,80 340,70 420,120 Z"
        />
      </svg>

      {/* Soft wave hugging the bottom of the section */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 w-full text-[#f9fafb]"
        viewBox="0 0 1440 200"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,120 C240,180 480,60 720,90 C960,120 1200,200 1440,140 L1440,200 L0,200 Z"
        />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 sm:grid-cols-2 sm:gap-16">
        <div>
          <p
            data-reveal
            className="text-sm font-semibold uppercase tracking-wider text-brand"
          >
            Contact Us
          </p>
          <h1
            data-reveal
            className="mt-4 max-w-2xl text-5xl font-bold tracking-tight text-ink sm:text-6xl"
          >
            Let&apos;s Grow Your Shop Together
          </h1>
          <p data-reveal className="mt-6 max-w-xl text-xl text-ink/60">
            Whether you're looking to become a Cashlo Merchant, activate UPI Cash Point, join as a Distributor,
            or need help with your account, our dedicated team is here to assist you. Reach out today and we'll help you get started quickly.
          </p>

          {/* Trust badges */}
          <ul
            data-reveal
            className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-base font-medium text-ink">
                <Icon className="h-6 w-6 shrink-0 text-brand" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Contact Sales
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#support"
              className="inline-flex items-center gap-2 rounded-lg border border-brand px-7 py-3.5 text-base font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              Get Support
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div data-reveal className="relative mx-auto w-full max-w-3xl xl:max-w-4xl">
          <Image
            src="/images/contact/contact-hero.png"
            alt="Cashlo support team ready to help you grow your shop"
            width={1536}
            height={1024}
            priority
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}