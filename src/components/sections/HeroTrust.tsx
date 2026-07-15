"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Poppins } from "next/font/google";
import { useHeroTrust } from "@/hooks/useHeroTrust";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const pillars = [
  {
    title: "100% Secure",
    desc: "Every transaction is protected through secure UPI payment infrastructure with encrypted processing.",
    img: "/cards/secure.jpg",
  },
  {
    title: "RBI Compliant Process",
    desc: "Cashlo follows applicable banking partner processes and operational guidelines.",
    img: "/cards/guidelines.jpg",
  },
  {
    title: "Bank-grade Security",
    desc: "Every payment travels through trusted UPI rails ensuring reliable, fast fund transfers.",
    img: "/cards/money-transfer.jpg",
  },
  {
    title: "Data Protection",
    desc: "Merchant and customer information is handled with strict privacy and security standards.",
    img: "/cards/data-protection.jpg",
  },
];

export default function HeroTrust() {
  const { scope, pinRef } = useHeroTrust();

  return (
    <section ref={scope} className="relative overflow-hidden bg-bg">
      <div ref={pinRef} className="relative">
        {/* ============================================================
            STAGE 1 — HERO (1:1 port of the reference HTML hero)
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
                  India&rsquo;s Trusted UPI CashPoint Network
                </span>

                <h1 className="h-hero rv">
                  Turn Every Shop
                  <br />
                  into a <span className="grad-txt">UPI CashPoint</span>
                </h1>

                <p className="tagline">Scan. Pay. Collect Cash.</p>

                <p className="lede">
                  Cashlo is building India&apos;s next generation cash access
                  network, enabling people to withdraw cash through UPI at
                  trusted neighborhood merchants. More convenience for
                  customers, more earnings for merchants.
                </p>

                <div className="hero-ctas">
                  {/* adjust these two hrefs to your routes */}
                  <Link href="/how-it-works" className="btn btn-primary btn-lg magnetic">
                    Watch How It Works <span className="arr">→</span>
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
                    Download the App
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
              <div className="phone-stage" data-phone-stage>
                <div className="phone-halo" />

                <span className="h-coin" style={{ width: 74, height: 74, fontSize: 27, top: "4%", left: "-3%" }}>₹</span>
                <span className="h-coin" style={{ width: 46, height: 46, fontSize: 17, bottom: "11%", left: "5%", animationDelay: "-3s" }}>₹</span>
                <span className="h-coin" style={{ width: 32, height: 32, fontSize: 12, top: "15%", right: "1%", animationDelay: "-6s", filter: "blur(1px)" }}>₹</span>

                <div className="f-chip c1">
                  <span className="ci" style={{ background: "var(--mint-soft)" }}>💵</span>
                  <span><b>₹2,000 cash given</b><span>Customer served · just now</span></span>
                </div>
                <div className="f-chip c2">
                  <span className="ci" style={{ background: "var(--blue-soft)" }}>📈</span>
                  <span><b>+₹14 commission</b><span>Credited instantly</span></span>
                </div>
                <div className="f-chip c3">
                  <span className="ci" style={{ background: "#FFF6DE" }}>🏪</span>
                  <span><b>Gupta Kirana Store</b><span>CashPoint · Kanpur</span></span>
                </div>

                <div className="phone" data-phone>
                  <div className="notch" />
                  <div className="phone-scr">
                    <div className="ap-bar">
                      <span className="p-brand">
                        {/* swap this mark for your logo asset if you have one */}
                        <svg width="22" height="22" viewBox="0 0 76 76" fill="none" aria-hidden>
                          <rect width="76" height="76" rx="20" fill="#3D5AFE" />
                          <path d="M22 6H12C8.7 6 6 8.7 6 12v10M54 6h10c3.3 0 6 2.7 6 6v10M22 70H12c-3.3 0-6-2.7-6-6V54M54 70h10c3.3 0 6-2.7 6-6V54" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
                          <rect x="24" y="24" width="12" height="12" rx="3" fill="#fff" />
                          <rect x="40" y="40" width="12" height="12" rx="3" fill="#fff" />
                          <rect x="40" y="24" width="12" height="12" rx="3" fill="#fff" opacity=".6" />
                          <rect x="24" y="40" width="12" height="12" rx="3" fill="#fff" opacity=".6" />
                        </svg>
                        Cashlo
                      </span>
                      <span className="ap-ic">🔔<span className="dot" /></span>
                      <span className="ap-ic">👤</span>
                    </div>

                    <div className="ap-body">
                      <div className="bal-card">
                        <div className="bal-l">
                          <span className="bal-lbl">Cashlo Balance</span>
                          <span className="bal-amt">₹20,000<span className="eye">👁</span></span>
                          <span className="bal-pill">₹ &nbsp;Add Money</span>
                          <span className="bal-pill">🏛️ Settlement</span>
                        </div>
                        <div className="scan-tile">
                          <div className="qr-grid qr-sm" data-qr-grid>
                            <div className="scanline" data-scanline />
                          </div>
                          <b>Scan Pay</b>
                          <span className="ap-status" data-qr-status>GENERATING QR…</span>
                        </div>
                      </div>

                      <div className="qa-row">
                        <div className="qa"><span className="qi" style={{ background: "linear-gradient(150deg,#9D6BFF,#6C3DF4)" }}>📱</span><span>Recharge</span></div>
                        <div className="qa"><span className="qi" style={{ background: "linear-gradient(150deg,#FFB24D,#F58A1F)" }}>⚡</span><span>Electricity</span></div>
                        <div className="qa"><span className="qi" style={{ background: "linear-gradient(150deg,#5BC9F2,#2AA5E0)" }}>🚗</span><span>FASTag</span></div>
                        <div className="qa"><span className="qi" style={{ background: "linear-gradient(150deg,#FF7BA3,#F04E7E)" }}>🧾</span><span>Bill Payment</span></div>
                      </div>

                      <div className="ap-banner">
                        <span style={{ fontSize: 22 }}>🪙</span>
                        <span>
                          <b>APPLY LOAN &amp; EARN COMMISSION</b>
                          <small>Easy application · More approvals · High commission</small>
                        </span>
                      </div>

                      <div className="earn-row">
                        <div className="e-card">
                          <span className="e-top"><span className="ei" style={{ background: "#E4F8EE" }}>📈</span>Earnings today</span>
                          <b>₹22</b>
                          <span className="e-sub" style={{ color: "var(--mint)" }}>+<span data-ph-comm>₹0.00</span> · 4 transactions</span>
                        </div>
                        <div className="e-card">
                          <span className="e-top"><span className="ei" style={{ background: "#E8EDFF" }}>🐷</span>All time earnings</span>
                          <b data-ph-earn>₹1,240</b>
                          <span className="e-sub" style={{ color: "var(--blue)" }}>This week: ₹212</span>
                        </div>
                      </div>
                    </div>

                    <div className="ap-nav">
                      <span className="on"><span className="ni">🏠</span>Home</span>
                      <span><span className="ni">👛</span>Wallet</span>
                      <span className="ap-qr">
                        <svg width="22" height="22" viewBox="0 0 76 76" fill="none" aria-hidden>
                          <path d="M22 6H12C8.7 6 6 8.7 6 12v10M54 6h10c3.3 0 6 2.7 6 6v10M22 70H12c-3.3 0-6-2.7-6-6V54M54 70h10c3.3 0 6-2.7 6-6V54" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
                          <rect x="24" y="24" width="12" height="12" rx="3" fill="#fff" />
                          <rect x="40" y="40" width="12" height="12" rx="3" fill="#fff" />
                          <rect x="40" y="24" width="12" height="12" rx="3" fill="#fff" opacity=".6" />
                          <rect x="24" y="40" width="12" height="12" rx="3" fill="#fff" opacity=".6" />
                        </svg>
                      </span>
                      <span><span className="ni">📒</span>Khata</span>
                      <span><span className="ni">💰</span>Loan</span>
                    </div>

                    <div className="p-success" data-ph-success>
                      <div className="tick">
                        <div className="ripple" />
                        <svg viewBox="0 0 52 52" aria-hidden>
                          <path d="M14 27l8 8 16-18" />
                        </svg>
                      </div>
                      <b>Payment received</b>
                      <span data-succ-amt>₹2,000 · via Google Pay</span>
                      <span style={{ fontFamily: "var(--font-m)", fontSize: 12, color: "var(--mint)", fontWeight: 700 }}>
                        HAND OVER CASH ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            STAGE 2 — TRUST (unchanged handoff: overlays the hero on
            desktop; cards assemble as the phone scene exits)
           ============================================================ */}
        <div
          data-trust
          className="ht-trust relative px-6 pb-24 md:absolute md:inset-0 md:flex md:flex-col md:items-center md:justify-center md:px-[3vw] md:pb-0 md:opacity-0"
        >
          <div data-thead className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Trusted by Dukandaars Everywhere
            </h2>
            <p className="mt-2 text-base font-medium text-brand">
              Aapka Vishwas, Hamari Zimmedari
            </p>
          </div>

          <div className="grid w-full max-w-[1400px] gap-6 md:grid-cols-4 md:gap-5">
            {pillars.map((p) => (
              <article
                key={p.title}
                data-tcard
                className="group relative h-[420px] w-full overflow-hidden rounded-2xl shadow-sm md:h-[52vh] md:min-h-[380px]"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-semibold text-white lg:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    {p.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}