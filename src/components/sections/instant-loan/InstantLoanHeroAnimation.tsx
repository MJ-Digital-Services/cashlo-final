"use client";

/**
 * InstantLoanHeroAnimation
 * -------------------------------------------------------------------------
 * Premium fintech motion graphic for the Cashlo "Instant Loan" hero.
 * Renders on a transparent background with no card or container of its own.
 * Everything is drawn with SVG + DOM. No images, GIFs or video.
 * Pauses when scrolled out of view; collapses to a single static frame
 * when the visitor prefers reduced motion.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ─────────────────────────────  tokens  ───────────────────────────── */

const BLUE = "#3B5BFF";
const BLUE_DEEP = "#1E36C7";
const GREEN = "#10B981";
/* Theme-aware — resolved from CSS variables so dark mode just works. */
const BLUE_SOFT = "var(--clh-blue-soft)";
const INK = "var(--clh-ink)";
const MUTE = "var(--clh-mute)";
const LINE = "var(--clh-line)";

/** Fixed design canvas — the whole scene is scaled to fit its parent. */
const CANVAS_W = 520;
const CANVAS_H = 620;

const PHONE = { x: 131, y: 46, w: 258, h: 528 };
const BEZEL = 10;
const SCREEN_W = PHONE.w - BEZEL * 2;
const SCREEN_H = PHONE.h - BEZEL * 2;

type SceneId =
  | "dashboard"
  | "form"
  | "amount"
  | "eligibility"
  | "approved"
  | "disbursed"
  | "commission";

/** One full story = 11.9s. */
const SCENES: { id: SceneId; ms: number }[] = [
  { id: "dashboard", ms: 1300 },
  { id: "form", ms: 2300 },
  { id: "amount", ms: 1800 },
  { id: "eligibility", ms: 1800 },
  { id: "approved", ms: 1500 },
  { id: "disbursed", ms: 1400 },
  { id: "commission", ms: 1800 },
];

const LOAN_MIN = 20000;
const LOAN_MAX = 200000;
const COMMISSION = 2500;

const inr = (n: number) => "₹" + new Intl.NumberFormat("en-IN").format(Math.round(n));

/** EMI at 14% p.a. over 24 months. */
const emiFor = (p: number) => {
  const r = 0.14 / 12;
  const n = 24;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

/* ─────────────────────────────  hooks  ────────────────────────────── */

/** True while at least a third of the node is on screen. */
function useInView(ref: RefObject<HTMLDivElement | null>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

/** Scales the fixed canvas down to whatever width the hero column gives us. */
function useCanvasScale(ref: RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const w = node.getBoundingClientRect().width;
      if (w) setScale(Math.min(1, w / CANVAS_W));
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

/** Advances through SCENES; freezes entirely while `running` is false. */
function useSceneLoop(running: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % SCENES.length),
      SCENES[index].ms
    );
    return () => clearTimeout(t);
  }, [index, running]);
  return index;
}

/** Milliseconds elapsed inside the current scene — drives the choreography. */
function useSceneClock(sceneIndex: number, running: boolean) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!running) {
      setMs(9999); // frozen → show every scene in its finished state
      return;
    }
    let raf: number;
    let start: number | undefined;
    const step = (t: number) => {
      if (start === undefined) start = t;
      setMs(t - start);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [sceneIndex, running]);
  return ms;
}

/* ──────────────────────────  small helpers  ───────────────────────── */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Progress 0→1 for a segment of the scene timeline. */
const seg = (ms: number, start: number, duration: number) => clamp01((ms - start) / duration);

/** Reveals `text` one character at a time. */
const typed = (text: string, ms: number, start: number, charMs: number) =>
  text.slice(0, Math.max(0, Math.floor((ms - start) / charMs)));

const enter = {
  initial: { opacity: 0, scale: 1.03, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.97, filter: "blur(8px)" },
  transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
};

/* ─────────────────────────────  icons  ────────────────────────────── */

type IconName =
  | "rupee"
  | "coins"
  | "wallet"
  | "shield"
  | "bank"
  | "score"
  | "doc"
  | "approved"
  | "growth"
  | "commission";

