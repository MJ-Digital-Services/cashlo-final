"use client";

/* ------------------------------------------------------------------ *
 *  CashloHeroAnimation
 *  A seamless 15s looping flat-SVG scene: customers queue on the road,
 *  walk in through the LEFT entry door, get served at the CENTER
 *  counter, leave through the RIGHT exit door — while the merchant
 *  earns commission on every transaction.
 *
 *  Everything is driven by one deterministic clock, so the loop is
 *  frame-exact and never drifts.
 * ------------------------------------------------------------------ */

import { useRef, useState, useEffect, type CSSProperties, type ReactNode } from "react";
import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";

/* ----------------------------- tokens ----------------------------- */

const C = {
  blue: "#3B5BFF",
  blueDeep: "#2743CC",
  blueSoft: "#E7ECFF",
  blueLine: "#C9D4FF",
  ink: "#1B2437",
  inkSoft: "#69738C",
  line: "#E3E8F4",
  panel: "#F5F7FD",
  panel2: "#EDF1FA",
  white: "#FFFFFF",
  green: "#17B26A",
  greenSoft: "#E6F7EE",
  gold: "#E8A93A",
  goldSoft: "#FCF2DF",
  leaf: "#CBDED2",
  leafDark: "#B2CDBD",
  bark: "#CDBCA9",
};

/* --------------------------- stage layout -------------------------- */

const SHOP_L = 430;
const SHOP_R = 900;
const FACADE_TOP = 118;
const FLOOR_Y = 282;
const PAVE_Y = 306;

const DOOR_IN_L = 444;
const DOOR_IN_R = 512;
const DOOR_OUT_L = 818;
const DOOR_OUT_R = 886;

const COUNTER_L = 585;
const COUNTER_R = 755;
const COUNTER_TOP = 228;

const BASE_OUT = 290;
const BASE_IN = 272;

/* ---------------------------- timeline ---------------------------- */

const LOOP = 15;
const N = 6;
const STAGGER = LOOP / N;

type Seg = [number, number, number, number];

const SEGS: Seg[] = [
  [0.0, 2.0, -80, 190],
  [2.0, 2.5, 190, 190],
  [2.5, 3.3, 190, 280],
  [3.3, 5.0, 280, 280],
  [5.0, 5.8, 280, 370],
  [5.8, 7.5, 370, 370],
  [7.5, 9.8, 370, 648],
  [9.8, 10.9, 648, 648],
  [10.9, 15.0, 648, 1250],
];

const SEG_START_DIST: number[] = (() => {
  let acc = 0;
  return SEGS.map((s) => {
    const at = acc;
    acc += Math.abs(s[3] - s[2]);
    return at;
  });
})();

/* ------------------------------ math ------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

/** Trapezoidal velocity: accelerate, cruise at a constant speed, decelerate. */
function trapEase(p: number, a = 0.16, b = 0.16) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  const V = 1 / (1 - a / 2 - b / 2);
  if (p < a) return (V * p * p) / (2 * a);
  if (p <= 1 - b) return V * (a / 2 + (p - a));
  const q = 1 - p;
  return 1 - (V * q * q) / (2 * b);
}

function pathAt(tau: number) {
  for (let i = 0; i < SEGS.length; i++) {
    const [t0, t1, x0, x1] = SEGS[i];
    if (tau < t1 || i === SEGS.length - 1) {
      const e = trapEase(clamp01((tau - t0) / (t1 - t0)));
      return {
        x: x0 + (x1 - x0) * e,
        dist: SEG_START_DIST[i] + Math.abs(x1 - x0) * e,
      };
    }
  }
  return { x: 1250, dist: 0 };
}

const depthAt = (x: number) => clamp01((x - 482) / 60) * (1 - clamp01((x - 848) / 55));

const entrySignal = (x: number) => clamp01((x - 388) / 52) * (1 - clamp01((x - 538) / 52));
const exitSignal = (x: number) => clamp01((x - 772) / 48) * (1 - clamp01((x - 908) / 48));

/* --------------------------- the cast ----------------------------- */

type HoldKind = "cash" | "phone" | "receipt" | "doc" | "gold";

type CastMember = {
  id: string;
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  accent: string;
  badge: string;
  amount: number;
  hold: HoldKind;
};

