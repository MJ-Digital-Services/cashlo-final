"use client";

import { useEffect, useMemo, useRef, useState, memo, type CSSProperties, type ReactNode } from "react";

/* ------------------------------------------------------------------
   Cashlo — Gold Loan & Digital Gold hero animation
   Self-contained. No dependencies, no images, no GIFs. Pure SVG + CSS.
   Drop into the empty right-hand column of the hero.
------------------------------------------------------------------- */

const BLUE = "#3B5BFF";
const BLUE_DEEP = "#2440D9";
const BLUE_SOFT = "#EDF1FF";
const GOLD = "#F4C542";
const GOLD_DEEP = "#D4AF37";
const GOLD_SOFT = "#FEF6E0";
const INK = "#0B1020";
const MUTED = "#7A839B";
const LINE = "#E9ECF7";
const GREEN = "#12B76A";

const STAGE_W = 600;
const STAGE_H = 620;

/* Scene timeline (seconds) --------------------------------------- */
const BOUNDS = [0, 1.8, 4.2, 6.1, 7.8, 9.5, 11.3, 13.0, 14.4];
const TOTAL = BOUNDS[BOUNDS.length - 1];
const RAMP = 0.45;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v: number) => {
  const x = clamp(v);
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

function windowAlpha(t: number, start: number, end: number) {
  const raw = (x: number) => {
    const rise = smooth((x - (start - RAMP)) / RAMP);
    const fall = 1 - smooth((x - (end - RAMP)) / RAMP);
    return clamp(Math.min(rise, fall));
  };
  return Math.max(raw(t), raw(t - TOTAL), raw(t + TOTAL));
}

type SceneProps = { p: number };

/* ---------------------------------------------------------------- */

export default function GoldHeroAnimation() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [live, setLive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [t, setT] = useState(0);

  /* reduced motion */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* fit the fixed-size stage to whatever width the hero column gives us */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const w = entry.contentRect.width;
      setScale(clamp(w / STAGE_W, 0.42, 1.18));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* pause when off-screen */
  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setLive(e.isIntersecting && e.intersectionRatio > 0.08),
      { threshold: [0, 0.08, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* timeline */
  useEffect(() => {
    if (reduced) {
      setT(7.0); // hold on the portfolio beat
      return;
    }
    if (!live) return;
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setT((prev) => (prev + dt) % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, reduced]);

  const frozen = reduced || !live;
  const sceneIndex = useMemo(() => {
    for (let i = 0; i < BOUNDS.length - 1; i++) {
      if (t >= BOUNDS[i] && t < BOUNDS[i + 1]) return i;
    }
    return 0;
  }, [t]);

  const scenes = [Welcome, Purchase, Growing, Portfolio, Collateral, Approved, Disbursal, Ecosystem];

  return (
    <div
      ref={hostRef}
      className={"gh-root" + (frozen ? " gh-frozen" : "")}
      style={{
        width: "100%",
        height: STAGE_H * scale,
        position: "relative",
        pointerEvents: "none",
        userSelect: "none",
      }}
      aria-label="How Cashlo digital gold and gold loans work"
      role="img"
    >
      <style>{CSS}</style>
      <div
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          position: "absolute",
          left: "50%",
          marginLeft: -STAGE_W / 2,
          top: 0,
        }}
      >
        <Ambient />
        <Decor spotlight={sceneIndex === 7} />

        {/* phone */}
        <div style={phoneShell}>
          <div style={phoneScreen}>
            <div style={island} />
            {scenes.map((Scene, i) => {
              const a = windowAlpha(t, BOUNDS[i], BOUNDS[i + 1]);
              if (a <= 0.002) return null;
              const span = BOUNDS[i + 1] - BOUNDS[i];
              const p = clamp((t - BOUNDS[i]) / span);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: "34px 18px 18px",
                    opacity: a,
                    transform: `translateY(${(1 - a) * 10}px) scale(${lerp(0.985, 1, a)})`,
                    filter: a < 0.9 ? `blur(${(1 - a) * 3}px)` : "none",
                  }}
                >
                  <Scene p={p} />
                </div>
              );
            })}
          </div>
          <div style={phoneGlow} />
        </div>

        {/* floating glass cards */}
        <GlassCard
          style={{ left: 6, top: 26 }}
          alpha={1}
          label="Live 24K rate"
          value="₹7,412 / g"
          delta="+0.8%"
        />
        <GlassCard
          style={{ left: 438, top: 486 }}
          alpha={clamp((t - 11.4) / 0.9) * (1 - clamp((t - 13.9) / 0.5))}
          label="Credited to bank"
          value="₹2,00,000"
          delta="Instant"
        />
      </div>
    </div>
  );
}

/* ============================== SCENES ============================ */

