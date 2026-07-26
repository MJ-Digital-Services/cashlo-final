"use client";

/**
 * QuickKhataPhoneDemo
 * -------------------
 * Phone mockup + looping, self-explaining product demo:
 *   Add customer -> Record udhaar -> Generate QR -> Customer pays -> Ledger settles
 *
 * The component fills its parent's width and caps at 300px. Everything inside
 * the screen is laid out on a fixed 300x624 design canvas and scaled with a
 * single transform, so it is pixel-consistent at any size.
 */

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type ComponentProps,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

/* ------------------------------------------------------------------ tokens */

const T = {
  blue: "#3B5BFF",
  blueDeep: "#2942D6",
  blueSoft: "#EEF1FF",
  blueLine: "#DCE2FF",
  green: "#12B76A",
  greenSoft: "#E6F7EF",
  red: "#F04438",
  amber: "#F79009",
  ink: "#0B1020",
  body: "#5A6379",
  mute: "#98A0B3",
  line: "#EDEFF6",
  bg: "#F6F7FB",
  card: "#FFFFFF",
};

const FRAME_W = 300;
const FRAME_H = 624;
const BEZEL = 10;
const SCREEN_W = FRAME_W - BEZEL * 2; // 280
const SCREEN_H = FRAME_H - BEZEL * 2; // 604

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // premium ease-out
const EASE_IO: [number, number, number, number] = [0.65, 0, 0.35, 1]; // ease-in-out

/** Global tempo. 1 = ~12.8s loop. Raise to speed the whole story up. */
const SPEED = 1;

type SceneId =
  | "dashboard"
  | "addCustomer"
  | "customerAdded"
  | "addUdhaar"
  | "ledgerUpdate"
  | "qr"
  | "scan"
  | "success"
  | "celebrate";

type Scene = { id: SceneId; ms: number; step: string };

const SCENES: Scene[] = [
  { id: "dashboard", ms: 1300, step: "Udhaar ledger · 6 customers" },
  { id: "addCustomer", ms: 2000, step: "Add a customer" },
  { id: "customerAdded", ms: 800, step: "Rahul Sharma added" },
  { id: "addUdhaar", ms: 2100, step: "Record udhaar" },
  { id: "ledgerUpdate", ms: 1400, step: "Ledger updated" },
  { id: "qr", ms: 1500, step: "Payment QR ready" },
  { id: "scan", ms: 1400, step: "Customer is paying" },
  { id: "success", ms: 1300, step: "₹500 received" },
  { id: "celebrate", ms: 1000, step: "Settled automatically" },
];

const IDX = SCENES.reduce<Record<SceneId, number>>((a, s, i) => {
  a[s.id] = i;
  return a;
}, {} as Record<SceneId, number>);

type Customer = {
  id: string;
  name: string;
  meta: string;
  amount: number;
  dir: "get" | "give";
  due?: boolean;
};

const CUSTOMERS: Customer[] = [
  { id: "ms", name: "Md Salman", meta: "2 days ago", amount: 1200, dir: "get", due: true },
  { id: "sd", name: "Sunita Devi", meta: "3 days ago", amount: 315, dir: "get" },
  { id: "ry", name: "Ramesh Yadav", meta: "4 days ago", amount: 1340, dir: "get", due: true },
  { id: "ps", name: "Pooja Sharma", meta: "5 days ago", amount: 190, dir: "give" },
];

const BASE_GET = 4055;

/* ----------------------------------------------------------------- helpers */

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic QR-looking matrix rendered as one SVG path (1 DOM node). */
function buildQrPath(n = 25, cell = 4, seed = 20260725) {
  const rnd = mulberry32(seed);
  const g: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const reserved = (r: number, c: number) =>
    (r < 8 && c < 8) ||
    (r < 8 && c >= n - 8) ||
    (r >= n - 8 && c < 8) ||
    (r >= n / 2 - 3 && r <= n / 2 + 2 && c >= n / 2 - 3 && c <= n / 2 + 2);

  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (!reserved(r, c)) g[r][c] = rnd() > 0.5 ? 1 : 0;

  const finder = (r0: number, c0: number) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const edge = i === 0 || i === 6 || j === 0 || j === 6;
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        g[r0 + i][c0 + j] = edge || core ? 1 : 0;
      }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);

  for (let i = 8; i < n - 8; i++) {
    g[6][i] = i % 2 === 0 ? 1 : 0;
    g[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // alignment block, bottom-right
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 5; j++) {
      const edge = i === 0 || i === 4 || j === 0 || j === 4;
      const core = i === 2 && j === 2;
      g[n - 9 + i][n - 9 + j] = edge || core ? 1 : 0;
    }

  let d = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (g[r][c]) d += `M${c * cell} ${r * cell}h${cell}v${cell}h${-cell}z`;
  return d;
}

/** Scale a fixed design canvas to whatever width the parent gives us. */
function useFitScale(designW: number): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = (w: number) => setScale(w > 0 ? w / designW : 1);
    apply(el.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => apply(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [designW]);
  return [ref, scale];
}

