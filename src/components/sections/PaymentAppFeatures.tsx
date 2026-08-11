"use client";

// import React, { useMemo, useRef, useState } from "react";
import { useId, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  Variants,
} from "framer-motion";
import { WalletCards, Smartphone, FileSpreadsheet, BookOpenText, QrCode, Landmark } from "lucide-react";

/** Structural type for a Lucide icon component — avoids importing the `LucideIcon`
 *  type export, which some bundlers (incl. the Claude artifact sandbox) can't resolve. */
type IconComponent = React.ComponentType<{
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Cashlo — "More Than Just a Payment App" section
 * ─────────────────────────────────────────────────────────────────────────
 * Stack: React + TypeScript + Tailwind CSS + Framer Motion
 *
 * v2 upgrades over the first pass:
 * - Layered, soft-gradient "3D-style" SVG illustrations (still fully
 *   vector, no images/GIF/Lottie) — closer to the Stripe/Razorpay/CRED
 *   marketing-illustration register: soft volumetric shading via subtle
 *   linearGradient fills + layered drop shadows, not flat single-tone icons.
 * - Cursor-tracked parallax tilt per card (perspective + rotateX/rotateY),
 *   with the illustration drifting at a slightly different depth for a
 *   subtle multi-plane effect.
 * - Ambient floating particles that appear only while hovered.
 * - Every illustration still idles on its own ~5s infinite loop, and
 *   plays a richer, faster "active" sequence on hover, sharing the same
 *   motion vocabulary so idle → hover feels like an intensification
 *   rather than a swap.
 * - prefers-reduced-motion strips looping motion, parallax and particles
 *   down to a simple, static, accessible presentation.
 * ─────────────────────────────────────────────────────────────────────────
 */

const COLORS = {
  blue: "#3B5BFF",
  blueDeep: "#2541D6",
  blueSoft: "#EEF1FF",
  indigo: "#6366F1",
  indigoSoft: "#EEF0FE",
  ink: "#111827",
  inkSoft: "#6B7280",
  border: "#EAEAEA",
  success: "#22C55E",
  successDeep: "#15A34A",
  successSoft: "#E9FBF0",
  warning: "#F59E0B",
  warningDeep: "#D97F06",
  warningSoft: "#FEF3E2",
};

/* ────────────────────────────────────────────────────────────────────── */
/* Shared illustration primitives                                         */
/* ────────────────────────────────────────────────────────────────────── */

interface IllustrationProps {
  active: boolean;
  reduceMotion: boolean;
}

let gradientSeed = 0;
/** Generates a stable, unique id so multiple card instances never clash defs. */
/** Generates a stable, unique id so multiple card instances never clash defs. */
function useGradId(prefix: string) {
  const id = useId().replace(/:/g, "");
  return `${prefix}-${id}`;
}

/** Soft ambient colour wash behind an illustration — depth layer 0. */
const BackgroundWash: React.FC<{ color: string }> = ({ color }) => {
  const id = useGradId("wash");
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="220" fill={`url(#${id})`} />
    </>
  );
};

/** Reusable volumetric-ish gradient tile — the building block for "3D" panels. */
const GradTile: React.FC<{
  id: string;
  from: string;
  to: string;
}> = ({ id, from, to }) => (
  <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stopColor={from} />
    <stop offset="100%" stopColor={to} />
  </linearGradient>
);

const CommissionChip: React.FC<{
  x: number;
  y: number;
  label: string;
  active: boolean;
  reduceMotion: boolean;
  delay?: number;
}> = ({ x, y, label, active, reduceMotion, delay = 0 }) => {
  const id = useGradId("chip");
  return (
    <motion.g
      initial={{ opacity: 0, y: y + 6 }}
      animate={
        reduceMotion
          ? { opacity: active ? 1 : 0.85 }
          : active
          ? { opacity: 1, y: [y + 4, y - 6, y + 4] }
          : { opacity: 0.9, y: [y, y - 3, y] }
      }
      transition={
        reduceMotion
          ? { duration: 0.3 }
          : { duration: active ? 1.6 : 5, repeat: Infinity, ease: "easeInOut", delay }
      }
    >
      <defs>
        <GradTile id={id} from={COLORS.blue} to={COLORS.blueDeep} />
      </defs>
      <rect
        x={x - 32}
        y={y - 14}
        width="64"
        height="27"
        rx="13.5"
        fill={`url(#${id})`}
        style={{ filter: "drop-shadow(0 6px 10px rgba(59,91,255,0.32))" }}
      />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight={700} fill="#FFFFFF" fontFamily="Inter, sans-serif">
        {label}
      </text>
    </motion.g>
  );
};

