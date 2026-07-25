"use client";

/**
 * CashloMerchantJourney
 * ---------------------------------------------------------------------------
 * Looping, cinematic SVG story for the right side of the Contact Us hero:
 *   Join Cashlo -> Open your Cashlo Store -> Customers arrive -> Business grows
 *
 * Pure SVG + Framer Motion. No images, GIFs or video.
 * Scales to whatever box you give it (width:100%, height:100%).
 * Pauses when scrolled out of view and when the browser tab is hidden.
 * Falls back to a still composed frame under prefers-reduced-motion.
 * ---------------------------------------------------------------------------
 */

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";

/* ------------------------------------------------------------------ tokens */

const C = {
  blue: "#3B5BFF",
  blueDeep: "#2440D6",
  blueMid: "#6E86FF",
  blueSoft: "#9BAAFF",
  blueWash: "#EEF1FF",
  ink: "#232335",
  inkSoft: "#3D3D55",
  inkMute: "#5A5A75",
  line: "#E4E7F2",
  panel: "#F5F7FC",
  panelDeep: "#EAEEF8",
  skin: "#F3C6AC",
  skinDeep: "#E3AE90",
  white: "#FFFFFF",
};

/* Ground plane + store anchor, in viewBox units. */
const VB = { w: 720, h: 560 };
const GROUND = 436;
const STORE_X = 380;

/* Story beats, in seconds from the top of the loop. */
const CUE = {
  WALK: 0,
  PIN: 2.2,
  LAUNCH: 3.2,
  LAND: 4.6,
  BUILD: 5.2,
  OPEN: 7.0,
  CUSTOMERS: 8.0,
  GROWTH: 10.4,
  NETWORK: 12.0,
  OUTRO: 13.8,
};
const CUES = Object.values(CUE);
const LOOP = 14.8;

const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const EASE_SOFT: [number, number, number, number] = [0.4, 0, 0.2, 1];

/* --------------------------------------------------------------- utilities */

/** True when every animation should be frozen (reduced-motion users). */
const StillContext = createContext(false);
const useStill = () => useContext(StillContext);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function useInView(ref: RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return visible;
}

/**
 * Drives the story. Runs on rAF but only commits state when the beat changes,
 * so React re-renders ~10 times per 15s loop instead of 900. All the real
 * motion is handed to Framer Motion (compositor-friendly transforms).
 */