const Ic: Record<IconName, React.ReactNode> = {
  rupee: <path d="M6 3h12M6 8h12M16 3c0 4-3 5-6 5h-1l7 8" />,
  coins: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="3" />
      <path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      <path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  wallet: (
    <>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1" />
      <path d="M3 7.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2.5" />
      <path d="M20 9.5h-4a2.5 2.5 0 0 0 0 5h4z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5.5c0 4.2-2.9 7.6-7 8.5-4.1-.9-7-4.3-7-8.5V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9.5L12 4l9 5.5" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 20h18" />
    </>
  ),
  score: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16l4-4" />
      <path d="M4 19h16" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  approved: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.2l2.4 2.4 4.6-5" />
    </>
  ),
  growth: (
    <>
      <path d="M4 17l5.5-5.5 3.5 3.5L20 8" />
      <path d="M15 8h5v5" />
    </>
  ),
  commission: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 8.5h5M9.5 11.5h5M13 8.5c0 2.6-1.9 3-3.5 3l4 4.5" />
    </>
  ),
};

function Glyph({
  name,
  size = 20,
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {Ic[name]}
    </svg>
  );
}

/* ───────────────────────  floating ecosystem  ─────────────────────── */

const ORBIT: { name: IconName; x: number; y: number; d: number; delay: number; drift: number }[] = [
  { name: "rupee", x: 58, y: 120, d: 5.6, delay: 0.0, drift: 6 },
  { name: "coins", x: 44, y: 262, d: 6.4, delay: 0.7, drift: -5 },
  { name: "wallet", x: 66, y: 400, d: 5.2, delay: 1.4, drift: 5 },
  { name: "shield", x: 104, y: 528, d: 6.8, delay: 0.4, drift: -4 },
  { name: "growth", x: 96, y: 34, d: 6.0, delay: 1.1, drift: 5 },
  { name: "bank", x: 462, y: 120, d: 6.2, delay: 0.2, drift: -6 },
  { name: "score", x: 476, y: 262, d: 5.4, delay: 0.9, drift: 5 },
  { name: "doc", x: 454, y: 400, d: 6.6, delay: 1.6, drift: -5 },
  { name: "approved", x: 416, y: 528, d: 5.8, delay: 0.5, drift: 4 },
  { name: "commission", x: 424, y: 34, d: 6.4, delay: 1.3, drift: -5 },
];

function OrbitChip({
  item,
  index,
  animate,
}: {
  item: (typeof ORBIT)[number];
  index: number;
  animate: boolean;
}) {
  const size = 46;
  return (
    <motion.div
      className="clh-chip"
      style={{
        position: "absolute",
        left: item.x - size / 2,
        top: item.y - size / 2,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}
        animate={
          animate
            ? { y: [0, -11, 0], x: [0, item.drift, 0] }
            : { y: 0, x: 0 }
        }
        transition={
          animate
            ? {
                duration: item.d,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : { duration: 0 }
        }
      >
        <Glyph name={item.name} />
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────  phone UI  ──────────────────────────── */

function ScreenHeader({ title, step }: { title: string; step?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 4px 12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            background: `linear-gradient(140deg, ${BLUE}, ${BLUE_DEEP})`,
          }}
        />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: INK, letterSpacing: "-0.01em" }}>
          {title}
        </span>
      </div>
      {step ? (
        <span style={{ fontSize: 10, fontWeight: 600, color: MUTE, letterSpacing: "0.06em" }}>
          {step}
        </span>
      ) : null}
    </div>
  );
}

function Field({ label, value, caret }: { label: string; value: string; caret?: boolean }) {
  return (
    <div
      style={{
        border: `1px solid ${LINE}`,
        borderRadius: 10,
        padding: "7px 10px",
        background: "#fff",
        minHeight: 40,
      }}
      className="clh-surface"
    >
      <div style={{ fontSize: 8.5, fontWeight: 600, color: MUTE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: INK, marginTop: 2, minHeight: 14 }}>
        {value}
        {caret ? <span className="clh-caret" /> : null}
      </div>
    </div>
  );
}

