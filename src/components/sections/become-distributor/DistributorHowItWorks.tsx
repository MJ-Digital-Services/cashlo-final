"use client";

import { useState, useEffect, useRef, type CSSProperties, type ComponentType } from "react";
import {
  Search,
  MapPin,
  Check,
  Mail,
  Shield,
  FileText,
  Store,
  Wallet,
  TrendingUp,
  User,
  Phone,
  Briefcase,
  AtSign,
} from "lucide-react";

/* ------------------------------------------------------------------
   Cashlo — "How it works" animated onboarding walkthrough
   Auto-plays 7 steps (~3.5s each ≈ 24s total), then loops forever.
   No dependencies beyond React + lucide-react. All motion is CSS
   transform/opacity only, so it stays GPU-composited at 60fps.
------------------------------------------------------------------- */

const STEP_MS = 3500; // time each step stays on stage
const EXIT_MS = 450; // slide-out window at the end of each step

/* ---------------------------- helpers ---------------------------- */

// Types a string character by character using staggered CSS delays.
function Typed({
  text,
  delay = 0,
  speed = 0.075,
  caret = true,
}: {
  text: string;
  delay?: number;
  speed?: number;
  caret?: boolean;
}) {
  const chars = text.split("");
  const end = delay + chars.length * speed;
  return (
    <span className="hiw-typed">
      {chars.map((c, i) => (
        <span
          key={i}
          className="hiw-char"
          style={{ animationDelay: `${delay + i * speed}s` }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
      {caret && (
        <i
          className="hiw-caret"
          style={{ animationDelay: `${delay}s`, "--caret-end": `${end}s` } as CSSProperties}
        />
      )}
    </span>
  );
}

// Counts up to a target number, restarts whenever the step remounts.
function useCountUp(target: number, duration = 1600, delay = 800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    let start: number | null = null;
    const timeout = setTimeout(() => {
      const tick = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(target * eased));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay]);
  return value;
}

// Deterministic QR-ish matrix so the pattern never flickers between renders.
function qrMatrix(size = 21): [number, number][] {
  const cells: [number, number][] = [];
  let seed = 7919;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const inFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c > size - 8) || (r > size - 8 && c < 7);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (inFinder(r, c)) continue;
      if (rand() > 0.55) cells.push([r, c]);
    }
  }
  return cells;
}
const QR_CELLS = qrMatrix();

/* -------------------------- illustrations ------------------------- */

function IlloPinCode() {
  return (
    <div className="hiw-scene hiw-map">
      <svg className="hiw-mapart" viewBox="0 0 420 220" aria-hidden="true">
        <defs>
          <pattern id="hiwGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0v28" fill="none" stroke="#E7EAF3" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="420" height="220" fill="url(#hiwGrid)" />
        <path d="M0 138h420" stroke="#DDE2F0" strokeWidth="9" strokeLinecap="round" />
        <path d="M152 0v220" stroke="#DDE2F0" strokeWidth="9" strokeLinecap="round" />
        <path d="M300 0v220" stroke="#E7EAF3" strokeWidth="6" />
        <path d="M0 62h420" stroke="#E7EAF3" strokeWidth="6" />
        <rect x="34" y="20" width="70" height="30" rx="6" fill="#EFF2FA" />
        <rect x="196" y="80" width="76" height="40" rx="6" fill="#EFF2FA" />
        <rect x="326" y="160" width="62" height="34" rx="6" fill="#EFF2FA" />
      </svg>

      <div className="hiw-search">
        <Search size={16} strokeWidth={2.4} />
        <span className="hiw-search-text">
          <Typed text="110001" delay={0.25} speed={0.11} />
        </span>
      </div>

      <div className="hiw-pinwrap">
        <span className="hiw-ripple" style={{ animationDelay: "1.25s" }} />
        <span className="hiw-ripple" style={{ animationDelay: "1.65s" }} />
        <span className="hiw-ripple" style={{ animationDelay: "2.05s" }} />
        <span className="hiw-pin">
          <MapPin size={22} strokeWidth={2.6} />
        </span>
      </div>

      <div className="hiw-glass hiw-areacard">
        <div>
          <p className="hiw-glass-k">Selected area</p>
          <p className="hiw-glass-v">110001 · Connaught Place</p>
        </div>
        <span className="hiw-chip hiw-chip-green" style={{ animationDelay: "2.25s" }}>
          <Check size={12} strokeWidth={3.5} /> Reserved
        </span>
      </div>
    </div>
  );
}

