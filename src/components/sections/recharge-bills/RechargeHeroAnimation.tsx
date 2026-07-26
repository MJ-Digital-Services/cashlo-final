"use client";

/**
 * RechargeHeroAnimation.tsx
 * ---------------------------------------------------------------------------
 * Cashlo — animated Recharge & Bill Payments hero card.
 *
 * The outer wrapper keeps a fixed width/border-radius/shadow, and every scene
 * beyond the form renders as an absolutely positioned overlay, so the card
 * height never changes and the hero cannot grow.
 *
 * All styles are scoped via `cl-` classes injected once via ScopedStyles.
 * Total loop ≈ 13.7s.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ═══════════════════════════════ tokens ═══════════════════════════════ */

const BLUE = "#3B5BFF";
const BLUE_DARK = "#2843E0";
const BLUE_TINT = "#EEF1FF";
const INK = "#0B1020";
const MUTED = "#6B7280";
const LINE = "#E7E9F2";
const GREEN = "#12A150";

/* ══════════════════════════════ timeline ══════════════════════════════ */

type SceneId =
  | "idle"
  | "mobile"
  | "operator"
  | "circle"
  | "amount"
  | "tap"
  | "processing"
  | "success"
  | "commission"
  | "services"
  | "reset";

const SCENES: [SceneId, number][] = [
  ["idle", 400],
  ["mobile", 1800],
  ["operator", 1250],
  ["circle", 1150],
  ["amount", 1500],
  ["tap", 850],
  ["processing", 1250],
  ["success", 1700],
  ["commission", 1500],
  ["services", 1900],
  ["reset", 450],
];

const IDX = SCENES.reduce<Record<SceneId, number>>((m, [name], i) => {
  m[name] = i;
  return m;
}, {} as Record<SceneId, number>);

const MOBILE = "9876543210";
const AMOUNT = "299";

const OPERATORS: { name: string; tint: string }[] = [
  { name: "Airtel", tint: "#E4002B" },
  { name: "Jio", tint: "#0F3CC9" },
  { name: "Vi", tint: "#E60000" },
  { name: "BSNL", tint: "#0B7285" },
];

const CIRCLES = ["Delhi NCR", "Maharashtra", "Karnataka", "UP East"];

type ServiceIcon = "bolt" | "drop" | "tv" | "flame" | "road" | "globe" | "phone" | "shield";

const SERVICES: { label: string; icon: ServiceIcon }[] = [
  { label: "Electricity", icon: "bolt" },
  { label: "Water", icon: "drop" },
  { label: "DTH", icon: "tv" },
  { label: "Gas", icon: "flame" },
  { label: "FASTag", icon: "road" },
  { label: "Broadband", icon: "globe" },
  { label: "Postpaid", icon: "phone" },
  { label: "Insurance", icon: "shield" },
];

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

/* ═══════════════════════════════ icons ════════════════════════════════ */

type IconName =
  | "phone"
  | "sim"
  | "rupee"
  | "bolt"
  | "wallet"
  | "drop"
  | "tv"
  | "flame"
  | "road"
  | "globe"
  | "shield"
  | "chevron"
  | "check"
  | "bbps";