function Welcome({ p }: SceneProps) {
  return (
    <>
      <ScreenHead />
      <div style={{ ...goldCard, marginTop: 14 }}>
        <div style={shimmerBar} className="gh-shimmer" />
        <div style={{ position: "relative" }}>
          <div style={{ ...micro, color: "#8A6B1F" }}>YOUR GOLD BALANCE</div>
          <div style={{ ...bigNum, color: "#4A3708", marginTop: 4 }}>0.000 g</div>
          <div style={{ ...small, color: "#8A6B1F", marginTop: 2 }}>
            Start from ₹100 · 24K, 99.9% pure
          </div>
        </div>
        <div style={{ position: "absolute", right: 14, top: 16, opacity: 0.9 }}>
          <CoinIcon size={40} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <MiniTile label="Vault insured" icon={<ShieldIcon size={16} />} />
        <MiniTile label="Sell anytime" icon={<GraphIcon size={16} />} />
      </div>

      <div style={{ position: "absolute", left: 18, right: 18, bottom: 62 }}>
        <div
          className="gh-glow"
          style={{
            ...cta,
            transform: `scale(${lerp(0.96, 1, easeOut(p * 2.2))})`,
          }}
        >
          Buy digital gold
        </div>
      </div>
      <FootNote>Backed by insured, audited vaults</FootNote>
    </>
  );
}

function Purchase({ p }: SceneProps) {
  const steps = [500, 1000, 5000, 10000];
  const seg = clamp(p / 0.9) * 3;
  const i = Math.min(2, Math.floor(seg));
  const amount = lerp(steps[i], steps[i + 1], easeInOut(seg - i));
  const fill = clamp(amount / 10000);
  const grams = amount / 7412;

  return (
    <>
      <ScreenHead title="Buy digital gold" />
      <div style={{ ...micro, marginTop: 18 }}>INVESTMENT AMOUNT</div>
      <div style={{ ...bigNum, fontSize: 34, marginTop: 2 }}>{inr(amount)}</div>
      <div style={{ ...small, marginTop: 2 }}>
        ≈ {grams.toFixed(3)} g of 24K gold
      </div>

      {/* slider */}
      <div style={{ marginTop: 20, position: "relative", height: 22 }}>
        <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 6, borderRadius: 6, background: BLUE_SOFT }} />
        <div style={{ position: "absolute", top: 8, left: 0, width: `${fill * 100}%`, height: 6, borderRadius: 6, background: `linear-gradient(90deg, ${BLUE}, ${GOLD_DEEP})` }} />
        <div
          style={{
            position: "absolute",
            top: 2,
            left: `calc(${fill * 100}% - 9px)`,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: "#fff",
            border: `2px solid ${BLUE}`,
            boxShadow: "0 4px 10px rgba(59,91,255,.32)",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {steps.map((s, k) => (
          <div
            key={s}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px 0",
              borderRadius: 9,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.1,
              color: k <= i + 0.5 && amount >= s - 1 ? "#fff" : MUTED,
              background: amount >= s - 1 ? BLUE : "#F5F7FE",
            }}
          >
            {"₹" + s.toLocaleString("en-IN")}
          </div>
        ))}
      </div>

      {/* particles condensing into a coin */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, height: 130 }}>
        <svg width="100%" height="130" viewBox="0 0 232 130">
          {Array.from({ length: 14 }).map((_, k) => {
            const ang = (k / 14) * Math.PI * 2 + 0.4;
            const r = lerp(74, 0, easeInOut(clamp(p * 1.35 - k * 0.02)));
            return (
              <circle
                key={k}
                cx={116 + Math.cos(ang) * r * 1.15}
                cy={66 + Math.sin(ang) * r * 0.62}
                r={lerp(2.6, 1, clamp(p * 1.4))}
                fill={k % 3 === 0 ? BLUE : GOLD}
                opacity={clamp(1 - p * 1.1) * 0.9 + 0.1}
              />
            );
          })}
          <g
            transform={`translate(116 66) scale(${lerp(0.3, 1, easeOut(clamp(p * 1.5 - 0.35)))})`}
            opacity={clamp(p * 2 - 0.5)}
          >
            <Coin r={30} />
          </g>
        </svg>
      </div>
      <FootNote>Gold is credited to your vault instantly</FootNote>
    </>
  );
}