function useStoryClock(active: boolean) {
  const [state, setState] = useState({ beat: 0, take: 0 });
  const elapsed = useRef(0);
  const beat = useRef(0);
  const take = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      elapsed.current += Math.min((now - last) / 1000, 0.25);
      last = now;

      if (elapsed.current >= LOOP) {
        elapsed.current -= LOOP;
        take.current += 1;
        beat.current = 0;
        setState({ beat: 0, take: take.current });
      } else {
        let next = 0;
        for (let i = CUES.length - 1; i >= 0; i -= 1) {
          if (elapsed.current >= CUES[i]) {
            next = i;
            break;
          }
        }
        if (next !== beat.current) {
          beat.current = next;
          setState({ beat: next, take: take.current });
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return state;
}

/* Beat index helpers, so scene conditions read like the storyboard. */
const B = {
  walk: 0,
  pin: 1,
  launch: 2,
  land: 3,
  build: 4,
  open: 5,
  customers: 6,
  growth: 7,
  network: 8,
  outro: 9,
};

/* ------------------------------------------------------------------ people */

type PersonKind = "merchant" | "student" | "office" | "homemaker" | "farmer" | "shopkeeper";
type Prop = "case" | "backpack" | "tote" | "hat" | "apron";

const PEOPLE: Record<PersonKind, { top: string; leg: string; hair: string; prop: Prop }> = {
  merchant: { top: C.ink, leg: C.inkSoft, hair: C.ink, prop: "case" },
  student: { top: C.blue, leg: C.inkSoft, hair: C.ink, prop: "backpack" },
  office: { top: C.inkSoft, leg: C.ink, hair: C.ink, prop: "case" },
  homemaker: { top: C.blueMid, leg: C.inkSoft, hair: C.ink, prop: "tote" },
  farmer: { top: C.blueSoft, leg: C.inkSoft, hair: C.ink, prop: "hat" },
  shopkeeper: { top: C.blueDeep, leg: C.ink, hair: C.ink, prop: "apron" },
};

const fillBox: CSSProperties = { transformBox: "fill-box" } as CSSProperties;

/**
 * A flat, faceless figure standing on y = 0, roughly 120 units tall.
 * Limbs pivot from their shoulder / hip via transform-box: fill-box.
 */
function Person({
  kind = "student",
  moving = true,
  offset = 0,
}: {
  kind?: PersonKind;
  moving?: boolean;
  offset?: number;
}) {
  const still = useStill();
  const p = PEOPLE[kind] ?? PEOPLE.student;
  const swing = moving && !still;

  const limb = (a: number, b: number) => {
    const transition: Transition = swing
      ? {
          duration: 0.66,
          repeat: Infinity,
          ease: "easeInOut",
          delay: offset,
        }
      : { duration: 0.3 };
    return {
      animate: { rotate: swing ? [a, b, a] : 0 },
      transition,
      style: { ...fillBox, transformOrigin: "50% 0%" },
    };
  };

  return (
    <motion.g
      animate={{ y: swing ? [0, -1.6, 0] : 0 }}
      transition={
        swing
          ? { duration: 0.33, repeat: Infinity, ease: "easeInOut", delay: offset }
          : { duration: 0.3 }
      }
    >
      {/* back leg */}
      <motion.g {...limb(-17, 17)}>
        <rect x="-10.5" y="-52" width="11" height="54" rx="5.5" fill={p.leg} />
        <rect x="-13" y="-4" width="19" height="8" rx="4" fill={C.ink} />
      </motion.g>

      {/* back arm */}
      <motion.g {...limb(16, -16)}>
        <rect x="-4" y="-92" width="8" height="42" rx="4" fill={p.top} />
      </motion.g>

      {p.prop === "backpack" && (
        <rect x="-22" y="-92" width="14" height="34" rx="6" fill={C.blueDeep} />
      )}

      {/* torso */}
      <rect x="-13.5" y="-98" width="27" height="52" rx="12" fill={p.top} />
      {p.prop === "apron" && (
        <path
          d="M-9-84h18v30a9 9 0 0 1-9 9 9 9 0 0 1-9-9z"
          fill={C.white}
          opacity="0.85"
        />
      )}

      {/* head */}
      <rect x="-4" y="-104" width="8" height="8" fill={C.skinDeep} />
      <circle cx="0" cy="-114" r="12.5" fill={C.skin} />
      <path
        d="M-12.5-116a12.5 12.5 0 0 1 25 0c0 4-3 5-6 3-4-3-9-3-13 1-3 3-6 1-6-4z"
        fill={p.hair}
      />
      {p.prop === "hat" && (
        <g>
          <ellipse cx="0" cy="-122" rx="21" ry="4.5" fill={C.blueDeep} />
          <path d="M-9-124a9 9 0 0 1 18 0z" fill={C.blueDeep} />
        </g>
      )}

      {/* front leg */}
      <motion.g {...limb(18, -18)}>
        <rect x="-0.5" y="-52" width="11" height="54" rx="5.5" fill={C.ink} />
        <rect x="-2" y="-4" width="19" height="8" rx="4" fill={C.ink} />
      </motion.g>

      {/* front arm (+ carried prop) */}
      <motion.g {...limb(-16, 16)}>
        <rect x="-4" y="-92" width="8" height="42" rx="4" fill={p.top} />
        {p.prop === "case" && (
          <g>
            <rect x="-19" y="-52" width="38" height="26" rx="5" fill={C.blue} />
            <rect x="-6" y="-55" width="12" height="5" rx="2.5" fill={C.blueDeep} />
            <rect
              x="-13"
              y="-38"
              width="16"
              height="4"
              rx="2"
              fill={C.white}
              opacity="0.55"
            />
          </g>
        )}
        {p.prop === "tote" && (
          <g>
            <rect x="-12" y="-50" width="24" height="26" rx="4" fill={C.blueDeep} />
            <path
              d="M-6-50v-5a6 6 0 0 1 12 0v5"
              fill="none"
              stroke={C.blueDeep}
              strokeWidth="2.5"
            />
          </g>
        )}
      </motion.g>
    </motion.g>
  );
}

/** Soft contact shadow that lives under a figure or object. */
function Shadow({
  rx = 26,
  opacity = 0.14,
  fill = C.ink,
}: {
  rx?: number;
  opacity?: number;
  fill?: string;
}) {
  return <ellipse cx="0" cy="4" rx={rx} ry="5" fill={fill} opacity={opacity} />;
}

/* ------------------------------------------------------------------ scenes */

/** Scene 1 + 5 — the entrepreneur arrives, waits, then steps into his store. */
function Entrepreneur({ beat }: { beat: number }) {
  const still = useStill();
  const [arrived, setArrived] = useState(false);
  const entering = beat >= B.open;
  const moving = still ? false : entering || !arrived;

  return (
    <motion.g
      initial={{ x: -180, opacity: 0 }}
      animate={
        entering
          ? { x: STORE_X - 26, opacity: 1 }
          : { x: 196, opacity: 1 }
      }
      transition={
        entering
          ? { duration: 1.15, ease: EASE_SOFT }
          : { x: { duration: 2.1, ease: EASE }, opacity: { duration: 0.4 } }
      }
      onAnimationComplete={() => setArrived(true)}
    >
      <motion.g
        animate={{ opacity: entering ? 0 : 1, scale: entering ? 0.82 : 1 }}
        transition={{
          duration: entering ? 0.85 : 0.3,
          delay: entering ? 0.55 : 0,
          ease: EASE_SOFT,
        }}
        style={{ ...fillBox, transformOrigin: "50% 100%" }}
      >
        <g transform={`translate(0 ${GROUND})`}>
          <Shadow rx={30} />
          <Person kind="merchant" moving={moving} />
        </g>
      </motion.g>
    </motion.g>
  );
}

/** Scene 2 + 3 — pin appears above him, becomes a rocket, flies, lands. */
function PinRocket({ beat, uid }: { beat: number; uid: string }) {
  const still = useStill();
  const launched = beat >= B.launch;

  const flight = {
    x: [0, 2, 62, 148, 184, 184],
    y: [0, -46, -132, -150, -74, 128],
    rotate: [0, 0, 26, 58, 22, 0],
  };

  return (
    <g transform="translate(196 288)">
      {/* trail */}
      {launched && !still && (
        <motion.path
          d="M0 6C0-40 18-94 66-118 118-144 176-104 184-46c4 32 3 88 0 172"
          fill="none"
          stroke={`url(#${uid}-trail)`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 9"
          initial={{ pathLength: 0, opacity: 0.9 }}
          animate={{ pathLength: 1, opacity: [0.9, 0.9, 0] }}
          transition={{
            pathLength: { duration: 1.3, ease: EASE_SOFT },
            opacity: { duration: 2.1, times: [0, 0.62, 1] },
          }}
        />
      )}

      <motion.g
        initial={{ scale: 0, y: 14, opacity: 0 }}
        animate={
          launched
            ? { ...flight, scale: 1, opacity: [1, 1, 1, 1, 1, 0] }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={
          launched
            ? { duration: 1.4, ease: EASE_SOFT }
            : { type: "spring", stiffness: 260, damping: 16 }
        }
        style={{ ...fillBox, transformOrigin: "50% 100%" }}
      >
        {/* map pin — cross-fades into the rocket on launch */}
        <motion.g
          animate={{ opacity: launched ? 0 : 1, scale: launched ? 0.7 : 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{ ...fillBox, transformOrigin: "50% 100%" }}
        >
          <path
            d="M0 8c0 0-19-22-19-34a19 19 0 1 1 38 0C19-14 0 8 0 8z"
            fill={`url(#${uid}-pin)`}
          />
          <circle cx="0" cy="-26" r="7" fill={C.white} />
        </motion.g>

        {/* rocket */}
        <motion.g
          animate={{ opacity: launched ? 1 : 0, scale: launched ? 1 : 0.6 }}
          transition={{ duration: 0.28, delay: launched ? 0.06 : 0 }}
          style={{ ...fillBox, transformOrigin: "50% 100%" }}
        >
          <path
            d="M0-42c9 9 13 21 13 33l-4 9h-18l-4-9c0-12 4-24 13-33z"
            fill={`url(#${uid}-pin)`}
          />
          <path d="M-13 0l-9 8 9-2z" fill={C.blueDeep} />
          <path d="M13 0l9 8-9-2z" fill={C.blueDeep} />
          <circle cx="0" cy="-16" r="5" fill={C.white} />
          <motion.path
            d="M-6 2h12l-6 16z"
            fill={C.blueSoft}
            animate={{ scaleY: still ? 1 : [1, 1.5, 1], opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 0.24, repeat: Infinity }}
            style={{ ...fillBox, transformOrigin: "50% 0%" }}
          />
        </motion.g>
      </motion.g>

      {/* location dots dropped along the flight path */}
      {launched &&
        [40, 84, 128, 168].map((dx, i) => (
          <motion.circle
            key={dx}
            cx={dx}
            cy={148}
            r="3.5"
            fill={C.blueSoft}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 0.35] }}
            transition={{ duration: 0.7, delay: 0.28 + i * 0.16, ease: EASE }}
          />
        ))}
    </g>
  );
}

/** Scene 3 — landing marker and ground ripple. */
function LandingRipple({ uid }: { uid: string }) {
  const still = useStill();
  return (
    <g transform={`translate(${STORE_X} ${GROUND})`}>
      {!still &&
        [0, 0.45, 0.9].map((delay) => (
          <motion.ellipse
            key={delay}
            rx="30"
            ry="9"
            fill="none"
            stroke={C.blue}
            strokeWidth="2"
            initial={{ scale: 0.3, opacity: 0.55 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{
              duration: 1.6,
              delay,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: "easeOut",
            }}
          />
        ))}
      <motion.ellipse
        rx="46"
        ry="14"
        fill={`url(#${uid}-glow)`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.5 }}
      />
    </g>
  );
}

/** Scene 4 + 5 — the Cashlo store builds out of the ground and opens up. */
function Store({ beat, uid }: { beat: number; uid: string }) {
  const still = useStill();
  const open = beat >= B.open;
  const grow = (delay: number, duration = 0.6) => ({
    initial: { scaleY: 0, opacity: 0 },
    animate: { scaleY: 1, opacity: 1 },
    transition: { duration, delay, ease: EASE },
    style: { ...fillBox, transformOrigin: "50% 100%" },
  });

  return (
    <g>
      {/* plinth */}
      <motion.rect
        x="248"
        y="428"
        width="264"
        height="12"
        rx="6"
        fill={C.panelDeep}
        {...grow(0, 0.45)}
      />

      {/* facade */}
      <motion.g {...grow(0.18, 0.75)}>
        <rect
          x="262"
          y="256"
          width="236"
          height="176"
          rx="10"
          fill={`url(#${uid}-facade)`}
          stroke={C.line}
        />
      </motion.g>

      {/* awning */}
      <motion.g
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
        style={{ ...fillBox, transformOrigin: "50% 50%" }}
      >
        <path d="M252 254h256l-10 26H262z" fill={C.blue} />
        <path d="M296 254l-8 26h20l8-26zM348 254l-8 26h20l8-26zM400 254l-8 26h20l8-26zM452 254l-8 26h20l8-26z" fill={C.white} opacity="0.22" />
      </motion.g>

      {/* window */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: EASE }}
      >
        <rect x="282" y="300" width="76" height="82" rx="8" fill={`url(#${uid}-glass)`} />
        <rect x="282" y="300" width="76" height="82" rx="8" fill="none" stroke={C.line} />
        <path d="M290 372l26-52 14 26 10-14 12 40z" fill={C.blue} opacity="0.14" />
      </motion.g>

      {/* doorway + interior */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.12, ease: EASE }}
      >
        <rect x="384" y="296" width="92" height="132" rx="8" fill={C.ink} />
        <motion.rect
          x="384"
          y="296"
          width="92"
          height="132"
          rx="8"
          fill={`url(#${uid}-interior)`}
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.9, delay: open ? 0.35 : 0 }}
        />
        {/* shutter rolls up on opening */}
        <motion.g
          initial={{ scaleY: 1 }}
          animate={{ scaleY: open ? 0.04 : 1 }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          style={{ ...fillBox, transformOrigin: "50% 0%" }}
        >
          <rect x="384" y="296" width="92" height="132" rx="8" fill={C.panelDeep} />
          {[306, 318, 330, 342, 354, 366, 378, 390, 402, 414].map((y) => (
            <rect key={y} x="388" y={y} width="84" height="4" rx="2" fill={C.line} />
          ))}
        </motion.g>
      </motion.g>

      {/* signboard */}
      <motion.g
        initial={{ scale: 0.7, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 1.25 }}
        style={{ ...fillBox, transformOrigin: "50% 100%" }}
      >
        <motion.ellipse
          cx={STORE_X}
          cy="216"
          rx="118"
          ry="52"
          fill={`url(#${uid}-glow)`}
          animate={{ opacity: still ? 0.7 : [0.45, 0.95, 0.45] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="302" y="192" width="156" height="48" rx="12" fill={`url(#${uid}-sign)`} />
        <rect
          x="302"
          y="192"
          width="156"
          height="48"
          rx="12"
          fill="none"
          stroke={C.white}
          strokeOpacity="0.35"
        />
        <motion.text
          x={STORE_X}
          y="223"
          textAnchor="middle"
          fill={C.white}
          fontSize="23"
          fontWeight="800"
          letterSpacing="3"
          style={{ fontFamily: "inherit" }}
          animate={{ opacity: still ? 1 : [1, 0.82, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          CASHLO
        </motion.text>
        <rect x="332" y="240" width="8" height="16" rx="3" fill={C.blueDeep} />
        <rect x="420" y="240" width="8" height="16" rx="3" fill={C.blueDeep} />
      </motion.g>

      {/* swinging Open sign */}
      {open && (
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          style={{ ...fillBox, transformOrigin: "50% 0%" }}
        >
          <motion.g
            animate={{ rotate: still ? 0 : [-5, 5, -5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ ...fillBox, transformOrigin: "50% 0%" }}
          >
            <line x1="352" y1="296" x2="352" y2="308" stroke={C.inkMute} strokeWidth="2" />
            <rect x="330" y="308" width="44" height="22" rx="6" fill={C.white} stroke={C.blue} strokeWidth="2" />
            <text
              x="352"
              y="323"
              textAnchor="middle"
              fill={C.blue}
              fontSize="11"
              fontWeight="700"
              letterSpacing="0.5"
              style={{ fontFamily: "inherit" }}
            >
              OPEN
            </text>
          </motion.g>
        </motion.g>
      )}
    </g>
  );
}

/** Scene 4 — confetti on opening day. */
const CONFETTI: [number, number, number, string][] = [
  [-96, -18, -14, C.blue],
  [-62, 10, 22, C.blueSoft],
  [-28, -30, 8, C.blueMid],
  [6, 4, -20, C.blue],
  [40, -22, 16, C.blueSoft],
  [74, 12, -8, C.blueMid],
  [104, -14, 26, C.blue],
  [-118, 16, 12, C.blueSoft],
  [24, -40, -26, C.blueDeep],
  [-46, -6, 18, C.blueDeep],
];

function Confetti() {
  const still = useStill();
  if (still) return null;
  return (
    <g transform={`translate(${STORE_X} 210)`}>
      {CONFETTI.map(([x, drift, rot, fill], i) => (
        <motion.rect
          key={i}
          x={x}
          y={0}
          width="7"
          height="10"
          rx="2"
          fill={fill}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: [0, -70, 150], opacity: [0, 1, 0], rotate: rot * 8, x: x + drift }}
          transition={{ duration: 1.5, delay: 1.25 + i * 0.05, ease: "easeOut" }}
        />
      ))}
    </g>
  );
}

/* ----------------------------------------------------- customers + services */

const CUSTOMERS: { kind: PersonKind; from: number; delay: number }[] = [
  { kind: "student", from: -230, delay: 0.0 },
  { kind: "office", from: 250, delay: 0.34 },
  { kind: "homemaker", from: -270, delay: 0.68 },
  { kind: "farmer", from: 292, delay: 1.02 },
  { kind: "shopkeeper", from: -310, delay: 1.36 },
];

function Customers() {
  const still = useStill();
  const door = STORE_X + 48;

  if (still) {
    return (
      <g>
        <g transform={`translate(${STORE_X - 96} ${GROUND})`}>
          <Shadow rx={26} />
          <Person kind="student" moving={false} />
        </g>
        <g transform={`translate(${STORE_X + 118} ${GROUND})`}>
          <g transform="scale(-1 1)">
            <Shadow rx={26} />
            <Person kind="homemaker" moving={false} />
          </g>
        </g>
      </g>
    );
  }

  return (
    <g>
      {CUSTOMERS.map(({ kind, from, delay }, i) => {
        const flip = from > 0;
        const start = STORE_X + from;
        return (
          <motion.g
            key={kind}
            initial={{ x: start }}
            animate={{ x: door }}
            transition={{ duration: 2.5, delay, ease: EASE_SOFT }}
          >
            <motion.g
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 0.94, 0.94, 0.78] }}
              transition={{
                duration: 2.5,
                delay,
                times: [0, 0.14, 0.78, 1],
                ease: "easeInOut",
              }}
              style={{ ...fillBox, transformOrigin: "50% 100%" }}
            >
              <g transform={`translate(0 ${GROUND})`}>
                <g transform={flip ? "scale(-1 1)" : undefined}>
                  <Shadow rx={26} />
                  <Person kind={kind} moving offset={i * 0.09} />
                </g>
              </g>
            </motion.g>
          </motion.g>
        );
      })}
    </g>
  );
}