const Icon = ({
  name,
  size = 20,
  color = BLUE,
  strokeWidth = 1.7,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "phone":
      return (
        <svg {...common}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
          <path d="M10.6 18.6h2.8" />
        </svg>
      );
    case "sim":
      return (
        <svg {...common}>
          <path d="M5.5 4.2A1.7 1.7 0 0 1 7.2 2.5h6.4L18.5 7.4v12.4a1.7 1.7 0 0 1-1.7 1.7H7.2a1.7 1.7 0 0 1-1.7-1.7z" />
          <rect x="8.6" y="11" width="6.8" height="6.4" rx="1.4" />
          <path d="M11.9 11v6.4M8.6 14.2h6.8" />
        </svg>
      );
    case "rupee":
      return (
        <svg {...common}>
          <path d="M7.5 4.5h9M7.5 8.5h9M14.6 4.7c0 2.6-1.6 3.8-4 3.8H7.5l7.4 11" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13.4 2.5 4.8 13.4h6l-1.2 8.1 8.6-10.9h-6z" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...common}>
          <path d="M2.8 8.2A2.4 2.4 0 0 1 5.2 5.8h13.6a2.4 2.4 0 0 1 2.4 2.4v8.6a2.4 2.4 0 0 1-2.4 2.4H5.2a2.4 2.4 0 0 1-2.4-2.4z" />
          <path d="M16.4 12.5h4.8" />
          <circle cx="16.6" cy="12.5" r="0.9" fill={color} stroke="none" />
        </svg>
      );
    case "drop":
      return (
        <svg {...common}>
          <path d="M12 2.8s6 6.3 6 10.4a6 6 0 1 1-12 0C6 9.1 12 2.8 12 2.8z" />
        </svg>
      );
    case "tv":
      return (
        <svg {...common}>
          <rect x="2.8" y="6.2" width="18.4" height="12" rx="2.2" />
          <path d="M8.4 21.2h7.2M9.6 2.8 12 6.2l2.4-3.4" />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path d="M12 2.6s5.4 4.4 5.4 9.6a5.4 5.4 0 1 1-10.8 0c0-2 .9-3.4 1.8-4.4.3 1.4 1.1 2.2 2 2.2 1.3 0 1.9-1.6 1.6-7.4z" />
        </svg>
      );
    case "road":
      return (
        <svg {...common}>
          <path d="M7.6 2.8 4.4 21.2M16.4 2.8l3.2 18.4M12 3.4v3.2M12 10.4v3.2M12 17.4v3.2" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.2" />
          <path d="M2.9 12h18.2M12 2.8c2.3 2.5 3.5 5.7 3.5 9.2s-1.2 6.7-3.5 9.2c-2.3-2.5-3.5-5.7-3.5-9.2S9.7 5.3 12 2.8z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 2.8 4.6 6v6c0 4.6 3.1 8.2 7.4 9.2 4.3-1 7.4-4.6 7.4-9.2V6z" />
          <path d="m9.2 12 2 2.1 3.6-4" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...common} strokeWidth={2}>
          <path d="m6.5 9.5 5.5 5 5.5-5" />
        </svg>
      );
    case "check":
      return (
        <svg {...common} strokeWidth={2.6}>
          <path d="m5.5 12.4 4.3 4.4 8.7-9.6" />
        </svg>
      );
    case "bbps":
      return (
        <svg {...common}>
          <rect x="2.8" y="4.6" width="18.4" height="14.8" rx="2.4" />
          <path d="M2.8 9.4h18.4M6.6 14.4h4.4M15.4 14.4h2" />
        </svg>
      );
    default:
      return null;
  }
};

/* ═════════════════════════════ small parts ════════════════════════════ */

const Caret = () => (
  <motion.span
    className="cl-caret"
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 1] }}
  />
);

const OperatorMark = ({
  tint,
  letter,
  size = 22,
}: {
  tint: string;
  letter: string;
  size?: number;
}) => (
  <span
    className="cl-mark"
    style={{
      width: size,
      height: size,
      background: `${tint}14`,
      color: tint,
      fontSize: size * 0.5,
    }}
  >
    {letter}
  </span>
);

function CountUp({
  from,
  to,
  duration = 900,
  prefix = "",
  format,
}: {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  format?: (n: number) => string;
}) {
  const [v, setV] = useState(from);
  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration]);
  const n = Math.round(v);
  return (
    <>
      {prefix}
      {format ? format(n) : n}
    </>
  );
}

const inr = (n: number) => n.toLocaleString("en-IN");

/* ═══════════════════════════ main component ═══════════════════════════ */