/* ------------------------------------------------------------ micro atoms */

function CountUp({
  from = 0,
  to = 0,
  duration = 900,
  active = true,
  prefix = "",
}: {
  from?: number;
  to?: number;
  duration?: number;
  active?: boolean;
  prefix?: string;
}) {
  const [v, setV] = useState(active ? from : to);
  useEffect(() => {
    if (!active) {
      setV(to);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setV(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration, active]);
  return <>{prefix + Math.round(v).toLocaleString("en-IN")}</>;
}

function Typewriter({
  text,
  active = true,
  delay = 0,
  cps = 20,
  caret = true,
}: {
  text: string;
  active?: boolean;
  delay?: number;
  cps?: number;
  caret?: boolean;
}) {
  const [n, setN] = useState(active ? 0 : text.length);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!active) {
      setN(text.length);
      return;
    }
    setN(0);
    const t = setTimeout(() => {
      let i = 0;
      iv.current = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length && iv.current) clearInterval(iv.current);
      }, 1000 / cps);
    }, delay);
    return () => {
      clearTimeout(t);
      if (iv.current) clearInterval(iv.current);
    };
  }, [text, active, delay, cps]);

  const done = n >= text.length;
  return (
    <span>
      {text.slice(0, n)}
      {caret && active && !done && <span className="qk-caret" />}
    </span>
  );
}

/** Simulated finger press: scale dip at a given moment. */
function Press({
  at = 0,
  active = true,
  children,
  style,
  ...rest
}: ComponentProps<typeof motion.div> & { at?: number; active?: boolean }) {
  return (
    <motion.div
      style={style}
      animate={active ? { scale: [1, 1, 0.955, 1] } : { scale: 1 }}
      transition={{ duration: 0.42, delay: at, times: [0, 0.25, 0.55, 1], ease: EASE_IO }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function Avatar({
  name,
  size = 30,
  tone = "blue",
}: {
  name: string;
  size?: number;
  tone?: "blue" | "green";
}) {
  const bg = tone === "green" ? T.green : T.blue;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: bg,
        color: "#fff",
        fontSize: size * 0.36,
        fontWeight: 700,
        letterSpacing: 0.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}

/* ---------------------------------------------------------------- chrome */

function StatusBar() {
  return (
    <div
      style={{
        height: 24,
        padding: "0 18px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        fontSize: 9,
        fontWeight: 700,
        color: T.ink,
        letterSpacing: 0.2,
      }}
    >
      <span>9:41</span>
      <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 3}
              y={6 - i * 1.8}
              width="2"
              height={2 + i * 1.8}
              rx="0.6"
              fill={T.ink}
            />
          ))}
        </svg>
        <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
          <rect x="0.5" y="0.5" width="12" height="7" rx="2" stroke={T.ink} opacity="0.5" />
          <rect x="2" y="2" width="9" height="4" rx="1" fill={T.ink} />
          <rect x="14" y="3" width="1.5" height="2" rx="0.7" fill={T.ink} opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}

function CashloMark({ size = 16, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="8" height="8" rx="2" stroke={color} strokeWidth="2" />
      <rect x="14" y="2" width="8" height="8" rx="2" stroke={color} strokeWidth="2" />
      <rect x="2" y="14" width="8" height="8" rx="2" stroke={color} strokeWidth="2" />
      <rect x="14.5" y="14.5" width="3" height="3" rx="1" fill={color} />
      <rect x="19" y="19" width="3" height="3" rx="1" fill={color} />
      <rect x="14.5" y="19" width="3" height="3" rx="1" fill={color} opacity="0.55" />
      <rect x="19" y="14.5" width="3" height="3" rx="1" fill={color} opacity="0.55" />
    </svg>
  );
}