const CAST: CastMember[] = [
  {
    id: "employee",
    skin: "#E7B58C",
    hair: "#232B3D",
    top: "#4A6CF7",
    bottom: "#2B3550",
    accent: "#2B3550",
    badge: "Cash Withdrawal",
    amount: 5,
    hold: "cash",
  },
  {
    id: "student",
    skin: "#D9A272",
    hair: "#1F2637",
    top: "#EFB646",
    bottom: "#37415C",
    accent: "#2B3550",
    badge: "Recharge Done",
    amount: 8,
    hold: "phone",
  },
  {
    id: "homemaker",
    skin: "#E3AE85",
    hair: "#1B2233",
    top: "#D4738F",
    bottom: "#B65B77",
    accent: "#F0C7D4",
    badge: "Bill Paid",
    amount: 12,
    hold: "receipt",
  },
  {
    id: "farmer",
    skin: "#C98A57",
    hair: "#241C15",
    top: "#EAE1CE",
    bottom: "#F2F0E8",
    accent: "#D8663F",
    badge: "Loan Approved",
    amount: 50,
    hold: "doc",
  },
  {
    id: "owner",
    skin: "#DFA579",
    hair: "#20283A",
    top: "#7E8CBF",
    bottom: "#39425E",
    accent: "#2B3550",
    badge: "Khata Updated",
    amount: 20,
    hold: "phone",
  },
  {
    id: "delivery",
    skin: "#E0AC80",
    hair: "#1B2233",
    top: "#3B5BFF",
    bottom: "#2B3550",
    accent: "#E8A93A",
    badge: "Gold Purchased",
    amount: 35,
    hold: "gold",
  },
];

const SERVE_FROM = 9.85;
const SERVE_TO = 10.9;
const BADGE_FROM = 10.25;
const BADGE_LEN = 1.9;
const COMM_FROM = 10.55;
const COMM_LEN = 2.0;

type PersonState = {
  i: number;
  cfg: CastMember;
  tau: number;
  x: number;
  y: number;
  scale: number;
  phase: number;
  move: number;
  showHold: boolean;
  seed: number;
  t: number;
  inside: boolean;
  onStage: boolean;
};

/* ========================== sub-components ========================= */