export default function RechargeHeroAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);

  const [mobile, setMobile] = useState("");
  const [detected, setDetected] = useState(false);
  const [dropdown, setDropdown] = useState<"operator" | "circle" | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [circle, setCircle] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [plan, setPlan] = useState(false);
  const [ripple, setRipple] = useState(false);

  const scene = SCENES[step][0];
  const running = inView && visible && !reduced;

  /* ── pause when off-screen or tab hidden ───────────────────────────── */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting && e.intersectionRatio > 0.15),
      { threshold: [0, 0.15, 0.5] }
    );
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /* ── the clock ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(
      () => setStep((s) => (s + 1) % SCENES.length),
      SCENES[step][1]
    );
    return () => clearTimeout(t);
  }, [step, running]);

  /* ── reset at the top of every loop ────────────────────────────────── */
  useEffect(() => {
    if (scene !== "idle") return;
    setMobile("");
    setDetected(false);
    setDropdown(null);
    setHovered(null);
    setOperator(null);
    setCircle(null);
    setAmount("");
    setPlan(false);
    setRipple(false);
  }, [scene]);

  /* ── scene 2: type the mobile number, detect the operator ──────────── */
  useEffect(() => {
    if (scene !== "mobile" || !running) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    MOBILE.split("").forEach((_, i) => {
      timers.push(
        setTimeout(() => setMobile(MOBILE.slice(0, i + 1)), 220 + i * 125)
      );
    });
    timers.push(setTimeout(() => setDetected(true), 1620));
    return () => timers.forEach(clearTimeout);
  }, [scene, running]);

  /* ── scene 3: operator dropdown ────────────────────────────────────── */
  useEffect(() => {
    if (scene !== "operator" || !running) return;
    const t = [
      setTimeout(() => setDropdown("operator"), 120),
      setTimeout(() => setHovered("Airtel"), 620),
      setTimeout(() => setOperator("Airtel"), 900),
      setTimeout(() => {
        setDropdown(null);
        setHovered(null);
      }, 990),
    ];
    return () => t.forEach(clearTimeout);
  }, [scene, running]);

  /* ── scene 4: circle dropdown ──────────────────────────────────────── */
  useEffect(() => {
    if (scene !== "circle" || !running) return;
    const t = [
      setTimeout(() => setDropdown("circle"), 120),
      setTimeout(() => setHovered("Delhi NCR"), 560),
      setTimeout(() => setCircle("Delhi NCR"), 820),
      setTimeout(() => {
        setDropdown(null);
        setHovered(null);
      }, 910),
    ];
    return () => t.forEach(clearTimeout);
  }, [scene, running]);

  /* ── scene 5: amount + plan card ───────────────────────────────────── */
  useEffect(() => {
    if (scene !== "amount" || !running) return;
    const t: ReturnType<typeof setTimeout>[] = [];
    AMOUNT.split("").forEach((_, i) => {
      t.push(setTimeout(() => setAmount(AMOUNT.slice(0, i + 1)), 260 + i * 165));
    });
    t.push(setTimeout(() => setPlan(true), 880));
    return () => t.forEach(clearTimeout);
  }, [scene, running]);

  /* ── scene 6: the tap ──────────────────────────────────────────────── */
  useEffect(() => {
    if (scene !== "tap" || !running) return;
    const t = [
      setTimeout(() => setRipple(true), 380),
      setTimeout(() => setRipple(false), 900),
    ];
    return () => t.forEach(clearTimeout);
  }, [scene, running]);

  /* ── reduced motion: render the finished form, no loop ─────────────── */
  const rm = reduced;
  const rmMobile = rm ? MOBILE : mobile;
  const rmOperator = rm ? "Airtel" : operator;
  const rmCircle = rm ? "Delhi NCR" : circle;
  const rmAmount = rm ? AMOUNT : amount;
  const rmPlan = rm ? true : plan;

  const showProcessing = !rm && scene === "processing";
  const showSuccess = !rm && (scene === "success" || scene === "commission");
  const showCommission = !rm && scene === "commission";
  const showServices = !rm && scene === "services";
  const formDim = showProcessing || showSuccess || showServices;

  const activeField =
    scene === "mobile"
      ? "mobile"
      : scene === "operator"
      ? "operator"
      : scene === "circle"
      ? "circle"
      : scene === "amount"
      ? "amount"
      : null;

  const opTint =
    OPERATORS.find((o) => o.name === rmOperator)?.tint || OPERATORS[0].tint;

  /* particles that need stable randomness */
  const confetti = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 260,
        y: -60 - Math.random() * 130,
        r: (Math.random() - 0.5) * 320,
        d: Math.random() * 0.28,
        w: 4 + Math.random() * 4,
        h: 7 + Math.random() * 7,
        c: [BLUE, "#8AA0FF", GREEN, "#FFC53D", "#C8D2FF"][i % 5],
      })),
    []
  );

  const coins = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        x: -46 + i * 15 + (Math.random() - 0.5) * 8,
        d: i * 0.075,
        s: 0.7 + Math.random() * 0.4,
      })),
    []
  );

  const sweep = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        y: 6 + Math.random() * 46,
        d: i * 0.045,
        s: 2 + Math.random() * 3,
      })),
    []
  );

  const orbit: IconName[] = ["phone", "sim", "rupee", "bolt", "wallet", "bbps"];

  return (
    <div className="cl-root" ref={rootRef}>
      <ScopedStyles />

      {/* The card is an illustration of the merchant flow, not a live form. */}
      <p className="cl-sr">
        Animated demo: enter a mobile number, pick the operator and circle, enter
        an amount, complete the recharge, and earn commission — plus electricity,
        water, DTH, gas, FASTag, broadband and postpaid bills.
      </p>

      <div className="cl-card" aria-hidden="true">
        {/* ── Prepaid / Postpaid tabs (always visible) ───────────────── */}
        <div className="cl-tabs">
          <motion.div
            className="cl-tab-pill"
            layout
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          />
          <button className="cl-tab cl-tab-on" type="button" tabIndex={-1}>
            Prepaid
          </button>
          <button className="cl-tab" type="button" tabIndex={-1}>
            Postpaid
          </button>
          {!rm && (
            <motion.span
              className="cl-tab-glow"
              animate={{ opacity: [0.35, 0.75, 0.35] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>

        {/* ── stage: fixed frame, overlays live inside it ───────────── */}
        <div className="cl-stage">
          <motion.div
            className="cl-form"
            animate={{
              opacity: formDim ? 0 : 1,
              filter: formDim ? "blur(6px)" : "blur(0px)",
              scale: formDim ? 0.985 : 1,
            }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            {/* Mobile number */}
            <div className="cl-field">
              <label className="cl-label">Mobile number</label>
              <motion.div
                className="cl-input"
                animate={{
                  borderColor: activeField === "mobile" ? BLUE : LINE,
                  boxShadow:
                    activeField === "mobile"
                      ? `0 0 0 4px ${BLUE}1F`
                      : `0 0 0 0px ${BLUE}00`,
                }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Icon
                  name="phone"
                  size={18}
                  color={activeField === "mobile" ? BLUE : "#9AA1B4"}
                />
                <span className={rmMobile ? "cl-value" : "cl-ph"}>
                  {rmMobile
                    ? rmMobile.replace(/(\d{5})(\d{0,5})/, "$1 $2").trim()
                    : "Enter 10 digit mobile number"}
                </span>
                {activeField === "mobile" && !rm && <Caret />}
                <span className="cl-spacer" />
                <AnimatePresence>
                  {(detected || rm) && (
                    <motion.span
                      key="op"
                      className="cl-detected"
                      initial={{ opacity: 0, x: 10, scale: 0.85 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 6, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      style={{ background: `${opTint}0F`, color: opTint }}
                    >
                      <OperatorMark tint={opTint} letter="A" size={16} />
                      Airtel
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Operator + Circle */}
            <div className="cl-row">
              <SelectField
                label="Operator"
                placeholder="Select operator"
                value={rmOperator}
                open={dropdown === "operator"}
                active={activeField === "operator"}
                leading={
                  rmOperator ? (
                    <OperatorMark tint={opTint} letter="A" size={18} />
                  ) : null
                }
                options={OPERATORS.map((o) => ({
                  key: o.name,
                  label: o.name,
                  leading: (
                    <OperatorMark tint={o.tint} letter={o.name[0]} size={18} />
                  ),
                }))}
                hovered={hovered}
              />
              <SelectField
                label="Circle"
                placeholder="Select circle"
                value={rmCircle}
                open={dropdown === "circle"}
                active={activeField === "circle"}
                options={CIRCLES.map((c) => ({ key: c, label: c }))}
                hovered={hovered}
              />
            </div>

            {/* Amount */}
            <div className="cl-field">
              <label className="cl-label">Amount</label>
              <motion.div
                className="cl-input"
                animate={{
                  borderColor: activeField === "amount" ? BLUE : LINE,
                  boxShadow:
                    activeField === "amount"
                      ? `0 0 0 4px ${BLUE}1F`
                      : `0 0 0 0px ${BLUE}00`,
                }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <span className="cl-rupee">₹</span>
                <span className={rmAmount ? "cl-value cl-amt" : "cl-ph"}>
                  {rmAmount || "Enter amount"}
                </span>
                {activeField === "amount" && !rm && <Caret />}
              </motion.div>
            </div>

            {/* Plan slot — fixed height, so nothing below ever shifts */}
            <div className="cl-slot">
              <AnimatePresence mode="wait" initial={false}>
                {rmPlan ? (
                  <motion.div
                    key="plan"
                    className="cl-plan"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.42, ease: EASE }}
                  >
                    <div className="cl-plan-left">
                      <div className="cl-plan-amt">₹299</div>
                      <div className="cl-plan-sub">Truly unlimited</div>
                    </div>
                    <div className="cl-plan-right">
                      {["28 days", "2GB / day", "Unlimited calls", "100 SMS / day"].map(
                        (t, i) => (
                          <motion.span
                            key={t}
                            className="cl-chip cl-chip-plan"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.12 + i * 0.06,
                              duration: 0.32,
                              ease: EASE,
                            }}
                          >
                            {t}
                          </motion.span>
                        )
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chips"
                    className="cl-quick"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <span className="cl-quick-label">Popular</span>
                    {["₹199", "₹299", "₹499", "₹799"].map((v) => {
                      const lit = v === "₹299" && scene === "amount";
                      return (
                        <motion.span
                          key={v}
                          className="cl-chip"
                          animate={{
                            borderColor: lit ? BLUE : LINE,
                            color: lit ? BLUE : "#5A6175",
                            backgroundColor: lit ? BLUE_TINT : "#ffffff",
                            scale: lit ? 1.04 : 1,
                          }}
                          transition={{ duration: 0.28, ease: EASE }}
                        >
                          {v}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <motion.button
              type="button"
              tabIndex={-1}
              className="cl-cta"
              animate={
                scene === "tap" && !rm
                  ? {
                      scale: [1, 1.015, 0.985, 1],
                      boxShadow: [
                        `0 10px 24px -10px ${BLUE}66`,
                        `0 14px 38px -8px ${BLUE}99`,
                        `0 10px 24px -10px ${BLUE}66`,
                      ],
                    }
                  : { scale: 1, boxShadow: `0 10px 24px -10px ${BLUE}66` }
              }
              transition={{ duration: 0.85, ease: EASE }}
            >
              <span className="cl-cta-text">Proceed to recharge</span>

              {/* particle sweep */}
              {scene === "tap" && !rm && (
                <span className="cl-sweep">
                  {sweep.map((p) => (
                    <motion.span
                      key={p.id}
                      className="cl-spark"
                      style={{ top: p.y, width: p.s * 4, height: p.s }}
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 420, opacity: [0, 1, 0] }}
                      transition={{ duration: 0.7, delay: p.d, ease: "easeOut" }}
                    />
                  ))}
                  <motion.span
                    className="cl-shine"
                    initial={{ x: "-120%" }}
                    animate={{ x: "120%" }}
                    transition={{ duration: 0.8, ease: EASE }}
                  />
                </span>
              )}

              {/* tap ripple */}
              <AnimatePresence>
                {ripple && (
                  <motion.span
                    className="cl-ripple"
                    initial={{ scale: 0, opacity: 0.45 }}
                    animate={{ scale: 3.4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.62, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* ── overlay: processing ─────────────────────────────────── */}
          <AnimatePresence>
            {showProcessing && (
              <motion.div
                key="processing"
                className="cl-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34, ease: EASE }}
              >
                {orbit.map((n, i) => {
                  const a = (i / orbit.length) * Math.PI * 2 - Math.PI / 2;
                  return (
                    <motion.span
                      key={n}
                      className="cl-orbit"
                      style={{
                        left: `calc(50% + ${Math.cos(a) * 108}px - 21px)`,
                        top: `calc(50% + ${Math.sin(a) * 84}px - 21px)`,
                      }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                      transition={{
                        opacity: { duration: 0.3, delay: 0.05 * i },
                        scale: {
                          type: "spring",
                          stiffness: 380,
                          damping: 22,
                          delay: 0.05 * i,
                        },
                        y: {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.12 * i,
                        },
                      }}
                    >
                      <Icon name={n} size={19} color={BLUE} />
                    </motion.span>
                  );
                })}

                <div className="cl-ring-wrap">
                  <svg width="104" height="104" viewBox="0 0 104 104">
                    <circle
                      cx="52"
                      cy="52"
                      r="45"
                      fill="none"
                      stroke={BLUE_TINT}
                      strokeWidth="7"
                    />
                    <motion.circle
                      cx="52"
                      cy="52"
                      r="45"
                      fill="none"
                      stroke={BLUE}
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 45}
                      initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.15, ease: [0.4, 0, 0.2, 1] }}
                      transform="rotate(-90 52 52)"
                    />
                  </svg>
                  <span className="cl-ring-num">
                    <CountUp from={0} to={100} duration={1150} />%
                  </span>
                </div>
                <p className="cl-over-title">Processing recharge</p>
                <p className="cl-over-sub">Securely routed via BBPS</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── overlay: success (+ commission) ─────────────────────── */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                key="success"
                className="cl-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34, ease: EASE }}
              >
                <div className="cl-confetti">
                  {confetti.map((c) => (
                    <motion.span
                      key={c.id}
                      style={{
                        background: c.c,
                        width: c.w,
                        height: c.h,
                        borderRadius: 2,
                      }}
                      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.4 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        x: c.x,
                        y: c.y,
                        rotate: c.r,
                        scale: 1,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.1 + c.d,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  className="cl-check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 18 }}
                >
                  <motion.span
                    className="cl-check-halo"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.75, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <motion.path
                      d="m5.5 12.4 4.3 4.4 8.7-9.6"
                      stroke="#fff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, delay: 0.14, ease: EASE }}
                    />
                  </svg>
                </motion.div>

                <motion.p
                  className="cl-over-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.34, ease: EASE }}
                >
                  Recharge successful
                </motion.p>
                <motion.p
                  className="cl-success-amt"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.36, ease: EASE }}
                >
                  ₹299
                </motion.p>
                <motion.p
                  className="cl-txn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.42, duration: 0.34 }}
                >
                  Airtel · 98765 43210 · TXN 8241 9037 5512
                </motion.p>

                {/* commission slides up over the success card */}
                <AnimatePresence>
                  {showCommission && (
                    <motion.div
                      key="commission"
                      className="cl-commission"
                      initial={{ y: 70, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    >
                      <div className="cl-coins">
                        {coins.map((c) => (
                          <motion.span
                            key={c.id}
                            className="cl-coin"
                            style={{ left: `calc(50% + ${c.x}px)` }}
                            initial={{ y: 8, opacity: 0, scale: c.s * 0.6 }}
                            animate={{ y: -62, opacity: [0, 1, 0], scale: c.s }}
                            transition={{
                              duration: 1.15,
                              delay: c.d,
                              ease: "easeOut",
                            }}
                          >
                            ₹
                          </motion.span>
                        ))}
                      </div>
                      <span className="cl-comm-badge">
                        <Icon name="wallet" size={17} color={GREEN} />
                      </span>
                      <div className="cl-comm-copy">
                        <strong>+₹8 commission earned</strong>
                        <span>
                          Wallet balance{" "}
                          <b>
                            ₹
                            <CountUp
                              from={12450}
                              to={12458}
                              duration={900}
                              format={inr}
                            />
                          </b>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── overlay: other services ─────────────────────────────── */}
          <AnimatePresence>
            {showServices && (
              <motion.div
                key="services"
                className="cl-overlay cl-overlay-top"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.34, ease: EASE }}
              >
                <motion.p
                  className="cl-serv-title"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, ease: EASE }}
                >
                  Same counter, every bill
                </motion.p>
                <div className="cl-grid">
                  {SERVICES.map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="cl-tile"
                      initial={{ opacity: 0, y: 16, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.08 + i * 0.065,
                        type: "spring",
                        stiffness: 380,
                        damping: 26,
                      }}
                    >
                      <span className="cl-tile-icon">
                        <Icon name={s.icon} size={20} color={BLUE} />
                      </span>
                      <span className="cl-tile-label">{s.label}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  className="cl-over-sub"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  Every payment earns commission
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="cl-foot">Available through the Cashlo Merchant App</p>
      </div>
    </div>
  );
}

/* ══════════════════════════ select + dropdown ═════════════════════════ */

type SelectOption = { key: string; label: string; leading?: ReactNode };

function SelectField({
  label,
  placeholder,
  value,
  open,
  active,
  options,
  hovered,
  leading,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  open: boolean;
  active: boolean;
  options: SelectOption[];
  hovered: string | null;
  leading?: ReactNode;
}) {
  return (
    <div className="cl-field cl-field-half">
      <label className="cl-label">{label}</label>
      <div className="cl-select-wrap">
        <motion.div
          className="cl-input cl-select"
          animate={{
            borderColor: active ? BLUE : LINE,
            boxShadow: active
              ? `0 0 0 4px ${BLUE}1F`
              : `0 0 0 0px ${BLUE}00`,
          }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {leading}
          <span className={value ? "cl-value" : "cl-ph"}>
            {value || placeholder}
          </span>
          <span className="cl-spacer" />
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{ display: "flex" }}
          >
            <Icon name="chevron" size={16} color="#9AA1B4" />
          </motion.span>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="cl-menu"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.24, ease: EASE }}
            >
              {options.map((o, i) => (
                <motion.div
                  key={o.key}
                  className="cl-opt"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    backgroundColor:
                      hovered === o.key ? BLUE_TINT : "rgba(255,255,255,0)",
                  }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.22,
                    ease: EASE,
                  }}
                >
                  {o.leading}
                  <span
                    style={{
                      color: hovered === o.key ? BLUE : INK,
                      fontWeight: hovered === o.key ? 600 : 500,
                    }}
                  >
                    {o.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ══════════════════════════════ styles ════════════════════════════════ */

function ScopedStyles() {
  return (
    <style>{`
.cl-root{width:100%;max-width:520px;margin-left:auto;font-family:inherit;-webkit-font-smoothing:antialiased}
.cl-card{position:relative;background:#fff;border:1px solid ${LINE};border-radius:28px;padding:26px;
  box-shadow:0 1px 2px rgba(16,24,40,.04),0 26px 60px -32px rgba(16,24,40,.22);}

/* tabs */
.cl-tabs{position:relative;display:flex;background:#F5F6FA;border-radius:999px;padding:5px;margin-bottom:24px;overflow:hidden}
.cl-tab{flex:1;position:relative;z-index:2;border:0;background:transparent;cursor:default;
  padding:12px 0;font-size:15px;font-weight:600;color:${MUTED};font-family:inherit;letter-spacing:-.01em}
.cl-tab-on{color:#fff}
.cl-tab-pill{position:absolute;z-index:1;left:5px;top:5px;bottom:5px;width:calc(50% - 5px);
  background:${BLUE};border-radius:999px;box-shadow:0 6px 16px -8px ${BLUE}CC}
.cl-tab-glow{position:absolute;z-index:0;left:5px;top:5px;bottom:5px;width:calc(50% - 5px);
  border-radius:999px;box-shadow:0 0 0 6px ${BLUE}1A}

.cl-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
  clip:rect(0 0 0 0);white-space:nowrap;border:0}

/* stage — fixed frame; every overlay is inset:0 inside it, so the card height
   is identical in every scene and the hero can never grow. */
.cl-stage{position:relative;min-height:440px}
.cl-form{display:flex;flex-direction:column;gap:18px}
.cl-field{display:flex;flex-direction:column;gap:8px;min-width:0}
.cl-field-half{flex:1}
.cl-row{display:flex;gap:14px}
.cl-label{font-size:13px;font-weight:600;color:#3C4356;letter-spacing:-.005em}

.cl-input{display:flex;align-items:center;gap:10px;height:54px;padding:0 14px;background:#fff;
  border:1px solid ${LINE};border-radius:14px;overflow:hidden}
.cl-select{height:50px;padding:0 12px;gap:8px}
.cl-ph{font-size:15px;color:#A2A8B8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cl-value{font-size:15px;font-weight:600;color:${INK};letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cl-amt{font-size:17px;letter-spacing:0}
.cl-rupee{font-size:16px;color:#8A90A2;font-weight:500}
.cl-spacer{flex:1}
.cl-caret{display:inline-block;width:2px;height:19px;background:${BLUE};border-radius:2px;margin-left:1px;flex:none}
.cl-mark{display:inline-flex;align-items:center;justify-content:center;border-radius:7px;font-weight:800;flex:none}
.cl-detected{display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 5px;border-radius:999px;
  font-size:12.5px;font-weight:700;flex:none}

/* dropdown */
.cl-select-wrap{position:relative}
.cl-menu{position:absolute;z-index:20;top:calc(100% + 8px);left:0;right:0;background:#fff;
  border:1px solid ${LINE};border-radius:14px;padding:6px;transform-origin:top center;
  box-shadow:0 20px 44px -18px rgba(16,24,40,.28),0 2px 6px rgba(16,24,40,.05)}
.cl-opt{display:flex;align-items:center;gap:9px;padding:10px 10px;border-radius:10px;font-size:14px;white-space:nowrap}

/* plan slot */
.cl-slot{position:relative;height:74px}
.cl-quick{display:flex;align-items:center;gap:8px;height:100%}
.cl-quick-label{font-size:12px;font-weight:600;color:#9AA1B4;letter-spacing:.02em;text-transform:uppercase}
.cl-chip{display:inline-flex;align-items:center;padding:7px 11px;border:1px solid ${LINE};border-radius:999px;
  font-size:13px;font-weight:600;color:#5A6175;background:#fff;white-space:nowrap}
.cl-plan{display:flex;align-items:center;gap:14px;height:100%;padding:0 16px;border-radius:16px;
  background:linear-gradient(180deg,#F7F9FF 0%,#F1F4FF 100%);border:1px solid ${BLUE}26}
.cl-plan-left{flex:none}
.cl-plan-amt{font-size:22px;font-weight:800;color:${INK};letter-spacing:-.02em;line-height:1.1}
.cl-plan-sub{font-size:11.5px;font-weight:600;color:${BLUE};letter-spacing:.01em}
.cl-plan-right{display:flex;flex-wrap:wrap;gap:6px}
.cl-chip-plan{padding:5px 9px;font-size:11.5px;border-color:${BLUE}2E;color:#4A5270;background:#fff}

/* cta */
.cl-cta{position:relative;height:58px;width:100%;border:0;border-radius:16px;cursor:default;overflow:hidden;
  background:linear-gradient(180deg,${BLUE} 0%,${BLUE_DARK} 100%);color:#fff;font-family:inherit;
  font-size:16px;font-weight:700;letter-spacing:-.01em;display:flex;align-items:center;justify-content:center}
.cl-cta-text{position:relative;z-index:3}
.cl-sweep{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}
.cl-spark{position:absolute;left:0;background:rgba(255,255,255,.85);border-radius:999px;filter:blur(.3px)}
.cl-shine{position:absolute;top:0;bottom:0;width:38%;
  background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.34),rgba(255,255,255,0))}
.cl-ripple{position:absolute;z-index:1;left:50%;top:50%;width:120px;height:120px;margin:-60px 0 0 -60px;
  border-radius:999px;background:rgba(255,255,255,.5)}

/* overlays */
.cl-overlay{position:absolute;inset:0;z-index:15;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;background:#fff;border-radius:18px;overflow:hidden}
.cl-overlay-top{justify-content:flex-start;padding-top:6px}
.cl-orbit{position:absolute;width:42px;height:42px;border-radius:14px;background:#fff;border:1px solid ${LINE};
  display:flex;align-items:center;justify-content:center;box-shadow:0 10px 22px -14px rgba(16,24,40,.4)}
.cl-ring-wrap{position:relative;width:104px;height:104px;display:flex;align-items:center;justify-content:center}
.cl-ring-num{position:absolute;font-size:20px;font-weight:800;color:${INK};letter-spacing:-.02em}
.cl-over-title{margin:16px 0 0;font-size:17px;font-weight:700;color:${INK};letter-spacing:-.01em}
.cl-over-sub{margin:6px 0 0;font-size:13px;color:${MUTED}}
.cl-success-amt{margin:8px 0 0;font-size:38px;font-weight:800;color:${INK};letter-spacing:-.03em;line-height:1}
.cl-txn{margin:10px 0 0;font-size:12px;color:#8A90A2;letter-spacing:.02em;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.cl-check{position:relative;width:66px;height:66px;border-radius:999px;background:${GREEN};
  display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px -12px ${GREEN}99}
.cl-check-halo{position:absolute;inset:0;border-radius:999px;background:${GREEN}33}
.cl-confetti{position:absolute;left:50%;top:46%;width:0;height:0;z-index:1}
.cl-confetti>span{position:absolute}

/* commission */
.cl-commission{position:absolute;left:14px;right:14px;bottom:12px;z-index:5;display:flex;align-items:center;gap:12px;
  padding:14px 16px;border-radius:16px;background:#fff;border:1px solid ${GREEN}2E;text-align:left;
  box-shadow:0 18px 40px -20px rgba(16,24,40,.35)}
.cl-comm-badge{width:38px;height:38px;border-radius:12px;background:${GREEN}14;display:flex;align-items:center;
  justify-content:center;flex:none}
.cl-comm-copy{display:flex;flex-direction:column;gap:2px}
.cl-comm-copy strong{font-size:14.5px;font-weight:700;color:${INK};letter-spacing:-.01em}
.cl-comm-copy span{font-size:12.5px;color:${MUTED}}
.cl-comm-copy b{color:${INK};font-weight:700}
.cl-coins{position:absolute;left:0;right:0;bottom:22px;height:0}
.cl-coin{position:absolute;font-size:14px;font-weight:800;color:${GREEN};
  width:22px;height:22px;border-radius:999px;background:${GREEN}14;display:flex;align-items:center;justify-content:center}

/* services */
.cl-serv-title{margin:2px 0 16px;font-size:16px;font-weight:700;color:${INK};letter-spacing:-.01em}
.cl-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;width:100%}
.cl-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px 6px;
  border:1px solid ${LINE};border-radius:16px;background:#fff;box-shadow:0 10px 22px -20px rgba(16,24,40,.5)}
.cl-tile-icon{width:38px;height:38px;border-radius:12px;background:${BLUE_TINT};display:flex;align-items:center;justify-content:center}
.cl-tile-label{font-size:11.5px;font-weight:600;color:#4A5270;text-align:center;line-height:1.1}

.cl-foot{margin:18px 0 0;text-align:center;font-size:13px;color:#9AA1B4}

@media (max-width:640px){
  .cl-root{max-width:100%}
  .cl-card{padding:20px;border-radius:24px}
  .cl-stage{min-height:428px}
  .cl-row{flex-direction:column;gap:16px}
  .cl-plan{flex-direction:column;align-items:flex-start;justify-content:center;gap:6px;padding:10px 14px}
  .cl-plan-amt{font-size:18px}
  .cl-grid{grid-template-columns:repeat(3,1fr)}
  .cl-success-amt{font-size:32px}
}
@media (prefers-reduced-motion:reduce){
  .cl-tab-glow{display:none}
}
`}</style>
  );
}