/* Seven services, floating up around the shop as customers step inside. */
type ServiceIcon = "upi" | "recharge" | "bill" | "doc" | "loan" | "gold" | "shield";

const SERVICES: { label: string; x: number; y: number; icon: ServiceIcon }[] = [
  { label: "UPI Withdrawal", x: 128, y: 176, icon: "upi" },
  { label: "Recharge", x: 100, y: 244, icon: "recharge" },
  { label: "Bill Pay", x: 122, y: 312, icon: "bill" },
  { label: "ITR Filing", x: 250, y: 168, icon: "doc" },
  { label: "Loan", x: 602, y: 176, icon: "loan" },
  { label: "Digital Gold", x: 620, y: 244, icon: "gold" },
  { label: "Insurance", x: 598, y: 312, icon: "shield" },
];

function ServiceGlyph({ icon }: { icon: ServiceIcon }) {
  const s = { fill: "none", stroke: C.blue, strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "upi":
      return (
        <g>
          <rect x="-6" y="-5" width="12" height="10" rx="2" {...s} />
          <path d="M-3 -1h6" {...s} />
        </g>
      );
    case "recharge":
      return (
        <g>
          <rect x="-4.5" y="-7" width="9" height="14" rx="2.5" {...s} />
          <path d="M0 -3l-2 3h4l-2 3" {...s} />
        </g>
      );
    case "bill":
      return (
        <g>
          <path d="M-5-7h10v14l-3-2-2 2-2-2-3 2z" {...s} />
          <path d="M-2-3h4" {...s} />
        </g>
      );
    case "loan":
      return (
        <g>
          <circle cx="0" cy="0" r="6.5" {...s} />
          <path d="M-2.5-3h5M-2.5 0h5M-1.5-3v4a2.5 2.5 0 0 0 3 2" {...s} />
        </g>
      );
    case "gold":
      return (
        <g>
          <path d="M-7 2l3-6h8l3 6z" {...s} />
          <path d="M-4-4l4 6 4-6" {...s} />
        </g>
      );
    case "shield":
      return <path d="M0-7l6 2v5c0 4-3 6-6 7-3-1-6-3-6-7v-5z" {...s} />;
    default:
      return (
        <g>
          <path d="M-5-7h7l3 3v11h-10z" {...s} />
          <path d="M-2-1h4M-2 2h4" {...s} />
        </g>
      );
  }
}

