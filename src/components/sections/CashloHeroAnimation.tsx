"use client";

/**
 * CashloHeroAnimation
 * -------------------
 * Premium, looping SVG explainer for the Cashlo UPI CashPoint hero.
 *
 * Story (≈10s loop):
 *   phone enters → QR scan → UPI transfer → processing → success
 *   → cash drawer opens → ₹500/₹200/₹100 fly out → "₹2,000 Withdrawn Successfully"
 *
 * Notes:
 *   - Transparent background. Drop it straight into the right column of the hero.
 *   - All motion is transform/opacity only (GPU friendly, no layout thrash).
 *   - Pauses completely when scrolled out of view (IntersectionObserver).
 *   - Renders a calm, final-state composition when prefers-reduced-motion is set.
 */

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

const BLUE = "#3B5BFF";
const BLUE_DEEP = "#1E37C4";
const BLUE_SOFT = "#8FA3FF";
const BLUE_100 = "#DDE3FF";
const BLUE_50 = "#EEF1FF";
const INK = "#161C42";
const GREEN = "#16A34A";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

type SceneKey =
  | "enter"
  | "scan"
  | "transfer"
  | "processing"
  | "success"
  | "cash"
  | "badge";

const SCENES: { key: SceneKey; ms: number }[] = [
  { key: "enter", ms: 1200 },
  { key: "scan", ms: 1800 },
  { key: "transfer", ms: 1500 },
  { key: "processing", ms: 1400 },
  { key: "success", ms: 1000 },
  { key: "cash", ms: 1900 },
  { key: "badge", ms: 1600 },
];
const ORDER = SCENES.map((s) => s.key);

const STATUS: Partial<Record<SceneKey, string>> = {
  scan: "Scanning Cashlo QR",
  transfer: "Sending ₹2,000",
  processing: "Processing payment",
  success: "Payment successful",
  cash: "Dispensing cash",
  badge: "Collect your cash",
};

/* Sampled points along the phone → QR flow curve */
const FLOW_X = [206, 248, 293, 342, 396];
const FLOW_Y = [244, 228, 208, 188, 172];

/* QR data modules (9×9 grid, finder patterns excluded) */
const QR_MODULES: [number, number][] = [
  [3, 0], [5, 0], [4, 1], [3, 2], [5, 2],
  [0, 3], [2, 3], [4, 3], [6, 3], [7, 3],
  [1, 4], [3, 4], [6, 4], [8, 4],
  [0, 5], [2, 5], [4, 5], [5, 5], [8, 5],
  [3, 6], [6, 6], [8, 6],
  [5, 7], [8, 7],
  [3, 8], [4, 8], [6, 8], [7, 8],
];