function IlloForm() {
  const fields = [
    { icon: User, label: "Full name", value: "Rahul Sharma" },
    { icon: Phone, label: "Mobile number", value: "98765 43210" },
    { icon: AtSign, label: "Email", value: "rahul@cashlo.in" },
    { icon: Briefcase, label: "Business name", value: "Sharma Enterprises" },
  ];
  return (
    <div className="hiw-scene hiw-form">
      {fields.map((f, i) => {
        const start = 0.2 + i * 0.62;
        const IconEl = f.icon;
        return (
          <div
            className="hiw-field"
            key={f.label}
            style={{ animationDelay: `${i * 0.09}s` }}
          >
            <span className="hiw-field-focus" style={{ animationDelay: `${start}s` }} />
            <IconEl size={15} strokeWidth={2.3} className="hiw-field-icon" />
            <span className="hiw-field-body">
              <span className="hiw-field-label">{f.label}</span>
              <span className="hiw-field-value">
                <Typed text={f.value} delay={start} speed={0.028} />
              </span>
            </span>
            <span className="hiw-tick" style={{ animationDelay: `${start + 0.52}s` }}>
              <Check size={11} strokeWidth={4} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function IlloOtp() {
  const digits = ["4", "8", "2", "0", "1", "9"];
  return (
    <div className="hiw-scene hiw-otp">
      <div className="hiw-envelope">
        <Mail size={26} strokeWidth={2.2} />
        <span className="hiw-badge-dot" />
      </div>
      <p className="hiw-otp-note">Code sent to rahul@cashlo.in</p>
      <div className="hiw-otp-row">
        {digits.map((d, i) => (
          <span
            className="hiw-otp-box"
            key={i}
            style={
              {
                animationDelay: `${0.75 + i * 0.14}s`,
                "--fill-delay": `${0.75 + i * 0.14}s`,
              } as CSSProperties
            }
          >
            <b style={{ animationDelay: `${0.8 + i * 0.14}s` }}>{d}</b>
          </span>
        ))}
      </div>
      <span className="hiw-chip hiw-chip-green hiw-otp-chip" style={{ animationDelay: "1.95s" }}>
        <Check size={12} strokeWidth={3.5} /> Email verified
      </span>
      <div className="hiw-confetti">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            style={
              {
                "--tx": `${(i - 6.5) * 15}px`,
                "--ty": `${-40 - ((i * 37) % 46)}px`,
                "--rot": `${(i * 63) % 360}deg`,
                background: i % 3 === 0 ? "#12B76A" : i % 3 === 1 ? "#3B5BFF" : "#FFC53D",
                animationDelay: `${2 + (i % 5) * 0.05}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

function IlloPayment() {
  return (
    <div className="hiw-scene hiw-pay">
      <div className="hiw-qr">
        <svg viewBox="0 0 21 21" aria-hidden="true">
          {(
            [
              [0, 0],
              [0, 14],
              [14, 0],
            ] as [number, number][]
          ).map(([r, c], i) => (
            <g key={i}>
              <rect x={c} y={r} width="7" height="7" rx="1.4" fill="#0B1020" />
              <rect x={c + 1.4} y={r + 1.4} width="4.2" height="4.2" rx="0.8" fill="#fff" />
              <rect x={c + 2.4} y={r + 2.4} width="2.2" height="2.2" rx="0.5" fill="#0B1020" />
            </g>
          ))}
          {QR_CELLS.map(([r, c], i) => (
            <rect key={i} x={c} y={r} width="1" height="1" fill="#0B1020" opacity="0.88" />
          ))}
        </svg>
        <span className="hiw-scanline" />
        <span className="hiw-qr-label">Scan to pay</span>
      </div>

      <div className="hiw-phone">
        <div className="hiw-phone-notch" />
        <div className="hiw-phone-body">
          <p className="hiw-pay-k">PIN reservation fee</p>
          <p className="hiw-pay-amt">₹1,100</p>
          <p className="hiw-pay-sub">One-time · UPI</p>
          <div className="hiw-pay-state">
            <span className="hiw-spinner" />
            <span className="hiw-pay-done">
              <span className="hiw-tickbig">
                <Check size={20} strokeWidth={4} />
              </span>
              Payment successful
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IlloReserved() {
  return (
    <div className="hiw-scene hiw-reserve">
      <div className="hiw-radar">
        <span className="hiw-radar-ring" style={{ animationDelay: "0.4s" }} />
        <span className="hiw-radar-ring" style={{ animationDelay: "0.9s" }} />
        <span className="hiw-radar-ring" style={{ animationDelay: "1.4s" }} />
        <span className="hiw-radar-core" />
        <span className="hiw-shield">
          <Shield size={30} strokeWidth={2.2} />
          <Check size={14} strokeWidth={4} className="hiw-shield-check" />
        </span>
      </div>
      <div className="hiw-glass hiw-reserve-card">
        <p className="hiw-glass-k">PIN code 110001</p>
        <p className="hiw-glass-v">Reserved to you — exclusive territory</p>
      </div>
      <div className="hiw-sparks">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            style={
              {
                "--tx": `${Math.cos((i / 10) * 6.28) * 90}px`,
                "--ty": `${Math.sin((i / 10) * 6.28) * 62}px`,
                animationDelay: `${1.65 + (i % 4) * 0.06}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

function IlloKyc() {
  const docs = [
    { label: "PAN card", lines: 3 },
    { label: "Aadhaar", lines: 3 },
    { label: "Photo", lines: 2 },
    { label: "Bank details", lines: 3 },
  ];
  return (
    <div className="hiw-scene hiw-kyc">
      <div className="hiw-docs">
        {docs.map((d, i) => (
          <div
            className="hiw-doc"
            key={d.label}
            style={
              {
                animationDelay: `${0.1 + i * 0.1}s`,
                "--verify": `${0.85 + i * 0.42}s`,
              } as CSSProperties
            }
          >
            <span className="hiw-doc-scan" style={{ animationDelay: `${0.5 + i * 0.42}s` }} />
            <FileText size={17} strokeWidth={2.2} className="hiw-doc-icon" />
            <span className="hiw-doc-lines">
              {Array.from({ length: d.lines }).map((_, k) => (
                <i key={k} style={{ width: `${70 - k * 16}%` }} />
              ))}
            </span>
            <span className="hiw-doc-label">{d.label}</span>
            <span className="hiw-doc-tick" style={{ animationDelay: `${0.85 + i * 0.42}s` }}>
              <Check size={10} strokeWidth={4} />
            </span>
          </div>
        ))}
      </div>
      <span className="hiw-chip hiw-chip-green hiw-kyc-chip" style={{ animationDelay: "2.5s" }}>
        <Check size={12} strokeWidth={3.5} /> KYC approved
      </span>
    </div>
  );
}

function IlloEarn() {
  const balance = useCountUp(1860, 1500, 950);
  const bars = [26, 40, 34, 58, 72, 96];
  return (
    <div className="hiw-scene hiw-earn">
      <div className="hiw-store">
        <svg viewBox="0 0 150 120" aria-hidden="true">
          <path d="M18 42h114v66a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="#F3F5FC" />
          <path d="M14 42 26 18h98l12 24z" fill="#3B5BFF" opacity="0.16" />
          <path d="M14 42 26 18h98l12 24z" fill="none" stroke="#3B5BFF" strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="60" y="66" width="30" height="46" rx="3" fill="#fff" stroke="#3B5BFF" strokeWidth="2.4" />
          <rect x="30" y="60" width="20" height="18" rx="3" fill="#fff" stroke="#C9D1EE" strokeWidth="2" />
          <rect x="100" y="60" width="20" height="18" rx="3" fill="#fff" stroke="#C9D1EE" strokeWidth="2" />
          <path d="M18 42h114" stroke="#3B5BFF" strokeWidth="2.4" />
        </svg>
        <Store size={0} />
        <div className="hiw-walkers">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ animationDelay: `${0.55 + i * 0.45}s` }} />
          ))}
        </div>
        <span className="hiw-store-tag">Cashlo merchant</span>
      </div>

      <div className="hiw-earn-right">
        <div className="hiw-glass hiw-wallet">
          <span className="hiw-wallet-icon">
            <Wallet size={16} strokeWidth={2.3} />
          </span>
          <div>
            <p className="hiw-glass-k">Commission wallet</p>
            <p className="hiw-wallet-amt">₹{balance.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="hiw-graph">
          <TrendingUp size={14} strokeWidth={2.6} className="hiw-graph-icon" />
          {bars.map((h, i) => (
            <i
              key={i}
              style={{ "--h": `${h}%`, animationDelay: `${1 + i * 0.11}s` } as CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className="hiw-payouts">
        {["+₹350", "+₹620", "+₹890"].map((amt, i) => (
          <span key={amt} style={{ animationDelay: `${0.95 + i * 0.6}s` }}>
            {amt}
          </span>
        ))}
      </div>

      <span className="hiw-chip hiw-chip-blue hiw-earn-chip" style={{ animationDelay: "2.6s" }}>
        Business started
      </span>
    </div>
  );
}

/* ------------------------------ data ------------------------------ */

type Step = {
  num: string;
  title: string;
  rail: string;
  caption: string;
  Illo: ComponentType;
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Choose your area PIN code",
    rail: "Choose your area PIN code",
    caption: "Pick the PIN code you want to cover. One distributor per area.",
    Illo: IlloPinCode,
  },
  {
    num: "02",
    title: "Fill your details",
    rail: "Fill your details",
    caption: "Name, mobile number, email and business name. That's it.",
    Illo: IlloForm,
  },
  {
    num: "03",
    title: "Verify your email via OTP",
    rail: "Verify your email via OTP",
    caption: "We email a 6-digit code. Enter it to confirm your address.",
    Illo: IlloOtp,
  },
  {
    num: "04",
    title: "Pay ₹1,100 PIN reservation fee",
    rail: "Pay ₹1,100 reservation fee",
    caption: "A one-time UPI payment holds the area in your name.",
    Illo: IlloPayment,
  },
  {
    num: "05",
    title: "Your PIN code gets reserved",
    rail: "Your PIN code gets reserved",
    caption: "The area is locked to you. Nobody else can claim it.",
    Illo: IlloReserved,
  },
  {
    num: "06",
    title: "Complete KYC",
    rail: "Complete KYC",
    caption: "Upload PAN, Aadhaar, photo and bank details for verification.",
    Illo: IlloKyc,
  },
  {
    num: "07",
    title: "Onboard merchants and earn commission",
    rail: "Onboard merchants and earn",
    caption: "Sign up shops in your area and earn on every transaction.",
    Illo: IlloEarn,
  },
];

/* ---------------------------- component --------------------------- */

export default function DistributorHowItWorks() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    setPhase("in");
    const outTimer = setTimeout(() => setPhase("out"), STEP_MS - EXIT_MS);
    const nextTimer = setTimeout(
      () => setActive((i) => (i + 1) % STEPS.length),
      STEP_MS
    );
    return () => {
      clearTimeout(outTimer);
      clearTimeout(nextTimer);
    };
  }, [active]);

  const step = STEPS[active];
  const Illo = step.Illo;

  return (
    <section id="how-it-works" className="hiw scroll-mt-24" aria-label="How Cashlo distributor onboarding works">
      <style>{CSS}</style>

      <header className="hiw-head">
        <span className="hiw-eyebrow">Distributor onboarding</span>
        <h2 className="hiw-title">How it works</h2>
        <p className="hiw-sub">
          Seven steps from picking your PIN code to earning your first commission.
        </p>

        <div className="hiw-meter" role="status" aria-live="polite">
          <span className="hiw-meter-label">
            Step {active + 1} of {STEPS.length}
          </span>
          <span className="hiw-meter-track">
            <span
              className="hiw-meter-fill"
              style={{
                width: `${((active + 1) / STEPS.length) * 100}%`,
                transitionDuration: `${STEP_MS}ms`,
              }}
            />
          </span>
        </div>
      </header>

      <div className="hiw-grid">
        <nav className="hiw-rail" aria-label="Onboarding steps">
          <span className="hiw-rail-line">
            <span
              className="hiw-rail-fill"
              style={{ height: `${(active / (STEPS.length - 1)) * 100}%` }}
            />
          </span>

          {STEPS.map((s, i) => {
            const state = i < active ? "done" : i === active ? "active" : "todo";
            return (
              <button
                key={s.num}
                type="button"
                className={`hiw-node is-${state}`}
                onClick={() => setActive(i)}
                aria-current={state === "active" ? "step" : undefined}
              >
                <span className="hiw-dot">
                  {state === "done" ? <Check size={13} strokeWidth={4} /> : i + 1}
                </span>
                <span className="hiw-node-label">{s.rail}</span>
              </button>
            );
          })}
        </nav>

        <div className="hiw-stage">
          <article key={active} className="hiw-card" data-phase={phase}>
            <div className="hiw-card-head">
              <span className="hiw-num">{step.num}</span>
              <div>
                <h3 className="hiw-card-title">{step.title}</h3>
                <p className="hiw-card-caption">{step.caption}</p>
              </div>
            </div>
            <div className="hiw-illo">
              <Illo />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- CSS ------------------------------- */

const CSS = `
.hiw{
  --blue:#3B5BFF; --blue-soft:#EEF1FF; --blue-line:#D8DFFF;
  --green:#12B76A; --green-soft:#E7F8EF;
  --ink:#0B1020; --muted:#6B7280; --line:#EAECF3; --bg:#FFFFFF;
  background:var(--bg); color:var(--ink);
  padding:72px 24px 88px;
  font-family:-apple-system,BlinkMacSystemFont,"Inter","Segoe UI",Poppins,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.hiw *{box-sizing:border-box;}

/* ---- header ---- */
.hiw-head{max-width:1120px;margin:0 auto 44px;text-align:center;}
.hiw-eyebrow{
  display:inline-block;font-size:12px;font-weight:650;letter-spacing:.12em;
  text-transform:uppercase;color:var(--blue);background:var(--blue-soft);
  padding:6px 14px;border-radius:999px;
}
.hiw-title{
  margin:18px 0 10px;font-size:clamp(34px,5vw,52px);font-weight:800;
  letter-spacing:-.032em;line-height:1.04;
}
.hiw-sub{margin:0 auto;max-width:520px;font-size:16px;line-height:1.6;color:var(--muted);}
.hiw-meter{
  display:flex;align-items:center;gap:14px;justify-content:center;
  margin-top:26px;
}
.hiw-meter-label{
  font-size:13px;font-weight:650;color:var(--ink);white-space:nowrap;
  font-variant-numeric:tabular-nums;
}
.hiw-meter-track{
  width:min(280px,42vw);height:4px;border-radius:999px;background:var(--line);
  overflow:hidden;
}
.hiw-meter-fill{
  display:block;height:100%;border-radius:999px;background:var(--blue);
  transition-property:width;transition-timing-function:linear;
}

/* ---- layout ---- */
.hiw-grid{
  max-width:1120px;margin:0 auto;display:grid;gap:36px;
  grid-template-columns:300px minmax(0,1fr);align-items:start;
}
@media (max-width:920px){
  .hiw-grid{grid-template-columns:1fr;gap:26px;}
}

/* ---- rail ---- */
.hiw-rail{position:relative;display:flex;flex-direction:column;gap:6px;padding-left:6px;}
.hiw-rail-line{
  position:absolute;left:20px;top:26px;bottom:26px;width:2px;
  background:var(--line);border-radius:2px;overflow:hidden;
}
.hiw-rail-fill{
  display:block;width:100%;background:linear-gradient(180deg,var(--green),var(--blue));
  transition:height .7s cubic-bezier(.4,0,.2,1);
}
@media (max-width:920px){
  .hiw-rail{flex-direction:row;overflow-x:auto;gap:10px;padding:2px 2px 10px;scrollbar-width:none;}
  .hiw-rail::-webkit-scrollbar{display:none;}
  .hiw-rail-line{display:none;}
  .hiw-node-label{display:none;}
}

.hiw-node{
  position:relative;display:flex;align-items:center;gap:14px;
  background:transparent;border:0;padding:8px 10px;border-radius:14px;
  cursor:pointer;text-align:left;font:inherit;color:var(--muted);
  transition:background .3s ease,color .3s ease;
}
.hiw-node:hover{background:#F7F8FC;}
.hiw-node:focus-visible{outline:2px solid var(--blue);outline-offset:2px;}
.hiw-dot{
  flex:0 0 auto;width:28px;height:28px;border-radius:50%;
  display:grid;place-items:center;font-size:13px;font-weight:700;
  background:#fff;border:2px solid var(--line);color:#9AA1B2;
  transition:all .38s cubic-bezier(.4,0,.2,1);
}
.hiw-node-label{font-size:14.5px;font-weight:550;line-height:1.35;transition:color .3s ease;}

.hiw-node.is-active .hiw-dot{
  background:var(--blue);border-color:var(--blue);color:#fff;
  transform:scale(1.14);
  box-shadow:0 0 0 6px rgba(59,91,255,.14),0 6px 16px rgba(59,91,255,.35);
}
.hiw-node.is-active .hiw-node-label{color:var(--ink);font-weight:680;}
.hiw-node.is-done .hiw-dot{background:var(--green);border-color:var(--green);color:#fff;}
.hiw-node.is-done .hiw-node-label{color:#4A5162;}

/* ---- stage card ---- */
.hiw-stage{position:relative;min-height:470px;}
.hiw-card{
  background:#fff;border:1px solid var(--line);border-radius:26px;
  padding:30px 32px 26px;
  box-shadow:0 1px 2px rgba(11,16,32,.04),0 18px 44px -22px rgba(11,16,32,.22);
  will-change:transform,opacity;
}
.hiw-card[data-phase="in"]{animation:hiwIn .62s cubic-bezier(.22,1,.36,1) both;}
.hiw-card[data-phase="out"]{animation:hiwOut .45s cubic-bezier(.55,0,.85,.4) both;}
@keyframes hiwIn{
  from{opacity:0;transform:translate3d(56px,0,0) scale(.985);}
  to{opacity:1;transform:none;}
}
@keyframes hiwOut{
  from{opacity:1;transform:none;}
  to{opacity:0;transform:translate3d(-46px,0,0) scale(.985);}
}

.hiw-card-head{display:flex;gap:20px;align-items:flex-start;}
.hiw-num{
  font-size:clamp(38px,6vw,54px);font-weight:800;line-height:.9;
  letter-spacing:-.05em;color:var(--blue);opacity:.18;
  font-variant-numeric:tabular-nums;
  animation:hiwNum .8s cubic-bezier(.22,1,.36,1) both .08s;
}
@keyframes hiwNum{from{opacity:0;transform:translateY(14px);}to{opacity:.18;transform:none;}}
.hiw-card-title{
  margin:0 0 6px;font-size:clamp(21px,2.4vw,27px);font-weight:750;letter-spacing:-.022em;
  animation:hiwUp .6s cubic-bezier(.22,1,.36,1) both .12s;
}
.hiw-card-caption{
  margin:0;font-size:15px;line-height:1.55;color:var(--muted);max-width:46ch;
  animation:hiwUp .6s cubic-bezier(.22,1,.36,1) both .2s;
}
@keyframes hiwUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}

.hiw-illo{
  margin-top:24px;height:320px;border-radius:20px;background:#FAFBFF;
  border:1px solid #F0F2F9;position:relative;overflow:hidden;
  animation:hiwUp .65s cubic-bezier(.22,1,.36,1) both .26s;
}
@media (max-width:600px){ .hiw-illo{height:290px;} .hiw-card{padding:22px 18px;} }
.hiw-scene{position:absolute;inset:0;}

/* ---- shared bits ---- */
.hiw-glass{
  background:rgba(255,255,255,.82);backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
  border:1px solid rgba(11,16,32,.07);border-radius:16px;
  box-shadow:0 12px 30px -14px rgba(11,16,32,.28);
  padding:12px 16px;
}
.hiw-glass-k{margin:0;font-size:11px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);}
.hiw-glass-v{margin:3px 0 0;font-size:14.5px;font-weight:680;color:var(--ink);}
.hiw-chip{
  display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;
  font-size:12.5px;font-weight:700;white-space:nowrap;
  animation:hiwPop .5s cubic-bezier(.34,1.56,.64,1) both;
}
.hiw-chip-green{background:var(--green-soft);color:#067647;}
.hiw-chip-blue{background:var(--blue-soft);color:var(--blue);}
@keyframes hiwPop{0%{opacity:0;transform:scale(.5);}60%{transform:scale(1.08);}100%{opacity:1;transform:scale(1);}}

.hiw-typed{white-space:nowrap;}
.hiw-char{opacity:0;animation:hiwChar .01s linear forwards;}
@keyframes hiwChar{to{opacity:1;}}
.hiw-caret{
  display:inline-block;width:1.5px;height:1em;background:var(--blue);
  vertical-align:-.14em;margin-left:1px;opacity:0;
  animation:hiwBlink .62s steps(1) infinite;
}
@keyframes hiwBlink{0%,50%{opacity:1;}51%,100%{opacity:0;}}

/* ---- step 1: map ---- */
.hiw-mapart{position:absolute;inset:0;width:100%;height:100%;
  animation:hiwMapIn 1.4s cubic-bezier(.22,1,.36,1) both;}
@keyframes hiwMapIn{from{transform:scale(1.08);opacity:.4;}to{transform:scale(1);opacity:1;}}
.hiw-search{
  position:absolute;left:24px;top:22px;display:flex;align-items:center;gap:9px;
  background:#fff;border:1px solid var(--line);border-radius:12px;
  padding:10px 16px;min-width:190px;color:var(--muted);
  box-shadow:0 8px 22px -12px rgba(11,16,32,.3);
  animation:hiwUp .5s cubic-bezier(.22,1,.36,1) both .05s;
}
.hiw-search-text{font-size:15px;font-weight:700;color:var(--ink);letter-spacing:.06em;}
.hiw-pinwrap{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);}
.hiw-pin{
  position:relative;z-index:2;display:grid;place-items:center;
  width:44px;height:44px;border-radius:50% 50% 50% 8px;transform:rotate(-45deg);
  background:var(--blue);color:#fff;
  box-shadow:0 10px 26px -8px rgba(59,91,255,.7);
  animation:hiwDrop .75s cubic-bezier(.34,1.4,.5,1) both 1.05s;
}
.hiw-pin svg{transform:rotate(45deg);}
@keyframes hiwDrop{
  0%{opacity:0;transform:rotate(-45deg) translate3d(0,-70px,0) scale(.7);}
  70%{opacity:1;transform:rotate(-45deg) translate3d(0,4px,0) scale(1.04);}
  100%{opacity:1;transform:rotate(-45deg) translate3d(0,0,0) scale(1);}
}
.hiw-ripple{
  position:absolute;left:50%;top:60%;width:56px;height:56px;margin:-28px 0 0 -28px;
  border-radius:50%;border:2px solid var(--blue);opacity:0;
  animation:hiwRipple 1.7s cubic-bezier(.22,1,.36,1) infinite both;
}
@keyframes hiwRipple{
  0%{opacity:.55;transform:scale(.4);}
  100%{opacity:0;transform:scale(3.1);}
}
.hiw-areacard{
  position:absolute;right:22px;bottom:22px;display:flex;align-items:center;gap:16px;
  animation:hiwUp .6s cubic-bezier(.22,1,.36,1) both 1.75s;
}

/* ---- step 2: form ---- */
.hiw-form{display:flex;flex-direction:column;justify-content:center;gap:11px;padding:0 clamp(18px,5%,54px);}
.hiw-field{
  position:relative;display:flex;align-items:center;gap:12px;
  background:#fff;border:1px solid var(--line);border-radius:14px;padding:11px 14px;
  box-shadow:0 4px 14px -10px rgba(11,16,32,.3);
  animation:hiwFieldIn .55s cubic-bezier(.22,1,.36,1) both;
}
@keyframes hiwFieldIn{from{opacity:0;transform:translate3d(30px,0,0);}to{opacity:1;transform:none;}}
.hiw-field-focus{
  position:absolute;inset:-1px;border-radius:14px;border:1.5px solid var(--blue);
  opacity:0;box-shadow:0 0 0 4px rgba(59,91,255,.12);
  animation:hiwFocus .75s ease both;
}
@keyframes hiwFocus{0%{opacity:0;}18%{opacity:1;}82%{opacity:1;}100%{opacity:0;}}
.hiw-field-icon{color:#9AA1B2;flex:0 0 auto;}
.hiw-field-body{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1;}
.hiw-field-label{font-size:10.5px;font-weight:650;letter-spacing:.05em;text-transform:uppercase;color:#9AA1B2;}
.hiw-field-value{font-size:14.5px;font-weight:620;color:var(--ink);}
.hiw-tick{
  flex:0 0 auto;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;
  background:var(--green);color:#fff;
  animation:hiwPop .45s cubic-bezier(.34,1.56,.64,1) both;
}

/* ---- step 3: OTP ---- */
.hiw-otp{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;}
.hiw-envelope{
  position:relative;width:56px;height:56px;border-radius:18px;display:grid;place-items:center;
  background:var(--blue-soft);color:var(--blue);
  animation:hiwFloat 2.6s ease-in-out infinite, hiwPop .55s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes hiwFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
.hiw-badge-dot{
  position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;
  background:#F04438;border:2px solid #FAFBFF;
  animation:hiwPop .4s cubic-bezier(.34,1.56,.64,1) both .5s;
}
.hiw-otp-note{margin:0;font-size:12.5px;color:var(--muted);
  animation:hiwUp .5s ease both .35s;}
.hiw-otp-row{display:flex;gap:9px;}
.hiw-otp-box{
  width:42px;height:52px;border-radius:12px;background:#fff;
  border:1.5px solid var(--line);display:grid;place-items:center;
  font-size:20px;font-weight:750;color:var(--ink);
  animation:hiwOtpFill .6s ease both;
}
@keyframes hiwOtpFill{
  0%{border-color:var(--line);transform:scale(1);}
  30%{border-color:var(--blue);transform:scale(1.07);box-shadow:0 0 0 4px rgba(59,91,255,.12);}
  100%{border-color:var(--green);transform:scale(1);box-shadow:0 0 0 0 rgba(59,91,255,0);}
}
.hiw-otp-box b{opacity:0;animation:hiwPop .35s cubic-bezier(.34,1.56,.64,1) both;}
.hiw-otp-chip{margin-top:4px;}
.hiw-confetti{position:absolute;left:50%;bottom:66px;width:0;height:0;}
.hiw-confetti span{
  position:absolute;width:6px;height:9px;border-radius:2px;opacity:0;
  animation:hiwConfetti 1.15s cubic-bezier(.2,.6,.3,1) both;
}
@keyframes hiwConfetti{
  0%{opacity:0;transform:translate3d(0,0,0) scale(.4) rotate(0);}
  16%{opacity:1;}
  100%{opacity:0;transform:translate3d(var(--tx),var(--ty),0) scale(1) rotate(var(--rot));}
}

/* ---- step 4: payment ---- */
.hiw-pay{display:flex;align-items:center;justify-content:center;gap:clamp(18px,6%,52px);}
.hiw-qr{
  position:relative;width:150px;padding:14px;border-radius:18px;background:#fff;
  border:1px solid var(--line);box-shadow:0 14px 34px -20px rgba(11,16,32,.4);
  overflow:hidden;animation:hiwUp .55s cubic-bezier(.22,1,.36,1) both .05s;
}
.hiw-qr svg{width:100%;display:block;}
.hiw-qr-label{display:block;margin-top:9px;text-align:center;font-size:11px;font-weight:650;color:var(--muted);}
.hiw-scanline{
  position:absolute;left:0;right:0;height:34px;
  background:linear-gradient(180deg,rgba(59,91,255,0),rgba(59,91,255,.22),rgba(59,91,255,0));
  border-top:1.5px solid var(--blue);
  animation:hiwScan 1.5s cubic-bezier(.45,0,.55,1) both .35s;
}
@keyframes hiwScan{
  0%{opacity:0;transform:translateY(-20px);}
  12%{opacity:1;}
  88%{opacity:1;}
  100%{opacity:0;transform:translateY(170px);}
}
.hiw-phone{
  position:relative;width:172px;height:236px;border-radius:26px;background:#fff;
  border:1px solid #E4E7F0;padding:16px 16px 0;
  box-shadow:0 22px 46px -24px rgba(11,16,32,.45);
  animation:hiwPhoneIn .7s cubic-bezier(.22,1,.36,1) both .18s;
}
@keyframes hiwPhoneIn{from{opacity:0;transform:translate3d(34px,0,0) rotate(3deg);}to{opacity:1;transform:none;}}
.hiw-phone-notch{width:44px;height:4px;border-radius:99px;background:#E4E7F0;margin:0 auto 18px;}
.hiw-phone-body{text-align:center;}
.hiw-pay-k{margin:0;font-size:10.5px;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);}
.hiw-pay-amt{margin:6px 0 2px;font-size:31px;font-weight:800;letter-spacing:-.03em;}
.hiw-pay-sub{margin:0;font-size:11.5px;color:var(--muted);}
.hiw-pay-state{position:relative;height:74px;margin-top:14px;}
.hiw-spinner{
  position:absolute;left:50%;top:8px;width:28px;height:28px;margin-left:-14px;
  border-radius:50%;border:2.5px solid var(--blue-soft);border-top-color:var(--blue);
  animation:hiwSpin .7s linear infinite, hiwSpinnerLife 2.4s ease both;
}
@keyframes hiwSpin{to{transform:rotate(360deg);}}
@keyframes hiwSpinnerLife{0%,58%{opacity:0;}62%,88%{opacity:1;}100%{opacity:0;}}
.hiw-pay-done{
  position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;gap:8px;
  font-size:13px;font-weight:700;color:#067647;opacity:0;
  animation:hiwUp .5s cubic-bezier(.22,1,.36,1) both 2.25s;
}
.hiw-tickbig{
  width:40px;height:40px;border-radius:50%;display:grid;place-items:center;
  background:var(--green);color:#fff;
  box-shadow:0 0 0 6px var(--green-soft);
  animation:hiwPop .55s cubic-bezier(.34,1.56,.64,1) both 2.28s;
}

/* ---- step 5: reserved ---- */
.hiw-reserve{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;}
.hiw-radar{position:relative;width:150px;height:150px;display:grid;place-items:center;}
.hiw-radar-core{
  position:absolute;width:104px;height:104px;border-radius:50%;
  background:radial-gradient(circle,rgba(59,91,255,.22),rgba(59,91,255,0) 70%);
  animation:hiwGlow 2.2s ease-in-out infinite;
}
@keyframes hiwGlow{0%,100%{transform:scale(.94);opacity:.7;}50%{transform:scale(1.06);opacity:1;}}
.hiw-radar-ring{
  position:absolute;width:96px;height:96px;border-radius:50%;
  border:1.5px solid var(--blue);opacity:0;
  animation:hiwRipple 2s cubic-bezier(.22,1,.36,1) infinite both;
}
.hiw-shield{
  position:relative;z-index:2;width:64px;height:64px;border-radius:22px;
  display:grid;place-items:center;background:var(--blue);color:#fff;
  box-shadow:0 16px 34px -14px rgba(59,91,255,.8);
  animation:hiwPop .7s cubic-bezier(.34,1.5,.5,1) both .55s;
}
.hiw-shield-check{
  position:absolute;right:-6px;bottom:-6px;width:22px;height:22px;padding:4px;
  border-radius:50%;background:var(--green);color:#fff;border:2px solid #FAFBFF;
  animation:hiwPop .45s cubic-bezier(.34,1.56,.64,1) both 1.1s;
}
.hiw-reserve-card{text-align:center;animation:hiwUp .6s cubic-bezier(.22,1,.36,1) both 1.45s;}
.hiw-sparks{position:absolute;left:50%;top:44%;width:0;height:0;}
.hiw-sparks span{
  position:absolute;width:5px;height:5px;border-radius:50%;background:var(--blue);opacity:0;
  animation:hiwSpark 1.1s cubic-bezier(.2,.6,.3,1) both;
}
@keyframes hiwSpark{
  0%{opacity:0;transform:translate3d(0,0,0) scale(.3);}
  22%{opacity:1;}
  100%{opacity:0;transform:translate3d(var(--tx),var(--ty),0) scale(1);}
}

/* ---- step 6: KYC ---- */
.hiw-kyc{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:0 18px;}
.hiw-docs{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;}
.hiw-doc{
  position:relative;width:112px;padding:14px 12px 12px;border-radius:14px;background:#fff;
  border:1.5px solid var(--line);overflow:hidden;
  box-shadow:0 8px 22px -16px rgba(11,16,32,.4);
  animation:hiwFieldIn .55s cubic-bezier(.22,1,.36,1) both, hiwDocVerify .6s ease forwards var(--verify);
}
@keyframes hiwDocVerify{
  from{border-color:var(--line);background:#fff;}
  to{border-color:var(--green);background:#F6FEF9;}
}
.hiw-doc-scan{
  position:absolute;left:0;right:0;top:0;height:26px;
  background:linear-gradient(180deg,rgba(59,91,255,0),rgba(59,91,255,.28),rgba(59,91,255,0));
  border-bottom:1.5px solid var(--blue);opacity:0;
  animation:hiwDocScan .8s cubic-bezier(.45,0,.55,1) both;
}
@keyframes hiwDocScan{
  0%{opacity:0;transform:translateY(-26px);}
  15%{opacity:1;}
  85%{opacity:1;}
  100%{opacity:0;transform:translateY(112px);}
}
.hiw-doc-icon{color:var(--blue);}
.hiw-doc-lines{display:flex;flex-direction:column;gap:5px;margin:10px 0 12px;}
.hiw-doc-lines i{display:block;height:5px;border-radius:99px;background:#EDEFF6;}
.hiw-doc-label{font-size:11.5px;font-weight:680;color:var(--ink);}
.hiw-doc-tick{
  position:absolute;top:10px;right:10px;width:18px;height:18px;border-radius:50%;
  display:grid;place-items:center;background:var(--green);color:#fff;
  animation:hiwPop .4s cubic-bezier(.34,1.56,.64,1) both;
}
@media (max-width:600px){ .hiw-doc{width:96px;} }

/* ---- step 7: earn ---- */
.hiw-earn{display:flex;align-items:center;justify-content:center;gap:clamp(16px,5%,44px);padding:0 20px;}
.hiw-store{position:relative;width:170px;animation:hiwUp .6s cubic-bezier(.22,1,.36,1) both .05s;}
.hiw-store svg{width:100%;display:block;}
.hiw-store-tag{
  display:block;text-align:center;margin-top:6px;font-size:11px;font-weight:680;color:var(--muted);
}
.hiw-walkers{position:absolute;left:0;right:0;bottom:34px;height:14px;}
.hiw-walkers span{
  position:absolute;left:6px;bottom:0;width:9px;height:13px;border-radius:5px 5px 3px 3px;
  background:var(--blue);opacity:0;
  animation:hiwWalk 1.5s cubic-bezier(.4,0,.4,1) both;
}
@keyframes hiwWalk{
  0%{opacity:0;transform:translate3d(-14px,0,0) scale(.9);}
  18%{opacity:1;}
  70%{opacity:1;transform:translate3d(70px,0,0) scale(1);}
  100%{opacity:0;transform:translate3d(78px,0,0) scale(.85);}
}
.hiw-earn-right{display:flex;flex-direction:column;gap:14px;}
.hiw-wallet{
  display:flex;align-items:center;gap:12px;min-width:190px;
  animation:hiwUp .6s cubic-bezier(.22,1,.36,1) both .3s;
}
.hiw-wallet-icon{
  width:34px;height:34px;border-radius:11px;display:grid;place-items:center;
  background:var(--blue-soft);color:var(--blue);flex:0 0 auto;
}
.hiw-wallet-amt{
  margin:2px 0 0;font-size:23px;font-weight:800;letter-spacing:-.028em;
  font-variant-numeric:tabular-nums;color:var(--ink);
}
.hiw-graph{
  display:flex;align-items:flex-end;gap:7px;height:78px;padding:12px 14px;
  background:#fff;border:1px solid var(--line);border-radius:16px;position:relative;
  box-shadow:0 8px 22px -18px rgba(11,16,32,.4);
  animation:hiwUp .6s cubic-bezier(.22,1,.36,1) both .45s;
}
.hiw-graph-icon{position:absolute;top:10px;right:12px;color:var(--green);}
.hiw-graph i{
  display:block;width:12px;border-radius:5px;background:var(--blue);height:0;
  animation:hiwBar .7s cubic-bezier(.22,1,.36,1) both;
}
.hiw-graph i:nth-child(2){opacity:.35;}
.hiw-graph i:nth-child(3){opacity:.45;}
.hiw-graph i:nth-child(4){opacity:.6;}
.hiw-graph i:nth-child(5){opacity:.78;}
@keyframes hiwBar{from{height:0;}to{height:var(--h);}}
.hiw-payouts{position:absolute;right:clamp(18px,9%,66px);top:18px;}
.hiw-payouts span{
  position:absolute;right:0;top:0;padding:6px 12px;border-radius:999px;
  background:var(--green-soft);color:#067647;font-size:12.5px;font-weight:750;
  white-space:nowrap;opacity:0;
  animation:hiwPayout 1.7s cubic-bezier(.22,1,.36,1) both;
}
@keyframes hiwPayout{
  0%{opacity:0;transform:translate3d(0,18px,0) scale(.8);}
  16%{opacity:1;transform:translate3d(0,0,0) scale(1);}
  70%{opacity:1;transform:translate3d(0,-24px,0) scale(1);}
  100%{opacity:0;transform:translate3d(0,-48px,0) scale(.94);}
}
.hiw-earn-chip{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);}
@media (max-width:600px){
  .hiw-earn{flex-direction:column;gap:14px;}
  .hiw-store{width:120px;}
}

/* ---- accessibility ---- */
@media (prefers-reduced-motion:reduce){
  .hiw *,.hiw *::before,.hiw *::after{
    animation-duration:.001ms !important;animation-iteration-count:1 !important;
    transition-duration:.001ms !important;
  }
}
`;