function Growing({ p }: SceneProps) {
  const stage = clamp(p * 1.15);
  const gain = lerp(0, 842, easeOut(stage));
  const pts = [0, 12, 8, 26, 22, 40, 52, 68, 84];
  const path = pts
    .map((v, k) => `${k === 0 ? "M" : "L"} ${(k / (pts.length - 1)) * 196} ${72 - v * 0.72}`)
    .join(" ");
  const dash = 260;

  return (
    <>
      <ScreenHead title="Your gold is growing" />

      <div style={{ position: "relative", height: 118, marginTop: 10 }}>
        <svg width="100%" height="118" viewBox="0 0 232 118">
          <g transform="translate(116 62)">
            <g opacity={clamp(1 - stage * 2.6)}>
              <Coin r={30} />
            </g>
            <g opacity={clamp(stage * 3 - 0.6) * clamp(1 - (stage - 0.55) * 3.4)}>
              <Bar w={78} h={30} y={-15} />
            </g>
            <g opacity={clamp((stage - 0.6) * 3.2)}>
              <Bar w={64} h={20} y={4} />
              <Bar w={52} h={19} y={-14} />
              <Bar w={40} h={18} y={-31} />
            </g>
          </g>
          {[...Array(9)].map((_, k) => (
            <g key={k} className="gh-twinkle" style={{ animationDelay: `${k * 0.31}s` }}>
              <Sparkle x={22 + k * 24} y={18 + ((k * 37) % 78)} s={k % 3 === 0 ? 5 : 3.4} />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ ...panel, marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={micro}>GOLD VALUE</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>
            +{inr(gain)} · {(clamp(stage) * 8.4).toFixed(1)}%
          </div>
        </div>
        <svg width="100%" height="76" viewBox="0 0 196 76" style={{ marginTop: 6, overflow: "visible" }}>
          <defs>
            <linearGradient id="ghArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L 196 76 L 0 76 Z`} fill="url(#ghArea)" opacity={clamp(stage * 1.6 - 0.2)} />
          <path
            d={path}
            fill="none"
            stroke={GOLD_DEEP}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dash}
            strokeDashoffset={dash * (1 - easeInOut(stage))}
          />
          <circle
            cx={196 * easeInOut(stage)}
            cy={72 - pts[Math.min(pts.length - 1, Math.round(easeInOut(stage) * (pts.length - 1)))] * 0.72}
            r="4"
            fill="#fff"
            stroke={GOLD_DEEP}
            strokeWidth="2.5"
            opacity={clamp(stage * 3)}
          />
        </svg>
      </div>
      <FootNote>Live-priced against the 24K market rate</FootNote>
    </>
  );
}

function Portfolio({ p }: SceneProps) {
  const e = easeOut(clamp(p * 1.6));
  const rows: [string, string][] = [
    ["Total gold value", inr(lerp(10000, 10842, e))],
    ["Today's growth", "+" + lerp(0.4, 1.8, e).toFixed(2) + "%"],
    ["Total invested", "₹10,000"],
    ["Market rate", inr(lerp(7412, 7468, e)) + " / g"],
  ];
  return (
    <>
      <ScreenHead title="Gold portfolio" />
      <div
        style={{
          ...panel,
          marginTop: 14,
          transform: `translateY(${lerp(26, 0, e)}px)`,
          opacity: clamp(p * 4),
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={shimmerBar} className="gh-shimmer" />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CoinIcon size={26} />
          <div>
            <div style={micro}>HOLDING</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: INK, letterSpacing: -0.3 }}>
              {lerp(1.349, 1.462, e).toFixed(3)} g
            </div>
          </div>
          <div style={{ marginLeft: "auto", ...pill(GREEN) }}>▲ 1.8%</div>
        </div>
        <div style={{ height: 1, background: LINE, margin: "12px 0 4px" }} />
        {rows.map(([k, v], idx) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "7px 0",
              opacity: clamp(p * 3.4 - idx * 0.28),
            }}
          >
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>{k}</span>
            <span style={{ fontSize: 12, color: INK, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 62 }}>
        <div style={{ ...cta, background: "#fff", color: BLUE, border: `1.5px solid ${BLUE}`, boxShadow: "none" }}>
          Get loan against gold
        </div>
      </div>
      <FootNote>Sell, deliver, or borrow against it — anytime</FootNote>
    </>
  );
}

function Collateral({ p }: SceneProps) {
  const press = clamp(p * 5);
  const drop = easeInOut(clamp(p * 1.6 - 0.18));
  const verify = clamp(p * 1.5 - 0.35);
  return (
    <>
      <ScreenHead title="Pledge your gold" />
      <div style={{ position: "relative", marginTop: 6 }}>
        <div style={{ ...cta, position: "relative", overflow: "hidden", transform: `scale(${lerp(1, 0.98, Math.sin(press * Math.PI))})` }}>
          Get loan against gold
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 12,
              height: 12,
              marginLeft: -6,
              marginTop: -6,
              borderRadius: 999,
              background: "rgba(255,255,255,.45)",
              transform: `scale(${lerp(1, 22, easeOut(press))})`,
              opacity: 1 - press,
            }}
          />
        </div>
      </div>

      <svg width="100%" height="196" viewBox="0 0 232 196" style={{ marginTop: 10 }}>
        <g transform={`translate(116 ${lerp(34, 108, drop)}) scale(${lerp(1, 0.62, drop)})`} opacity={1 - clamp(drop * 1.3 - 0.35)}>
          <Bar w={76} h={28} y={-14} />
        </g>
        {Array.from({ length: 12 }).map((_, k) => {
          const side = k % 2 ? 1 : -1;
          const q = clamp(verify * 1.4 - k * 0.05);
          return (
            <circle
              key={k}
              cx={116 + side * lerp(86, 0, easeInOut(q))}
              cy={lerp(60 + ((k * 23) % 60), 118, easeInOut(q))}
              r="2.4"
              fill={side > 0 ? BLUE : GOLD}
              opacity={(1 - q) * 0.85}
            />
          );
        })}
        <g transform="translate(116 118)">
          <Vault size={92} />
          <circle
            r="58"
            fill="none"
            stroke={BLUE}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 58}
            strokeDashoffset={2 * Math.PI * 58 * (1 - easeInOut(verify))}
            transform="rotate(-90)"
            opacity="0.85"
          />
        </g>
      </svg>

      <div style={{ textAlign: "center", marginTop: 2 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: INK }}>
          {verify > 0.85 ? "Collateral secured" : "Verifying gold collateral"}
        </div>
        <div style={{ ...small, marginTop: 3 }}>1.462 g · 24K · insured vault</div>
      </div>
      <FootNote>Your gold stays yours — locked, never sold</FootNote>
    </>
  );
}