function HeldItem({ kind, skin }: { kind: HoldKind; skin: string }) {
  switch (kind) {
    case "cash":
      return (
        <g>
          <rect x={-9} y={-5} width={18} height={11} rx={1.5} fill="#BFE7CF" />
          <rect x={-9} y={-7} width={18} height={11} rx={1.5} fill="#DCF3E6" stroke={C.green} strokeWidth={1} />
          <circle cx={0} cy={-1.5} r={2.4} fill={C.green} opacity={0.55} />
        </g>
      );
    case "phone":
      return (
        <g>
          <rect x={-5} y={-9} width={10} height={17} rx={2} fill={C.ink} />
          <rect x={-3.6} y={-7.4} width={7.2} height={12.6} rx={1} fill={C.blueSoft} />
          <circle cx={0} cy={-1} r={1.8} fill={C.blue} />
        </g>
      );
    case "receipt":
      return (
        <g>
          <rect x={-6} y={-9} width={12} height={17} rx={1.5} fill={C.white} stroke={C.line} strokeWidth={1} />
          <path d="M-3 -5h6M-3 -2h6M-3 1h4" stroke={C.blueLine} strokeWidth={1.2} strokeLinecap="round" />
          <circle cx={2} cy={4} r={2.6} fill={C.greenSoft} />
          <path d="M0.7 4l1 1.1 2-2.3" stroke={C.green} strokeWidth={1.2} fill="none" strokeLinecap="round" />
        </g>
      );
    case "doc":
      return (
        <g>
          <rect x={-7} y={-9} width={14} height={18} rx={2} fill={C.white} stroke={C.blueLine} strokeWidth={1} />
          <path d="M-4 -5h8M-4 -1.5h8" stroke={C.blueLine} strokeWidth={1.2} strokeLinecap="round" />
          <circle cx={0} cy={4} r={3.4} fill={C.blue} />
          <path d="M-1.6 4l1.2 1.3 2.2-2.6" stroke={C.white} strokeWidth={1.3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "gold":
      return (
        <g>
          <circle cx={0} cy={0} r={7.5} fill={C.gold} />
          <circle cx={0} cy={0} r={5} fill={C.goldSoft} />
          <text x={0} y={3.4} textAnchor="middle" fontSize={7.5} fontWeight={800} fill={C.gold} fontFamily="inherit">
            ₹
          </text>
        </g>
      );
    default:
      return <circle cx={0} cy={0} r={3.2} fill={skin} />;
  }
}

/** A walking customer. Feet sit at local y = 0. */
function Person({ p }: { p: PersonState }) {
  const { x, y, scale, phase, move, cfg, showHold, seed, t } = p;

  const sw = Math.sin(phase);
  const legSwing = sw * 30 * move;
  const armSwing = -sw * 26 * move;
  const bounce = -Math.abs(Math.cos(phase)) * 2.1 * move;
  const idle = Math.sin(t * 1.9 + seed) * (1 - move);
  const bodyY = bounce + idle * 0.6;
  const headTilt = sw * 2.4 * move + idle * 1.6;

  const rightArm = showHold ? -108 + Math.sin(t * 2.4 + seed) * 3 : -armSwing;

  const isHomemaker = cfg.id === "homemaker";
  const legLen = isHomemaker ? 22 : 30;
  const legTop = isHomemaker ? -22 : -30;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={1.5} rx={15} ry={3.2} fill={C.ink} opacity={0.07} />

      <g transform={`translate(0 ${bodyY})`}>
        {cfg.id === "student" && <rect x={-22} y={-58} width={13} height={23} rx={5} fill={cfg.accent} />}
        {cfg.id === "delivery" && (
          <g>
            <rect x={-25} y={-59} width={15} height={19} rx={2.5} fill={cfg.accent} />
            <path d="M-25 -50h15" stroke={C.white} strokeWidth={1.6} opacity={0.8} />
          </g>
        )}
        {cfg.id === "employee" && <rect x={11} y={-42} width={12} height={14} rx={2.5} fill={cfg.accent} />}

        <g transform={`translate(0 ${legTop})`}>
          <g transform={`rotate(${-legSwing})`}>
            <line x1={0} y1={0} x2={0} y2={legLen} stroke={cfg.bottom} strokeWidth={7} strokeLinecap="round" opacity={0.82} />
          </g>
          <g transform={`rotate(${legSwing})`}>
            <line x1={0} y1={0} x2={0} y2={legLen} stroke={cfg.bottom} strokeWidth={7} strokeLinecap="round" />
          </g>
        </g>

        {isHomemaker && <path d="M-9 -34 L9 -34 L14 -6 L-14 -6 Z" fill={cfg.bottom} />}

        <rect x={-11} y={-62} width={22} height={34} rx={8} fill={cfg.top} />
        {cfg.id === "owner" && <path d="M-8 -52 L8 -52 L10 -29 L-10 -29 Z" fill={cfg.accent} opacity={0.9} />}
        {cfg.id === "employee" && <path d="M-9 -58 L8 -34" stroke={C.white} strokeWidth={2} opacity={0.45} strokeLinecap="round" />}
        {cfg.id === "homemaker" && <path d="M-10 -58 L7 -32" stroke={cfg.accent} strokeWidth={3.4} strokeLinecap="round" />}
        {cfg.id === "delivery" && <path d="M-9 -56 L9 -36" stroke={C.white} strokeWidth={2} opacity={0.5} strokeLinecap="round" />}

        <g transform="translate(-8 -56)">
          <g transform={`rotate(${armSwing})`}>
            <line x1={0} y1={0} x2={0} y2={20} stroke={cfg.top} strokeWidth={5.6} strokeLinecap="round" opacity={0.78} />
            <circle cx={0} cy={22} r={3.1} fill={cfg.skin} opacity={0.85} />
          </g>
        </g>

        <g transform="translate(8 -56)">
          <g transform={`rotate(${rightArm})`}>
            <line x1={0} y1={0} x2={0} y2={20} stroke={cfg.top} strokeWidth={5.6} strokeLinecap="round" />
            <circle cx={0} cy={22} r={3.1} fill={cfg.skin} />
            {showHold && (
              <g transform={`translate(0 26) rotate(${-rightArm})`}>
                <HeldItem kind={cfg.hold} skin={cfg.skin} />
              </g>
            )}
          </g>
        </g>

        <g transform={`translate(0 -63) rotate(${headTilt})`}>
          <rect x={-3} y={-6} width={6} height={7} fill={cfg.skin} />
          <circle cx={0} cy={-11} r={9.5} fill={cfg.skin} />

          {cfg.id === "employee" && (
            <path d="M-9.5 -13 A9.5 9.5 0 0 1 9.5 -13 L9.5 -14 A9.5 9.5 0 0 0 -9.5 -14 Z" fill={cfg.hair} />
          )}
          {(cfg.id === "employee" || cfg.id === "owner") && (
            <path d="M-9.6 -12.5 Q0 -23 9.6 -12.5 Q0 -17.5 -9.6 -12.5 Z" fill={cfg.hair} />
          )}
          {cfg.id === "student" && (
            <g>
              <path d="M-9.8 -12 A9.8 9.8 0 0 1 9.8 -12 Z" fill={cfg.top} />
              <rect x={6} y={-13.6} width={11} height={3.2} rx={1.6} fill={cfg.top} />
            </g>
          )}
          {cfg.id === "homemaker" && (
            <g>
              <path d="M-9.8 -11 Q-11 -22 0 -22 Q11 -22 9.8 -11 Q6 -18 0 -18 Q-6 -18 -9.8 -11 Z" fill={cfg.hair} />
              <circle cx={-10} cy={-8} r={4.4} fill={cfg.hair} />
              <path d="M9.5 -14 Q17 -8 12 2" stroke={cfg.accent} strokeWidth={3.2} fill="none" strokeLinecap="round" />
            </g>
          )}
          {cfg.id === "farmer" && (
            <g>
              <path d="M-10 -13 Q0 -27 10 -13 Q0 -19 -10 -13 Z" fill={cfg.accent} />
              <path d="M-10 -13 Q-14 -10 -12 -6" stroke={cfg.accent} strokeWidth={3} fill="none" strokeLinecap="round" />
            </g>
          )}
          {cfg.id === "owner" && <rect x={2} y={-9.5} width={6} height={1.8} rx={0.9} fill={cfg.hair} />}
          {cfg.id === "delivery" && (
            <g>
              <path d="M-10 -11 A10 10 0 0 1 10 -11 Z" fill={C.blue} />
              <rect x={4} y={-12.5} width={7} height={2.6} rx={1.3} fill={C.blueDeep} />
            </g>
          )}

          <circle cx={4.5} cy={-11} r={1.15} fill={C.ink} opacity={0.75} />
          <path d="M2.6 -7.4 Q5 -5.6 7.2 -7.6" stroke={C.ink} strokeWidth={1.05} fill="none" opacity={0.45} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** The Cashlo merchant, behind the counter. */
function Merchant({
  t,
  serving,
  progress,
  waving,
  onPhone,
}: {
  t: number;
  serving: boolean;
  progress: number;
  waving: boolean;
  onPhone: boolean;
}) {
  const breathe = Math.sin(t * 1.7) * 0.9;
  const lean = serving ? smooth(clamp01(progress * 3)) * 2.6 : 0;
  const headTurn = serving ? 5 : Math.sin(t * 0.8) * 4;

  let armWork = 8;
  if (serving) {
    const g = progress;
    if (g < 0.25) armWork = lerp(8, 52, smooth(g / 0.25));
    else if (g < 0.6) armWork = 52 + Math.sin(g * 46) * 6;
    else if (g < 0.85) armWork = lerp(52, 84, smooth((g - 0.6) / 0.25));
    else armWork = lerp(84, 8, smooth((g - 0.85) / 0.15));
  }

  const armFree = waving ? -148 + Math.sin(t * 13) * 20 : onPhone ? -126 : -8 + breathe;

  return (
    <g transform={`translate(${705} ${257}) scale(0.86)`}>
      <g transform={`translate(${lean} ${breathe * 0.6})`}>
        <line x1={-5} y1={-30} x2={-5} y2={0} stroke="#39425E" strokeWidth={7} strokeLinecap="round" />
        <line x1={5} y1={-30} x2={5} y2={0} stroke="#39425E" strokeWidth={7} strokeLinecap="round" />

        <rect x={-12} y={-64} width={24} height={36} rx={8} fill={C.blue} />
        <path d="M-9 -54 L9 -54 L11 -28 L-11 -28 Z" fill={C.blueDeep} opacity={0.35} />
        <rect x={-4.5} y={-49} width={9} height={7} rx={1.6} fill={C.white} opacity={0.9} />

        <g transform="translate(9 -57)">
          <g transform={`rotate(${armFree})`}>
            <line x1={0} y1={0} x2={0} y2={20} stroke={C.blue} strokeWidth={5.8} strokeLinecap="round" />
            <circle cx={0} cy={22} r={3.2} fill="#DFA579" />
            {onPhone && !serving && !waving && (
              <g transform={`translate(0 25) rotate(${-armFree})`}>
                <rect x={-4.5} y={-8} width={9} height={15} rx={2} fill={C.ink} />
                <rect x={-3.2} y={-6.6} width={6.4} height={11} rx={1} fill={C.blueSoft} />
              </g>
            )}
          </g>
        </g>

        <g transform="translate(-9 -57)">
          <g transform={`rotate(${armWork})`}>
            <line x1={0} y1={0} x2={0} y2={21} stroke={C.blue} strokeWidth={5.8} strokeLinecap="round" />
            <circle cx={0} cy={23} r={3.2} fill="#DFA579" />
            {serving && progress > 0.62 && (
              <g transform={`translate(0 27) rotate(${-armWork})`} opacity={clamp01((progress - 0.62) / 0.16)}>
                <rect x={-8} y={-5} width={16} height={10} rx={1.5} fill="#DCF3E6" stroke={C.green} strokeWidth={1} />
              </g>
            )}
          </g>
        </g>

        <g transform={`translate(0 -65) rotate(${headTurn * 0.25})`}>
          <rect x={-3} y={-6} width={6} height={7} fill="#DFA579" />
          <circle cx={0} cy={-11} r={9.6} fill="#DFA579" />
          <path d="M-9.7 -12.5 Q0 -23.5 9.7 -12.5 Q0 -17.5 -9.7 -12.5 Z" fill="#20283A" />
          <circle cx={4.6} cy={-11} r={1.15} fill={C.ink} opacity={0.75} />
          <path d="M2.6 -7.4 Q5 -5.4 7.3 -7.6" stroke={C.ink} strokeWidth={1.05} fill="none" opacity={0.45} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

function CommissionPopup({ amount, p }: { amount: number; p: number }) {
  const s = p < 0.16 ? easeOutBack(clamp01(p / 0.16)) : 1;
  const o = p < 0.1 ? p / 0.1 : p > 0.7 ? clamp01(1 - (p - 0.7) / 0.3) : 1;
  const dy = -32 * easeOutCubic(p);

  const w = 130 + 8.5 * String(amount).length;
  const cx = -w / 2 + 16;

  return (
    <g transform={`translate(810 ${58 + dy})`} opacity={o}>
      <g transform={`scale(${s})`}>
        <rect x={-w / 2} y={-16} width={w} height={32} rx={16} fill={C.white} stroke={C.blueLine} strokeWidth={1.4} />
        <circle cx={cx} cy={0} r={9.5} fill={C.blueSoft} />
        <path
          d={`M${cx} -4.6 L${cx + 4} 0.6 L${cx + 1.8} 0.6 L${cx + 1.8} 4.6 L${cx - 1.8} 4.6 L${cx - 1.8} 0.6 L${cx - 4} 0.6 Z`}
          fill={C.blue}
        />
        <text x={-w / 2 + 30} y={4.6} fontSize={12.5} fontWeight={500} fill={C.inkSoft}>
          <tspan fontSize={13.5} fontWeight={700} fill={C.blue}>
            +₹{amount}
          </tspan>
          <tspan dx={6}>Commission</tspan>
        </text>
      </g>
    </g>
  );
}

function StatusBadge({ label, p }: { label: string; p: number }) {
  const s = p < 0.16 ? easeOutBack(clamp01(p / 0.16)) : 1;
  const o = p < 0.1 ? p / 0.1 : p > 0.7 ? clamp01(1 - (p - 0.7) / 0.3) : 1;
  const dy = -28 * easeOutCubic(p);
  const w = 34 + label.length * 7.1;

  return (
    <g transform={`translate(548 ${58 + dy})`} opacity={o}>
      <g transform={`scale(${s})`}>
        <rect x={-w / 2} y={-14} width={w} height={28} rx={14} fill={C.white} stroke="#CFEBDD" strokeWidth={1.4} />
        <circle cx={-w / 2 + 16} cy={0} r={7.6} fill={C.greenSoft} />
        <path d={`M${-w / 2 + 12.6} 0 l2.6 2.8 l4.6 -5.4`} stroke={C.green} strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={-w / 2 + 28} y={4.4} fontSize={12.5} fontWeight={600} fill={C.ink}>
          {label}
        </text>
      </g>
    </g>
  );
}

/* ============================== scene ============================== */

export default function CashloMerchantHeroAnimation({
  className = "",
  height = "clamp(260px, 25vw, 320px)",
  style,
}: {
  className?: string;
  height?: string;
  style?: CSSProperties;
}): ReactNode {
  const prefersReduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const visible = useRef(true);
  const [t, setT] = useState(prefersReduced ? 10.35 : 0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
      },
      { threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useAnimationFrame((ms) => {
    if (prefersReduced || !visible.current) return;
    setT((ms / 1000) % LOOP);
  });

  /* ---- derive the whole frame from the clock ---- */

  const people: PersonState[] = CAST.map((cfg, i) => {
    const tau = (((t - i * STAGGER) % LOOP) + LOOP) % LOOP;
    const { x, dist } = pathAt(tau);

    const dAhead = pathAt(Math.min(tau + 0.035, LOOP)).dist;
    const dBack = pathAt(Math.max(tau - 0.035, 0)).dist;
    const speed = (dAhead - dBack) / 0.07;

    const d = depthAt(x);
    return {
      i,
      cfg,
      tau,
      x,
      y: lerp(BASE_OUT, BASE_IN, d),
      scale: lerp(1, 0.9, d),
      phase: (dist / 30) * Math.PI,
      move: clamp01(speed / 105),
      showHold: x > 672 && x < 1240,
      seed: i * 1.7,
      t,
      inside: x > 482 && x < DOOR_OUT_R,
      onStage: x > -60 && x < 1245,
    };
  });

  const entryOpen = people.reduce((m, p) => Math.max(m, entrySignal(p.x)), 0);
  const exitOpen = people.reduce((m, p) => Math.max(m, exitSignal(p.x)), 0);

  const served = people.find((p) => p.tau >= SERVE_FROM && p.tau <= SERVE_TO);
  const serveProgress = served ? clamp01((served.tau - SERVE_FROM) / (SERVE_TO - SERVE_FROM)) : 0;
  const waving = people.some((p) => p.x > 498 && p.x < 585);
  const onPhone = (t > 3.9 && t < 4.8) || (t > 11.4 && t < 12.3);

  /* ambient */
  const cloudDrift = Math.sin((t / LOOP) * Math.PI * 2);
  const sway = Math.sin((t / LOOP) * Math.PI * 2 * 3) * 1.6;
  const birdT = (t - 1.6) / 5.0;
  const birdOn = birdT > 0 && birdT < 1;
  const birdX = -70 + birdT * 1340;
  const flap = Math.sin(t * 9);
  const leafT = (t - 4.5) / 4.5;
  const leafOn = leafT > 0 && leafT < 1;

  const font = '"Inter", "Plus Jakarta Sans", "Segoe UI", system-ui, -apple-system, sans-serif';

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width: "100%", height, background: C.white, ...style }}
      aria-label="A Cashlo merchant serving a steady queue of customers and earning commission on every transaction"
      role="img"
    >
      <motion.svg
        viewBox="0 0 1200 340"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", fontFamily: font }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <defs>
          <clipPath id="cashlo-inside">
            <rect x={436} y={FACADE_TOP} width={458} height={172} />
            <rect x={DOOR_OUT_L} y={FACADE_TOP} width={112} height={172} />
          </clipPath>
        </defs>

        {/* ---------------- sky ---------------- */}
        <g opacity={0.9}>
          <g transform={`translate(${170 + cloudDrift * 16} 0)`}>
            <ellipse cx={0} cy={28} rx={30} ry={11} fill={C.panel2} />
            <ellipse cx={-18} cy={31} rx={19} ry={8} fill={C.panel2} />
            <ellipse cx={20} cy={32} rx={16} ry={7} fill={C.panel2} />
          </g>
          <g transform={`translate(${1046 - cloudDrift * 14} 0)`}>
            <ellipse cx={0} cy={22} rx={26} ry={9.5} fill={C.panel2} />
            <ellipse cx={19} cy={25} rx={15} ry={6.5} fill={C.panel2} />
          </g>
        </g>

        {birdOn && (
          <g opacity={0.75}>
            {[0, 34, 66].map((off, k) => (
              <path
                key={k}
                d={`M${birdX - off - 8} ${18 + k * 7 + Math.sin(t * 1.3 + k) * 4} q4 ${-4.5 - flap * 2.5} 8 0 q4 ${-4.5 - flap * 2.5} 8 0`}
                stroke="#C2CBDD"
                strokeWidth={1.6}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}

        {/* ---------------- ground ---------------- */}
        <rect x={0} y={FLOOR_Y} width={1200} height={PAVE_Y - FLOOR_Y} fill={C.panel} />
        <line x1={0} y1={FLOOR_Y} x2={1200} y2={FLOOR_Y} stroke={C.line} strokeWidth={1.6} />
        <line x1={0} y1={PAVE_Y} x2={1200} y2={PAVE_Y} stroke={C.line} strokeWidth={1.2} opacity={0.7} />

        {/* ---------------- tree (right) ---------------- */}
        <g>
          <rect x={1116} y={228} width={8} height={62} rx={3} fill={C.bark} />
          <g transform={`rotate(${sway} 1120 232)`}>
            <circle cx={1120} cy={206} r={24} fill={C.leaf} />
            <circle cx={1101} cy={220} r={17} fill={C.leafDark} />
            <circle cx={1139} cy={219} r={16} fill={C.leafDark} />
            <circle cx={1126} cy={196} r={13} fill={C.leaf} />
          </g>
          {leafOn && (
            <g
              transform={`translate(${1130 - 28 * leafT + Math.sin(leafT * 9) * 9} ${228 + 60 * leafT}) rotate(${leafT * 280})`}
              opacity={leafT < 0.15 ? leafT / 0.15 : leafT > 0.78 ? (1 - leafT) / 0.22 : 1}
            >
              <ellipse cx={0} cy={0} rx={4.4} ry={2.4} fill={C.leafDark} />
            </g>
          )}
        </g>

        {/* ---------------- shop interior ---------------- */}
        <rect x={436} y={FACADE_TOP} width={458} height={FLOOR_Y - FACADE_TOP} fill={C.panel} />
        <rect x={436} y={266} width={458} height={16} fill={C.panel2} />

        <g clipPath="url(#cashlo-inside)">
          <rect x={455} y={150} width={64} height={46} rx={6} fill={C.blueSoft} />
          <text x={487} y={181} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.blue} opacity={0.6}>
            ₹
          </text>
          <rect x={778} y={166} width={100} height={9} rx={4} fill={C.blueSoft} />
          <rect x={790} y={148} width={17} height={18} rx={3} fill={C.blueLine} opacity={0.75} />
          <rect x={814} y={152} width={17} height={14} rx={3} fill={C.blueSoft} />
          <rect x={838} y={146} width={17} height={20} rx={3} fill={C.blueLine} opacity={0.55} />

          <Merchant t={t} serving={!!served} progress={serveProgress} waving={waving && !served} onPhone={onPhone} />

          {people.filter((p) => p.inside).map((p) => (
            <Person key={p.cfg.id} p={p} />
          ))}

          <rect x={COUNTER_L} y={COUNTER_TOP + 4} width={COUNTER_R - COUNTER_L} height={FLOOR_Y - COUNTER_TOP - 4} fill={C.white} />
          <rect
            x={COUNTER_L}
            y={COUNTER_TOP + 4}
            width={COUNTER_R - COUNTER_L}
            height={FLOOR_Y - COUNTER_TOP - 4}
            fill="none"
            stroke={C.line}
            strokeWidth={1.4}
          />
          <rect x={COUNTER_L - 6} y={COUNTER_TOP - 4} width={COUNTER_R - COUNTER_L + 12} height={9} rx={3} fill={C.blue} />
          <rect x={COUNTER_L + 14} y={COUNTER_TOP + 22} width={64} height={7} rx={3.5} fill={C.blueSoft} />
          <rect x={COUNTER_L + 14} y={COUNTER_TOP + 36} width={40} height={7} rx={3.5} fill={C.blueSoft} />

          <g transform={`translate(668 ${COUNTER_TOP - 4})`}>
            <rect x={0} y={-24} width={26} height={24} rx={3.5} fill={C.ink} />
            <rect x={3} y={-21} width={20} height={12} rx={2} fill={served ? C.blue : C.blueSoft} />
            <rect x={5} y={-6} width={16} height={3} rx={1.5} fill={C.inkSoft} opacity={0.5} />
          </g>
          <g transform={`translate(600 ${COUNTER_TOP - 4})`}>
            <rect x={0} y={-8} width={34} height={8} rx={2} fill={C.panel2} />
            <rect x={3} y={-12} width={28} height={5} rx={1.5} fill="#DCF3E6" />
          </g>
        </g>

        {/* ---------------- facade ---------------- */}
        <rect x={520} y={FACADE_TOP} width={290} height={FLOOR_Y - FACADE_TOP} fill={C.white} opacity={0.16} />
        <path d={`M556 ${FLOOR_Y} L636 ${FACADE_TOP} L668 ${FACADE_TOP} L588 ${FLOOR_Y} Z`} fill={C.white} opacity={0.3} />
        <rect x={520} y={FACADE_TOP} width={290} height={FLOOR_Y - FACADE_TOP} fill="none" stroke={C.line} strokeWidth={1.6} />
        <rect x={620} y={FACADE_TOP} width={6} height={FLOOR_Y - FACADE_TOP} fill={C.white} stroke={C.line} strokeWidth={1} />
        <rect x={716} y={FACADE_TOP} width={6} height={FLOOR_Y - FACADE_TOP} fill={C.white} stroke={C.line} strokeWidth={1} />

        <rect x={DOOR_IN_L - 4} y={FACADE_TOP} width={76} height={FLOOR_Y - FACADE_TOP} fill="none" stroke={C.line} strokeWidth={1.6} />
        <rect x={DOOR_OUT_L - 4} y={FACADE_TOP} width={76} height={FLOOR_Y - FACADE_TOP} fill="none" stroke={C.line} strokeWidth={1.6} />

        <g transform={`translate(${DOOR_IN_L} 0) scale(${1 - 0.94 * entryOpen} 1)`}>
          <rect x={0} y={FACADE_TOP + 2} width={DOOR_IN_R - DOOR_IN_L} height={FLOOR_Y - FACADE_TOP - 2} fill={C.white} opacity={0.55} />
          <rect x={0} y={FACADE_TOP + 2} width={DOOR_IN_R - DOOR_IN_L} height={FLOOR_Y - FACADE_TOP - 2} fill="none" stroke={C.blueLine} strokeWidth={2} />
          <rect x={DOOR_IN_R - DOOR_IN_L - 12} y={196} width={4} height={26} rx={2} fill={C.blue} />
          <rect x={6} y={132} width={34} height={7} rx={3.5} fill={C.blueSoft} />
        </g>

        <g transform={`translate(${DOOR_OUT_R} 0) scale(${1 - 0.94 * exitOpen} 1) translate(${-DOOR_OUT_R} 0)`}>
          <rect x={DOOR_OUT_L} y={FACADE_TOP + 2} width={DOOR_OUT_R - DOOR_OUT_L} height={FLOOR_Y - FACADE_TOP - 2} fill={C.white} opacity={0.55} />
          <rect
            x={DOOR_OUT_L}
            y={FACADE_TOP + 2}
            width={DOOR_OUT_R - DOOR_OUT_L}
            height={FLOOR_Y - FACADE_TOP - 2}
            fill="none"
            stroke={C.blueLine}
            strokeWidth={2}
          />
          <rect x={DOOR_OUT_L + 8} y={196} width={4} height={26} rx={2} fill={C.blue} />
          <rect x={DOOR_OUT_L + 20} y={132} width={34} height={7} rx={3.5} fill={C.blueSoft} />
        </g>

        <rect x={SHOP_L} y={FACADE_TOP} width={14} height={FLOOR_Y - FACADE_TOP} fill={C.white} stroke={C.line} strokeWidth={1.4} />
        <rect x={SHOP_R - 14} y={FACADE_TOP} width={14} height={FLOOR_Y - FACADE_TOP} fill={C.white} stroke={C.line} strokeWidth={1.4} />

        <g>
          {(
            [
              { x: 528, glyph: "rupee" },
              { x: 582, glyph: "qr" },
              { x: 636, glyph: "bolt" },
            ] as { x: number; glyph: "rupee" | "qr" | "bolt" }[]
          ).map((s) => (
            <g key={s.x} transform={`translate(${s.x} 130)`}>
              <rect x={0} y={0} width={44} height={18} rx={9} fill={C.white} stroke={C.blueLine} strokeWidth={1.1} />
              {s.glyph === "rupee" && (
                <text x={22} y={13.5} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.blue}>
                  ₹
                </text>
              )}
              {s.glyph === "qr" && (
                <g fill={C.blue} transform="translate(15 5)">
                  <rect x={0} y={0} width={3.4} height={3.4} rx={0.6} />
                  <rect x={5.4} y={0} width={3.4} height={3.4} rx={0.6} />
                  <rect x={10.8} y={0} width={3.4} height={3.4} rx={0.6} />
                  <rect x={0} y={5} width={3.4} height={3.4} rx={0.6} />
                  <rect x={10.8} y={5} width={3.4} height={3.4} rx={0.6} />
                </g>
              )}
              {s.glyph === "bolt" && <path d="M24 4 L18 10.5 L21.6 10.5 L20 14.5 L26 8 L22.4 8 Z" fill={C.blue} />}
            </g>
          ))}
        </g>

        <rect x={414} y={110} width={502} height={9} rx={3} fill={C.blueSoft} />
        <rect x={414} y={70} width={502} height={40} rx={11} fill={C.blue} />
        <g transform="translate(436 80)">
          <rect x={0} y={0} width={20} height={20} rx={5} fill={C.white} />
          <g fill={C.blue} transform="translate(4.5 4.5)">
            <rect x={0} y={0} width={4} height={4} rx={0.8} />
            <rect x={7} y={0} width={4} height={4} rx={0.8} />
            <rect x={0} y={7} width={4} height={4} rx={0.8} />
            <rect x={7} y={7} width={4} height={4} rx={0.8} />
          </g>
        </g>
        <text x={468} y={97} fontSize={21} fontWeight={800} letterSpacing={3.4} fill={C.white}>
          CASHLO
        </text>
        <rect x={786} y={82} width={112} height={17} rx={8.5} fill={C.white} opacity={0.16} />
        <text x={842} y={94.5} textAnchor="middle" fontSize={10.5} fontWeight={600} letterSpacing={1.1} fill={C.white} opacity={0.95}>
          DIGITAL SERVICES
        </text>

        {/* ---------------- QR stand outside ---------------- */}
        <g>
          <line x1={926} y1={258} x2={918} y2={288} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
          <line x1={950} y1={258} x2={958} y2={288} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
          <rect x={914} y={214} width={48} height={48} rx={7} fill={C.white} stroke={C.blueLine} strokeWidth={1.6} />
          <rect x={914} y={214} width={48} height={11} rx={5.5} fill={C.blue} />
          <g fill={C.blue} transform="translate(925 231)">
            <rect x={0} y={0} width={7} height={7} rx={1.4} />
            <rect x={12} y={0} width={7} height={7} rx={1.4} />
            <rect x={0} y={12} width={7} height={7} rx={1.4} />
            <rect x={12} y={12} width={4} height={4} rx={1} opacity={0.55} />
            <rect x={8} y={5} width={3} height={3} rx={0.8} opacity={0.4} />
          </g>
        </g>

        {/* ---------------- customers outside ---------------- */}
        {people.filter((p) => !p.inside && p.onStage).map((p) => (
          <Person key={p.cfg.id} p={p} />
        ))}

        {/* ---------------- popups above the shop ---------------- */}
        {people.map((p) => {
          const bp = (p.tau - BADGE_FROM) / BADGE_LEN;
          return bp > 0 && bp < 1 ? <StatusBadge key={`b-${p.cfg.id}`} label={p.cfg.badge} p={bp} /> : null;
        })}
        {people.map((p) => {
          const cp = (p.tau - COMM_FROM) / COMM_LEN;
          return cp > 0 && cp < 1 ? <CommissionPopup key={`c-${p.cfg.id}`} amount={p.cfg.amount} p={cp} /> : null;
        })}
      </motion.svg>
    </div>
  );
}