/* Scene 1 — Dashboard */
function DashboardScene({ ms }: { ms: number }) {
  return (
    <div>
      <ScreenHeader title="Cashlo" step="LOANS" />
      <div
        style={{
          borderRadius: 16,
          padding: "14px 15px",
          background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DEEP} 100%)`,
          color: "#fff",
          boxShadow: `0 14px 30px -14px ${BLUE}80`,
        }}
      >
        <div style={{ fontSize: 9.5, opacity: 0.82, letterSpacing: "0.08em", fontWeight: 600 }}>
          PRE-APPROVED LIMIT
        </div>
        <div style={{ fontSize: 25, fontWeight: 700, marginTop: 4, letterSpacing: "-0.02em" }}>
          {inr(LOAN_MAX)}
        </div>
        <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>
          Personal &amp; business loans
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
        {(
          [
            ["Same-day", "Approval"],
            ["Basic KYC", "Documents"],
          ] as [string, string][]
        ).map(([a, b]) => (
          <div
            key={a}
            className="clh-surface"
            style={{ border: `1px solid ${LINE}`, borderRadius: 11, padding: "9px 10px" }}
          >
            <div style={{ fontSize: 11.5, fontWeight: 700, color: INK }}>{a}</div>
            <div style={{ fontSize: 9.5, color: MUTE, marginTop: 1 }}>{b}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", marginTop: 18 }}>
        <motion.div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 16,
            border: `2px solid ${BLUE}`,
          }}
          animate={{ opacity: [0.45, 0, 0.45], scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{
            position: "relative",
            borderRadius: 12,
            background: BLUE,
            color: "#fff",
            textAlign: "center",
            padding: "12px 0",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            boxShadow: `0 12px 26px -12px ${BLUE}`,
          }}
          animate={{ scale: ms > 950 ? 0.965 : 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          Apply for loan
        </motion.div>
      </div>
    </div>
  );
}

/* Scene 2 — Customer details */
const FORM_FIELDS = [
  { label: "Full name", value: "Rahul Sharma", at: 120, charMs: 45 },
  { label: "Aadhaar number", value: "XXXX XXXX 4821", at: 640, charMs: 32 },
  { label: "PAN", value: "ABCDE1234F", at: 1080, charMs: 38 },
  { label: "Mobile number", value: "+91 98765 43210", at: 1450, charMs: 30 },
  { label: "Occupation", value: "Shop owner", at: 1830, charMs: 42 },
];

function FormScene({ ms }: { ms: number }) {
  return (
    <div>
      <ScreenHeader title="Customer details" step="STEP 1 / 4" />
      <div style={{ display: "grid", gap: 8 }}>
        {FORM_FIELDS.map((f) => {
          const text = typed(f.value, ms, f.at, f.charMs);
          const done = text.length === f.value.length;
          return (
            <Field
              key={f.label}
              label={f.label}
              value={text}
              caret={ms > f.at && !done}
            />
          );
        })}
      </div>
      <motion.div
        style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}
        animate={{ opacity: ms > 2100 ? 1 : 0.35 }}
      >
        <span style={{ color: GREEN, display: "grid", placeItems: "center" }}>
          <Glyph name="approved" size={14} strokeWidth={2} />
        </span>
        <span style={{ fontSize: 10, fontWeight: 600, color: MUTE }}>
          Details captured — no paperwork needed
        </span>
      </motion.div>
    </div>
  );
}

/* Scene 3 — Loan amount */
function AmountScene({ ms }: { ms: number }) {
  const p = easeOutCubic(seg(ms, 250, 1150));
  const amount = LOAN_MIN + (LOAN_MAX - LOAN_MIN) * p;
  const emi = emiFor(amount);
  const pct = ((amount - LOAN_MIN) / (LOAN_MAX - LOAN_MIN)) * 100;

  return (
    <div>
      <ScreenHeader title="Loan amount" step="STEP 2 / 4" />
      <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: MUTE, letterSpacing: "0.08em" }}>
          YOU ARE APPLYING FOR
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.03em",
            marginTop: 4,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {inr(amount)}
        </div>
      </div>

      <div style={{ padding: "10px 2px 0" }}>
        <div style={{ position: "relative", height: 6, borderRadius: 99, background: BLUE_SOFT }} className="clh-track">
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${pct}%`,
              borderRadius: 99,
              background: `linear-gradient(90deg, ${BLUE}, ${BLUE_DEEP})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${pct}%`,
              width: 18,
              height: 18,
              marginTop: -9,
              marginLeft: -9,
              borderRadius: "50%",
              background: "#fff",
              border: `3px solid ${BLUE}`,
              boxShadow: `0 6px 14px -4px ${BLUE}99`,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 9.5, color: MUTE, fontWeight: 600 }}>{inr(LOAN_MIN)}</span>
          <span style={{ fontSize: 9.5, color: MUTE, fontWeight: 600 }}>{inr(LOAN_MAX)}</span>
        </div>
      </div>

      <div
        className="clh-surface"
        style={{
          marginTop: 16,
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          padding: "11px 12px",
          display: "grid",
          gap: 8,
        }}
      >
        {(
          [
            ["Monthly EMI", inr(emi)],
            ["Tenure", "24 months"],
            ["Interest", "14% p.a."],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10.5, color: MUTE, fontWeight: 500 }}>{k}</span>
            <span
              style={{
                fontSize: 11.5,
                color: INK,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Scene 4 — Eligibility */
const CHECKS = [
  { label: "Aadhaar verified", at: 200 },
  { label: "PAN verified", at: 550 },
  { label: "Bank account verified", at: 900 },
  { label: "Credit score checked", at: 1250 },
];

function EligibilityScene({ ms }: { ms: number }) {
  const progress = Math.round(easeOutCubic(seg(ms, 150, 1450)) * 100);
  return (
    <div>
      <ScreenHeader title="Checking eligibility" step="STEP 3 / 4" />

      <div style={{ padding: "6px 2px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: MUTE }}>Verification</span>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: BLUE,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {progress}%
          </span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: BLUE_SOFT }} className="clh-track">
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 99,
              background: `linear-gradient(90deg, ${BLUE}, ${BLUE_DEEP})`,
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {CHECKS.map((c) => {
          const on = ms > c.at;
          return (
            <motion.div
              key={c.label}
              className="clh-surface"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                border: `1px solid ${on ? "#D9F5E9" : LINE}`,
                background: on ? "#F4FDF9" : "#fff",
                borderRadius: 11,
                padding: "10px 11px",
              }}
              animate={{ opacity: on ? 1 : 0.5, y: on ? 0 : 6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.span
                style={{ color: on ? GREEN : "#C7CBD6", display: "grid", placeItems: "center" }}
                animate={{ scale: on ? [0.6, 1.15, 1] : 0.9 }}
                transition={{ duration: 0.36, ease: "easeOut" }}
              >
                <Glyph name="approved" size={16} strokeWidth={2} />
              </motion.span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: on ? INK : MUTE }}>
                {c.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* Scene 5 — Approved */
const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  x: 10 + ((i * 37) % 200),
  delay: (i % 6) * 0.07,
  size: i % 3 === 0 ? 6 : 4,
  rot: (i % 2 ? 1 : -1) * 90,
}));

function ApprovedScene({ ms }: { ms: number }) {
  const amount = LOAN_MAX * easeOutCubic(seg(ms, 420, 900));
  return (
    <div style={{ position: "relative", height: "100%", display: "grid", placeItems: "center" }}>
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            top: 120,
            left: c.x,
            width: c.size,
            height: c.size,
            borderRadius: 1.5,
            background: i % 3 === 0 ? GREEN : BLUE,
          }}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], y: [-6, -80], rotate: c.rot }}
          transition={{ duration: 1.1, delay: 0.3 + c.delay, ease: "easeOut" }}
        />
      ))}

      <div style={{ textAlign: "center", position: "relative" }}>
        <motion.div
          style={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            margin: "0 auto",
            display: "grid",
            placeItems: "center",
            background: "#EAFBF3",
            boxShadow: `0 0 0 10px rgba(16,185,129,0.08)`,
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <motion.path
              d="M10 19.5l6 6 12-13"
              stroke={GREEN}
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <div style={{ fontSize: 16, fontWeight: 700, color: INK, marginTop: 16, letterSpacing: "-0.02em" }}>
          Loan approved
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: BLUE,
            letterSpacing: "-0.03em",
            marginTop: 6,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {inr(amount)}
        </div>
        <div style={{ fontSize: 10.5, color: MUTE, marginTop: 6 }}>
          Approved in under a minute
        </div>
      </div>
    </div>
  );
}