function ServiceBadges() {
  const still = useStill();
  return (
    <g>
      {SERVICES.map(({ label, x, y, icon }, i) => (
        <motion.g
          key={label}
          transform={`translate(${x} ${y})`}
          initial={{ opacity: 0, scale: 0.7, y: 14 }}
          animate={
            still
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: [0, 1, 1, 0], scale: [0.7, 1, 1, 0.94], y: [14, 0, -8, -22] }
          }
          transition={{
            duration: still ? 0.3 : 2.9,
            delay: still ? 0 : 0.35 + i * 0.26,
            times: still ? undefined : [0, 0.16, 0.72, 1],
            ease: EASE,
          }}
          style={{ ...fillBox, transformOrigin: "50% 50%" }}
        >
          <rect
            x="-58"
            y="-17"
            width="116"
            height="34"
            rx="17"
            fill={C.white}
            stroke={C.line}
          />
          <circle cx="-40" cy="0" r="12" fill={C.blueWash} />
          <g transform="translate(-40 0)">
            <ServiceGlyph icon={icon} />
          </g>
          <text
            x="-22"
            y="4.5"
            fill={C.inkSoft}
            fontSize="12"
            fontWeight="600"
            style={{ fontFamily: "inherit" }}
          >
            {label}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ growth */

function Growth({ uid }: { uid: string }) {
  const still = useStill();

  return (
    <g>
      {/* rupees drifting up off the roof */}
      {!still &&
        [-70, -24, 22, 68, 104].map((dx, i) => (
          <motion.text
            key={dx}
            x={STORE_X + dx}
            y={250}
            textAnchor="middle"
            fill={C.blue}
            fontSize={i % 2 ? 20 : 26}
            fontWeight="700"
            style={{ fontFamily: "inherit" }}
            initial={{ opacity: 0, y: 250 }}
            animate={{ opacity: [0, 1, 0], y: [250, 202, 172] }}
            transition={{
              duration: 2.6,
              delay: i * 0.34,
              repeat: Infinity,
              repeatDelay: 0.6,
              ease: "easeOut",
            }}
          >
            ₹
          </motion.text>
        ))}

      {/* growth bars + arrow */}
      <motion.g
        transform="translate(652 110)"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <rect x="-46" y="-58" width="102" height="86" rx="14" fill={C.white} stroke={C.line} />
        {(
          [
            [-30, 14, 0],
            [-10, 26, 0.12],
            [10, 40, 0.24],
            [30, 54, 0.36],
          ] as [number, number, number][]
        ).map(([x, h, d]) => (
          <motion.rect
            key={x}
            x={x}
            y={16 - h}
            width="12"
            height={h}
            rx="4"
            fill={C.blue}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, delay: 0.25 + d, ease: EASE }}
            style={{ ...fillBox, transformOrigin: "50% 100%" }}
          />
        ))}
        <motion.path
          d="M-32-24l20-12 16 8 24-18"
          fill="none"
          stroke={C.blueDeep}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        />
        <motion.path
          d="M20-46h10v10"
          fill="none"
          stroke={C.blueDeep}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 1.1 }}
          style={{ ...fillBox, transformOrigin: "50% 50%" }}
        />
      </motion.g>

      {/* wallet filling up */}
      <motion.g
        transform="translate(86 110)"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
      >
        <rect x="-42" y="-30" width="84" height="60" rx="14" fill={C.white} stroke={C.line} />
        <motion.rect
          x="-42"
          y="-30"
          width="84"
          height="60"
          rx="14"
          fill={`url(#${uid}-fill)`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE_SOFT }}
          style={{ ...fillBox, transformOrigin: "50% 100%" }}
        />
        <path d="M-26-12h52a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6h-52a6 6 0 0 1-6-6v-18a6 6 0 0 1 6-6z" fill={C.blue} />
        <circle cx="22" cy="4" r="5" fill={C.white} />
      </motion.g>

      {/* status badges */}
      <FloatingBadge x={240} y={108} delay={0.45} label="Business growing" tone="solid" />
      <FloatingBadge
        x={474}
        y={108}
        delay={0.8}
        label="Trusted Cashlo merchant"
        tone="outline"
      />
    </g>
  );
}