const CheckBadge: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  active: boolean;
  reduceMotion: boolean;
  delay?: number;
}> = ({ cx, cy, r = 12, active, reduceMotion, delay = 0 }) => {
  const id = useGradId("check");
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={
        active
          ? { scale: 1, opacity: 1 }
          : reduceMotion
          ? { scale: 1, opacity: 0.9 }
          : { scale: [0.94, 1, 0.94], opacity: 1 }
      }
      transition={{
        duration: active ? 0.4 : 4.5,
        delay: active ? delay : 0,
        repeat: active ? 0 : Infinity,
        ease: "easeInOut",
      }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <defs>
        <GradTile id={id} from={COLORS.success} to={COLORS.successDeep} />
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} style={{ filter: "drop-shadow(0 3px 6px rgba(34,197,94,0.35))" }} />
      <path
        d={`M ${cx - r * 0.45} ${cy} L ${cx - r * 0.1} ${cy + r * 0.4} L ${cx + r * 0.5} ${cy - r * 0.4}`}
        stroke="#FFFFFF"
        strokeWidth={r * 0.22}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.g>
  );
};

const FloatingCoin: React.FC<{
  cx: number;
  cy: number;
  r: number;
  active: boolean;
  reduceMotion: boolean;
  delay?: number;
}> = ({ cx, cy, r, active, reduceMotion, delay = 0 }) => {
  const id = useGradId("coin");
  return (
    <motion.g
      animate={
        reduceMotion
          ? {}
          : {
              y: active ? [0, -10, 0] : [0, -4, 0],
              rotate: active ? [0, 180, 360] : [0, 8, 0],
            }
      }
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      transition={{ duration: active ? 2 : 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <defs>
        <GradTile id={id} from="#FDE68A" to={COLORS.warningDeep} />
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} style={{ filter: "drop-shadow(0 3px 5px rgba(217,127,6,0.35))" }} />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="#FFF7E6" strokeWidth="1" opacity="0.6" />
    </motion.g>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* 1. UPI Cash Point                                                      */
/* ────────────────────────────────────────────────────────────────────── */

const UpiCashPointIllustration: React.FC<IllustrationProps> = ({ active, reduceMotion }) => {
  const roofId = useGradId("roof");
  const wallId = useGradId("wall");
  const merchId = useGradId("merch");
  const custId = useGradId("cust");
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="UPI Cash Point illustration">
      <BackgroundWash color={COLORS.blue} />
      <defs>
        <GradTile id={roofId} from={COLORS.blue} to={COLORS.blueDeep} />
        <GradTile id={wallId} from="#FFFFFF" to="#F2F4FF" />
        <GradTile id={merchId} from={COLORS.blue} to={COLORS.blueDeep} />
        <GradTile id={custId} from="#8B93FF" to={COLORS.blueDeep} />
      </defs>

      {/* shop */}
      <rect x="58" y="92" width="144" height="80" rx="8" fill={`url(#${wallId})`} stroke={COLORS.border} style={{ filter: "drop-shadow(0 10px 18px rgba(17,24,39,0.06))" }} />
      <motion.path
        d="M50 92 L130 58 L210 92 Z"
        fill={`url(#${roofId})`}
        style={{ filter: "drop-shadow(0 6px 10px rgba(59,91,255,0.25))" }}
        animate={reduceMotion ? {} : active ? { y: [0, -3, 0] } : { y: [0, -1, 0] }}
        transition={{ duration: active ? 2 : 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x="76" y="140" width="6" height="32" fill={COLORS.border} />
      <rect x="180" y="140" width="6" height="32" fill={COLORS.border} />
      <rect x="90" y="114" width="34" height="34" rx="4" fill="#FFFFFF" stroke={COLORS.border} />
      <rect x="132" y="114" width="52" height="20" rx="3" fill={COLORS.blueSoft} />
      <rect x="132" y="138" width="52" height="10" rx="3" fill={COLORS.blueSoft} opacity={0.6} />

      {/* QR sign */}
      <rect x="150" y="140" width="34" height="30" rx="4" fill="#FFFFFF" stroke={COLORS.border} style={{ filter: "drop-shadow(0 4px 8px rgba(17,24,39,0.08))" }} />
      <motion.rect
        x="156"
        y="146"
        width="22"
        height="18"
        rx="2"
        fill={COLORS.ink}
        animate={reduceMotion ? {} : { opacity: active ? [0.6, 1, 0.6] : [0.85, 1, 0.85] }}
        transition={{ duration: active ? 1.1 : 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* customer */}
      <motion.g
        animate={reduceMotion ? {} : active ? { x: [0, -6, 0] } : { x: [0, -1.5, 0] }}
        transition={{ duration: active ? 1.8 : 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="245" cy="118" r="11" fill="#FBCFE8" style={{ filter: "drop-shadow(0 3px 5px rgba(17,24,39,0.1))" }} />
        <rect x="234" y="130" width="22" height="36" rx="7" fill={`url(#${custId})`} style={{ filter: "drop-shadow(0 4px 8px rgba(17,24,39,0.08))" }} />
      </motion.g>

      {/* merchant */}
      <circle cx="100" cy="128" r="10" fill="#FDE68A" style={{ filter: "drop-shadow(0 3px 5px rgba(17,24,39,0.1))" }} />
      <rect x="90" y="140" width="20" height="32" rx="6" fill={`url(#${merchId})`} style={{ filter: "drop-shadow(0 4px 8px rgba(17,24,39,0.08))" }} />

      {/* cash notes moving between them */}
      <motion.rect
        x="160"
        y="150"
        width="20"
        height="13"
        rx="2"
        fill={COLORS.warning}
        style={{ filter: "drop-shadow(0 2px 4px rgba(217,127,6,0.3))" }}
        animate={
          reduceMotion
            ? { opacity: 0.9 }
            : active
            ? { x: [160, 225, 160], opacity: [1, 1, 0], rotate: [0, 8, 0] }
            : { x: [160, 190, 160], opacity: [0.6, 0.9, 0.6] }
        }
        transition={{ duration: active ? 1.6 : 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <FloatingCoin cx={205} cy={68} r={7.5} active={active} reduceMotion={reduceMotion} />
      <FloatingCoin cx={222} cy={52} r={5.5} active={active} reduceMotion={reduceMotion} delay={0.25} />

      <CommissionChip x={250} y={58} label="+₹8" active={active} reduceMotion={reduceMotion} />
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* 2. Recharge & Bill Payments                                            */
/* ────────────────────────────────────────────────────────────────────── */

const RechargeIllustration: React.FC<IllustrationProps> = ({ active, reduceMotion }) => {
  const phoneId = useGradId("phone");
  const screenId = useGradId("screen");
  const chips = [
    { label: "📱", angle: 0 },
    { label: "⚡", angle: 60 },
    { label: "💧", angle: 120 },
    { label: "⛽", angle: 180 },
    { label: "🚗", angle: 240 },
    { label: "📺", angle: 300 },
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Recharge and bill payments illustration">
      <BackgroundWash color={COLORS.blue} />
      <defs>
        <GradTile id={phoneId} from="#1F2937" to={COLORS.ink} />
        <GradTile id={screenId} from="#FFFFFF" to={COLORS.blueSoft} />
      </defs>

      {/* phone */}
      <rect x="132" y="50" width="56" height="108" rx="12" fill={`url(#${phoneId})`} style={{ filter: "drop-shadow(0 12px 20px rgba(17,24,39,0.14))" }} />
      <rect x="138" y="60" width="44" height="88" rx="6" fill={`url(#${screenId})`} />

      <motion.g
        animate={reduceMotion ? { opacity: active ? 1 : 0.9 } : { opacity: active ? [0.4, 1, 0.4] : [0.7, 1, 0.7] }}
        transition={{ duration: active ? 1.4 : 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <text x="160" y="118" textAnchor="middle" fontSize="9" fontWeight={700} fill={COLORS.ink} fontFamily="Inter, sans-serif">
          Payment
        </text>
        <text x="160" y="130" textAnchor="middle" fontSize="9" fontWeight={700} fill={COLORS.ink} fontFamily="Inter, sans-serif">
          Successful
        </text>
      </motion.g>
      <CheckBadge cx={160} cy={90} r={11} active={active} reduceMotion={reduceMotion} />

      {/* orbiting icon chips */}
      {chips.map((chip, i) => {
        const rad = 86;
        const cx = round(160 + rad * Math.cos((chip.angle * Math.PI) / 180));
        const cy = round(108 + rad * 0.6 * Math.sin((chip.angle * Math.PI) / 180));
        return (
          <motion.g
            key={chip.label}
            animate={reduceMotion ? {} : { rotate: active ? [0, 10, 0, -10, 0] : [0, 3, 0] }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            transition={{ duration: active ? 2.2 : 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          >
            <circle cx={cx} cy={cy} r="16" fill="#FFFFFF" stroke={COLORS.border} style={{ filter: "drop-shadow(0 6px 10px rgba(17,24,39,0.1))" }} />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14">
              {chip.label}
            </text>
          </motion.g>
        );
      })}

      <CommissionChip x={252} y={38} label="+₹5" active={active} reduceMotion={reduceMotion} />
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* 3. GST & Accounting                                                    */
/* ────────────────────────────────────────────────────────────────────── */

const GstIllustration: React.FC<IllustrationProps> = ({ active, reduceMotion }) => {
  const laptopId = useGradId("laptop");
  const baseId = useGradId("base");
  const rows = [
    { label: "GST Registration", y: 78 },
    { label: "GSTR-1 Filing", y: 96 },
    { label: "GSTR-3B Filing", y: 114 },
    { label: "ITR Filing", y: 132 },
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="GST and accounting dashboard illustration">
      <BackgroundWash color={COLORS.success} />
      <defs>
        <GradTile id={laptopId} from="#FFFFFF" to="#F6FBF8" />
        <GradTile id={baseId} from="#D1D5DB" to="#9CA3AF" />
      </defs>

      <rect x="80" y="150" width="160" height="9" rx="4" fill={`url(#${baseId})`} style={{ filter: "drop-shadow(0 4px 8px rgba(17,24,39,0.1))" }} />
      <rect x="90" y="55" width="140" height="95" rx="8" fill={`url(#${laptopId})`} stroke={COLORS.border} strokeWidth="2" style={{ filter: "drop-shadow(0 14px 22px rgba(17,24,39,0.1))" }} />
      <rect x="98" y="63" width="124" height="14" rx="3" fill={COLORS.successSoft} />
      <text x="106" y="73" fontSize="8" fontWeight={700} fill={COLORS.successDeep} fontFamily="Inter, sans-serif">
        GST Dashboard
      </text>

      {rows.map((row, i) => (
        <motion.g
          key={row.label}
          initial={{ opacity: 0.4, x: -4 }}
          animate={
            reduceMotion
              ? { opacity: 1, x: 0 }
              : active
              ? { opacity: 1, x: [0, 2, 0] }
              : { opacity: [0.6, 1, 0.6], x: 0 }
          }
          transition={{ duration: active ? 1.2 : 5, delay: i * (active ? 0.15 : 0.2), repeat: Infinity, ease: "easeInOut" }}
        >
          <text x="106" y={row.y} fontSize="7.5" fill={COLORS.inkSoft} fontFamily="Inter, sans-serif">
            {row.label}
          </text>
          <CheckBadge cx={210} cy={row.y - 3} r={6} active={active} reduceMotion={reduceMotion} delay={i * 0.1} />
        </motion.g>
      ))}

      {/* files sliding into folders */}
      <motion.g
        animate={
          reduceMotion
            ? {}
            : active
            ? { x: [0, 22, 22, 0], opacity: [1, 1, 0.4, 1] }
            : { x: [0, 4, 0] }
        }
        transition={{ duration: active ? 2 : 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="30" y="70" width="34" height="24" rx="3" fill={COLORS.blue} opacity={0.92} style={{ filter: "drop-shadow(0 4px 8px rgba(59,91,255,0.25))" }} />
        <rect x="34" y="98" width="34" height="24" rx="3" fill={COLORS.warning} opacity={0.9} style={{ filter: "drop-shadow(0 4px 8px rgba(217,127,6,0.22))" }} />
        <rect x="30" y="126" width="34" height="24" rx="3" fill={COLORS.success} opacity={0.9} style={{ filter: "drop-shadow(0 4px 8px rgba(21,163,74,0.22))" }} />
      </motion.g>

      {/* calculator */}
      <g>
        <rect x="245" y="145" width="40" height="34" rx="6" fill="#FFFFFF" stroke={COLORS.border} style={{ filter: "drop-shadow(0 6px 10px rgba(17,24,39,0.08))" }} />
        <motion.text
          x="265"
          y="167"
          textAnchor="middle"
          fontSize="11"
          fontWeight={700}
          fill={COLORS.successDeep}
          fontFamily="Inter, sans-serif"
          animate={reduceMotion ? {} : { opacity: active ? [1, 0.6, 1] : [0.85, 1, 0.85] }}
          transition={{ duration: active ? 1.2 : 5, repeat: Infinity, ease: "easeInOut" }}
        >
          ✓ 100%
        </motion.text>
      </g>

      <CommissionChip x={252} y={190} label="Filed" active={active} reduceMotion={reduceMotion} />
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* 4. Quick Khata                                                         */
/* ────────────────────────────────────────────────────────────────────── */

const QuickKhataIllustration: React.FC<IllustrationProps> = ({ active, reduceMotion }) => {
  const tabId = useGradId("tab");
  const rows = [
    { name: "Rohan Kumar", amt: "₹2,500" },
    { name: "Neha Traders", amt: "₹5,800" },
    { name: "Amit Enterprises", amt: "₹3,200" },
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Quick Khata digital ledger illustration">
      <BackgroundWash color={COLORS.warning} />
      <defs>
        <GradTile id={tabId} from="#FFFFFF" to="#FFF9F0" />
      </defs>

      <rect x="70" y="40" width="180" height="130" rx="14" fill={`url(#${tabId})`} stroke={COLORS.border} strokeWidth="2" style={{ filter: "drop-shadow(0 14px 24px rgba(17,24,39,0.08))" }} />
      <rect x="82" y="52" width="156" height="16" rx="3" fill={COLORS.warningSoft} />
      <text x="90" y="63" fontSize="8" fontWeight={700} fill={COLORS.warningDeep} fontFamily="Inter, sans-serif">
        Quick Khata
      </text>

      {rows.map((row, i) => {
        const y = 88 + i * 24;
        return (
          <motion.g
            key={row.name}
            initial={{ opacity: 0, x: -6 }}
            animate={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: active ? [0, 3, 0] : [0, 1, 0] }}
            transition={{ duration: active ? 1.3 : 5, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="94" cy={y} r="7" fill={COLORS.blueSoft} stroke={COLORS.blue} strokeWidth="1" />
            <text x="108" y={y - 2} fontSize="7.5" fontWeight={600} fill={COLORS.ink} fontFamily="Inter, sans-serif">
              {row.name}
            </text>
            <motion.text
              x="108"
              y={y + 8}
              fontSize="7"
              fill={COLORS.inkSoft}
              fontFamily="Inter, sans-serif"
              animate={reduceMotion ? {} : active ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {row.amt}
            </motion.text>
            <motion.rect
              x="205"
              y={y - 8}
              width="34"
              height="16"
              rx="8"
              fill={COLORS.successSoft}
              initial={{ opacity: 0.3 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: active ? [0.3, 1, 1] : [0.6, 1, 0.6] }}
              transition={{ duration: active ? 1.4 : 5, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}
            />
            <text x="222" y={y + 3} textAnchor="middle" fontSize="6.5" fontWeight={700} fill={COLORS.successDeep} fontFamily="Inter, sans-serif">
              Paid
            </text>
          </motion.g>
        );
      })}

      {/* paper register becoming digital */}
      <motion.g
        animate={reduceMotion ? {} : active ? { opacity: [0.6, 1, 0.6], y: [0, -3, 0] } : { opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: active ? 1.6 : 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="30" y="150" width="26" height="34" rx="2" fill="#F3F4F6" stroke={COLORS.border} />
        <line x1="34" y1="158" x2="52" y2="158" stroke={COLORS.border} strokeWidth="1" />
        <line x1="34" y1="164" x2="52" y2="164" stroke={COLORS.border} strokeWidth="1" />
        <line x1="34" y1="170" x2="52" y2="170" stroke={COLORS.border} strokeWidth="1" />
      </motion.g>

      <CommissionChip x={250} y={186} label="Settled" active={active} reduceMotion={reduceMotion} />
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* 5. Digital Payments                                                    */
/* ────────────────────────────────────────────────────────────────────── */

const DigitalPaymentsIllustration: React.FC<IllustrationProps> = ({ active, reduceMotion }) => {
  const standId = useGradId("stand");
  const walletId = useGradId("wallet");
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Digital payments QR stand illustration">
      <BackgroundWash color={COLORS.blue} />
      <defs>
        <GradTile id={standId} from={COLORS.blue} to={COLORS.blueDeep} />
        <GradTile id={walletId} from="#FFFFFF" to={COLORS.blueSoft} />
      </defs>

      <path d="M150 190 L128 60 L212 60 L190 190 Z" fill="#FBFBFF" stroke={COLORS.border} style={{ filter: "drop-shadow(0 10px 18px rgba(17,24,39,0.06))" }} />
      <rect x="98" y="185" width="144" height="7" rx="3.5" fill="#E5E7EB" />
      <rect x="136" y="70" width="68" height="20" rx="5" fill={`url(#${standId})`} style={{ filter: "drop-shadow(0 6px 12px rgba(59,91,255,0.28))" }} />
      <text x="170" y="84" textAnchor="middle" fontSize="9.5" fontWeight={700} fill="#FFFFFF" fontFamily="Inter, sans-serif">
        CASHLO
      </text>

      <motion.g
        animate={reduceMotion ? {} : { opacity: active ? [0.6, 1, 0.6] : [0.85, 1, 0.85], scale: active ? [1, 1.03, 1] : 1 }}
        style={{ transformOrigin: "170px 128px" }}
        transition={{ duration: active ? 1.2 : 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="140" y="100" width="60" height="60" rx="5" fill="#FFFFFF" stroke={COLORS.border} style={{ filter: "drop-shadow(0 6px 12px rgba(17,24,39,0.08))" }} />
        <rect x="149" y="109" width="42" height="42" rx="2" fill={COLORS.ink} />
      </motion.g>
      <text x="170" y="172" textAnchor="middle" fontSize="8.5" fontWeight={700} fill={COLORS.blue} fontFamily="Inter, sans-serif">
        SCAN &amp; PAY
      </text>

      <FloatingCoin cx={88} cy={182} r={17} active={active} reduceMotion={reduceMotion} />
      <FloatingCoin cx={88} cy={168} r={17} active={active} reduceMotion={reduceMotion} delay={0.15} />
      <FloatingCoin cx={88} cy={154} r={17} active={active} reduceMotion={reduceMotion} delay={0.3} />

      {/* money flying to wallet */}
      <motion.circle
        cx="150"
        cy="120"
        r="4.5"
        fill={COLORS.warning}
        style={{ filter: "drop-shadow(0 2px 4px rgba(217,127,6,0.4))" }}
        animate={
          reduceMotion
            ? { opacity: 0.7 }
            : active
            ? { x: [0, 100, 100], y: [0, -55, -55], opacity: [1, 1, 0] }
            : { opacity: [0.4, 0.8, 0.4] }
        }
        transition={{ duration: active ? 1.4 : 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <rect x="236" y="46" width="46" height="34" rx="6" fill={`url(#${walletId})`} stroke={COLORS.blue} strokeWidth="1" style={{ filter: "drop-shadow(0 8px 14px rgba(59,91,255,0.16))" }} />
      <text x="259" y="68" textAnchor="middle" fontSize="15">
        👛
      </text>

      <CommissionChip x={68} y={40} label="Instant" active={active} reduceMotion={reduceMotion} />
      <CommissionChip x={252} y={128} label="Settled" active={active} reduceMotion={reduceMotion} delay={0.3} />
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* 6. Loan Services                                                       */
/* ────────────────────────────────────────────────────────────────────── */

const LoanServicesIllustration: React.FC<IllustrationProps> = ({ active, reduceMotion }) => {
  const cardId = useGradId("loancard");
  const cashId = useGradId("cash");
  const fields = ["Personal Details", "Business Details", "KYC Verification", "Loan Amount"];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Loan application and approval illustration">
      <BackgroundWash color={COLORS.success} />
      <defs>
        <GradTile id={cardId} from="#FFFFFF" to="#F6FAF7" />
        <GradTile id={cashId} from="#86EFAC" to={COLORS.successDeep} />
      </defs>

      <rect x="66" y="42" width="120" height="136" rx="12" fill={`url(#${cardId})`} stroke={COLORS.border} strokeWidth="2" style={{ filter: "drop-shadow(0 14px 22px rgba(17,24,39,0.08))" }} />
      <text x="78" y="62" fontSize="8.5" fontWeight={700} fill={COLORS.blue} fontFamily="Inter, sans-serif">
        Loan Application
      </text>

      {fields.map((f, i) => {
        const y = 82 + i * 20;
        return (
          <motion.g
            key={f}
            initial={{ opacity: 0.3 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: active ? [0.3, 1, 1] : [0.7, 1, 0.7] }}
            transition={{ duration: active ? 1.2 : 5, delay: i * (active ? 0.2 : 0.15), repeat: Infinity, ease: "easeInOut" }}
          >
            <text x="78" y={y} fontSize="7" fill={COLORS.inkSoft} fontFamily="Inter, sans-serif">
              {f}
            </text>
            <CheckBadge cx={168} cy={y - 3} r={6} active={active} reduceMotion={reduceMotion} delay={0.5 + i * 0.1} />
          </motion.g>
        );
      })}

      <motion.rect
        x="78"
        y="158"
        width="96"
        height="16"
        rx="8"
        fill={COLORS.blue}
        style={{ transformOrigin: "126px 166px" }}
        animate={reduceMotion ? {} : active ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="126" y="169" textAnchor="middle" fontSize="7.5" fontWeight={700} fill="#FFFFFF" fontFamily="Inter, sans-serif">
        Submit
      </text>

      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : active
            ? { opacity: 1, scale: [0.95, 1, 0.95] }
            : { opacity: [0.7, 1, 0.7], scale: 1 }
        }
        transition={{ duration: active ? 1.6 : 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="200" y="52" width="98" height="48" rx="10" fill={COLORS.successSoft} stroke={COLORS.success} strokeWidth="1" style={{ filter: "drop-shadow(0 10px 16px rgba(21,163,74,0.12))" }} />
        <text x="249" y="73" textAnchor="middle" fontSize="8.5" fontWeight={700} fill={COLORS.successDeep} fontFamily="Inter, sans-serif">
          Loan Approved!
        </text>
        <CheckBadge cx={249} cy={86} r={8} active={active} reduceMotion={reduceMotion} />
      </motion.g>

      {/* growing money stack */}
      <motion.g
        animate={
          reduceMotion
            ? {}
            : active
            ? { y: [8, -6, -6], opacity: [0.5, 1, 1] }
            : { y: [0, -1.5, 0] }
        }
        transition={{ duration: active ? 1.8 : 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="210" y="132" width="70" height="18" rx="3" fill={`url(#${cashId})`} opacity={0.85} style={{ filter: "drop-shadow(0 4px 8px rgba(21,163,74,0.2))" }} />
        <rect x="215" y="124" width="70" height="18" rx="3" fill={`url(#${cashId})`} opacity={0.92} style={{ filter: "drop-shadow(0 4px 8px rgba(21,163,74,0.2))" }} />
        <rect x="220" y="116" width="70" height="18" rx="3" fill={`url(#${cashId})`} style={{ filter: "drop-shadow(0 4px 8px rgba(21,163,74,0.2))" }} />
      </motion.g>

      <CommissionChip x={252} y={188} label="+₹120" active={active} reduceMotion={reduceMotion} />
    </svg>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* Card data                                                              */
/* ────────────────────────────────────────────────────────────────────── */

interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  Illustration: React.FC<IllustrationProps>;
  Icon: IconComponent;
  accent: string;
  accentSoft: string;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    id: "upi-cash-point",
    title: "UPI Cash Point",
    description: "Let customers withdraw cash at your counter and earn a commission on every eligible transaction.",
    Illustration: UpiCashPointIllustration,
    Icon: WalletCards,
    accent: COLORS.blue,
    accentSoft: COLORS.blueSoft,
  },
  {
    id: "recharge-bill-payments",
    title: "Recharge & Bill Payments",
    description: "Offer mobile, DTH, electricity, water, gas and FASTag payments — earn on every transaction you process.",
    Illustration: RechargeIllustration,
    Icon: Smartphone,
    accent: COLORS.indigo,
    accentSoft: COLORS.indigoSoft,
  },
  {
    id: "gst-accounting",
    title: "GST & Accounting",
    description: "Handle GST registration, filings and ITR from one dashboard — no paperwork, no back-and-forth.",
    Illustration: GstIllustration,
    Icon: FileSpreadsheet,
    accent: COLORS.success,
    accentSoft: COLORS.successSoft,
  },
  {
    id: "quick-khata",
    title: "Quick Khata",
    description: "Track customer and supplier credit digitally, and finally retire the paper register.",
    Illustration: QuickKhataIllustration,
    Icon: BookOpenText,
    accent: COLORS.warning,
    accentSoft: COLORS.warningSoft,
  },
  {
    id: "digital-payments",
    title: "Digital Payments",
    description: "Accept payments from any UPI app with a dynamic QR code and instant settlement to your account.",
    Illustration: DigitalPaymentsIllustration,
    Icon: QrCode,
    accent: COLORS.blue,
    accentSoft: COLORS.blueSoft,
  },
  {
    id: "loan-services",
    title: "Loan Services",
    description: "Help customers access personal and business loans in minutes, and earn commission on every approval.",
    Illustration: LoanServicesIllustration,
    Icon: Landmark,
    accent: COLORS.success,
    accentSoft: COLORS.successSoft,
  },
];

/* ────────────────────────────────────────────────────────────────────── */
/* Floating hover particles                                               */
/* ────────────────────────────────────────────────────────────────────── */

const PARTICLE_POSITIONS = [
  { left: "14%", top: "20%", size: 4, delay: 0 },
  { left: "82%", top: "16%", size: 3, delay: 0.3 },
  { left: "26%", top: "78%", size: 3.5, delay: 0.6 },
  { left: "70%", top: "72%", size: 4, delay: 0.9 },
  { left: "50%", top: "10%", size: 3, delay: 0.45 },
];

const HoverParticles: React.FC<{ color: string }> = ({ color }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {PARTICLE_POSITIONS.map((p, i) => (
      <motion.span
        key={i}
        className="absolute rounded-full"
        style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: color }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 0.8, 0], y: -26 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2.2, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
      />
    ))}
  </div>
);

/* ────────────────────────────────────────────────────────────────────── */
/* FeatureCard — parallax tilt + hover state                              */
/* ────────────────────────────────────────────────────────────────────── */

const cardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 2px 8px rgba(17, 24, 39, 0.04), 0 1px 2px rgba(17, 24, 39, 0.03)",
  },
  hover: {
    y: -8,
    scale: 1.03,
    boxShadow: "0 28px 56px rgba(17, 24, 39, 0.14), 0 10px 20px rgba(17, 24, 39, 0.07)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

/** Converts a "#RRGGBB" hex string to an "r, g, b" triplet for use in rgba(). */
function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/** Rounds to avoid cross-engine floating-point drift causing hydration mismatches. */
function round(n: number, decimals = 3): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/** Hover state for the 44×44 title icon: scale 1.08, lifts 3px, soft glow — spring, ~250ms. */
const iconTransition = { type: "spring" as const, stiffness: 380, damping: 22, mass: 0.6 };

const FeatureCard: React.FC<{ card: FeatureCardData }> = ({ card }) => {
  const [hovered, setHovered] = useState(false);
  const userReduceMotion = !!useReducedMotion();
  const { Illustration } = card;
  const ref = useRef<HTMLDivElement>(null);

  // Parallax tilt driven by pointer position within the card.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), springConfig);
  const illustrationX = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), springConfig);
  const illustrationY = useSpring(useTransform(rawY, [-0.5, 0.5], [-4, 4]), springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (userReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card"
      style={{
        perspective: 900,
        rotateX: userReduceMotion ? 0 : rotateX,
        rotateY: userReduceMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      variants={cardVariants}
      initial="rest"
      animate={hovered ? "hover" : "rest"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => {
        setHovered(false);
        resetTilt();
      }}
      onPointerMove={handlePointerMove}
      onFocus={() => setHovered(true)}
      onBlur={() => {
        setHovered(false);
        resetTilt();
      }}
      tabIndex={0}
    >
      <AnimatePresence>{hovered && !userReduceMotion && <HoverParticles color={card.accent} />}</AnimatePresence>

      {/* Illustration zone — deliberately stays light in both themes; the
          illustrations' internal shading assumes a white backdrop */}
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-white p-6 sm:aspect-[3/2]">
        <motion.div
          className="h-full w-full"
          style={{
            x: userReduceMotion ? 0 : illustrationX,
            y: userReduceMotion ? 0 : illustrationY,
          }}
        >
          {/* Static until hovered/focused — only the active card animates,
              so idle cards run zero Framer Motion loops. */}
          <Illustration active={hovered} reduceMotion={userReduceMotion || !hovered} />
        </motion.div>
      </div>

      {/* Copy zone — 35% */}
      <div className="flex flex-1 flex-col gap-3 border-t border-border px-6 py-6">
        <div className="flex items-center gap-3">
          <motion.span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
            style={{ backgroundColor: card.accentSoft }}
            animate={{
              y: hovered ? -3 : 0,
              scale: hovered ? 1.08 : 1,
              boxShadow: hovered
                ? `0 6px 16px rgba(${hexToRgbTriplet(card.accent)}, 0.28)`
                : `0 0px 0px rgba(${hexToRgbTriplet(card.accent)}, 0)`,
            }}
            transition={iconTransition}
          >
            <card.Icon size={23} strokeWidth={1.75} color={card.accent} aria-hidden="true" />
          </motion.span>
          <h3 className="text-lg font-semibold leading-tight text-ink">
            {card.title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-ink/60">
          {card.description}
        </p>
      </div>
    </motion.div>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* Section                                                                */
/* ────────────────────────────────────────────────────────────────────── */

const PaymentAppFeatures: React.FC = () => {
  return (
    <section className="w-full bg-bg py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="text-xs font-bold tracking-[0.12em]" style={{ color: COLORS.blue }}>
            HAR DUKAAN KI EXTRA INCOME
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            More Than Just a Payment App
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/60 sm:text-lg">
            Most payment apps help you accept money.
            <br className="hidden sm:block" /> Cashlo helps you earn money from every transaction.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentAppFeatures;