function Header({ scene, i, active }: { scene: Scene; i: number; active: boolean }) {
  const detail = i >= IDX.addUdhaar;
  return (
    <div
      style={{
        height: 46,
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <AnimatePresence initial={false}>
          {detail && (
            <motion.svg
              key="back"
              initial={{ opacity: 0, x: -6, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 14 }}
              exit={{ opacity: 0, x: -6, width: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M9 2.5 4.5 7 9 11.5"
                stroke={T.ink}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
        <div style={{ minWidth: 0 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={detail ? "rahul" : "brand"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: T.ink,
                letterSpacing: -0.3,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
              }}
            >
              {detail ? "Rahul Sharma" : "QuickKhata"}
            </motion.div>
          </AnimatePresence>
          <div style={{ height: 12, overflow: "hidden", marginTop: 1 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{
                  fontSize: 8.5,
                  fontWeight: 600,
                  color: i === 0 ? T.mute : T.blue,
                  letterSpacing: 0.1,
                  whiteSpace: "nowrap",
                }}
              >
                {scene.step}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!detail && (
          <motion.div
            key="export"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 9px",
              borderRadius: 999,
              border: `1px solid ${T.line}`,
              fontSize: 8.5,
              fontWeight: 700,
              color: T.body,
              background: T.card,
              whiteSpace: "nowrap",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v7m0 0L3.5 5.5M6 8l2.5-2.5M2 10.5h8"
                stroke={T.body}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressLine({ i, ms, active }: { i: number; ms: number; active: boolean }) {
  return (
    <div style={{ height: 2, background: T.line, position: "relative", overflow: "hidden" }}>
      <motion.div
        key={i}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: ms / 1000, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "left center",
          background: `linear-gradient(90deg, ${T.blue}, ${T.blueDeep})`,
        }}
      />
    </div>
  );
}

function BottomNav({ i }: { i: number }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "wallet", label: "Wallet" },
    { id: "spacer", label: "" },
    { id: "khata", label: "Khata" },
    { id: "loan", label: "Loan" },
  ];
  const icon = (id: string, on: boolean) => {
    const c = on ? T.blue : T.mute;
    if (id === "home")
      return (
        <path d="M2 7.5 8 2.5l6 5V14H2z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      );
    if (id === "wallet")
      return (
        <>
          <rect x="1.8" y="4" width="12.4" height="9" rx="2.2" stroke={c} strokeWidth="1.5" fill="none" />
          <circle cx="11.2" cy="8.5" r="1.1" fill={c} />
        </>
      );
    if (id === "khata")
      return (
        <>
          <path d="M2 3.5h4.4c.9 0 1.6.7 1.6 1.6V13c0-.8-.7-1.5-1.6-1.5H2z" stroke={c} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
          <path d="M14 3.5H9.6C8.7 3.5 8 4.2 8 5.1V13c0-.8.7-1.5 1.6-1.5H14z" stroke={c} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
        </>
      );
    return (
      <>
        <circle cx="8" cy="8" r="5.6" stroke={c} strokeWidth="1.5" fill="none" />
        <path d="M8 5v6M6.3 6.6h3.2M6.3 9.4h3.4" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      </>
    );
  };

  return (
    <div
      style={{
        height: 54,
        borderTop: `1px solid ${T.line}`,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {items.map((it) => {
        const on = it.id === "khata";
        if (it.id === "spacer") return <div key="spacer" style={{ flex: 1 }} />;
        return (
          <div
            key={it.id}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16">
              {icon(it.id, on)}
            </svg>
            <span style={{ fontSize: 7.5, fontWeight: 700, color: on ? T.blue : T.mute }}>
              {it.label}
            </span>
          </div>
        );
      })}

      <motion.div
        animate={
          i === IDX.qr
            ? { scale: [1, 1.12, 1], boxShadow: [`0 6px 16px ${T.blue}55`, `0 10px 26px ${T.blue}88`, `0 6px 16px ${T.blue}55`] }
            : { scale: 1 }
        }
        transition={{ duration: 0.7, ease: EASE_IO }}
        style={{
          position: "absolute",
          left: "50%",
          top: -16,
          marginLeft: -21,
          width: 42,
          height: 42,
          borderRadius: 42,
          background: `linear-gradient(145deg, ${T.blue}, ${T.blueDeep})`,
          border: "3px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 6px 16px ${T.blue}55`,
        }}
      >
        <CashloMark size={17} />
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------- ledger UI */

function SummaryCard({ i, active }: { i: number; active: boolean }) {
  const youGet = i >= IDX.ledgerUpdate && i < IDX.success ? BASE_GET + 500 : BASE_GET;
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 12,
        background: `linear-gradient(135deg, ${T.blue} 0%, ${T.blueDeep} 100%)`,
        boxShadow: `0 10px 24px -12px ${T.blue}99`,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        aria-hidden
        animate={active ? { x: ["-60%", "160%"] } : { x: "-60%" }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent)",
          transform: "skewX(-18deg)",
        }}
      />
      <div style={{ display: "flex", position: "relative" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8.5, opacity: 0.78, fontWeight: 600 }}>You will get</div>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5, marginTop: 1, color: "#8CF5C4" }}>
            <CountUp from={BASE_GET} to={youGet} active={active} prefix="₹" />
          </div>
        </div>
        <div style={{ width: 1, background: "rgba(255,255,255,.22)", margin: "2px 10px" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8.5, opacity: 0.78, fontWeight: 600 }}>You will give</div>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5, marginTop: 1, color: "#FFB4AC" }}>
            ₹190
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: "1px dashed rgba(255,255,255,.28)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 8.5,
          fontWeight: 600,
          lineHeight: 1.35,
        }}
      >
        <motion.span
          animate={active ? { scale: [1, 1.25, 1], opacity: [1, 0.6, 1] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, ease: EASE_IO }}
          style={{ width: 6, height: 6, borderRadius: 6, background: "#FFD166", flexShrink: 0 }}
        />
        4 customers to collect from · tap to send a reminder
      </div>
    </div>
  );
}

function FilterChips() {
  const chips = ["All", "To collect", "To pay", "Settled"];
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
      {chips.map((c, k) => (
        <div
          key={c}
          style={{
            padding: "4px 9px",
            borderRadius: 999,
            fontSize: 8.5,
            fontWeight: 700,
            background: k === 0 ? T.blue : T.card,
            color: k === 0 ? "#fff" : T.body,
            border: `1px solid ${k === 0 ? T.blue : T.line}`,
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
}

function CustomerRow({
  c,
  active,
  highlight,
  settled,
  label,
  tone,
}: {
  c: Customer;
  active: boolean;
  highlight?: boolean;
  settled?: boolean;
  label?: string;
  tone?: "blue" | "green";
}) {
  const isGive = c.dir === "give";
  const amountColor = settled ? T.mute : isGive ? T.red : T.green;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "9px 10px",
        borderBottom: `1px solid ${T.line}`,
        position: "relative",
      }}
    >
      <Avatar name={c.name} size={28} tone={tone || (settled ? "green" : "blue")} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink, letterSpacing: -0.1 }}>
          {c.name}
        </div>
        <div style={{ fontSize: 8, color: T.mute, marginTop: 1.5, display: "flex", gap: 4, alignItems: "center" }}>
          {c.meta}
          {c.due && (
            <motion.span
              animate={active ? { opacity: [0.55, 1, 0.55] } : {}}
              transition={{ duration: 1.8, repeat: Infinity, ease: EASE_IO }}
              style={{ color: T.amber, fontWeight: 700 }}
            >
              · due
            </motion.span>
          )}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: amountColor, letterSpacing: -0.2 }}>
          {inr(c.amount)}
        </div>
        <div style={{ fontSize: 6.5, fontWeight: 800, letterSpacing: 0.6, color: T.mute, marginTop: 1 }}>
          {label || (settled ? "SETTLED" : isGive ? "YOU GIVE" : "YOU GET")}
        </div>
      </div>
      {highlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, ease: EASE_IO }}
          style={{
            position: "absolute",
            inset: "2px 4px",
            borderRadius: 12,
            background: `linear-gradient(90deg, ${T.blueSoft}, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

function ListView({ i, active }: { i: number; active: boolean }) {
  const added = i >= IDX.customerAdded;
  const rahul: Customer = {
    id: "rs",
    name: "Rahul Sharma",
    meta: "just now",
    amount: 0,
    dir: "get",
  };
  return (
    <div style={{ padding: "10px 12px 0" }}>
      <SummaryCard i={i} active={active} />
      <FilterChips />
      <div
        style={{
          marginTop: 10,
          background: T.card,
          borderRadius: 14,
          border: `1px solid ${T.line}`,
          overflow: "hidden",
          boxShadow: "0 4px 14px -10px rgba(11,16,32,.35)",
        }}
      >
        <AnimatePresence initial={false}>
          {added && (
            <motion.div
              key="rahul"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 47, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.7 }}
              style={{ overflow: "hidden" }}
            >
              <CustomerRow c={rahul} active={active} highlight label="NEW" tone="green" />
            </motion.div>
          )}
        </AnimatePresence>
        {CUSTOMERS.map((c) => (
          <CustomerRow key={c.id} c={c} active={active} />
        ))}
      </div>

      <Press
        at={1.05}
        active={active && i === IDX.dashboard}
        style={{
          marginTop: 12,
          height: 36,
          borderRadius: 999,
          background: T.green,
          color: "#fff",
          fontSize: 11,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          boxShadow: `0 8px 18px -10px ${T.green}`,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M7 3v8M3 7h8" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
        Add customer
      </Press>
    </div>
  );
}

/* --------------------------------------------------------------- detail UI */

function Confetti({ active }: { active: boolean }) {
  const bits = useMemo(() => {
    const rnd = mulberry32(99);
    return Array.from({ length: 16 }, () => ({
      x: (rnd() - 0.5) * 190,
      d: 26 + rnd() * 44,
      r: rnd() * 260 - 130,
      s: 3 + rnd() * 3,
      delay: rnd() * 0.28,
      c: [T.blue, T.green, "#FFD166", T.blueDeep][Math.floor(rnd() * 4)],
      round: rnd() > 0.5,
    }));
  }, []);
  if (!active) return null;
  return (
    <div style={{ position: "absolute", left: "50%", top: 26, pointerEvents: "none" }}>
      {bits.map((b, k) => (
        <motion.span
          key={k}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: b.x, y: b.d, scale: 1, rotate: b.r }}
          transition={{ duration: 1.15, delay: b.delay, ease: EASE }}
          style={{
            position: "absolute",
            width: b.s,
            height: b.s * (b.round ? 1 : 1.8),
            borderRadius: b.round ? 999 : 1,
            background: b.c,
            display: "block",
          }}
        />
      ))}
    </div>
  );
}

function DetailView({ i, active }: { i: number; active: boolean }) {
  const hasTxn = i >= IDX.ledgerUpdate;
  const settled = i >= IDX.success;
  const balance = hasTxn && !settled ? 500 : 0;

  return (
    <div style={{ padding: "10px 12px 0", position: "relative", height: "100%", boxSizing: "border-box" }}>
      {/* balance card */}
      <motion.div
        style={{
          borderRadius: 16,
          padding: "12px 14px",
          background: settled ? T.greenSoft : T.card,
          border: `1px solid ${settled ? "#BFEBD6" : T.line}`,
          boxShadow: settled ? "none" : "0 6px 18px -12px rgba(11,16,32,.5)",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 8.5, fontWeight: 700, color: settled ? T.green : T.mute, letterSpacing: 0.3 }}>
          {settled ? "ALL SETTLED" : "YOU WILL GET"}
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: -1.2,
            color: settled ? T.green : T.ink,
            lineHeight: 1.15,
            marginTop: 2,
          }}
        >
          <CountUp
            from={i === IDX.ledgerUpdate ? 0 : settled ? 500 : balance}
            to={balance}
            duration={i === IDX.ledgerUpdate ? 900 : 600}
            active={active}
            prefix="₹"
          />
        </div>
        <div style={{ fontSize: 8.5, color: T.body, marginTop: 2, fontWeight: 600 }}>
          98XXXXXXXX · Rahul Sharma
        </div>
        <Confetti active={active && i === IDX.ledgerUpdate} />
      </motion.div>

      {/* transactions */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 8, fontWeight: 800, color: T.mute, letterSpacing: 0.8, marginBottom: 6 }}>
          ENTRIES
        </div>
        <div
          style={{
            background: T.card,
            border: `1px solid ${T.line}`,
            borderRadius: 14,
            overflow: "hidden",
            minHeight: 52,
          }}
        >
          <AnimatePresence initial={false}>
            {hasTxn ? (
              <motion.div
                key="txn"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 11px" }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 9,
                    background: settled ? T.greenSoft : T.blueSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 6.2h10M4.6 3.4h6.8l1.6 2.8v6.4H2.9V6.2z"
                      stroke={settled ? T.green : T.blue}
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: T.ink }}>Groceries</div>
                  <div style={{ fontSize: 8, color: T.mute, marginTop: 1 }}>Today · 9:41 AM</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: settled ? T.mute : T.green,
                      textDecoration: settled ? "line-through" : "none",
                    }}
                  >
                    ₹500
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={settled ? "paid" : "get"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        fontSize: 6.5,
                        fontWeight: 800,
                        letterSpacing: 0.6,
                        color: settled ? T.green : T.mute,
                        marginTop: 1,
                      }}
                    >
                      {settled ? "PAID · UPI" : "YOU GET"}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                exit={{ opacity: 0 }}
                style={{
                  padding: "16px 12px",
                  fontSize: 9,
                  color: T.mute,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                No entries yet. Add the first udhaar.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* celebration chips */}
      <AnimatePresence>
        {i === IDX.celebrate &&
          ["Paid", "Ledger updated", "Customer settled"].map((label, k) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: k * 0.11, type: "spring", stiffness: 340, damping: 24 }}
              style={{
                position: "absolute",
                left: 12 + k * 6,
                top: 196 + k * 28,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,.82)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: `1px solid ${T.line}`,
                boxShadow: "0 8px 20px -12px rgba(11,16,32,.6)",
                fontSize: 9,
                fontWeight: 700,
                color: T.ink,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill={T.green} />
                <path d="M4 7.2 6.2 9.4 10 5.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {label}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* actions */}
      <div style={{ position: "absolute", left: 12, right: 12, bottom: 14, display: "flex", gap: 8 }}>
        <div
          style={{
            flex: 1,
            height: 36,
            borderRadius: 999,
            border: `1.4px solid ${T.blueLine}`,
            color: T.blue,
            background: T.card,
            fontSize: 10.5,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Add udhaar
        </div>
        <Press
          at={1.0}
          active={active && i === IDX.ledgerUpdate}
          style={{
            flex: 1.25,
            height: 36,
            borderRadius: 999,
            background: `linear-gradient(145deg, ${T.blue}, ${T.blueDeep})`,
            color: "#fff",
            fontSize: 10.5,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            boxShadow: `0 8px 20px -10px ${T.blue}`,
          }}
        >
          <CashloMark size={13} />
          Collect payment
        </Press>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ sheets */

function Field({
  label,
  value,
  active,
  delay,
  cps,
}: {
  label: string;
  value: string;
  active: boolean;
  delay: number;
  cps: number;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 8.5, fontWeight: 700, color: T.mute, letterSpacing: 0.4, marginBottom: 5 }}>
        {label}
      </div>
      <motion.div
        initial={{ borderColor: T.line, boxShadow: "0 0 0 0px rgba(59,91,255,0)" }}
        animate={
          active
            ? {
                borderColor: [T.line, T.blue, T.blue, T.line],
                boxShadow: [
                  "0 0 0 0px rgba(59,91,255,0)",
                  "0 0 0 3px rgba(59,91,255,.12)",
                  "0 0 0 3px rgba(59,91,255,.12)",
                  "0 0 0 0px rgba(59,91,255,0)",
                ],
              }
            : {}
        }
        transition={{ duration: 1.4, delay: delay / 1000, times: [0, 0.1, 0.85, 1], ease: EASE_IO }}
        style={{
          height: 34,
          borderRadius: 11,
          border: `1.4px solid ${T.line}`,
          background: T.bg,
          display: "flex",
          alignItems: "center",
          padding: "0 11px",
          fontSize: 11.5,
          fontWeight: 700,
          color: T.ink,
        }}
      >
        <Typewriter text={value} active={active} delay={delay} cps={cps} />
      </motion.div>
    </div>
  );
}

function Sheet({ children, height }: { children: ReactNode; height: number }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{ position: "absolute", inset: 0, background: "rgba(11,16,32,.32)", backdropFilter: "blur(2px)" }}
      />
      <motion.div
        initial={{ y: height + 20 }}
        animate={{ y: 0 }}
        exit={{ y: height + 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height,
          background: T.card,
          borderRadius: "22px 22px 0 0",
          boxShadow: "0 -14px 40px -18px rgba(11,16,32,.6)",
          padding: "10px 16px 16px",
        }}
      >
        <div
          style={{
            width: 34,
            height: 4,
            borderRadius: 4,
            background: T.line,
            margin: "0 auto 10px",
          }}
        />
        {children}
      </motion.div>
    </>
  );
}

function AddCustomerSheet({ active }: { active: boolean }) {
  return (
    <Sheet height={236}>
      <div style={{ fontSize: 13.5, fontWeight: 800, color: T.ink, letterSpacing: -0.3 }}>
        Add customer
      </div>
      <div style={{ fontSize: 8.5, color: T.mute, marginTop: 2, fontWeight: 600 }}>
        They get free payment reminders on WhatsApp.
      </div>
      <Field label="CUSTOMER NAME" value="Rahul Sharma" active={active} delay={280} cps={22} />
      <Field label="MOBILE NUMBER" value="98XXXXXXXX" active={active} delay={1000} cps={26} />
      <Press
        at={1.62}
        active={active}
        style={{
          marginTop: 14,
          height: 36,
          borderRadius: 999,
          background: `linear-gradient(145deg, ${T.blue}, ${T.blueDeep})`,
          color: "#fff",
          fontSize: 11,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 20px -10px ${T.blue}`,
        }}
      >
        Save customer
      </Press>
    </Sheet>
  );
}

