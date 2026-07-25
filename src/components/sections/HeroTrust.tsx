"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Poppins } from "next/font/google";
import { useHeroTrust } from "@/hooks/useHeroTrust";
import CashloHeroAnimation from "@/components/sections/CashloHeroAnimation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function HeroTrust() {
  const { scope } = useHeroTrust();

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg">
      {/* ============================================================
          HERO (1:1 port of the reference HTML hero)
         ============================================================ */}
      <div
        className={`hero cx-hero ${poppins.className}`}
        style={{ "--cx-font": poppins.style.fontFamily } as CSSProperties}
      >
        <div className="mesh" />
        <div className="orb o1" />
        <div className="orb o2" />

        <div className="wrap">
          <div className="hero-grid">
            {/* ---- Copy ---- */}
            <div className="hero-copy" data-hero-copy>
              <span className="eyebrow">
                <span className="dot" />
                India&rsquo;s First Shop Income Platform
              </span>

              <h1 className="h-hero rv">
                Grow Your Shop. Earn <span className="grad-txt">More</span> Every Day.
              </h1>

              <p className="tagline">
                <span className="tagline-dot" />
                Payment Bhi. Kamai Bhi.
              </p>

              <p className="lede">
                Cashlo is India&apos;s complete business app designed for
                shopkeepers. Accept digital payments, offer UPI Cash Point
                services, earn commissions, manage customer credit, provide
                financial services, handle GST &amp; ITR, and monitor your
                entire business—all from a single platform with real-time
                settlement.
              </p>

              <div className="hero-ctas">
                {/* adjust these two hrefs to your routes */}
                <Link href="/how-it-works" className="btn btn-primary btn-lg magnetic">
                  Get Started <span className="arr">→</span>
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.cashlo.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg magnetic"
                >
                  <svg width="19" height="21" viewBox="0 0 24 26" fill="none" aria-hidden>
                    <path d="M2 2.5c-.5.5-.7 1.2-.7 2.1v16.8c0 .9.2 1.6.7 2.1l.1.1L13 13.2v-.4L2.1 2.4 2 2.5z" fill="#00D9FF" />
                    <path d="M16.6 16.8 13 13.2v-.4l3.6-3.6 4.4 2.5c1.3.7 1.3 1.9 0 2.6l-4.4 2.5z" fill="#FFC107" />
                    <path d="M17 16.6 13.2 13 2 24.2c.4.4 1.1.5 1.9.1L17 16.6z" fill="#FF5252" />
                    <path d="M17 9.4 3.9 1.9C3.1 1.5 2.4 1.5 2 2L13.2 13 17 9.4z" fill="#00E676" />
                  </svg>
                  Download App
                </Link>
              </div>

              <div className="hero-pills">
                <span className="pill">
                  <span className="pdot" />
                  <b>
                    <span className="cnt" data-to="50">0</span>,000+
                  </b>
                  &nbsp;live merchants
                </span>
                <span className="pill">
                  ⚡ <b><span className="cnt" data-to="1">0</span>M+</b>
                  &nbsp;transactions
                </span>
              </div>

              <div className="proof">
                <span className="avs">
                  <span style={{ background: "linear-gradient(150deg,#FF8A65,#F4511E)" }}>RS</span>
                  <span style={{ background: "linear-gradient(150deg,#4F6BFF,#2A46E8)" }}>AK</span>
                  <span style={{ background: "linear-gradient(150deg,#12C286,#0A9B6A)" }}>PV</span>
                  <span style={{ background: "linear-gradient(150deg,#9D6BFF,#6C3DF4)" }}>MG</span>
                </span>
                <span>
                  <span className="stars">★★★★★</span>
                  <small>
                    <b>4.8 rated</b> · loved by dukandaars across 100+ cities
                  </small>
                </span>
              </div>
            </div>

            {/* ---- Phone stage ---- */}
            {/* ---- Hero animation (replaces the phone dashboard mockup) ---- */}
            <div className="phone-stage" data-phone-stage>
              <CashloHeroAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}