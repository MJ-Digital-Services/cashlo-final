"use client";

/**
 * Cashlo — ITR Filing Hero Animation
 * ----------------------------------
 * Zero dependencies. Pure React + CSS transforms/opacity (GPU-composited).
 * All artwork is inline SVG. Pauses when scrolled out of viewport.
 * Honours prefers-reduced-motion with a static, fully-composed frame.
 * Styles are scoped under .cl-itr so nothing leaks into global CSS.
 */

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

/* ------------------------------------------------------------------ tokens */

const BLUE = "#3B5BFF";

type SceneId = "start" | "upload" | "verify" | "form" | "progress" | "success" | "refund";

/* Scene script — total loop ≈ 12.6s */
const SCENES: { id: SceneId; ms: number; step: number }[] = [
  { id: "start", ms: 1100, step: 0 },
  { id: "upload", ms: 2500, step: 0 },
  { id: "verify", ms: 2200, step: 1 },
  { id: "form", ms: 1900, step: 2 },
  { id: "progress", ms: 1700, step: 3 },
  { id: "success", ms: 1700, step: 3 },
  { id: "refund", ms: 2200, step: 4 },
];

const STEPS = ["Upload", "Verify", "Form", "File", "Refund"];

/* --------------------------------------------------------------- utilities */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useInView(ref: RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/* Fits the fixed 560×600 stage into whatever width the hero column gives us. */
function useStageScale(wrapRef: RefObject<HTMLDivElement | null>, baseW = 560, baseH = 600) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w) setScale(Math.min(1, w / baseW));
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapRef, baseW]);
  return { scale, height: baseH * scale };
}