function Approved({ p }: SceneProps) {
  const pop = easeOut(clamp(p * 2.4));
  const amount = lerp(0, 200000, easeOut(clamp(p * 1.5 - 0.15)));
  const tick = clamp(p * 3 - 0.4);
  return (
    <>
      <div style={{ textAlign: "center", marginTop: 26 }}>
        <div style={{ display: "inline-block", position: "relative" }}>
          <div
            className="gh-ripple"
            style={{
              position: "absolute",
              inset: -12,
              borderRadius: 999,
              border: `2px solid ${GREEN}`,
              opacity: 0.35,
            }}
          />
          <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: `scale(${lerp(0.5, 1, pop)})` }}>
            <circle cx="44" cy="44" r="40" fill="#E9FBF2" />
            <circle cx="44" cy="44" r="30" fill={GREEN} />
            <path
              d="M31 45 L40 54 L57 35"
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="44"
              strokeDashoffset={44 * (1 - easeOut(tick))}
            />
          </svg>
        </div>
        <div style={{ ...micro, marginTop: 14, color: GREEN }}>LOAN APPROVED</div>
        <div style={{ ...bigNum, fontSize: 36, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
          {inr(amount)}
        </div>
        <div style={{ ...small, marginTop: 4 }}>Sanctioned against 1.462 g of 24K gold</div>
      </div>

      <div style={{ ...panel, marginTop: 16, opacity: clamp(p * 2.6 - 0.7) }}>
        {(
          [
            ["Interest", "0.79% p.m."],
            ["Tenure", "12 months"],
            ["Processing fee", "₹0"],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>{k}</span>
            <span style={{ fontSize: 11.5, color: INK, fontWeight: 800 }}>{v}</span>
          </div>
        ))}
      </div>
      <FootNote>No foreclosure charges on small loans</FootNote>
    </>
  );
}