function AddUdhaarSheet({ active }: { active: boolean }) {
  return (
    <Sheet height={252}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: T.ink, letterSpacing: -0.3 }}>
          New entry
        </div>
        <div style={{ display: "flex", background: T.bg, borderRadius: 999, padding: 2 }}>
          {["You gave", "You got"].map((s, k) => (
            <div
              key={s}
              style={{
                padding: "3px 8px",
                borderRadius: 999,
                fontSize: 8,
                fontWeight: 800,
                background: k === 0 ? T.card : "transparent",
                color: k === 0 ? T.blue : T.mute,
                boxShadow: k === 0 ? "0 1px 4px rgba(11,16,32,.14)" : "none",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: T.mute }}>₹</span>
        <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.4, color: T.ink, lineHeight: 1 }}>
          <Typewriter text="500" active={active} delay={280} cps={7} />
        </span>
      </div>
      <div style={{ height: 1.4, background: T.line, marginTop: 8 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
          style={{ height: "100%", background: T.blue, transformOrigin: "left" }}
        />
      </div>

      <Field label="REASON" value="Groceries" active={active} delay={900} cps={22} />

      <Press
        at={1.7}
        active={active}
        style={{
          marginTop: 14,
          height: 36,
          borderRadius: 999,
          background: `linear-gradient(145deg, ${T.blue}, ${T.blueDeep})`,
          color: "#fff",
          fontSize: 11,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 8px 20px -10px ${T.blue}`,
        }}
      >
        Save entry
      </Press>
    </Sheet>
  );
}

/* ------------------------------------------------------------------- QR UI */

function QrCode({ active, scanning }: { active: boolean; scanning: boolean }) {
  const d = useMemo(() => buildQrPath(25, 4, 20260725), []);
  return (
    <div style={{ position: "relative", width: 124, height: 124 }}>
      {/* glow */}
      <motion.div
        animate={
          active
            ? { opacity: [0.35, 0.7, 0.35], scale: [0.97, 1.04, 0.97] }
            : { opacity: 0.4, scale: 1 }
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: EASE_IO }}
        style={{
          position: "absolute",
          inset: -14,
          borderRadius: 28,
          background: `radial-gradient(circle at 50% 50%, ${T.blue}55, transparent 68%)`,
          filter: "blur(6px)",
        }}
      />
      {/* ripples */}
      {active &&
        [0, 1].map((k) => (
          <motion.div
            key={k}
            initial={{ scale: 0.85, opacity: 0.45 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, delay: k * 1, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: 26,
              border: `1.5px solid ${T.blue}`,
            }}
          />
        ))}

      <motion.div
        initial={{ scale: 0.72, opacity: 0, rotate: -3 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        style={{
          position: "relative",
          width: 124,
          height: 124,
          borderRadius: 18,
          background: "#fff",
          border: `1px solid ${T.line}`,
          boxShadow: `0 14px 34px -16px ${T.blue}cc`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d={d} fill={T.ink} />
        </svg>
        {/* centre badge */}
        <div
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            borderRadius: 9,
            background: `linear-gradient(145deg, ${T.blue}, ${T.blueDeep})`,
            border: "2.5px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CashloMark size={14} />
        </div>
        {/* scan sweep */}
        {scanning && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 60 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: EASE_IO }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 34,
              background: `linear-gradient(180deg, transparent, ${T.blue}33, ${T.blue}00)`,
              borderBottom: `1.5px solid ${T.blue}`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

function PayParticles() {
  const bits = useMemo(() => {
    const rnd = mulberry32(7);
    return Array.from({ length: 12 }, (_, k) => ({
      dx: (rnd() - 0.5) * 26,
      dy: (rnd() - 0.5) * 20,
      delay: k * 0.075,
      s: 3 + rnd() * 3,
    }));
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {bits.map((b, k) => (
        <motion.span
          key={k}
          initial={{ opacity: 0, x: 196, y: 330, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [196, 150 + b.dx, 140 + b.dx],
            y: [330, 248 + b.dy, 145 + b.dy],
            scale: [0.4, 1, 0.5],
          }}
          transition={{ duration: 1.15, delay: b.delay, repeat: Infinity, ease: EASE_IO }}
          style={{
            position: "absolute",
            width: b.s,
            height: b.s,
            borderRadius: 999,
            background: T.blue,
            boxShadow: `0 0 6px ${T.blue}`,
            display: "block",
          }}
        />
      ))}
    </div>
  );
}

function CustomerPhone() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, x: 18, rotate: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, x: 0, rotate: -5, scale: 1 }}
      exit={{ opacity: 0, y: 50, rotate: 10 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      style={{
        position: "absolute",
        right: 6,
        bottom: 4,
        width: 84,
        height: 150,
        borderRadius: 16,
        background: "#0B1020",
        padding: 4,
        boxShadow: "0 20px 40px -18px rgba(11,16,32,.8)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          background: "#101736",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {/* viewfinder */}
        <div style={{ position: "relative", width: 50, height: 50 }}>
          {(
            [
              { top: 0, left: 0, b: "top left" },
              { top: 0, right: 0, b: "top right" },
              { bottom: 0, left: 0, b: "bottom left" },
              { bottom: 0, right: 0, b: "bottom right" },
            ] as { top?: number; left?: number; right?: number; bottom?: number; b: string }[]
          ).map((c, k) => (
            <span
              key={k}
              style={{
                position: "absolute",
                width: 13,
                height: 13,
                top: c.top,
                left: c.left,
                right: c.right,
                bottom: c.bottom,
                borderTop: c.b.includes("top") ? `2px solid ${T.blue}` : "none",
                borderBottom: c.b.includes("bottom") ? `2px solid ${T.blue}` : "none",
                borderLeft: c.b.includes("left") ? `2px solid ${T.blue}` : "none",
                borderRight: c.b.includes("right") ? `2px solid ${T.blue}` : "none",
                borderRadius: 4,
              }}
            />
          ))}
          <motion.div
            animate={{ y: [4, 42, 4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: EASE_IO }}
            style={{
              position: "absolute",
              left: 6,
              right: 6,
              height: 1.5,
              background: T.blue,
              boxShadow: `0 0 8px ${T.blue}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 13,
              borderRadius: 3,
              background: "rgba(255,255,255,.12)",
            }}
          />
        </div>
        <div style={{ fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>
          Scanning…
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: EASE_IO }}
          style={{
            fontSize: 6.5,
            fontWeight: 700,
            color: T.blue,
            padding: "2px 6px",
            borderRadius: 999,
            background: "rgba(59,91,255,.18)",
          }}
        >
          Any UPI app
        </motion.div>
      </div>
    </motion.div>
  );
}

function QrSheet({ i, active }: { i: number; active: boolean }) {
  const paying = i === IDX.scan;
  const done = i === IDX.success;
  return (
    <Sheet height={368}>
      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <motion.div
            key="qr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, color: T.mute, letterSpacing: 0.7 }}>
              COLLECT FROM RAHUL
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1.1, color: T.ink, marginTop: 2 }}>
              ₹500
            </div>
            <div style={{ marginTop: 14 }}>
              <QrCode active={active} scanning={paying} />
            </div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: T.body, marginTop: 16 }}>
              {paying ? "Waiting for payment…" : "Scan with any UPI app"}
            </div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 999,
                background: T.blueSoft,
                fontSize: 8,
                fontWeight: 800,
                color: T.blue,
                letterSpacing: 0.2,
              }}
            >
              <CashloMark size={10} color={T.blue} />
              Secured by Cashlo · UPI
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 26,
            }}
          >
            <div style={{ position: "relative" }}>
              {[0, 1].map((k) => (
                <motion.div
                  key={k}
                  initial={{ scale: 0.7, opacity: 0.5 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: k * 0.55, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 999,
                    border: `1.5px solid ${T.green}`,
                  }}
                />
              ))}
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 340, damping: 16 }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 999,
                  background: `linear-gradient(145deg, #19C97A, ${T.green})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 14px 30px -14px ${T.green}`,
                }}
              >
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <motion.path
                    d="M9 17.5 14.5 23 25 11.5"
                    stroke="#fff"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.42, delay: 0.14, ease: EASE }}
                  />
                </svg>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.32, ease: EASE }}
              style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, color: T.ink, marginTop: 16 }}
            >
              <CountUp from={0} to={500} duration={620} active={active} prefix="₹" /> received
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.32, ease: EASE }}
              style={{ fontSize: 9.5, color: T.body, fontWeight: 600, marginTop: 3 }}
            >
              From Rahul Sharma · UPI · 9:41 AM
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.42, type: "spring", stiffness: 320, damping: 22 }}
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 999,
                background: T.greenSoft,
                color: T.green,
                fontSize: 9,
                fontWeight: 800,
              }}
            >
              Ledger updated automatically
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {paying && <PayParticles />}
      <AnimatePresence>{paying && <CustomerPhone key="cp" />}</AnimatePresence>
    </Sheet>
  );
}