function useCounter(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(active ? 0 : target);
  useEffect(() => {
    if (!active) return;
    let raf: number;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

/* ------------------------------------------------------------------- icons */

type IconName =
  | "pan"
  | "aadhaar"
  | "pdf"
  | "bank"
  | "gov"
  | "calculator"
  | "shield"
  | "check"
  | "rupee"
  | "refund"
  | "certificate"
  | "spark";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "pan":
      return (
        <svg {...p}>
          <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
          <circle cx="8" cy="11" r="2" />
          <path d="M5 16c.6-1.3 1.7-2 3-2s2.4.7 3 2M14 10h4.5M14 13.5h3" />
        </svg>
      );
    case "aadhaar":
      return (
        <svg {...p}>
          <path d="M12 21c-1.6-2-2.4-4.3-2.4-6.7a2.4 2.4 0 1 1 4.8 0c0 1.3-.2 2.4-.6 3.4" />
          <path d="M6.6 17.4A11 11 0 0 1 5.2 12a6.8 6.8 0 0 1 13.6 0c0 1-.1 2-.4 2.9" />
          <path d="M8.3 6.2a6.9 6.9 0 0 1 7.7.4" />
        </svg>
      );
    case "pdf":
      return (
        <svg {...p}>
          <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
          <path d="M13.5 3v5.5H19M8.5 14h7M8.5 17h4.5" />
        </svg>
      );
    case "bank":
      return (
        <svg {...p}>
          <path d="M3.5 9.5 12 4.5l8.5 5" />
          <path d="M5.5 9.5v8M9.5 9.5v8M14.5 9.5v8M18.5 9.5v8M3 19.5h18" />
        </svg>
      );
    case "gov":
      return (
        <svg {...p}>
          <path d="M4 20.5h16M6 20.5V10m4 10.5V10m4 10.5V10m4 10.5V10" />
          <path d="M12 3.5 20 8H4z" />
        </svg>
      );
    case "calculator":
      return (
        <svg {...p}>
          <rect x="5" y="2.8" width="14" height="18.4" rx="2.4" />
          <path d="M8.5 7h7" />
          <circle cx="9" cy="12" r=".9" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="12" r=".9" fill="currentColor" stroke="none" />
          <circle cx="9" cy="16" r=".9" fill="currentColor" stroke="none" />
          <circle cx="12" cy="16" r=".9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="16" r=".9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 21c4.2-1.7 6.5-4.9 6.5-9.4V6L12 3.2 5.5 6v5.6C5.5 16.1 7.8 19.3 12 21z" />
          <path d="m9.3 11.8 1.9 1.9 3.6-3.6" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8.6" />
          <path d="m8.4 12.2 2.5 2.5 4.7-4.9" />
        </svg>
      );
    case "rupee":
      return (
        <svg {...p} strokeWidth={1.7}>
          <path d="M7.5 4.5h9M7.5 8.5h9M15.5 4.9c0 2.4-1.9 3.6-4.4 3.6H7.5l7.4 7.9" />
          <path d="M7.5 20.2 7.5 16.4" opacity="0" />
        </svg>
      );
    case "refund":
      return (
        <svg {...p}>
          <path d="M20 12a8 8 0 1 1-2.4-5.7" />
          <path d="M20 4v4.4h-4.4" />
          <path d="M12 8.6v6M9.6 12.2 12 14.6l2.4-2.4" />
        </svg>
      );
    case "certificate":
      return (
        <svg {...p}>
          <circle cx="12" cy="9.5" r="4.6" />
          <path d="m9.4 13.4-1.2 6.4 3.8-2 3.8 2-1.2-6.4" />
        </svg>
      );
    case "spark":
      return (
        <svg {...p}>
          <path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9z" />
          <path d="M18.5 16.5 19 18l1.5.5-1.5.5-.5 1.5-.5-1.5L16.5 18l1.5-.5z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------- screen bits */

function ScreenHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="cl-head">
      <div className="cl-eyebrow">{eyebrow}</div>
      <div className="cl-title">{title}</div>
    </div>
  );
}

const DOCS: { icon: IconName; label: string; meta: string }[] = [
  { icon: "pan", label: "PAN Card", meta: "ABCDE1234F" },
  { icon: "aadhaar", label: "Aadhaar", meta: "XXXX 8821" },
  { icon: "pdf", label: "Salary Slip", meta: "Form 16 · PDF" },
  { icon: "bank", label: "Bank Statement", meta: "HDFC · 2025-26" },
];

function ScreenStart() {
  return (
    <div className="cl-screen">
      <div className="cl-brandmark" style={{ animationDelay: "60ms" }}>
        <Icon name="shield" size={22} />
      </div>
      <ScreenHead eyebrow="FY 2025–26 · AY 2026–27" title="Start ITR filing" />
      <div className="cl-stack">
        {DOCS.slice(0, 3).map((d, i) => (
          <div key={d.label} className="cl-ghost-row" style={{ animationDelay: `${180 + i * 70}ms` }}>
            <span className="cl-ghost-dot" />
            <span className="cl-ghost-bar" style={{ width: `${72 - i * 12}%` }} />
          </div>
        ))}
      </div>
      <button className="cl-cta" type="button" tabIndex={-1} aria-hidden="true">
        <span className="cl-ripple" />
        Get started
      </button>
      <div className="cl-foot">Takes about 4 minutes</div>
    </div>
  );
}

function ScreenUpload() {
  return (
    <div className="cl-screen">
      <ScreenHead eyebrow="Step 1 of 4" title="Upload documents" />
      <div className="cl-progress-track">
        <span className="cl-progress-fill" />
      </div>
      <div className="cl-rows">
        {DOCS.map((d, i) => (
          <div key={d.label} className="cl-row cl-row-in" style={{ animationDelay: `${120 + i * 480}ms` }}>
            <span className="cl-row-ic">
              <Icon name={d.icon} size={16} />
            </span>
            <span className="cl-row-txt">
              <b>{d.label}</b>
              <i>{d.meta}</i>
            </span>
            <span className="cl-row-tag">Added</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenVerify() {
  return (
    <div className="cl-screen">
      <span className="cl-scanline" />
      <ScreenHead eyebrow="Step 2 of 4" title="Verifying details" />
      <div className="cl-ai-chip">
        <Icon name="spark" size={13} /> Automated checks running
      </div>
      <div className="cl-rows">
        {DOCS.map((d, i) => (
          <div key={d.label} className="cl-row cl-row-lit" style={{ animationDelay: `${180 + i * 420}ms` }}>
            <span className="cl-row-ic">
              <Icon name={d.icon} size={16} />
            </span>
            <span className="cl-row-txt">
              <b>{d.label}</b>
              <i>Matched with records</i>
            </span>
            <span className="cl-tick" style={{ animationDelay: `${420 + i * 420}ms` }}>
              <Icon name="check" size={16} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const FORMS = [
  { id: "ITR-1", sub: "Salary up to ₹50L" },
  { id: "ITR-2", sub: "Capital gains" },
  { id: "ITR-3", sub: "Business income" },
  { id: "ITR-4", sub: "Presumptive" },
];

function ScreenForm() {
  return (
    <div className="cl-screen">
      <ScreenHead eyebrow="Step 3 of 4" title="Matching your form" />
      <div className="cl-forms">
        {FORMS.map((f, i) => (
          <div
            key={f.id}
            className={`cl-form ${i === 0 ? "cl-form-sel" : "cl-form-out"}`}
            style={{ animationDelay: `${i === 0 ? 900 : 780 + i * 90}ms` }}
          >
            <b>{f.id}</b>
            <i>{f.sub}</i>
          </div>
        ))}
      </div>
      <div className="cl-picked">
        <span className="cl-picked-ic">
          <Icon name="check" size={15} />
        </span>
        ITR-1 fits your income
      </div>
    </div>
  );
}

function ScreenProgress({ active }: { active: boolean }) {
  const pct = useCounter(100, 1350, active);
  const R = 46;
  const C = 2 * Math.PI * R;
  return (
    <div className="cl-screen cl-screen-center">
      <ScreenHead eyebrow="Step 4 of 4" title="Filing your return" />
      <div className="cl-dial">
        <span className="cl-orbit">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="cl-orbit-dot" style={{ transform: `rotate(${i * 60}deg) translateY(-62px)` }} />
          ))}
        </span>
        <svg width="124" height="124" viewBox="0 0 124 124" aria-hidden="true">
          <circle cx="62" cy="62" r={R} fill="none" stroke="#EEF1FA" strokeWidth="9" />
          <circle
            className="cl-dial-arc"
            cx="62"
            cy="62"
            r={R}
            fill="none"
            stroke={BLUE}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C}
            style={{ "--c": C } as React.CSSProperties}
          />
        </svg>
        <div className="cl-dial-val">
          {pct}
          <span>%</span>
        </div>
      </div>
      <div className="cl-foot cl-foot-lift">Submitting to the Income Tax portal</div>
    </div>
  );
}

function ScreenSuccess() {
  return (
    <div className="cl-screen cl-screen-center">
      <div className="cl-seal">
        <svg width="66" height="66" viewBox="0 0 66 66" aria-hidden="true">
          <circle className="cl-seal-ring" cx="33" cy="33" r="29" fill="none" stroke="#12B76A" strokeWidth="3" />
          <path
            className="cl-seal-check"
            d="M21 34.2 29.4 42 45 25"
            fill="none"
            stroke="#12B76A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="cl-done-title">Return filed</div>
      <div className="cl-done-sub">Verified with Aadhaar OTP</div>
      <div className="cl-cert">
        <span className="cl-cert-ic">
          <Icon name="certificate" size={17} />
        </span>
        <span className="cl-cert-txt">
          <b>Acknowledgement</b>
          <i>2026 4471 8093 2274</i>
        </span>
      </div>
    </div>
  );
}

function ScreenRefund({ active }: { active: boolean }) {
  const amount = useCounter(8450, 1100, active);
  return (
    <div className="cl-screen cl-screen-center">
      <ScreenHead eyebrow="Assessment complete" title="Refund on its way" />
      <div className="cl-flow">
        <span className="cl-flow-node">
          <Icon name="gov" size={19} />
        </span>
        <span className="cl-flow-wire">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="cl-flow-dot" style={{ animationDelay: `${i * 200}ms` }} />
          ))}
        </span>
        <span className="cl-flow-node cl-flow-node-end">
          <Icon name="bank" size={19} />
        </span>
      </div>
      <div className="cl-amount">
        ₹{amount.toLocaleString("en-IN")}
        <span className="cl-coin cl-coin-a" />
        <span className="cl-coin cl-coin-b" />
        <span className="cl-coin cl-coin-c" />
      </div>
      <div className="cl-credited">Credited to HDFC ••8842</div>
    </div>
  );
}

/* --------------------------------------------------------------- component */

export default function ITRFilingAnimation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(wrapRef);
  const { scale, height } = useStageScale(wrapRef);
  const [i, setI] = useState(0);

  const running = inView && !reduced;
  const scene = reduced ? { id: "success" as SceneId, step: 4 } : SCENES[i];

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI((n) => (n + 1) % SCENES.length), SCENES[i].ms);
    return () => clearTimeout(t);
  }, [i, running]);

  const orbit: { name: IconName; x: number; y: number; d: number }[] = [
    { name: "pan", x: 58, y: 118, d: 0 },
    { name: "shield", x: 28, y: 244, d: 1.1 },
    { name: "bank", x: 62, y: 366, d: 2.2 },
    { name: "calculator", x: 40, y: 468, d: 3.1 },
    { name: "pdf", x: 500, y: 118, d: 0.7 },
    { name: "check", x: 526, y: 240, d: 1.8 },
    { name: "rupee", x: 496, y: 360, d: 2.6 },
    { name: "certificate", x: 516, y: 466, d: 3.6 },
  ];

  const flyers: { name: IconName; label: string; sx: number; sy: number; d: number }[] = [
    { name: "pan", label: "PAN", sx: -300, sy: -70, d: 0 },
    { name: "aadhaar", label: "Aadhaar", sx: 310, sy: 10, d: 0.36 },
    { name: "pdf", label: "Form 16", sx: -290, sy: 120, d: 0.72 },
    { name: "bank", label: "Statement", sx: 300, sy: 180, d: 1.08 },
  ];

  return (
    <div className="cl-itr" ref={wrapRef} style={{ height }} aria-hidden="true">
      <style>{CSS}</style>

      <div className="cl-stage" style={{ transform: `scale(${scale})` }} data-still={reduced ? "1" : undefined}>
        <span className="cl-halo" />

        {/* ambient ecosystem */}
        {orbit.map((o) => (
          <span key={o.name + o.x} className="cl-chip" style={{ left: o.x, top: o.y, animationDelay: `${o.d}s` }}>
            <Icon name={o.name} size={19} />
          </span>
        ))}

        {/* documents flying in during upload */}
        {scene.id === "upload" &&
          flyers.map((f) => (
            <span
              key={f.label}
              className="cl-flyer"
              style={{ "--sx": `${f.sx}px`, "--sy": `${f.sy}px`, animationDelay: `${f.d}s` } as React.CSSProperties}
            >
              <Icon name={f.name} size={16} />
              {f.label}
            </span>
          ))}

        {/* verification pulse */}
        {scene.id === "verify" && (
          <>
            <span className="cl-pulse" />
            <span className="cl-pulse" style={{ animationDelay: "0.9s" }} />
          </>
        )}

        {/* phone */}
        <div className="cl-phone">
          <span className="cl-notch" />
          <div className="cl-view" key={scene.id}>
            {scene.id === "start" && <ScreenStart />}
            {scene.id === "upload" && <ScreenUpload />}
            {scene.id === "verify" && <ScreenVerify />}
            {scene.id === "form" && <ScreenForm />}
            {scene.id === "progress" && <ScreenProgress active={running} />}
            {scene.id === "success" && <ScreenSuccess />}
            {scene.id === "refund" && <ScreenRefund active={running} />}
          </div>
        </div>

        {/* glass overlays */}
        {scene.id === "verify" && (
          <div className="cl-glass cl-glass-l">
            <span className="cl-glass-ic cl-ok">
              <Icon name="check" size={16} />
            </span>
            <span className="cl-glass-txt">
              <b>4 of 4 verified</b>
              <i>No mismatches found</i>
            </span>
          </div>
        )}

        {scene.id === "form" && (
          <div className="cl-glass cl-glass-r">
            <span className="cl-glass-ic">
              <Icon name="spark" size={16} />
            </span>
            <span className="cl-glass-txt">
              <b>ITR-1 selected</b>
              <i>Based on your income</i>
            </span>
          </div>
        )}

        {scene.id === "refund" && (
          <div className="cl-glass cl-glass-l">
            <span className="cl-glass-ic cl-ok">
              <Icon name="refund" size={16} />
            </span>
            <span className="cl-glass-txt">
              <b>₹8,450 refund</b>
              <i>Expected in 7 days</i>
            </span>
          </div>
        )}

        {/* journey rail */}
        <div className="cl-rail">
          {STEPS.map((s, n) => (
            <div key={s} className={`cl-rail-item ${n <= scene.step ? "on" : ""}`}>
              <span className="cl-rail-dot" />
              <span className="cl-rail-label">{s}</span>
              {n < STEPS.length - 1 && <span className={`cl-rail-line ${n < scene.step ? "on" : ""}`} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- style */

const CSS = `
.cl-itr{position:relative;width:100%;display:flex;align-items:flex-start;justify-content:center;
  font-family:inherit;color:#0B0F1F;-webkit-font-smoothing:antialiased}
.cl-itr *{box-sizing:border-box}
.cl-stage{position:relative;width:560px;height:600px;flex:none;transform-origin:top center}

.cl-halo{position:absolute;left:50%;top:46%;width:520px;height:520px;transform:translate(-50%,-50%);
  background:radial-gradient(circle,rgba(59,91,255,.09) 0%,rgba(59,91,255,.03) 42%,rgba(59,91,255,0) 68%);
  border-radius:50%;pointer-events:none}

/* ---- phone ---- */
.cl-phone{position:absolute;left:50%;top:32px;transform:translateX(-50%);width:236px;height:470px;
  background:#fff;border:1px solid #E9ECF5;border-radius:34px;padding:9px;
  box-shadow:0 32px 64px -28px rgba(21,32,78,.28),0 8px 20px -8px rgba(21,32,78,.10),0 0 0 5px rgba(255,255,255,.9);
  animation:cl-hover 7s ease-in-out infinite}
.cl-notch{position:absolute;left:50%;top:15px;transform:translateX(-50%);width:52px;height:5px;border-radius:99px;background:#EDEFF6}
.cl-view{position:relative;width:100%;height:100%;border-radius:26px;background:#fff;overflow:hidden;
  animation:cl-viewin .5s cubic-bezier(.22,1,.36,1) both}

.cl-screen{position:relative;height:100%;padding:34px 18px 20px;display:flex;flex-direction:column}
.cl-screen-center{align-items:center;text-align:center}
.cl-head{margin-bottom:14px}
.cl-eyebrow{font-size:9.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:${BLUE};margin-bottom:5px}
.cl-title{font-size:17px;font-weight:700;letter-spacing:-.02em;line-height:1.2}
.cl-foot{margin-top:auto;font-size:10px;color:#98A0B4;letter-spacing:.01em}
.cl-foot-lift{margin-top:22px}

/* start */
.cl-brandmark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff;
  background:linear-gradient(150deg,#5C74FF,${BLUE});box-shadow:0 8px 18px -8px rgba(59,91,255,.7);margin-bottom:16px;
  animation:cl-pop .5s cubic-bezier(.22,1.4,.4,1) both}
.cl-stack{display:flex;flex-direction:column;gap:9px;margin-top:6px}
.cl-ghost-row{display:flex;align-items:center;gap:8px;animation:cl-rise .5s cubic-bezier(.22,1,.36,1) both}
.cl-ghost-dot{width:22px;height:22px;border-radius:7px;background:#F3F5FB;flex:none}
.cl-ghost-bar{height:7px;border-radius:99px;background:#F3F5FB}
.cl-cta{position:relative;overflow:hidden;margin-top:20px;width:100%;border:0;border-radius:13px;padding:11px 0;
  background:${BLUE};color:#fff;font:inherit;font-size:12.5px;font-weight:600;letter-spacing:-.01em;
  box-shadow:0 10px 22px -10px rgba(59,91,255,.85);animation:cl-rise .5s .35s cubic-bezier(.22,1,.36,1) both}
.cl-ripple{position:absolute;left:50%;top:50%;width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.55);
  transform:translate(-50%,-50%) scale(0);animation:cl-ripple 2s .7s cubic-bezier(.22,1,.36,1) infinite}

/* rows */
.cl-progress-track{height:5px;border-radius:99px;background:#F1F3FA;overflow:hidden;margin-bottom:16px}
.cl-progress-fill{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#7C8DFF,${BLUE});
  animation:cl-fill 2.3s cubic-bezier(.4,0,.2,1) forwards}
.cl-rows{display:flex;flex-direction:column;gap:8px}
.cl-row{display:flex;align-items:center;gap:9px;padding:9px 10px;border:1px solid #EDEFF7;border-radius:13px;background:#fff;
  box-shadow:0 2px 8px -4px rgba(21,32,78,.10)}
.cl-row-in{animation:cl-drop .55s cubic-bezier(.22,1.2,.36,1) both}
.cl-row-lit{animation:cl-rise .45s cubic-bezier(.22,1,.36,1) both}
.cl-row-ic{width:26px;height:26px;flex:none;border-radius:8px;display:grid;place-items:center;background:#EEF1FF;color:${BLUE}}
.cl-row-txt{display:flex;flex-direction:column;gap:1px;min-width:0}
.cl-row-txt b{font-size:11px;font-weight:600;letter-spacing:-.01em}
.cl-row-txt i{font-size:9px;font-style:normal;color:#98A0B4}
.cl-row-tag{margin-left:auto;font-size:8.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#98A0B4}
.cl-tick{margin-left:auto;color:#12B76A;display:grid;place-items:center;animation:cl-pop .45s cubic-bezier(.22,1.5,.4,1) both}
.cl-ai-chip{display:inline-flex;align-items:center;gap:5px;align-self:flex-start;margin-bottom:12px;padding:5px 9px;border-radius:99px;
  background:#EEF1FF;color:${BLUE};font-size:9.5px;font-weight:600}
.cl-scanline{position:absolute;left:0;right:0;top:0;height:96px;pointer-events:none;z-index:2;
  background:linear-gradient(180deg,rgba(59,91,255,0) 0%,rgba(59,91,255,.10) 55%,rgba(59,91,255,0) 100%);
  animation:cl-scan 1.9s cubic-bezier(.5,0,.5,1) infinite}

/* forms */
.cl-forms{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cl-form{padding:12px 10px;border:1px solid #EDEFF7;border-radius:14px;display:flex;flex-direction:column;gap:2px;background:#fff}
.cl-form b{font-size:13px;font-weight:700;letter-spacing:-.02em}
.cl-form i{font-size:8.5px;font-style:normal;color:#98A0B4}
.cl-form-out{animation:cl-formout .55s cubic-bezier(.4,0,.2,1) both}
.cl-form-sel{animation:cl-formsel .6s cubic-bezier(.22,1.3,.4,1) both}
.cl-picked{margin-top:16px;display:inline-flex;align-items:center;gap:7px;padding:9px 11px;border-radius:12px;
  background:#F4F6FF;color:${BLUE};font-size:10.5px;font-weight:600;animation:cl-rise .5s 1.35s cubic-bezier(.22,1,.36,1) both}
.cl-picked-ic{display:grid;place-items:center;color:${BLUE}}

/* dial */
.cl-dial{position:relative;margin-top:26px;display:grid;place-items:center}
.cl-dial svg{transform:rotate(-90deg)}
.cl-dial-arc{animation:cl-arc 1.45s cubic-bezier(.4,0,.2,1) forwards}
.cl-dial-val{position:absolute;font-size:24px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.cl-dial-val span{font-size:12px;font-weight:600;color:#98A0B4;margin-left:1px}
.cl-orbit{position:absolute;width:0;height:0;animation:cl-spin 6s linear infinite}
.cl-orbit-dot{position:absolute;width:4px;height:4px;margin:-2px;border-radius:50%;background:${BLUE};opacity:.32}

/* success */
.cl-seal{margin-top:44px;animation:cl-pop .55s cubic-bezier(.22,1.4,.4,1) both}
.cl-seal-ring{stroke-dasharray:183;stroke-dashoffset:183;animation:cl-draw .7s .05s cubic-bezier(.4,0,.2,1) forwards}
.cl-seal-check{stroke-dasharray:40;stroke-dashoffset:40;animation:cl-draw .45s .5s cubic-bezier(.4,0,.2,1) forwards}
.cl-done-title{margin-top:18px;font-size:19px;font-weight:700;letter-spacing:-.025em;animation:cl-rise .5s .35s cubic-bezier(.22,1,.36,1) both}
.cl-done-sub{margin-top:5px;font-size:10.5px;color:#98A0B4;animation:cl-rise .5s .45s cubic-bezier(.22,1,.36,1) both}
.cl-cert{margin-top:22px;width:100%;display:flex;align-items:center;gap:9px;padding:11px;border-radius:14px;
  border:1px solid #EDEFF7;background:#fff;text-align:left;box-shadow:0 10px 24px -14px rgba(21,32,78,.35);
  animation:cl-slideup .6s .6s cubic-bezier(.22,1,.36,1) both}
.cl-cert-ic{width:28px;height:28px;flex:none;border-radius:9px;display:grid;place-items:center;background:#EEF1FF;color:${BLUE}}
.cl-cert-txt{display:flex;flex-direction:column;gap:1px}
.cl-cert-txt b{font-size:10px;font-weight:600}
.cl-cert-txt i{font-size:10px;font-style:normal;color:#98A0B4;font-variant-numeric:tabular-nums;letter-spacing:.02em}

/* refund */
.cl-flow{margin-top:24px;display:flex;align-items:center;gap:10px}
.cl-flow-node{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#F4F6FF;color:${BLUE};
  animation:cl-pop .5s cubic-bezier(.22,1.4,.4,1) both}
.cl-flow-node-end{background:${BLUE};color:#fff;box-shadow:0 10px 20px -10px rgba(59,91,255,.8);animation-delay:.12s}
.cl-flow-wire{position:relative;width:74px;height:2px;border-radius:99px;background:#EDEFF7}
.cl-flow-dot{position:absolute;top:-2px;left:0;width:6px;height:6px;border-radius:50%;background:${BLUE};
  animation:cl-travel 1.1s cubic-bezier(.4,0,.2,1) infinite}
.cl-amount{position:relative;margin-top:20px;font-size:32px;font-weight:700;letter-spacing:-.035em;font-variant-numeric:tabular-nums;
  animation:cl-pop .5s .2s cubic-bezier(.22,1.3,.4,1) both}
.cl-credited{margin-top:6px;font-size:10.5px;color:#98A0B4;animation:cl-rise .5s .4s cubic-bezier(.22,1,.36,1) both}
.cl-coin{position:absolute;bottom:2px;width:7px;height:7px;border-radius:50%;background:${BLUE};opacity:0}
.cl-coin-a{left:-14px;animation:cl-coin 2.2s .4s ease-out infinite}
.cl-coin-b{right:-16px;width:5px;height:5px;animation:cl-coin 2.2s .9s ease-out infinite}
.cl-coin-c{left:36%;width:4px;height:4px;animation:cl-coin 2.2s 1.4s ease-out infinite}

/* ---- stage furniture ---- */
.cl-chip{position:absolute;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:15px;display:grid;place-items:center;
  color:${BLUE};background:rgba(255,255,255,.72);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border:1px solid rgba(233,236,245,.9);box-shadow:0 14px 30px -18px rgba(21,32,78,.45);
  animation:cl-float 6.5s ease-in-out infinite}
.cl-flyer{position:absolute;left:50%;top:250px;display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:12px;
  background:rgba(255,255,255,.86);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid #E9ECF5;
  color:${BLUE};font-size:11px;font-weight:600;white-space:nowrap;z-index:3;
  box-shadow:0 18px 34px -20px rgba(21,32,78,.5);animation:cl-fly 1.6s cubic-bezier(.5,0,.2,1) both}
.cl-pulse{position:absolute;left:50%;top:267px;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:50%;
  border:1px solid rgba(59,91,255,.35);animation:cl-pulse 1.8s cubic-bezier(.22,1,.36,1) infinite}

.cl-glass{position:absolute;display:flex;align-items:center;gap:9px;padding:11px 13px;border-radius:16px;z-index:4;
  background:rgba(255,255,255,.68);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);
  border:1px solid rgba(255,255,255,.85);box-shadow:0 22px 44px -22px rgba(21,32,78,.5),0 0 0 1px rgba(233,236,245,.6);
  animation:cl-glassin .55s cubic-bezier(.22,1,.36,1) both}
.cl-glass-l{left:34px;top:392px}
.cl-glass-r{right:26px;top:150px}
.cl-glass-ic{width:30px;height:30px;flex:none;border-radius:10px;display:grid;place-items:center;background:#EEF1FF;color:${BLUE}}
.cl-glass-ic.cl-ok{background:#E8F8F0;color:#12B76A}
.cl-glass-txt{display:flex;flex-direction:column;gap:2px}
.cl-glass-txt b{font-size:11.5px;font-weight:600;letter-spacing:-.01em}
.cl-glass-txt i{font-size:9.5px;font-style:normal;color:#98A0B4}

/* ---- rail ---- */
.cl-rail{position:absolute;left:40px;right:40px;bottom:22px;display:flex}
.cl-rail-item{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;gap:7px}
.cl-rail-dot{width:8px;height:8px;border-radius:50%;background:#E4E8F2;transition:background .45s ease,transform .45s ease,box-shadow .45s ease}
.cl-rail-item.on .cl-rail-dot{background:${BLUE};transform:scale(1.25);box-shadow:0 0 0 4px rgba(59,91,255,.14)}
.cl-rail-label{font-size:9.5px;font-weight:600;letter-spacing:.01em;color:#B4BAC9;transition:color .45s ease}
.cl-rail-item.on .cl-rail-label{color:#0B0F1F}
.cl-rail-line{position:absolute;top:3.5px;left:calc(50% + 10px);right:calc(-50% + 10px);height:1.5px;border-radius:99px;background:#E4E8F2}
.cl-rail-line.on{background:${BLUE};opacity:.55}

/* ---- keyframes ---- */
@keyframes cl-hover{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-8px)}}
@keyframes cl-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes cl-viewin{from{opacity:0;transform:translateY(10px);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes cl-rise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
@keyframes cl-slideup{from{opacity:0;transform:translateY(22px);filter:blur(5px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes cl-pop{from{opacity:0;transform:scale(.72)}to{opacity:1;transform:scale(1)}}
@keyframes cl-drop{0%{opacity:0;transform:translateY(-14px) scale(.94)}60%{opacity:1}100%{opacity:1;transform:none}}
@keyframes cl-fill{from{width:4%}to{width:100%}}
@keyframes cl-scan{0%{transform:translateY(-100px)}100%{transform:translateY(460px)}}
@keyframes cl-formout{0%{opacity:1}100%{opacity:.12;filter:blur(2px);transform:scale(.94)}}
@keyframes cl-formsel{0%{transform:scale(1);border-color:#EDEFF7;box-shadow:none}
  100%{transform:scale(1.04);border-color:${BLUE};box-shadow:0 12px 26px -14px rgba(59,91,255,.75)}}
@keyframes cl-arc{to{stroke-dashoffset:0}}
@keyframes cl-spin{to{transform:rotate(360deg)}}
@keyframes cl-draw{to{stroke-dashoffset:0}}
@keyframes cl-travel{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(68px);opacity:0}}
@keyframes cl-coin{0%{opacity:0;transform:translateY(0) scale(.6)}25%{opacity:.8}100%{opacity:0;transform:translateY(-34px) scale(1)}}
@keyframes cl-ripple{0%{transform:translate(-50%,-50%) scale(0);opacity:.55}70%{opacity:0}100%{transform:translate(-50%,-50%) scale(16);opacity:0}}
@keyframes cl-pulse{0%{transform:scale(.82);opacity:.55}100%{transform:scale(1.12);opacity:0}}
@keyframes cl-glassin{from{opacity:0;transform:translateY(14px) scale(.96);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes cl-fly{
  0%{opacity:0;transform:translate(calc(-50% + var(--sx)),calc(-50% + var(--sy))) scale(.9)}
  18%{opacity:1}
  70%{opacity:1;transform:translate(-50%,-50%) scale(1)}
  100%{opacity:0;transform:translate(-50%,-46%) scale(.55)}
}

@media (prefers-reduced-motion: reduce){
  .cl-itr *,.cl-itr *::before,.cl-itr *::after{animation:none !important;transition:none !important}
  .cl-seal-ring,.cl-seal-check{stroke-dashoffset:0}
}
`;