function Disbursal({ p }: SceneProps) {
  const flow = clamp(p * 1.25);
  return (
    <>
      <ScreenHead title="Sending money" />
      <svg width="100%" height="150" viewBox="0 0 232 150" style={{ marginTop: 22 }}>
        <path d="M40 100 C 80 40, 152 40, 192 100" fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="4 6" />
        <g transform="translate(40 100)">
          <Vault size={54} />
        </g>
        <g transform="translate(192 100)">
          <BankGlyph size={54} />
        </g>
        {Array.from({ length: 7 }).map((_, k) => {
          const q = clamp(flow * 1.5 - k * 0.11);
          const bez = (a: number, b: number, c: number) => {
            const u = easeInOut(q);
            return (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
          };
          return (
            <circle
              key={k}
              cx={bez(40, 116, 192)}
              cy={bez(100, 44, 100)}
              r={k % 2 ? 3.4 : 2.4}
              fill={k % 3 === 0 ? GOLD : BLUE}
              opacity={q > 0 && q < 1 ? 0.95 : 0}
            />
          );
        })}
        {[0, 1].map((k) => {
          const q = clamp(flow * 1.3 - 0.2 - k * 0.22);
          return (
            <g
              key={k}
              transform={`translate(${lerp(52, 178, easeInOut(q))} ${lerp(96, 64, easeInOut(q))}) rotate(${lerp(-14, 10, q)})`}
              opacity={q > 0.02 && q < 0.97 ? 1 : 0}
            >
              <rect x="-15" y="-9" width="30" height="18" rx="3" fill={GOLD_SOFT} stroke={GOLD_DEEP} strokeWidth="1.2" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="800" fill={GOLD_DEEP}>
                {"₹"}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        style={{
          ...panel,
          marginTop: 6,
          borderColor: "#D6F5E6",
          background: "#F4FDF8",
          opacity: clamp(flow * 3 - 1.7),
          transform: `translateY(${lerp(14, 0, clamp(flow * 3 - 1.7))}px)`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26">
          <circle cx="13" cy="13" r="13" fill={GREEN} />
          <path d="M8 13.5 L11.5 17 L18 10" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: INK }}>Amount credited successfully</div>
          <div style={{ ...small, marginTop: 1 }}>₹2,00,000 · HDFC •••• 4821</div>
        </div>
      </div>
      <FootNote>Money reaches the bank account in minutes</FootNote>
    </>
  );
}

function Ecosystem({ p }: SceneProps) {
  const tiles: [string, ReactNode][] = [
    ["Digital gold", <CoinIcon size={20} key="a" />],
    ["Gold loan", <BarIcon size={20} key="b" />],
    ["Insured vault", <VaultIcon size={20} key="c" />],
    ["24K certificate", <CertIcon size={20} key="d" />],
  ];
  return (
    <>
      <ScreenHead title="Sona rakho, paisa pao" />
      <div style={{ ...small, marginTop: 6 }}>One app for buying, growing and borrowing.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
        {tiles.map(([label, icon], k) => (
          <div
            key={label}
            style={{
              ...panel,
              padding: "14px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              opacity: clamp(p * 4 - k * 0.35),
              transform: `translateY(${lerp(12, 0, clamp(p * 4 - k * 0.35))}px)`,
            }}
          >
            {icon}
            <span style={{ fontSize: 11, fontWeight: 700, color: INK }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 62 }}>
        <div className="gh-glow" style={cta}>
          Buy digital gold
        </div>
      </div>
      <FootNote>Start from ₹100 at any Cashlo shop</FootNote>
    </>
  );
}

/* ============================ DECOR =============================== */

const Decor = memo(function Decor({ spotlight }: { spotlight: boolean }) {
  const items: { x: number; y: number; el: ReactNode; d: number }[] = [
    { x: 72, y: 138, el: <CoinIcon size={26} />, d: 0 },
    { x: 40, y: 300, el: <RupeeIcon size={26} />, d: 1.1 },
    { x: 96, y: 420, el: <WalletIcon size={26} />, d: 2.2 },
    { x: 56, y: 512, el: <GraphIcon size={26} />, d: 0.6 },
    { x: 150, y: 592, el: <CertIcon size={26} />, d: 1.7 },
    { x: 300, y: 596, el: <ArrowIcon size={26} />, d: 2.6 },
    { x: 500, y: 58, el: <RingIcon size={26} />, d: 0.35 },
    { x: 532, y: 158, el: <BarIcon size={26} />, d: 1.45 },
    { x: 562, y: 302, el: <VaultIcon size={26} />, d: 2.05 },
    { x: 518, y: 428, el: <ShieldIcon size={26} />, d: 0.85 },
  ];
  return (
    <>
      <svg
        width={STAGE_W}
        height={STAGE_H}
        style={{ position: "absolute", inset: 0 }}
        className="gh-orbit"
        aria-hidden="true"
      >
        <ellipse cx="300" cy="300" rx="236" ry="272" fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="2 8" />
        <ellipse cx="300" cy="300" rx="286" ry="300" fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="2 12" opacity="0.7" />
      </svg>

      {items.map((it, k) => (
        <div
          key={k}
          className={"gh-float gh-f" + (k % 4)}
          style={{
            position: "absolute",
            left: it.x - 28,
            top: it.y - 28,
            width: 56,
            height: 56,
            borderRadius: 18,
            background: "rgba(255,255,255,.86)",
            border: `1px solid ${LINE}`,
            boxShadow: spotlight
              ? "0 14px 30px -12px rgba(212,175,55,.45)"
              : "0 10px 24px -14px rgba(16,24,64,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(6px)",
            animationDelay: `-${it.d}s`,
            transform: spotlight ? "scale(1.06)" : "none",
          }}
        >
          {it.el}
        </div>
      ))}
    </>
  );
});

function Ambient() {
  const sparks: [number, number][] = [
    [128, 90], [470, 120], [96, 236], [534, 236], [42, 388],
    [566, 388], [186, 606], [420, 604], [258, 44], [352, 40],
  ];
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 70,
          width: 420,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 45%, rgba(244,197,66,.16), rgba(244,197,66,.04) 45%, rgba(255,255,255,0) 70%)",
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 200,
          width: 300,
          height: 320,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(59,91,255,.10), rgba(59,91,255,0) 68%)",
          filter: "blur(4px)",
        }}
      />
      {sparks.map(([x, y], k) => (
        <div
          key={k}
          className="gh-twinkle"
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 6,
            height: 6,
            animationDelay: `${(k * 0.47) % 3.2}s`,
          }}
        >
          <svg width="6" height="6" viewBox="0 0 6 6">
            <path d="M3 0 L3.8 2.2 L6 3 L3.8 3.8 L3 6 L2.2 3.8 L0 3 L2.2 2.2 Z" fill={GOLD_DEEP} />
          </svg>
        </div>
      ))}
    </>
  );
}