function FloatingBadge({
  x,
  y,
  delay,
  label,
  tone,
}: {
  x: number;
  y: number;
  delay: number;
  label: string;
  tone: "solid" | "outline";
}) {
  const still = useStill();
  const solid = tone === "solid";
  const width = label.length * 7.4 + 46;

  return (
    <motion.g
      transform={`translate(${x} ${y})`}
      initial={{ opacity: 0, scale: 0.72, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay }}
      style={{ ...fillBox, transformOrigin: "50% 50%" }}
    >
      <motion.g
        animate={{ y: still ? 0 : [0, -6, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <rect
          x={-width / 2}
          y="-19"
          width={width}
          height="38"
          rx="19"
          fill={solid ? C.blue : C.white}
          stroke={solid ? C.blue : C.line}
        />
        <g transform={`translate(${-width / 2 + 24} 0)`}>
          {solid ? (
            <path
              d="M-7 5l5-7 4 4 6-9"
              fill="none"
              stroke={C.white}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M0-9l7 2.5v5c0 4.5-3.2 7-7 8.5-3.8-1.5-7-4-7-8.5v-5z"
              fill="none"
              stroke={C.blue}
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
          )}
        </g>
        <text
          x={-width / 2 + 40}
          y="5"
          fill={solid ? C.white : C.inkSoft}
          fontSize="13"
          fontWeight="650"
          style={{ fontFamily: "inherit" }}
        >
          {label}
        </text>
      </motion.g>
    </motion.g>
  );
}

/* ----------------------------------------------------------------- network */

const NODES: { x: number; y: number; d: string }[] = [
  { x: 128, y: 470, d: "M380 442C300 442 190 452 132 468" },
  { x: 232, y: 508, d: "M380 442C340 470 282 494 236 506" },
  { x: 528, y: 508, d: "M380 442C424 472 486 496 524 506" },
  { x: 634, y: 466, d: "M380 442C470 440 578 452 630 464" },
  { x: 74, y: 414, d: "M380 442C284 436 150 428 80 416" },
  { x: 668, y: 404, d: "M380 442C486 434 606 420 662 406" },
];

function Network() {
  const still = useStill();
  return (
    <g>
      {NODES.map(({ x, y, d }, i) => (
        <g key={d}>
          <motion.path
            d={d}
            fill="none"
            stroke={C.blueSoft}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 0.85, delay: i * 0.11, ease: EASE_SOFT }}
          />
          <motion.g
            transform={`translate(${x} ${y})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 16,
              delay: 0.5 + i * 0.11,
            }}
            style={{ ...fillBox, transformOrigin: "50% 100%" }}
          >
            {!still && (
              <motion.circle
                r="12"
                fill={C.blue}
                initial={{ scale: 0.4, opacity: 0.4 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.9 + i * 0.2,
                  ease: "easeOut",
                }}
              />
            )}
            {/* tiny Cashlo storefront */}
            <g transform="translate(-11 -20)">
              <path d="M0 6h22v14H0z" fill={C.white} stroke={C.blue} strokeWidth="1.6" />
              <path d="M-2 0h26l-3 6H1z" fill={C.blue} />
              <rect x="12" y="11" width="6" height="9" rx="1.5" fill={C.blue} opacity="0.5" />
            </g>
            <ellipse cy="2" rx="14" ry="4" fill={C.blue} opacity="0.14" />
          </motion.g>
        </g>
      ))}
    </g>
  );
}

/* -------------------------------------------------------------------- defs */

function Defs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`${uid}-pin`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.blueMid} />
        <stop offset="100%" stopColor={C.blueDeep} />
      </linearGradient>
      <linearGradient id={`${uid}-sign`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={C.blueMid} />
        <stop offset="55%" stopColor={C.blue} />
        <stop offset="100%" stopColor={C.blueDeep} />
      </linearGradient>
      <linearGradient id={`${uid}-facade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.white} />
        <stop offset="100%" stopColor={C.panel} />
      </linearGradient>
      <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={C.blueWash} />
        <stop offset="100%" stopColor={C.white} />
      </linearGradient>
      <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.blueWash} />
        <stop offset="100%" stopColor="#DCE3FF" />
      </linearGradient>
      <linearGradient id={`${uid}-trail`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor={C.blue} stopOpacity="0" />
        <stop offset="45%" stopColor={C.blue} stopOpacity="0.85" />
        <stop offset="100%" stopColor={C.blueDeep} />
      </linearGradient>
      <radialGradient id={`${uid}-glow`}>
        <stop offset="0%" stopColor={C.blue} stopOpacity="0.34" />
        <stop offset="70%" stopColor={C.blue} stopOpacity="0.06" />
        <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}-interior`} cx="0.5" cy="0.2" r="0.9">
        <stop offset="0%" stopColor="#FFF6DC" />
        <stop offset="55%" stopColor="#FFE9B8" />
        <stop offset="100%" stopColor="#F6C978" />
      </radialGradient>
    </defs>
  );
}

/* -------------------------------------------------------------------- root */

export default function CashloMerchantJourney({
  className = "",
  ariaLabel = "Animation: an entrepreneur joins Cashlo, opens a Cashlo store, welcomes customers for UPI cash withdrawal, recharges, bill payments, loans, digital gold, insurance and ITR filing, and grows into Cashlo's nationwide merchant network.",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(hostRef);
  const pageVisible = usePageVisible();
  const rawId = useId();
  const uid = `cmj${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const active = !reduced && inView && pageVisible;
  const { beat, take } = useStoryClock(active);

  /* Reduced motion: hold the story on its most complete frame, no movement. */
  const still = reduced;
  const shown = still ? B.network : beat;
  const outro = !still && beat >= B.outro;

  return (
    <StillContext.Provider value={still}>
      <div
        ref={hostRef}
        className={className}
        style={{ width: "100%", height: "100%", lineHeight: 0 }}
      >
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={ariaLabel}
          style={{ display: "block", overflow: "visible" }}
        >
          <Defs uid={uid} />

          <motion.g
            key={take}
            animate={{ opacity: outro ? 0 : 1 }}
            transition={{ duration: outro ? 0.9 : 0.4, ease: EASE_SOFT }}
          >
            {/* ground plane */}
            <line
              x1="40"
              y1={GROUND + 4}
              x2={VB.w - 40}
              y2={GROUND + 4}
              stroke={C.line}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <ellipse
              cx={STORE_X}
              cy={GROUND + 40}
              rx="300"
              ry="86"
              fill={`url(#${uid}-glow)`}
              opacity="0.5"
            />

            <AnimatePresence>
              {shown === B.land && <LandingRipple key="ripple" uid={uid} />}
              {shown >= B.pin && shown <= B.build && (
                <PinRocket key="rocket" beat={shown} uid={uid} />
              )}
              {shown >= B.build && <Store key="store" beat={shown} uid={uid} />}
              {shown >= B.build && shown < B.customers && <Confetti key="confetti" />}
              {shown < B.growth && <Entrepreneur key="merchant" beat={shown} />}
              {shown >= B.customers && shown < B.network && (
                <Customers key="customers" />
              )}
              {shown >= B.customers && <ServiceBadges key="services" />}
              {shown >= B.growth && <Growth key="growth" uid={uid} />}
              {shown >= B.network && <Network key="network" />}
            </AnimatePresence>
          </motion.g>
        </svg>
      </div>
    </StillContext.Provider>
  );
}