const NOTES: { value: string; dx: number; dy: number; rot: number; delay: number }[] = [
  { value: "₹500", dx: -232, dy: -46, rot: -12, delay: 0 },
  { value: "₹200", dx: -252, dy: 4, rot: 6, delay: 0.14 },
  { value: "₹100", dx: -214, dy: 50, rot: -5, delay: 0.28 },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type CashloHeroAnimationProps = {
  className?: string;
  style?: CSSProperties;
};

export default function CashloHeroAnimation({
  className = "",
  style,
}: CashloHeroAnimationProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);
  const prefersReduced = useReducedMotion();

  /* Pause when off-screen */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = inView && !prefersReduced;

  /* Advance the timeline */
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => setStep((s) => (s + 1) % SCENES.length),
      SCENES[step].ms
    );
    return () => clearTimeout(id);
  }, [playing, step]);

  const scene: SceneKey = prefersReduced ? "badge" : SCENES[step].key;
  const at = ORDER.indexOf(scene);
  const from = (name: SceneKey) => at >= ORDER.indexOf(name);
  const entering = scene === "enter";

  /* Snap (no travel) while the loop resets */
  const settle = <T extends object>(t: T): T | { duration: 0 } =>
    entering ? { duration: 0 } : t;

  const screen = useMemo(() => {
    if (from("cash")) return "amount";
    if (from("success")) return "success";
    if (from("processing")) return "processing";
    return "scanner";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const scanning = scene === "scan" || scene === "transfer";
  const drawerOpen = from("cash");

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width: "100%", maxWidth: 460, margin: "0 auto", ...style }}
    >
      <svg
        viewBox="0 0 600 500"
        role="img"
        aria-label="A customer scans the Cashlo QR with a UPI app, the payment succeeds, and the merchant's drawer opens to hand over ₹2,000 in cash."
        style={{
            width: "100%",
            height: "auto",
            display: "block",
            overflow: "visible",
            fontFamily: 'var(--font-d, "Poppins", sans-serif)',
          }}
      >
        <defs>
          <linearGradient id="cl-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6C86FF" />
            <stop offset="100%" stopColor={BLUE} />
          </linearGradient>

          <linearGradient id="cl-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0" />
            <stop offset="55%" stopColor={BLUE} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>

          <radialGradient id="cl-glow">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </radialGradient>

          <filter id="cl-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor={BLUE_DEEP} floodOpacity="0.12" />
          </filter>

          <filter id="cl-shadow-sm" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor={BLUE_DEEP} floodOpacity="0.14" />
          </filter>

          <clipPath id="cl-qr-clip">
            <rect x="420" y="114" width="90" height="90" rx="6" />
          </clipPath>
        </defs>

        {/* ---------------- ambient glow ---------------- */}
        <ellipse cx="465" cy="200" rx="185" ry="185" fill="url(#cl-glow)" />
        <ellipse cx="140" cy="250" rx="150" ry="160" fill="url(#cl-glow)" opacity="0.7" />

        {/* ---------------- flow curve ---------------- */}
        <motion.path
          d="M206 244 C 260 226 320 190 396 172"
          fill="none"
          stroke={BLUE}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="2 8"
          initial={false}
          animate={{ pathLength: scanning || from("processing") ? 1 : 0, opacity: scanning ? 0.55 : 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />

        {/* ================= MERCHANT: QR STAND ================= */}
        <motion.g
          initial={false}
          animate={entering ? { opacity: [0, 1], scale: [0.94, 1] } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ transformOrigin: "465px 200px" }}
        >
          {/* ripples */}
          {playing && scanning &&
            [0, 0.6, 1.2].map((delay) => (
              <motion.circle
                key={delay}
                cx="465"
                cy="159"
                r="46"
                fill="none"
                stroke={BLUE}
                strokeWidth="1.6"
                initial={{ scale: 0.85, opacity: 0.45 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeOut" }}
                style={{ transformOrigin: "465px 159px" }}
              />
            ))}

          <motion.g
            animate={playing ? { y: [0, -5, 0] } : { y: 0 }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* card */}
            <motion.rect
              x="398" y="96" width="134" height="162" rx="18"
              fill="#FFFFFF" stroke={BLUE_100} strokeWidth="1.5"
              filter="url(#cl-shadow)"
              animate={{ stroke: scanning ? BLUE : BLUE_100 }}
              transition={{ duration: 0.5 }}
            />

            {/* QR */}
            <g>
              {/* finder patterns */}
              {[[420, 114], [480, 114], [420, 174]].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <rect x={x} y={y} width="30" height="30" rx="7" fill="none" stroke={INK} strokeWidth="3.5" />
                  <rect x={x + 9} y={y + 9} width="12" height="12" rx="3" fill={BLUE} />
                </g>
              ))}
              {/* data modules */}
              {QR_MODULES.map(([c, r]) => (
                <rect
                  key={`${c}-${r}`}
                  x={421 + c * 10}
                  y={115 + r * 10}
                  width="8"
                  height="8"
                  rx="2"
                  fill={INK}
                  opacity="0.65"
                />
              ))}

              {/* scan beam */}
              <g clipPath="url(#cl-qr-clip)">
                <AnimatePresence>
                  {playing && scanning && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.g
                        animate={{ y: [0, 90, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <rect x="420" y="76" width="90" height="38" fill="url(#cl-beam)" />
                        <rect x="420" y="112" width="90" height="2" rx="1" fill={BLUE} />
                      </motion.g>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            </g>

            {/* corner brackets */}
            <motion.g
              stroke={BLUE}
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: scanning ? 1 : 0.25 }}
              transition={{ duration: 0.4 }}
            >
              <path d="M412 122 v-8 a4 4 0 0 1 4 -4 h8" />
              <path d="M518 122 v-8 a4 4 0 0 0 -4 -4 h-8" />
              <path d="M412 196 v8 a4 4 0 0 0 4 4 h8" />
              <path d="M518 196 v8 a4 4 0 0 1 -4 4 h-8" />
            </motion.g>

            {/* card label */}
            <text x="465" y="227" textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
            Cashlo
            </text>
            <text x="465" y="242" textAnchor="middle" fontSize="8.5" fontWeight="500" fill={BLUE} letterSpacing="1.1">
            UPI CASHPOINT
            </text>
          </motion.g>

          {/* stand */}
          <path d="M465 258 L465 314" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="465" cy="317" rx="44" ry="8" fill={BLUE_50} stroke={INK} strokeWidth="2" />
        </motion.g>

        {/* ---------------- digital particles ---------------- */}
        {playing && scene === "transfer" &&
          Array.from({ length: 9 }).map((_, i) => (
            <motion.g
              key={i}
              initial={{ x: FLOW_X[0], y: FLOW_Y[0], opacity: 0 }}
              animate={{
                x: FLOW_X,
                y: FLOW_Y.map((v, k) => v + (i % 3 === 0 ? -6 : i % 3 === 1 ? 0 : 7) * (1 - k / 4)),
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 1.05,
                delay: i * 0.11,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <circle r={i % 3 === 1 ? 4 : 2.8} fill={i % 2 ? BLUE : BLUE_SOFT} />
            </motion.g>
          ))}

        {/* ================= MERCHANT: COUNTER + DRAWER ================= */}
        <motion.g
          initial={false}
          animate={entering ? { opacity: [0, 1], y: [14, 0] } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: entering ? 0.1 : 0 }}
        >
          <rect x="366" y="322" width="196" height="104" rx="16" fill="#FFFFFF" stroke={INK} strokeWidth="2" />
          <path d="M366 350 H562" stroke={BLUE_100} strokeWidth="1.6" />

          {/* cash stacked inside, revealed as the drawer slides out */}
          <motion.g
            initial={false}
            animate={{ opacity: drawerOpen ? 1 : 0 }}
            transition={settle({ duration: 0.3, delay: drawerOpen ? 0.18 : 0 })}
          >
            {[0, 1, 2].map((i) => (
              <rect
                key={i}
                x={392 + i * 54}
                y="358"
                width="46"
                height="12"
                rx="3"
                fill={BLUE_50}
                stroke={BLUE_SOFT}
                strokeWidth="1.4"
              />
            ))}
          </motion.g>

          {/* drawer face */}
          <motion.g
            initial={false}
            animate={{ y: drawerOpen ? 20 : 0 }}
            transition={settle({ type: "spring", stiffness: 120, damping: 16 })}
          >
            <rect x="380" y="362" width="168" height="50" rx="12" fill={BLUE_50} stroke={INK} strokeWidth="2" />
            <rect x="440" y="383" width="48" height="7" rx="3.5" fill={BLUE} />
          </motion.g>
        </motion.g>

        {/* ================= CASH NOTES ================= */}
        {NOTES.map((note) => (
          <motion.g
            key={note.value}
            initial={false}
            animate={
              drawerOpen
                ? { x: note.dx, y: note.dy, rotate: note.rot, opacity: 1, scale: 1 }
                : { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.9 }
            }
            transition={settle({
              type: "spring",
              stiffness: 55,
              damping: 15,
              delay: drawerOpen ? 0.28 + note.delay : 0,
            })}
            style={{ transformOrigin: "465px 380px" }}
          >
            <g transform="translate(430, 360)" filter="url(#cl-shadow-sm)">
              <rect width="72" height="42" rx="7" fill="#FFFFFF" stroke={BLUE} strokeWidth="1.6" />
              <rect x="7" y="7" width="58" height="28" rx="4" fill="none" stroke={BLUE_100} strokeWidth="1.2" />
              <circle cx="20" cy="21" r="7.5" fill="none" stroke={BLUE_SOFT} strokeWidth="1.4" />
              <text x="46" y="26" textAnchor="middle" fontSize="14" fontWeight="700" fill={BLUE}>
                {note.value}
              </text>
            </g>
          </motion.g>
        ))}

        {/* ================= CUSTOMER: HAND + PHONE ================= */}
        <motion.g
          initial={false}
          animate={entering ? { x: [-80, 0], opacity: [0, 1] } : { x: 0, opacity: 1 }}
          transition={{ duration: 0.95, ease: EASE }}
        >
          <motion.g
            animate={playing ? { y: [0, -7, 0] } : { y: 0 }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* sleeve + palm */}
            <path d="M101 412 L90 500 L192 500 L181 412 Z" fill={BLUE_50} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <path d="M95 452 Q141 462 187 452" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
            <path
              d="M92 342 C92 396 110 420 141 420 C172 420 190 396 190 342"
              fill="#F5F7FF"
              stroke={INK}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* phone */}
            <rect x="78" y="126" width="124" height="236" rx="24" fill="#FFFFFF" stroke={INK} strokeWidth="2.4" filter="url(#cl-shadow)" />
            <rect x="88" y="138" width="104" height="212" rx="16" fill="#FFFFFF" stroke={BLUE_100} strokeWidth="1.4" />
            <rect x="126" y="131" width="28" height="4" rx="2" fill={BLUE_100} />
            <rect x="122" y="343" width="36" height="3" rx="1.5" fill={BLUE_100} />

            {/* screen content */}
            <AnimatePresence mode="wait">
              <motion.g
                key={screen}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                {screen === "scanner" && <ScannerScreen playing={playing && scanning} />}
                {screen === "processing" && <ProcessingScreen playing={playing} />}
                {screen === "success" && <SuccessScreen />}
                {screen === "amount" && <AmountScreen />}
              </motion.g>
            </AnimatePresence>

            {/* thumb, over the phone edge */}
            <rect
              x="68" y="292" width="24" height="56" rx="12"
              fill="#F5F7FF" stroke={INK} strokeWidth="2"
              transform="rotate(-8 80 320)"
            />
          </motion.g>
        </motion.g>

        {/* ================= STATUS PILL ================= */}
        <AnimatePresence>
          {from("scan") && (
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <rect
                x="360" y="446" width="204" height="46" rx="23"
                fill="#FFFFFF" stroke={BLUE_100} strokeWidth="1.5"
                filter="url(#cl-shadow-sm)"
              />
              {from("success") ? (
                <g>
                  <circle cx="390" cy="469" r="10" fill={GREEN} />
                  <path d="M385.5 469 l3.2 3.4 l6 -6.6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ) : (
                <motion.g
                  animate={playing ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "390px 469px" }}
                >
                  <circle cx="390" cy="469" r="9" fill="none" stroke={BLUE_100} strokeWidth="2.6" />
                  <path d="M390 460 a9 9 0 0 1 9 9" fill="none" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
                </motion.g>
              )}
              <text x="410" y="474" fontSize="13.5" fontWeight="600" fill={INK}>
                {STATUS[scene] ?? STATUS.badge}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* ================= SUCCESS BADGE ================= */}
        <AnimatePresence>
          {from("cash") && (
            <motion.g
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <motion.g
                animate={playing ? { y: [0, -6, 0] } : { y: 0 }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <rect
                  x="150" y="18" width="300" height="54" rx="27"
                  fill="#FFFFFF" stroke={BLUE_100} strokeWidth="1.5"
                  filter="url(#cl-shadow)"
                />
                <circle cx="184" cy="45" r="14" fill={GREEN} />
                <motion.path
                  d="M178 45.2 l4.4 4.6 l8 -9"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
                />
                <text x="208" y="51" fontSize="16" fontWeight="700" fill={INK}>
                  ₹2,000 Withdrawn Successfully
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone screens                                                       */
/* ------------------------------------------------------------------ */

function ScannerScreen({ playing }: { playing: boolean }) {
  return (
    <g>

      {/* viewfinder */}
      <g stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M108 196 v-10 a6 6 0 0 1 6 -6 h10" />
        <path d="M172 196 v-10 a6 6 0 0 0 -6 -6 h-10" />
        <path d="M108 252 v10 a6 6 0 0 0 6 6 h10" />
        <path d="M172 252 v10 a6 6 0 0 1 -6 -6 h-10" />
      </g>

      {/* mini QR in frame */}
      <g opacity="0.9">
        {[[116, 188], [150, 188], [116, 222]].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="14" height="14" rx="3.5" fill="none" stroke={INK} strokeWidth="2" />
            <rect x={x + 4.5} y={y + 4.5} width="5" height="5" rx="1.5" fill={BLUE} />
          </g>
        ))}
        {[[136, 206], [150, 210], [158, 224], [140, 232], [154, 240], [126, 244], [166, 200]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="6" height="6" rx="1.5" fill={INK} opacity="0.8" />
        ))}
      </g>

      {playing && (
        <motion.rect
          x="110" y="188" width="60" height="2" rx="1" fill={BLUE}
          animate={{ y: [0, 66, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <text x="140" y="296" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={INK} opacity="0.75">
        Scan to withdraw cash
      </text>
    </g>
  );
}

function ProcessingScreen({ playing }: { playing: boolean }) {
  return (
    <g>
      <motion.g
        animate={playing ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "140px 214px" }}
      >
        <circle cx="140" cy="214" r="22" fill="none" stroke={BLUE_100} strokeWidth="4" />
        <path d="M140 192 a22 22 0 0 1 22 22" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <text x="140" y="264" textAnchor="middle" fontSize="11" fontWeight="600" fill={INK}>
        Processing ₹2,000
      </text>
      <rect x="104" y="280" width="72" height="6" rx="3" fill={BLUE_50} />
      <rect x="116" y="294" width="48" height="6" rx="3" fill={BLUE_50} />
    </g>
  );
}

function SuccessScreen() {
  return (
    <g>
      <circle cx="140" cy="212" r="26" fill={BLUE_50} />
      <motion.path
        d="M129 212.5 l7.5 7.8 l14 -15.6"
        fill="none"
        stroke={GREEN}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
      />
      <text x="140" y="266" textAnchor="middle" fontSize="11" fontWeight="700" fill={INK}>
        Payment successful
      </text>
      <text x="140" y="282" textAnchor="middle" fontSize="9.5" fill={INK} opacity="0.55">
        UPI · Cashlo Merchant
      </text>
    </g>
  );
}

function AmountScreen() {
  return (
    <g>
      <text x="140" y="204" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={BLUE} letterSpacing="1.2">
        PAID VIA UPI
      </text>
      <text x="140" y="240" textAnchor="middle" fontSize="28" fontWeight="700" fill={INK}>
        ₹2,000
      </text>
      <rect x="102" y="258" width="76" height="1.4" fill={BLUE_100} />
      <text x="140" y="278" textAnchor="middle" fontSize="10" fill={INK} opacity="0.6">
        Collect cash at counter
      </text>
      <rect x="106" y="292" width="68" height="22" rx="11" fill={BLUE_50} />
      <text x="140" y="307" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={BLUE}>
        Cashlo
      </text>
    </g>
  );
}