function GlassCard({
  style,
  label,
  value,
  delta,
  alpha = 1,
}: {
  style: CSSProperties;
  label: string;
  value: string;
  delta: string;
  alpha?: number;
}) {
  return (
    <div
      className="gh-float gh-f2"
      style={{
        position: "absolute",
        width: 156,
        padding: "11px 13px",
        borderRadius: 16,
        background: "rgba(255,255,255,.72)",
        border: "1px solid rgba(233,236,247,.9)",
        boxShadow: "0 16px 34px -18px rgba(16,24,64,.4)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        opacity: alpha,
        ...style,
      }}
    >
      <div style={{ ...micro, fontSize: 8.5 }}>{label.toUpperCase()}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 3 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: INK, letterSpacing: -0.3 }}>{value}</span>
        <span style={{ fontSize: 10, fontWeight: 800, color: GREEN }}>{delta}</span>
      </div>
    </div>
  );
}

/* ========================= SMALL PIECES =========================== */

function ScreenHead({ title }: { title?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          background: `linear-gradient(140deg, ${GOLD}, ${GOLD_DEEP})`,
          boxShadow: "0 4px 10px -4px rgba(212,175,55,.9)",
        }}
      />
      <span style={{ fontSize: 12.5, fontWeight: 800, color: INK, letterSpacing: -0.2 }}>
        {title || "Cashlo Gold"}
      </span>
      <span style={{ marginLeft: "auto", ...pill(BLUE) }}>24K</span>
    </div>
  );
}

function MiniTile({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 10px",
        borderRadius: 12,
        background: "#F7F8FE",
        border: `1px solid ${LINE}`,
      }}
    >
      {icon}
      <span style={{ fontSize: 10, fontWeight: 700, color: INK }}>{label}</span>
    </div>
  );
}