/* Scene 6 — Disbursed */
function DisbursedScene() {
  const dots = [0, 1, 2, 3, 4];
  return (
    <div style={{ height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: MUTE, letterSpacing: "0.08em" }}>
          TRANSFERRING TO
        </div>

        <div
          className="clh-surface"
          style={{
            marginTop: 12,
            border: `1px solid ${LINE}`,
            borderRadius: 14,
            padding: "13px 14px",
            display: "flex",
            alignItems: "center",
            gap: 11,
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: BLUE_SOFT,
              color: BLUE,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
            className="clh-tile"
          >
            <Glyph name="bank" size={19} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: INK }}>Savings account</div>
            <div style={{ fontSize: 10, color: MUTE, marginTop: 1 }}>HDFC •••• 4472</div>
          </div>
        </div>

        <div style={{ position: "relative", height: 54, margin: "6px 0" }}>
          <svg width="100%" height="54" viewBox="0 0 220 54" fill="none" preserveAspectRatio="none">
            <path
              d="M110 4 L110 50"
              stroke={BLUE}
              strokeOpacity="0.18"
              strokeWidth="2"
              strokeDasharray="4 5"
              strokeLinecap="round"
            />
            {dots.map((d) => (
              <motion.circle
                key={d}
                cx="110"
                r="3"
                fill={BLUE}
                initial={{ cy: 4, opacity: 0 }}
                animate={{ cy: [4, 50], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 0.85,
                  delay: d * 0.16,
                  repeat: Infinity,
                  repeatDelay: 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>
        </div>

        <motion.div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 14px",
            borderRadius: 99,
            background: "#EAFBF3",
            color: "#047857",
            fontSize: 11.5,
            fontWeight: 700,
          }}
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 280, damping: 20 }}
        >
          <Glyph name="approved" size={15} strokeWidth={2} />
          Amount disbursed successfully
        </motion.div>

        <div
          style={{
            fontSize: 21,
            fontWeight: 700,
            color: INK,
            marginTop: 14,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {inr(LOAN_MAX)}
        </div>
        <div style={{ fontSize: 10, color: MUTE, marginTop: 3 }}>Credited instantly</div>
      </div>
    </div>
  );
}

/* Scene 7 — Merchant commission */
const RISING_COINS = Array.from({ length: 7 }, (_, i) => ({
  x: 18 + i * 30,
  delay: 0.35 + (i % 4) * 0.12,
  size: i % 2 ? 13 : 16,
}));

function CommissionScene({ ms }: { ms: number }) {
  const earned = COMMISSION * easeOutCubic(seg(ms, 500, 900));
  return (
    <div style={{ position: "relative", height: "100%", display: "grid", placeItems: "center" }}>
      {RISING_COINS.map((c, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            bottom: 40,
            left: c.x,
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            border: `1.6px solid ${BLUE}`,
            background: BLUE_SOFT,
            color: BLUE,
            fontSize: c.size * 0.62,
            fontWeight: 700,
            lineHeight: `${c.size - 3}px`,
            textAlign: "center",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0], y: [10, -180] }}
          transition={{ duration: 1.8, delay: c.delay, ease: "easeOut" }}
        >
          ₹
        </motion.span>
      ))}

      <motion.div
        style={{ width: "100%", position: "relative" }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 210, damping: 22 }}
      >
        <div
          style={{
            borderRadius: 18,
            padding: "20px 18px",
            background: `linear-gradient(140deg, ${BLUE} 0%, ${BLUE_DEEP} 100%)`,
            color: "#fff",
            boxShadow: `0 20px 40px -20px ${BLUE}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              margin: "0 auto 12px",
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.16)",
            }}
          >
            <Glyph name="commission" size={21} strokeWidth={1.8} />
          </div>
          <div style={{ fontSize: 10, opacity: 0.85, letterSpacing: "0.08em", fontWeight: 600 }}>
            YOU EARNED
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginTop: 4,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {inr(earned)}
          </div>
          <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 4 }}>
            Commission on this disbursal
          </div>
        </div>

        <div
          className="clh-surface"
          style={{
            marginTop: 12,
            border: `1px solid ${LINE}`,
            borderRadius: 12,
            padding: "11px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 10.5, color: MUTE, fontWeight: 500 }}>Credited to wallet</span>
          <span style={{ color: GREEN, display: "grid", placeItems: "center" }}>
            <Glyph name="approved" size={16} strokeWidth={2} />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────  transfer beam  ────────────────────────── */

type Pt = { x: number; y: number };

const bezier = (p0: Pt, c: Pt, p1: Pt, t: number): Pt => ({
  x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t ** 2 * p1.x,
  y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t ** 2 * p1.y,
});

const BEAM_START: Pt = { x: 462, y: 142 };
const BEAM_CTRL: Pt = { x: 452, y: 250 };
const BEAM_END: Pt = { x: 372, y: 300 };
const BEAM_PTS = Array.from({ length: 14 }, (_, i) =>
  bezier(BEAM_START, BEAM_CTRL, BEAM_END, i / 13)
);
const BEAM_PATH = `M${BEAM_START.x} ${BEAM_START.y} Q${BEAM_CTRL.x} ${BEAM_CTRL.y} ${BEAM_END.x} ${BEAM_END.y}`;

function TransferBeam() {
  return (
    <svg
      width={CANVAS_W}
      height={CANVAS_H}
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <motion.path
        d={BEAM_PATH}
        fill="none"
        stroke={BLUE}
        strokeWidth="1.6"
        strokeDasharray="5 7"
        strokeLinecap="round"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 0.3, pathLength: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          r="3.5"
          fill={BLUE}
          initial={{ opacity: 0 }}
          animate={{
            cx: BEAM_PTS.map((p) => p.x),
            cy: BEAM_PTS.map((p) => p.y),
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

/* ──────────────────────────  the composition  ─────────────────────── */

const SCENE_COMPONENTS: Record<SceneId, (props: { ms: number }) => React.ReactElement> = {
  dashboard: DashboardScene,
  form: FormScene,
  amount: AmountScene,
  eligibility: EligibilityScene,
  approved: ApprovedScene,
  disbursed: DisbursedScene,
  commission: CommissionScene,
};

export default function InstantLoanHeroAnimation({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scale = useCanvasScale(wrapRef);
  const inView = useInView(wrapRef);
  const reduced = useReducedMotion();

  const running = inView && !reduced;
  const sceneIndex = useSceneLoop(running);
  const sceneMs = useSceneClock(sceneIndex, running);

  // Reduced motion settles on the single most explanatory frame.
  const active = reduced ? SCENES[4] : SCENES[sceneIndex];
  const Scene = SCENE_COMPONENTS[active.id];

  return (
    <div
      ref={wrapRef}
      className={`clh-root ${className}`}
      style={{ width: "100%", height: CANVAS_H * scale, ...style }}
      aria-hidden="true"
    >
      <style>{CSS}</style>

      <div
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
        }}
      >
        {/* ambient blue wash — no card, no container */}
        <div
          className="clh-wash"
          style={{ left: 60, top: 70, width: 300, height: 300 }}
        />
        <div
          className="clh-wash clh-wash-2"
          style={{ left: 190, top: 300, width: 280, height: 280 }}
        />

        {/* slow dashed orbit ring */}
        <motion.svg
          width={CANVAS_W}
          height={CANVAS_H}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          style={{ position: "absolute", inset: 0 }}
          animate={running ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx={CANVAS_W / 2}
            cy={CANVAS_H / 2}
            rx="212"
            ry="272"
            fill="none"
            stroke={BLUE}
            strokeOpacity="0.13"
            strokeWidth="1.2"
            strokeDasharray="3 12"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* floating financial ecosystem */}
        {ORBIT.map((item, i) => (
          <OrbitChip key={item.name} item={item} index={i} animate={running} />
        ))}

        {/* money in flight, only while disbursing */}
        <AnimatePresence>{active.id === "disbursed" && <TransferBeam />}</AnimatePresence>

        {/* the phone */}
        <motion.div
          className="clh-phone"
          style={{ left: PHONE.x, top: PHONE.y, width: PHONE.w, height: PHONE.h }}
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={
            running
              ? { opacity: 1, scale: 1, y: [0, -7, 0] }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={
            running
              ? {
                  opacity: { duration: 0.6, ease: "easeOut" },
                  scale: { duration: 0.6, ease: "easeOut" },
                  y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                }
              : { duration: 0.5 }
          }
        >
          <div className="clh-notch" />
          <div
            className="clh-screen"
            style={{ width: SCREEN_W, height: SCREEN_H, top: BEZEL, left: BEZEL }}
          >
            <div className="clh-statusbar">
              <span>9:41</span>
              <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
                <i className="clh-bar" style={{ height: 4 }} />
                <i className="clh-bar" style={{ height: 6 }} />
                <i className="clh-bar" style={{ height: 8 }} />
              </span>
            </div>

            <div style={{ position: "relative", flex: 1 }}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.id}
                  className="clh-scene"
                  initial={enter.initial}
                  animate={enter.animate}
                  exit={enter.exit}
                  transition={enter.transition}
                >
                  <Scene ms={sceneMs} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────  styles  ───────────────────────────── */

const CSS = `
.clh-root {
  position: relative;
  overflow: visible;
  --clh-ink: #0B1020;
  --clh-mute: #6B7280;
  --clh-line: #EDEFF5;
  --clh-blue-soft: #EEF1FF;
}
.dark .clh-root {
  --clh-ink: #E9ECF7;
  --clh-mute: #98A0B8;
  --clh-line: rgba(255,255,255,0.10);
  --clh-blue-soft: rgba(59,91,255,0.18);
}

.clh-wash {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59,91,255,0.13) 0%, rgba(59,91,255,0) 70%);
  filter: blur(6px);
  pointer-events: none;
}
.clh-wash-2 {
  background: radial-gradient(circle, rgba(59,91,255,0.09) 0%, rgba(59,91,255,0) 70%);
}

.clh-chip {
  border-radius: 14px;
  background: #ffffff;
  color: ${BLUE};
  border: 1px solid rgba(59,91,255,0.12);
  box-shadow: 0 10px 26px -12px rgba(24,39,120,0.28);
  display: grid;
  place-items: center;
}

.clh-phone {
  position: absolute;
  border-radius: 40px;
  background: linear-gradient(160deg, #ffffff 0%, #F3F5FF 100%);
  border: 1px solid rgba(59,91,255,0.16);
  box-shadow:
    0 2px 4px rgba(16,24,64,0.04),
    0 30px 70px -30px rgba(24,39,120,0.38),
    inset 0 1px 0 rgba(255,255,255,0.9);
  will-change: transform;
}

.clh-notch {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 74px;
  height: 5px;
  border-radius: 99px;
  background: rgba(11,16,32,0.10);
  z-index: 3;
}

.clh-screen {
  position: absolute;
  border-radius: 31px;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 0 1px rgba(11,16,32,0.05);
}

.clh-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 6px;
  font-size: 9.5px;
  font-weight: 700;
  color: ${INK};
  letter-spacing: 0.01em;
  flex-shrink: 0;
}
.clh-bar {
  display: block;
  width: 2.5px;
  border-radius: 1px;
  background: ${INK};
  opacity: 0.55;
}

.clh-scene {
  position: absolute;
  inset: 0;
  padding: 14px 16px 18px;
  will-change: transform, opacity, filter;
}

.clh-caret {
  display: inline-block;
  width: 1.5px;
  height: 11px;
  margin-left: 1.5px;
  vertical-align: -1px;
  background: ${BLUE};
  animation: clh-blink 1s steps(1) infinite;
}
@keyframes clh-blink { 50% { opacity: 0; } }

/* Tailwind class-based dark mode */
.dark .clh-phone {
  background: linear-gradient(160deg, #10141F 0%, #0B0E17 100%);
  border-color: rgba(59,91,255,0.28);
  box-shadow: 0 30px 70px -30px rgba(0,0,0,0.8);
}
.dark .clh-screen { background: #0E1220; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06); }
.dark .clh-statusbar { color: #E6E9F5; }
.dark .clh-bar { background: #E6E9F5; }
.dark .clh-chip { background: #111629; border-color: rgba(59,91,255,0.3); box-shadow: 0 10px 26px -12px rgba(0,0,0,0.7); }
.dark .clh-surface { background: #141A2B !important; border-color: rgba(255,255,255,0.08) !important; }
.dark .clh-scene .clh-surface[style*="F4FDF9"] { background: rgba(16,185,129,0.10) !important; }
.dark .clh-tile { background: rgba(59,91,255,0.16) !important; }
.dark .clh-track { background: rgba(59,91,255,0.18) !important; }
.dark .clh-notch { background: rgba(255,255,255,0.14); }

@media (prefers-reduced-motion: reduce) {
  .clh-caret { animation: none; }
}
`;