/* -------------------------------------------------------------- main shell */

export default function QuickKhataPhoneDemo({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.35 });
  const reduced = useReducedMotion();
  const active = inView && !reduced;

  const [i, setI] = useState(0);
  const [fitRef, scale] = useFitScale(FRAME_W);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setI((p) => (p + 1) % SCENES.length), SCENES[i].ms / SPEED);
    return () => clearTimeout(t);
  }, [i, active]);

  // restart cleanly whenever the demo re-enters the viewport
  useEffect(() => {
    if (!inView) setI(0);
  }, [inView]);

  const scene = reduced ? SCENES[0] : SCENES[i];
  const idx = reduced ? 0 : i;
  const isDetail = idx >= IDX.addUdhaar;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width: "100%", maxWidth: FRAME_W, margin: "0 auto", ...style }}
      role="img"
      aria-label="QuickKhata demo: add a customer, record udhaar, generate a payment QR, receive the UPI payment, and the ledger settles automatically."
    >
      <style>{`
        @keyframes qk-blink { 0%,49% {opacity:1} 50%,100% {opacity:0} }
        .qk-caret{display:inline-block;width:1.5px;height:1em;margin-left:1px;
          background:${T.blue};vertical-align:-0.12em;animation:qk-blink .9s steps(1,end) infinite}
        @media (prefers-reduced-motion: reduce){ .qk-caret{animation:none;opacity:0} }
      `}</style>

      <div ref={fitRef} style={{ position: "relative", width: "100%", aspectRatio: `${FRAME_W} / ${FRAME_H}` }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            willChange: "transform",
          }}
        >
          {/* ambient halo */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -30,
              borderRadius: 80,
              background: `radial-gradient(60% 45% at 50% 60%, ${T.blue}1F, transparent 70%)`,
              filter: "blur(10px)",
            }}
          />

          {/* frame */}
          <div
            style={{
              position: "relative",
              width: FRAME_W,
              height: FRAME_H,
              borderRadius: 46,
              background: "#0B1020",
              padding: BEZEL,
              boxShadow:
                "0 40px 80px -40px rgba(11,16,32,.55), 0 2px 0 0 rgba(255,255,255,.06) inset",
            }}
          >
            {/* notch */}
            <div
              style={{
                position: "absolute",
                top: BEZEL,
                left: "50%",
                transform: "translateX(-50%)",
                width: 104,
                height: 22,
                background: "#0B1020",
                borderRadius: "0 0 14px 14px",
                zIndex: 30,
              }}
            />
            {/* screen */}
            <div
              style={{
                position: "relative",
                width: SCREEN_W,
                height: SCREEN_H,
                borderRadius: 37,
                overflow: "hidden",
                background: T.bg,
                display: "flex",
                flexDirection: "column",
                fontFamily: "inherit",
              }}
            >
              <StatusBar />
              <Header scene={scene} i={idx} active={active} />
              <ProgressLine i={idx} ms={SCENES[idx].ms / SPEED} active={active} />

              <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={isDetail ? "detail" : "list"}
                    initial={{ opacity: 0, x: isDetail ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isDetail ? -30 : 30 }}
                    transition={{ duration: 0.42, ease: EASE }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    {isDetail ? (
                      <DetailView i={idx} active={active} />
                    ) : (
                      <ListView i={idx} active={active} />
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  {idx === IDX.addCustomer && <AddCustomerSheet key="ac" active={active} />}
                  {idx === IDX.addUdhaar && <AddUdhaarSheet key="au" active={active} />}
                  {(idx === IDX.qr || idx === IDX.scan || idx === IDX.success) && (
                    <QrSheet key="qr" i={idx} active={active} />
                  )}
                </AnimatePresence>
              </div>

              <BottomNav i={idx} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}