function FootNote({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 26,
        textAlign: "center",
        fontSize: 9.5,
        color: MUTED,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

/* ============================ SVG BITS ============================ */

function Coin({ r = 30 }: { r?: number }) {
  return (
    <g>
      <ellipse cx="0" cy={r * 0.16} rx={r} ry={r * 0.94} fill="rgba(212,175,55,.18)" />
      <circle r={r} fill="url(#ghCoin)" stroke={GOLD_DEEP} strokeWidth="1.4" />
      <circle r={r * 0.74} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" />
      <text y={r * 0.28} textAnchor="middle" fontSize={r * 0.78} fontWeight="800" fill="#8A6B1F">
        {"₹"}
      </text>
      <defs>
        <linearGradient id="ghCoin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE9A6" />
          <stop offset="52%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_DEEP} />
        </linearGradient>
      </defs>
    </g>
  );
}

function Bar({ w = 70, h = 26, y = 0 }: { w?: number; h?: number; y?: number }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <path
        d={`M ${-w / 2} ${h / 2} L ${-w / 2 + 8} ${-h / 2} L ${w / 2 - 8} ${-h / 2} L ${w / 2} ${h / 2} Z`}
        fill="url(#ghBar)"
        stroke={GOLD_DEEP}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d={`M ${-w / 2 + 12} ${-h / 2 + 5} L ${w / 2 - 14} ${-h / 2 + 5}`} stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="ghBar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE9A6" />
          <stop offset="55%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_DEEP} />
        </linearGradient>
      </defs>
    </g>
  );
}

function Vault({ size = 80 }: { size?: number }) {
  const s = size / 80;
  return (
    <g transform={`scale(${s})`}>
      <rect x="-38" y="-34" width="76" height="68" rx="10" fill="#F4F6FE" stroke={BLUE} strokeWidth="2" />
      <rect x="-28" y="-25" width="56" height="50" rx="7" fill="#fff" stroke={BLUE} strokeWidth="1.4" opacity="0.7" />
      <circle cx="0" cy="0" r="14" fill="none" stroke={GOLD_DEEP} strokeWidth="2.6" />
      <g className="gh-spin">
        <path d="M0 -20 L0 -9 M0 9 L0 20 M-20 0 L-9 0 M9 0 L20 0" stroke={GOLD_DEEP} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <circle cx="0" cy="0" r="4" fill={GOLD} />
    </g>
  );
}

function BankGlyph({ size = 54 }: { size?: number }) {
  const s = size / 54;
  return (
    <g transform={`scale(${s})`}>
      <path d="M-24 -8 L0 -22 L24 -8 Z" fill={BLUE_SOFT} stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
      <rect x="-22" y="-6" width="44" height="24" rx="3" fill="#fff" stroke={BLUE} strokeWidth="2" />
      <path d="M-12 -2 L-12 12 M0 -2 L0 12 M12 -2 L12 12" stroke={BLUE} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <rect x="-26" y="16" width="52" height="5" rx="2.5" fill={BLUE} />
    </g>
  );
}

function Sparkle({ x, y, s = 4 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s / 4})`}
      d="M0 -4 L1.1 -1.1 L4 0 L1.1 1.1 L0 4 L-1.1 1.1 L-4 0 L-1.1 -1.1 Z"
      fill={GOLD_DEEP}
    />
  );
}

/* icon set (chips) */
type IconProps = { size?: number };

const iconWrap = (size: number, children: ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {children}
  </svg>
);
const CoinIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <circle cx="12" cy="12" r="9" fill={GOLD_SOFT} stroke={GOLD_DEEP} strokeWidth="1.6" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill={GOLD_DEEP}>{"₹"}</text>
    </>
  ));
const BarIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <path d="M3 16 L6 8 H18 L21 16 Z" fill={GOLD_SOFT} stroke={GOLD_DEEP} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 11 H16" stroke={GOLD_DEEP} strokeWidth="1.4" strokeLinecap="round" />
    </>
  ));
const RingIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <circle cx="12" cy="14.5" r="6.5" stroke={GOLD_DEEP} strokeWidth="1.8" fill="none" />
      <path d="M9.5 6.5 L12 3 L14.5 6.5 L12 9 Z" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="1.2" strokeLinejoin="round" />
    </>
  ));
const VaultIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" stroke={BLUE} strokeWidth="1.7" fill={BLUE_SOFT} />
      <circle cx="12" cy="12" r="4" stroke={GOLD_DEEP} strokeWidth="1.7" fill="#fff" />
      <path d="M12 8.5 V15.5 M8.5 12 H15.5" stroke={GOLD_DEEP} strokeWidth="1.4" strokeLinecap="round" />
    </>
  ));
const WalletIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <rect x="3" y="6" width="18" height="13" rx="3.5" stroke={BLUE} strokeWidth="1.7" fill={BLUE_SOFT} />
      <path d="M3 10 H21" stroke={BLUE} strokeWidth="1.4" />
      <circle cx="17" cy="14.5" r="1.6" fill={GOLD_DEEP} />
    </>
  ));
const ShieldIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <path d="M12 3 L19 6 V12 C19 16.2 15.9 19.4 12 21 C8.1 19.4 5 16.2 5 12 V6 Z" fill={BLUE_SOFT} stroke={BLUE} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12 L11.2 14.2 L15.2 10.2" stroke={GOLD_DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ));
const GraphIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <path d="M4 16 L9 11 L13 14 L20 7" stroke={GOLD_DEEP} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M20 7 H15.5 M20 7 V11.5" stroke={GOLD_DEEP} strokeWidth="1.7" strokeLinecap="round" />
    </>
  ));
const RupeeIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <circle cx="12" cy="12" r="9" fill={BLUE_SOFT} stroke={BLUE} strokeWidth="1.6" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="800" fill={BLUE}>{"₹"}</text>
    </>
  ));
const CertIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <rect x="4" y="3.5" width="16" height="13" rx="2.5" fill="#fff" stroke={BLUE} strokeWidth="1.6" />
      <path d="M7.5 7.5 H16.5 M7.5 11 H13" stroke={BLUE} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <circle cx="12" cy="17.5" r="3.2" fill={GOLD} stroke={GOLD_DEEP} strokeWidth="1.2" />
    </>
  ));
const ArrowIcon = ({ size = 24 }: IconProps) =>
  iconWrap(size, (
    <>
      <circle cx="12" cy="12" r="9" fill={GOLD_SOFT} stroke={GOLD_DEEP} strokeWidth="1.5" />
      <path d="M12 16.5 V8 M12 8 L8.5 11.5 M12 8 L15.5 11.5" stroke={GOLD_DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ));

/* ============================ STYLES ============================== */

const phoneShell: CSSProperties = {
  position: "absolute",
  left: 166,
  top: 30,
  width: 268,
  height: 520,
  borderRadius: 42,
  padding: 9,
  background: "linear-gradient(160deg, #FFFFFF 0%, #F2F4FD 100%)",
  border: `1px solid ${LINE}`,
  boxShadow: "0 40px 80px -34px rgba(16,24,64,.42), 0 2px 6px rgba(16,24,64,.05)",
};

const phoneScreen: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: 34,
  overflow: "hidden",
  background: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFF 100%)",
  border: `1px solid ${LINE}`,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif",
};

const island: CSSProperties = {
  position: "absolute",
  left: "50%",
  marginLeft: -37,
  top: 9,
  width: 74,
  height: 17,
  borderRadius: 10,
  background: INK,
  zIndex: 6,
};

const phoneGlow: CSSProperties = {
  position: "absolute",
  inset: -26,
  borderRadius: 60,
  background:
    "radial-gradient(circle at 50% 40%, rgba(244,197,66,.20), rgba(244,197,66,0) 62%)",
  zIndex: -1,
  pointerEvents: "none",
};

const micro: CSSProperties = {
  fontSize: 9,
  letterSpacing: 0.7,
  fontWeight: 800,
  color: MUTED,
};
const small: CSSProperties = { fontSize: 10.5, color: MUTED, fontWeight: 600 };
const bigNum: CSSProperties = { fontSize: 26, fontWeight: 800, color: INK, letterSpacing: -0.6 };

const panel: CSSProperties = {
  position: "relative",
  borderRadius: 16,
  border: `1px solid ${LINE}`,
  background: "#fff",
  padding: "13px 14px",
  boxShadow: "0 10px 26px -20px rgba(16,24,64,.5)",
  overflow: "hidden",
};

const goldCard: CSSProperties = {
  position: "relative",
  borderRadius: 18,
  padding: "16px 16px 18px",
  background: "linear-gradient(135deg, #FFF7DF 0%, #FDEDBE 55%, #F6DC97 100%)",
  border: "1px solid rgba(212,175,55,.35)",
  overflow: "hidden",
};

const cta: CSSProperties = {
  textAlign: "center",
  padding: "13px 0",
  borderRadius: 14,
  background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DEEP} 100%)`,
  color: "#fff",
  fontSize: 12.5,
  fontWeight: 800,
  letterSpacing: -0.1,
  boxShadow: "0 12px 26px -12px rgba(59,91,255,.75)",
};

const shimmerBar: CSSProperties = {
  position: "absolute",
  top: -20,
  bottom: -20,
  width: 60,
  background:
    "linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.75), rgba(255,255,255,0))",
  transform: "skewX(-16deg)",
  pointerEvents: "none",
};

const pill = (c: string): CSSProperties => ({
  fontSize: 9,
  fontWeight: 800,
  color: c,
  background: c === GREEN ? "#E9FBF2" : BLUE_SOFT,
  padding: "3px 7px",
  borderRadius: 999,
  letterSpacing: 0.2,
});

const CSS = `
.gh-root *{box-sizing:border-box;}
@keyframes ghFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-11px,0)}}
@keyframes ghFloatB{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-7px,9px,0)}}
@keyframes ghFloatC{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(8px,-8px,0)}}
@keyframes ghFloatD{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-5px,-12px,0)}}
@keyframes ghSpin{to{transform:rotate(360deg)}}
@keyframes ghDrift{0%,100%{transform:rotate(0deg)}50%{transform:rotate(2.2deg)}}
@keyframes ghShimmer{0%{left:-25%}55%,100%{left:120%}}
@keyframes ghTwinkle{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}
@keyframes ghGlow{0%,100%{box-shadow:0 12px 26px -12px rgba(59,91,255,.75)}50%{box-shadow:0 12px 34px -8px rgba(59,91,255,.95)}}
@keyframes ghRipple{0%{transform:scale(.9);opacity:.5}100%{transform:scale(1.35);opacity:0}}
.gh-float{animation:ghFloat 7s ease-in-out infinite;will-change:transform}
.gh-f1{animation:ghFloatB 8.4s ease-in-out infinite}
.gh-f2{animation:ghFloatC 7.6s ease-in-out infinite}
.gh-f3{animation:ghFloatD 9.2s ease-in-out infinite}
.gh-orbit{animation:ghDrift 22s ease-in-out infinite;transform-origin:300px 300px}
.gh-spin{animation:ghSpin 9s linear infinite;transform-origin:center}
.gh-shimmer{animation:ghShimmer 3.6s ease-in-out infinite}
.gh-twinkle{animation:ghTwinkle 3.1s ease-in-out infinite}
.gh-glow{animation:ghGlow 2.4s ease-in-out infinite}
.gh-ripple{animation:ghRipple 1.8s ease-out infinite}
.gh-frozen *,.gh-frozen{animation-play-state:paused !important}
@media (prefers-reduced-motion: reduce){
  .gh-root *,.gh-root{animation:none !important}
}
`;