"use client";

/**
 * Cashlo — "A Distributor's Day"
 * ---------------------------------------------------------------------------
 * A 15-second, seamlessly looping cinematic SVG story for the hero section of
 * the "Become a Cashlo Distributor" page.
 *
 * Reserve a PIN Code → Ride your territory → Convert shops into Cashlo
 * Merchants → Build your network → Earn recurring commission.
 * ---------------------------------------------------------------------------
 */

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════ TOKENS ═══ */

const DURATION = 15000;
const POSTER_TIME = 11600;

const C = {
  blue: "#3B5BFF",
  blueDeep: "#2540D6",
  blueSoft: "#EEF1FF",
  blueLine: "#C9D3FF",
  ink: "#0E1330",
  ink2: "#2A3157",
  grey: "#8A90A6",
  line: "#E6E8F0",
  paper: "#F7F8FC",
  skin: "#F0C6A4",
  hair: "#1B2340",
  green: "#12B981",
  sun: "#FFC46B",
  sunDeep: "#FF9F5A",
};

type Window = { a: number; b: number };

const S1: Window = { a: 0, b: 2900 };
const S2: Window = { a: 2550, b: 4750 };
const S3: Window = { a: 4400, b: 6750 };
const S4: Window = { a: 6400, b: 10450 };
const S5: Window = { a: 10100, b: 13250 };
const S6: Window = { a: 12900, b: 15000 };

const FADE = 320;
const TAU = Math.PI * 2;

/* ═══════════════════════════════════════════════════════════ EASING ═══ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const linear = (p: number) => p;
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const easeIn = (p: number) => p * p * p;
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const easeOutBack = (p: number) => {
  const c1 = 1.9,
    c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

/** MotionValue subscription that works across framer-motion versions. */
const subscribe = (mv: MotionValue<number>, fn: (v: number) => void) =>
  mv.on("change", fn);

/* ═════════════════════════════════════════════════════ TIMELINE HOOKS ═══ */

function useRamp(t: MotionValue<number>, a: number, b: number, ease = easeInOut) {
  return useTransform(t, (v) => ease(clamp01((v - a) / (b - a))));
}

function useNum(
  t: MotionValue<number>,
  a: number,
  b: number,
  from: number,
  to: number,
  ease = easeInOut
) {
  return useTransform(t, (v) => lerp(from, to, ease(clamp01((v - a) / (b - a)))));
}

function useFade(t: MotionValue<number>, a: number, b: number, c: number, d: number) {
  return useTransform(t, (v) => {
    if (v <= a || v >= d) return 0;
    if (v < b) return easeOut(clamp01((v - a) / (b - a)));
    if (v < c) return 1;
    return 1 - easeIn(clamp01((v - c) / (d - c)));
  });
}

function useScene(t: MotionValue<number>, s: Window, inMs = FADE, outMs = FADE) {
  return useFade(t, s.a, s.a + inMs, s.b - outMs, s.b);
}

function useCycle(t: MotionValue<number>, period: number, offset = 0) {
  return useTransform(t, (v) => (((v + offset) % period) / period));
}

/* ═════════════════════════════════════════════════════════ PRIMITIVES ═══ */

function CashloMark({ size = 40, color = C.blue, bg = "none" }: { size?: number; color?: string; bg?: string }) {
  const u = size / 40;
  return (
    <g transform={`scale(${u})`}>
      <rect x={0} y={0} width={40} height={40} rx={11} fill={bg} stroke={color} strokeWidth={3.2} />
      <rect x={8} y={8} width={10} height={10} rx={3} fill={color} />
      <rect x={22} y={8} width={10} height={10} rx={3} fill={color} />
      <rect x={8} y={22} width={10} height={10} rx={3} fill={color} />
      <rect x={23.5} y={23.5} width={3.6} height={3.6} rx={1.2} fill={color} />
      <rect x={28.4} y={28.4} width={3.6} height={3.6} rx={1.2} fill={color} />
      <rect x={23.5} y={28.4} width={3.6} height={3.6} rx={1.2} fill={color} />
    </g>
  );
}

function Shadow({ rx = 40, ry = 8, opacity = 0.08 }: { rx?: number; ry?: number; opacity?: number }) {
  return <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={C.ink} opacity={opacity} />;
}

function Person({
  phase,
  walking = true,
  helmet = false,
  smile = false,
  bag = true,
}: {
  phase: MotionValue<number>;
  walking?: boolean;
  helmet?: boolean;
  smile?: boolean;
  bag?: boolean;
}) {
  const legA = useTransform(phase, (p) => (walking ? Math.sin(p * TAU) * 26 : 5));
  const legB = useTransform(phase, (p) => (walking ? -Math.sin(p * TAU) * 26 : -5));
  const armA = useTransform(phase, (p) => (walking ? -Math.sin(p * TAU) * 30 : 9));
  const bob = useTransform(phase, (p) => (walking ? -Math.abs(Math.sin(p * TAU)) * 4 : 0));

  return (
    <g>
      <Shadow rx={30} ry={7} />
      <motion.g style={{ y: bob }}>
        <g transform="translate(-4,-70)">
          <motion.g style={{ rotate: legB, transformOrigin: "0px 0px" } as Record<string, unknown>}>
            <rect x={-7} y={-4} width={14} height={74} rx={7} fill={C.ink2} opacity={0.7} />
          </motion.g>
        </g>
        <g transform="translate(4,-70)">
          <motion.g style={{ rotate: legA, transformOrigin: "0px 0px" } as Record<string, unknown>}>
            <rect x={-7} y={-4} width={14} height={74} rx={7} fill={C.ink2} />
          </motion.g>
        </g>

        {bag && (
          <g transform="translate(-33,-120)">
            <rect x={0} y={0} width={22} height={44} rx={9} fill={C.ink} />
            <g transform="translate(4,12)">
              <CashloMark size={14} color="#FFFFFF" />
            </g>
          </g>
        )}

        <rect x={-21} y={-126} width={42} height={60} rx={16} fill={C.blue} />
        <rect x={-21} y={-98} width={42} height={7} rx={3.5} fill={C.blueDeep} opacity={0.55} />

        <g transform="translate(10,-116)">
          <motion.g style={{ rotate: armA, transformOrigin: "0px 0px" } as Record<string, unknown>}>
            <rect x={-6} y={-4} width={12} height={52} rx={6} fill={C.blueDeep} />
          </motion.g>
        </g>

        <rect x={-6} y={-138} width={12} height={14} rx={5} fill={C.skin} />
        <circle cx={0} cy={-152} r={17} fill={C.skin} />
        <path d="M -17 -155 a 17 17 0 0 1 34 0 l -6 -5 a 12 12 0 0 0 -22 0 Z" fill={C.hair} />
        {smile && (
          <>
            <circle cx={-6} cy={-154} r={1.9} fill={C.ink} />
            <circle cx={7} cy={-154} r={1.9} fill={C.ink} />
            <path d="M -6 -146 q 6 6 12 0" stroke={C.ink} strokeWidth={2} fill="none" strokeLinecap="round" />
          </>
        )}
        {helmet && (
          <g>
            <path d="M -19 -152 a 19 19 0 0 1 38 0 l 0 6 l -38 0 Z" fill={C.blue} />
            <path d="M -19 -150 l 12 0 l 0 6 l -12 0 Z" fill={C.ink} opacity={0.35} />
          </g>
        )}
      </motion.g>
    </g>
  );
}

function RiderRig({
  spin,
  bob,
  ignition,
  ignitionScale,
}: {
  spin: MotionValue<number>;
  bob: MotionValue<number>;
  ignition: MotionValue<number>;
  ignitionScale?: MotionValue<number>;
}) {
  const Wheel = ({ cx }: { cx: number }) => (
    <g transform={`translate(${cx},-36)`}>
      <circle r={36} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
      <motion.g style={{ rotate: spin, transformOrigin: "0px 0px" } as Record<string, unknown>}>
        <line x1={-24} y1={0} x2={24} y2={0} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
        <line x1={0} y1={-24} x2={0} y2={24} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
        <line x1={-17} y1={-17} x2={17} y2={17} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
        <line x1={-17} y1={17} x2={17} y2={-17} stroke={C.line} strokeWidth={3} strokeLinecap="round" />
      </motion.g>
      <circle r={5} fill={C.ink} />
    </g>
  );

  return (
    <g>
      <Shadow rx={104} ry={10} opacity={0.09} />
      <motion.g style={{ y: bob }}>
        <Wheel cx={-72} />
        <Wheel cx={72} />

        <motion.g style={{ opacity: ignition }}>
          <motion.g
            style={
              ignitionScale
                ? ({ scale: ignitionScale, transformOrigin: "0px -40px" } as Record<string, unknown>)
                : undefined
            }
          >
            <circle cx={0} cy={-40} r={30} fill="none" stroke={C.blue} strokeWidth={3} opacity={0.5} />
            <circle cx={0} cy={-40} r={52} fill="none" stroke={C.blue} strokeWidth={2} opacity={0.25} />
          </motion.g>
        </motion.g>

        <path
          d="M -72 -36 L -22 -78 L 34 -78 L 72 -36 M -22 -78 L 6 -36 M 34 -78 L 62 -52"
          stroke={C.blue}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M -34 -92 q 26 -14 54 -2 l 0 12 l -54 0 Z" fill={C.blueDeep} />
        <rect x={-64} y={-98} width={40} height={14} rx={7} fill={C.ink} />
        <g transform="translate(-96,-136)">
          <rect x={0} y={0} width={48} height={42} rx={10} fill={C.blue} />
          <g transform="translate(11,10)">
            <CashloMark size={26} color="#FFFFFF" />
          </g>
        </g>
        <path d="M 40 -84 L 58 -108 L 82 -104" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
        <circle cx={84} cy={-92} r={11} fill={C.sun} stroke={C.ink} strokeWidth={4} />

        <g transform="translate(-14,-96)">
          <rect x={22} y={12} width={16} height={34} rx={8} fill={C.ink2} transform="rotate(28 30 12)" />
          <rect x={-2} y={16} width={38} height={15} rx={7.5} fill={C.ink2} />
          <rect x={-16} y={-46} width={40} height={62} rx={16} fill={C.blue} />
          <rect x={16} y={-32} width={13} height={44} rx={6.5} fill={C.blueDeep} transform="rotate(-32 22 -32)" />
          <rect x={-2} y={-58} width={12} height={14} rx={5} fill={C.skin} />
          <circle cx={4} cy={-72} r={17} fill={C.skin} />
          <path d="M -15 -72 a 19 19 0 0 1 38 0 l 0 7 l -38 0 Z" fill={C.blue} transform="translate(-1,0)" />
          <path d="M -15 -70 l 13 0 l 0 7 l -13 0 Z" fill={C.ink} opacity={0.35} />
        </g>
      </motion.g>
    </g>
  );
}

function QRStand({ scale }: { scale: MotionValue<number> }) {
  return (
    <motion.g style={{ scale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
      <rect x={-16} y={-6} width={32} height={7} rx={3.5} fill={C.ink} />
      <rect x={-3} y={-58} width={6} height={54} rx={3} fill={C.ink2} />
      <rect x={-24} y={-104} width={48} height={50} rx={9} fill="#FFFFFF" stroke={C.blue} strokeWidth={3} />
      <g transform="translate(-13,-93)">
        <CashloMark size={26} color={C.blue} />
      </g>
    </motion.g>
  );
}

function Shop({
  name,
  w = 300,
  conv,
  convDelayed,
  glowScale,
  qrScale,
  stickerScale,
  customers,
}: {
  name: string;
  w?: number;
  conv: MotionValue<number>;
  convDelayed: MotionValue<number>;
  glowScale: MotionValue<number>;
  qrScale: MotionValue<number>;
  stickerScale: MotionValue<number>;
  customers: MotionValue<number>;
}) {
  const bodyStroke = useTransform(conv, (c) => (c > 0.45 ? C.blueLine : C.line));
  const bodyFill = useTransform(conv, (c) => (c > 0.45 ? "#FFFFFF" : C.paper));
  const h = 210;
  const signY = -h - 52;

  return (
    <g>
      <motion.g style={{ scale: glowScale, opacity: conv, transformOrigin: "0px 0px" } as Record<string, unknown>}>
        <g transform={`translate(${w / 2},${-h / 2 - 30})`}>
          <circle r={230} fill="url(#cashloBloom)" />
        </g>
      </motion.g>

      <Shadow rx={w / 2 + 20} ry={9} opacity={0.07} />

      <motion.rect x={0} y={-h} width={w} height={h} rx={10} fill={bodyFill} stroke={bodyStroke} strokeWidth={3} />

      <rect x={-10} y={-h - 16} width={w + 20} height={18} rx={7} fill={C.paper} stroke={C.line} strokeWidth={3} />
      <motion.rect x={-10} y={-h - 16} width={w + 20} height={18} rx={7} fill={C.blue} style={{ opacity: conv }} />

      <rect x={12} y={signY} width={w - 24} height={46} rx={9} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
      <motion.text
        x={w / 2}
        y={signY + 30}
        textAnchor="middle"
        fontSize={20}
        fontWeight={700}
        letterSpacing="1.6"
        fill={C.grey}
        style={{ opacity: useTransform(conv, (c) => 1 - clamp01(c * 3)) }}
      >
        {name}
      </motion.text>
      <motion.rect
        x={12}
        y={signY}
        width={w - 24}
        height={46}
        rx={9}
        fill={C.blue}
        style={{ scaleX: conv, transformOrigin: "left center" } as Record<string, unknown>}
      />
      <motion.g style={{ opacity: convDelayed }}>
        <g transform={`translate(${28},${signY + 8})`}>
          <CashloMark size={30} color="#FFFFFF" />
        </g>
        <text
          x={w / 2 + 16}
          y={signY + 31}
          textAnchor="middle"
          fontSize={20}
          fontWeight={800}
          letterSpacing="2.2"
          fill="#FFFFFF"
        >
          CASHLO MERCHANT
        </text>
      </motion.g>

      <rect x={26} y={-h + 34} width={w * 0.42} height={78} rx={8} fill={C.blueSoft} opacity={0.75} />
      <motion.rect x={26} y={-h + 34} width={w * 0.42} height={78} rx={8} fill={C.blueSoft} style={{ opacity: conv }} />

      <rect x={w - 108} y={-118} width={78} height={118} rx={8} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
      <circle cx={w - 42} cy={-58} r={4} fill={C.grey} />

      <g transform={`translate(${w - 24},-136)`}>
        <motion.g style={{ scale: stickerScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
          <rect x={-18} y={-18} width={36} height={36} rx={11} fill={C.blue} />
          <g transform="translate(-11,-11)">
            <CashloMark size={22} color="#FFFFFF" />
          </g>
        </motion.g>
      </g>

      <g transform={`translate(${w - 150},-4)`}>
        <QRStand scale={qrScale} />
      </g>

      <motion.g style={{ opacity: customers }}>
        <motion.g style={{ x: useTransform(customers, (c) => lerp(190, 60, easeOut(c))) }}>
          <g transform={`translate(${w},0) scale(0.62)`}>
            <MiniPerson tone={C.ink2} />
          </g>
        </motion.g>
        <motion.g style={{ x: useTransform(customers, (c) => lerp(280, 130, easeOut(c))) }}>
          <g transform={`translate(${w},0) scale(0.55)`}>
            <MiniPerson tone={C.blueDeep} />
          </g>
        </motion.g>
      </motion.g>
    </g>
  );
}

function MiniPerson({ tone = C.ink2 }: { tone?: string }) {
  return (
    <g>
      <Shadow rx={26} ry={6} opacity={0.06} />
      <rect x={-16} y={-70} width={12} height={70} rx={6} fill={tone} opacity={0.75} />
      <rect x={4} y={-70} width={12} height={70} rx={6} fill={tone} />
      <rect x={-20} y={-128} width={40} height={62} rx={16} fill={tone} />
      <circle cx={0} cy={-150} r={17} fill={C.skin} />
      <path d="M -17 -153 a 17 17 0 0 1 34 0 l -6 -5 a 12 12 0 0 0 -22 0 Z" fill={C.hair} />
    </g>
  );
}

function Commission({
  amount,
  rise,
  opacity,
}: {
  amount: string;
  rise: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.g style={{ y: rise, opacity }}>
      <rect x={-66} y={-26} width={132} height={52} rx={26} fill="#FFFFFF" stroke={C.line} strokeWidth={2.5} />
      <circle cx={-40} cy={0} r={14} fill={C.green} opacity={0.12} />
      <path d="M -46 0 l 4 5 l 8 -10" stroke={C.green} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={10} y={7} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.green}>
        {amount}
      </text>
    </motion.g>
  );
}

function Badge({
  label,
  w = 300,
  scale,
  opacity,
}: {
  label: string;
  w?: number;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.g style={{ scale, opacity, transformOrigin: "0px 0px" } as Record<string, unknown>}>
      <rect x={0} y={-27} width={w} height={54} rx={27} fill="#FFFFFF" stroke={C.line} strokeWidth={2.5} />
      <circle cx={30} cy={0} r={14} fill={C.blue} />
      <path d="M 24 0 l 4.5 5 l 8 -10" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={56} y={7} fontSize={21} fontWeight={650} fill={C.ink}>
        {label}
      </text>
    </motion.g>
  );
}

/* ═════════════════════════════════════════════ SCENE 1 — MORNING ═══════ */

function SceneMorning({ t }: { t: MotionValue<number> }) {
  const op = useScene(t, S1, 160);

  const sunY = useNum(t, 0, 1500, 800, 470, easeOut);
  const sunOp = useRamp(t, 0, 450, easeOut);
  const glowScale = useNum(t, 0, 1800, 0.45, 1, easeOut);
  const worldIn = useRamp(t, 40, 500, easeOut);

  const doorScale = useNum(t, 380, 850, 1, 0.12, easeInOut);

  const walkPhase = useCycle(t, 620);
  const walkX = useNum(t, 520, 1380, 350, 690, linear);
  const walkerOp = useFade(t, 480, 620, 1720, 1980);

  const helmetOp = useRamp(t, 1480, 1820, easeOut);
  const helmetY = useNum(t, 1480, 1820, -180, 0, easeOut);

  const pinScale = useNum(t, 1180, 1560, 0.7, 1, easeOutBack);
  const pinOp = useFade(t, 1180, 1450, 2500, 2800);
  const tickScale = useNum(t, 1480, 1760, 0, 1, easeOutBack);

  const bikeOp = useFade(t, 860, 1200, 15000, 15001);
  const riderOp = useFade(t, 1860, 2120, 15000, 15001);
  const ignition = useFade(t, 2080, 2200, 2340, 2560);
  const ignitionScale = useNum(t, 2080, 2560, 0.4, 1.5, easeOut);
  const rideX = useNum(t, 2440, 2900, 0, 980, easeIn);
  const spin = useTransform(t, (v) => (v < 2400 ? 0 : (v - 2400) * 0.9));
  const bikeBob = useTransform(t, (v) => (v > 2060 && v < 2560 ? Math.sin(v * 0.09) * 1.8 : 0));

  return (
    <motion.g style={{ opacity: op }}>
      <motion.g style={{ opacity: sunOp }}>
        <motion.g style={{ y: sunY }}>
          <motion.g style={{ scale: glowScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
            <g transform="translate(1180,0)">
              <circle r={300} fill="url(#cashloSun)" />
            </g>
          </motion.g>
          <circle cx={1180} cy={0} r={62} fill={C.sun} />
        </motion.g>
      </motion.g>
      <motion.g style={{ opacity: useTransform(t, (v) => 0.5 * clamp01((v - 300) / 700)) }}>
        <line x1={980} y1={560} x2={1120} y2={560} stroke={C.sunDeep} strokeWidth={4} strokeLinecap="round" opacity={0.35} />
        <line x1={1260} y1={520} x2={1420} y2={520} stroke={C.sunDeep} strokeWidth={4} strokeLinecap="round" opacity={0.25} />
      </motion.g>

      <motion.g style={{ opacity: worldIn }}>
        <g transform="translate(0,0)">
          <path d="M 170 442 L 340 318 L 510 442 Z" fill={C.blueSoft} stroke={C.blue} strokeWidth={4} strokeLinejoin="round" />
          <rect x={200} y={438} width={280} height={262} rx={10} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
          <rect x={396} y={488} width={64} height={64} rx={8} fill={C.blueSoft} />
          <rect x={286} y={556} width={86} height={144} rx={8} fill={C.paper} stroke={C.line} strokeWidth={3} />
          <g transform="translate(286,556)">
            <motion.g style={{ scaleX: doorScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
              <rect x={0} y={0} width={86} height={144} rx={8} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
              <circle cx={70} cy={76} r={4.5} fill={C.grey} />
            </motion.g>
          </g>
        </g>

        <line x1={60} y1={700} x2={1540} y2={700} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
        <line x1={90} y1={730} x2={280} y2={730} stroke={C.line} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        <line x1={1180} y1={730} x2={1420} y2={730} stroke={C.line} strokeWidth={3} strokeLinecap="round" opacity={0.6} />

        <motion.g style={{ opacity: pinOp }}>
          <g transform="translate(930,236)">
            <motion.g style={{ scale: pinScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
              <rect x={0} y={0} width={420} height={104} rx={22} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
              <rect x={22} y={22} width={60} height={60} rx={16} fill={C.blueSoft} />
              <path
                d="M 52 40 a 15 15 0 0 1 15 15 c 0 11 -15 24 -15 24 s -15 -13 -15 -24 a 15 15 0 0 1 15 -15 Z"
                fill={C.blue}
              />
              <circle cx={52} cy={55} r={5} fill="#FFFFFF" />
              <text x={100} y={45} fontSize={17} fontWeight={700} fill={C.grey} letterSpacing="1.6">
                PIN CODE RESERVED
              </text>
              <text x={100} y={78} fontSize={28} fontWeight={800} fill={C.ink}>
                110044 · Your territory
              </text>
              <g transform="translate(384,52)">
                <motion.g style={{ scale: tickScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
                  <circle r={17} fill={C.green} />
                  <path d="M -7 0 l 5 6 l 9 -12" stroke="#FFFFFF" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
              </g>
            </motion.g>
          </g>
        </motion.g>

        <motion.g style={{ opacity: walkerOp }}>
          <motion.g style={{ x: walkX }}>
            <g transform="translate(0,700)">
              <Person phase={walkPhase} walking />
              <motion.g style={{ opacity: helmetOp, y: helmetY }}>
                <path d="M -19 -152 a 19 19 0 0 1 38 0 l 0 6 l -38 0 Z" fill={C.blue} />
                <path d="M -19 -150 l 12 0 l 0 6 l -12 0 Z" fill={C.ink} opacity={0.35} />
              </motion.g>
            </g>
          </motion.g>
        </motion.g>

        <motion.g style={{ x: rideX }}>
          <motion.g style={{ opacity: bikeOp }}>
            <g transform="translate(840,700)">
              <motion.g style={{ opacity: useTransform(riderOp, (o) => 1 - o) }}>
                <Shadow rx={104} ry={10} opacity={0.09} />
                <g transform="translate(-72,-36)">
                  <circle r={36} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
                </g>
                <g transform="translate(72,-36)">
                  <circle r={36} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
                </g>
                <path
                  d="M -72 -36 L -22 -78 L 34 -78 L 72 -36 M -22 -78 L 6 -36 M 34 -78 L 62 -52"
                  stroke={C.blue}
                  strokeWidth={9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path d="M -34 -92 q 26 -14 54 -2 l 0 12 l -54 0 Z" fill={C.blueDeep} />
                <rect x={-64} y={-98} width={40} height={14} rx={7} fill={C.ink} />
                <path d="M 40 -84 L 58 -108 L 82 -104" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
                <circle cx={84} cy={-92} r={11} fill={C.paper} stroke={C.ink} strokeWidth={4} />
              </motion.g>
              <motion.g style={{ opacity: riderOp }}>
                <RiderRig spin={spin} bob={bikeBob} ignition={ignition} ignitionScale={ignitionScale} />
              </motion.g>
            </g>
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

/* ═════════════════════════════════════════════ SCENE 2 — JOURNEY ═══════ */

function TownTile({ dx }: { dx: number }) {
  return (
    <g transform={`translate(${dx},0)`}>
      <rect x={40} y={410} width={150} height={230} rx={10} fill={C.paper} stroke={C.line} strokeWidth={3} />
      <rect x={72} y={444} width={40} height={40} rx={6} fill={C.blueSoft} />
      <rect x={128} y={444} width={40} height={40} rx={6} fill={C.blueSoft} />
      <rect x={230} y={340} width={190} height={300} rx={10} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
      <rect x={262} y={380} width={54} height={44} rx={6} fill={C.blueSoft} />
      <rect x={336} y={380} width={54} height={44} rx={6} fill={C.blueSoft} />
      <rect x={262} y={450} width={54} height={44} rx={6} fill={C.blueSoft} />
      <rect x={460} y={452} width={200} height={188} rx={10} fill={C.paper} stroke={C.line} strokeWidth={3} />
      <rect x={496} y={490} width={128} height={46} rx={8} fill={C.blueLine} opacity={0.55} />
      <rect x={700} y={392} width={68} height={248} rx={10} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
    </g>
  );
}

function StreetTile({ dx }: { dx: number }) {
  return (
    <g transform={`translate(${dx},0)`}>
      <g transform="translate(60,0)">
        <rect x={-6} y={560} width={12} height={100} rx={6} fill={C.ink2} opacity={0.75} />
        <circle cx={0} cy={532} r={48} fill={C.blueSoft} stroke={C.blueLine} strokeWidth={3} />
      </g>
      <g transform="translate(320,0)">
        <rect x={-5} y={520} width={10} height={140} rx={5} fill={C.ink2} opacity={0.6} />
        <rect x={-76} y={452} width={152} height={72} rx={12} fill="#FFFFFF" stroke={C.blueLine} strokeWidth={3} />
        <g transform="translate(-58,466)">
          <CashloMark size={40} color={C.blue} />
        </g>
        <rect x={-6} y={476} width={68} height={12} rx={6} fill={C.blueLine} />
        <rect x={-6} y={496} width={44} height={10} rx={5} fill={C.line} />
      </g>
      <g transform="translate(560,0)">
        <rect x={-5} y={470} width={10} height={190} rx={5} fill={C.ink2} opacity={0.5} />
        <path d="M 0 470 q 0 -26 30 -26" stroke={C.ink2} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.5} />
        <circle cx={32} cy={450} r={11} fill={C.sun} opacity={0.85} />
      </g>
    </g>
  );
}

function SceneJourney({ t }: { t: MotionValue<number> }) {
  const op = useScene(t, S2);
  const k = (v: number) => v - S2.a;

  const farX = useTransform(t, (v) => -((k(v) * 0.075) % 800));
  const midX = useTransform(t, (v) => -((k(v) * 0.17) % 800));
  const nearX = useTransform(t, (v) => -((k(v) * 0.34) % 200));
  const spin = useTransform(t, (v) => k(v) * 0.55);
  const bob = useTransform(t, (v) => Math.sin(k(v) * 0.014) * 3.5);
  const speed = useCycle(t, 260);

  return (
    <motion.g style={{ opacity: op }}>
      <motion.g style={{ x: farX, opacity: 0.55 }}>
        <TownTile dx={0} />
        <TownTile dx={800} />
        <TownTile dx={1600} />
      </motion.g>
      <motion.g style={{ x: midX }}>
        <StreetTile dx={0} />
        <StreetTile dx={800} />
        <StreetTile dx={1600} />
      </motion.g>

      <line x1={0} y1={700} x2={1600} y2={700} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
      <motion.g style={{ x: nearX }}>
        {[0, 200, 400, 600, 800, 1000, 1200, 1400, 1600].map((x) => (
          <rect key={x} x={x} y={736} width={96} height={7} rx={3.5} fill={C.line} />
        ))}
      </motion.g>

      <motion.g style={{ opacity: useTransform(speed, (p) => 0.35 + Math.sin(p * TAU) * 0.25) }}>
        <line x1={420} y1={560} x2={560} y2={560} stroke={C.blueLine} strokeWidth={6} strokeLinecap="round" />
        <line x1={380} y1={612} x2={570} y2={612} stroke={C.blueLine} strokeWidth={6} strokeLinecap="round" />
        <line x1={452} y1={664} x2={572} y2={664} stroke={C.blueLine} strokeWidth={6} strokeLinecap="round" />
      </motion.g>

      <g transform="translate(830,700)">
        <RiderRig spin={spin} bob={bob} ignition={useMotionValue(0)} />
      </g>
    </motion.g>
  );
}

/* ═══════════════════════════════════ SCENE 3 — FIRST MERCHANT ══════════ */

function SceneFirstMerchant({ t }: { t: MotionValue<number> }) {
  const op = useScene(t, S3);

  const arriveX = useNum(t, 4420, 5180, -520, 240, easeOut);
  const riderOp = useFade(t, 4420, 4560, 5100, 5320);
  const spin = useTransform(t, (v) => (v < 5180 ? (v - 4420) * 0.5 : 0));

  const walkPhase = useCycle(t, 600);
  const walkX = useNum(t, 5180, 5660, 300, 900, linear);
  const walkOp = useFade(t, 5180, 5300, 5500, 5680);

  const conv = useRamp(t, 5560, 5820, easeInOut);
  const convDelayed = useRamp(t, 5700, 5960, easeOut);
  const glowScale = useNum(t, 5700, 6300, 0.5, 1, easeOut);
  const qrScale = useNum(t, 5880, 6220, 0, 1, easeOutBack);
  const stickerScale = useNum(t, 5980, 6300, 0, 1, easeOutBack);
  const customers = useRamp(t, 6060, 6520, easeOut);

  const cRise = useNum(t, 6180, 6740, 0, -150, easeOut);
  const cOp = useFade(t, 6180, 6340, 6480, 6740);

  const parkedOp = useFade(t, 5140, 5320, 15000, 15001);

  return (
    <motion.g style={{ opacity: op }}>
      <line x1={0} y1={700} x2={1600} y2={700} stroke={C.line} strokeWidth={4} strokeLinecap="round" />

      <g transform="translate(600,700)">
        <Shop
          name="GROCERY STORE"
          w={420}
          conv={conv}
          convDelayed={convDelayed}
          glowScale={glowScale}
          qrScale={qrScale}
          stickerScale={stickerScale}
          customers={customers}
        />
      </g>

      <g transform="translate(1180,430)">
        <Commission amount="+₹350" rise={cRise} opacity={cOp} />
      </g>

      <motion.g style={{ opacity: riderOp }}>
        <motion.g style={{ x: arriveX }}>
          <g transform="translate(0,700)">
            <RiderRig spin={spin} bob={useMotionValue(0)} ignition={useMotionValue(0)} />
          </g>
        </motion.g>
      </motion.g>

      <motion.g style={{ opacity: parkedOp }}>
        <g transform="translate(240,700)">
          <Shadow rx={104} ry={10} opacity={0.09} />
          <g transform="translate(-72,-36)">
            <circle r={36} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
          </g>
          <g transform="translate(72,-36)">
            <circle r={36} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
          </g>
          <path
            d="M -72 -36 L -22 -78 L 34 -78 L 72 -36 M -22 -78 L 6 -36 M 34 -78 L 62 -52"
            stroke={C.blue}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M -34 -92 q 26 -14 54 -2 l 0 12 l -54 0 Z" fill={C.blueDeep} />
          <rect x={-64} y={-98} width={40} height={14} rx={7} fill={C.ink} />
          <g transform="translate(-96,-136)">
            <rect x={0} y={0} width={48} height={42} rx={10} fill={C.blue} />
            <g transform="translate(11,10)">
              <CashloMark size={26} color="#FFFFFF" />
            </g>
          </g>
          <path d="M 40 -84 L 58 -108 L 82 -104" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
        </g>
      </motion.g>

      <motion.g style={{ opacity: walkOp }}>
        <motion.g style={{ x: walkX }}>
          <g transform="translate(0,700)">
            <Person phase={walkPhase} walking helmet />
          </g>
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

/* ═══════════════════════════════ SCENE 4 — NETWORK GROWS ═══════════════ */

const SHOPS: { id: string; x: number; name: string; amount: string; at: number }[] = [
  { id: "med", x: 120, name: "MEDICAL STORE", amount: "+₹350", at: 6820 },
  { id: "kir", x: 560, name: "KIRANA STORE", amount: "+₹520", at: 7520 },
  { id: "mob", x: 1000, name: "MOBILE SHOP", amount: "+₹640", at: 8220 },
  { id: "dai", x: 1440, name: "DAIRY SHOP", amount: "+₹780", at: 8920 },
  { id: "gen", x: 1880, name: "GENERAL STORE", amount: "+₹910", at: 9620 },
];

function NetworkShop({ t, shop }: { t: MotionValue<number>; shop: (typeof SHOPS)[number] }) {
  const a = shop.at;
  const conv = useRamp(t, a, a + 300, easeInOut);
  const convDelayed = useRamp(t, a + 160, a + 420, easeOut);
  const glowScale = useNum(t, a + 140, a + 700, 0.5, 1, easeOut);
  const qrScale = useNum(t, a + 320, a + 640, 0, 1, easeOutBack);
  const stickerScale = useNum(t, a + 400, a + 700, 0, 1, easeOutBack);
  const customers = useRamp(t, a + 460, a + 900, easeOut);

  const cRise = useNum(t, a + 560, a + 1500, 0, -170, easeOut);
  const cOp = useFade(t, a + 560, a + 720, a + 1150, a + 1500);
  const pinPulse = useTransform(t, (v) => (v > a + 300 ? 1 + Math.sin((v - a) * 0.008) * 0.12 : 0));

  return (
    <g transform={`translate(${shop.x},700)`}>
      <Shop
        name={shop.name}
        w={300}
        conv={conv}
        convDelayed={convDelayed}
        glowScale={glowScale}
        qrScale={qrScale}
        stickerScale={stickerScale}
        customers={customers}
      />
      <g transform="translate(150,-330)">
        <motion.g style={{ scale: pinPulse, opacity: conv, transformOrigin: "0px 0px" } as Record<string, unknown>}>
          <circle r={17} fill={C.blue} opacity={0.18} />
          <circle r={8} fill={C.blue} />
        </motion.g>
      </g>
      <g transform="translate(150,-430)">
        <Commission amount={shop.amount} rise={cRise} opacity={cOp} />
      </g>
    </g>
  );
}

function SceneNetwork({ t }: { t: MotionValue<number> }) {
  const op = useScene(t, S4);
  const cam = useNum(t, 6500, 10000, 869, -1331, linear);
  const camBack = useTransform(cam, (x) => x * 0.35 + 200);

  const spin = useTransform(t, (v) => (v - S4.a) * 0.42);
  const bob = useTransform(t, (v) => Math.sin((v - S4.a) * 0.012) * 2.6);
  const riderX = useTransform(cam, (x) => -x + 640);

  const netDash = useNum(t, 6900, 9900, 1, 0, linear);
  const netOp = useRamp(t, 6900, 7200, easeOut);

  const counter = useRamp(t, 6600, 10000, linear);

  return (
    <motion.g style={{ opacity: op }}>
      <motion.g style={{ x: camBack, opacity: 0.4 }}>
        <TownTile dx={-400} />
        <TownTile dx={400} />
        <TownTile dx={1200} />
        <TownTile dx={2000} />
      </motion.g>

      <line x1={0} y1={700} x2={1600} y2={700} stroke={C.line} strokeWidth={4} strokeLinecap="round" />

      <motion.g style={{ x: cam }}>
        <motion.path
          d="M 270 370 L 710 370 L 1150 370 L 1590 370 L 2030 370"
          fill="none"
          stroke={C.blue}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="1 1"
          style={{ strokeDashoffset: netDash, opacity: netOp } as Record<string, unknown>}
        />
        <motion.path
          d="M 270 370 L 710 370 L 1150 370 L 1590 370 L 2030 370"
          fill="none"
          stroke={C.blue}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray="1 1"
          style={
            {
              strokeDashoffset: netDash,
              opacity: useTransform(netOp, (o) => o * 0.14),
            } as Record<string, unknown>
          }
        />

        {SHOPS.map((s) => (
          <NetworkShop key={s.id} t={t} shop={s} />
        ))}

        <motion.g style={{ x: riderX }}>
          <g transform="translate(0,700)">
            <RiderRig spin={spin} bob={bob} ignition={useMotionValue(0)} />
          </g>
        </motion.g>
      </motion.g>

      <g transform="translate(1160,120)">
        <motion.g style={{ opacity: netOp }}>
          <rect x={0} y={0} width={320} height={86} rx={20} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
          <text x={26} y={35} fontSize={16} fontWeight={700} fill={C.grey} letterSpacing="1.6">
            TODAY&rsquo;S COMMISSION
          </text>
          <RupeeCounter x={26} y={68} value={counter} to={3200} size={30} fill={C.ink} />
          <MerchantCount x={296} y={54} value={counter} />
        </motion.g>
      </g>
    </motion.g>
  );
}

function RupeeCounter({
  x,
  y,
  value,
  to,
  size = 30,
  fill = C.ink,
}: {
  x: number;
  y: number;
  value: MotionValue<number>;
  to: number;
  size?: number;
  fill?: string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const step = Math.max(10, Math.round(to / 64));
    return subscribe(value, (p) => {
      const next = Math.round((clamp01(p) * to) / step) * step;
      setN((prev) => (prev === next ? prev : next));
    });
  }, [value, to]);
  return (
    <text x={x} y={y} fontSize={size} fontWeight={800} fill={fill}>
      ₹{n.toLocaleString("en-IN")}
    </text>
  );
}

function MerchantCount({ x, y, value }: { x: number; y: number; value: MotionValue<number> }) {
  const [n, setN] = useState(0);
  useEffect(
    () =>
      subscribe(value, (p) => {
        const next = Math.min(5, Math.floor(clamp01(p) * 5.6));
        setN((prev) => (prev === next ? prev : next));
      }),
    [value]
  );
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={26} fill={C.blueSoft} />
      <text y={9} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.blue}>
        {n}
      </text>
    </g>
  );
}

/* ═══════════════════════════════ SCENE 5 — SUCCESS DASHBOARD ═══════════ */

const PINS: { x: number; y: number }[] = [
  { x: 190, y: 150 },
  { x: 430, y: 96 },
  { x: 600, y: 250 },
  { x: 400, y: 356 },
  { x: 150, y: 320 },
];

function SceneDashboard({ t }: { t: MotionValue<number> }) {
  const op = useScene(t, S5, 360);
  const cardScale = useNum(t, 10150, 10700, 0.9, 1, easeOut);
  const boundary = useNum(t, 10350, 11300, 1, 0, easeInOut);
  const linkDash = useNum(t, 10800, 11800, 1, 0, easeInOut);
  const heroScale = useNum(t, 10500, 10900, 0, 1, easeOutBack);

  const graphScale = useNum(t, 11300, 11700, 0.88, 1, easeOutBack);
  const graphOp = useRamp(t, 11300, 11650, easeOut);
  const graphDash = useNum(t, 11550, 12500, 1, 0, easeInOut);

  return (
    <motion.g style={{ opacity: op }}>
      <g transform="translate(430,150)">
        <motion.g style={{ scale: cardScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
          <rect x={6} y={12} width={760} height={520} rx={30} fill={C.ink} opacity={0.05} />
          <rect x={0} y={0} width={760} height={520} rx={30} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
          <text x={40} y={54} fontSize={17} fontWeight={700} fill={C.grey} letterSpacing="1.8">
            PIN 110044 · YOUR MERCHANT NETWORK
          </text>

          <g transform="translate(40,70)">
            <motion.path
              d="M 96 40 C 300 -8 560 30 640 150 C 700 250 620 400 430 420 C 250 440 70 380 56 250 C 46 160 40 66 96 40 Z"
              fill={C.blueSoft}
              fillOpacity={0.5}
              stroke={C.blue}
              strokeWidth={3}
              strokeDasharray="1 1"
              style={{ strokeDashoffset: boundary } as Record<string, unknown>}
            />
            <motion.path
              d="M 190 150 L 430 96 L 600 250 L 400 356 L 150 320 L 190 150 M 400 356 L 190 150"
              fill="none"
              stroke={C.blue}
              strokeWidth={3}
              strokeOpacity={0.55}
              strokeDasharray="1 1"
              style={{ strokeDashoffset: linkDash } as Record<string, unknown>}
            />
            {PINS.map((p, i) => (
              <MapPin key={i} t={t} x={p.x} y={p.y} at={10700 + i * 130} />
            ))}
            <g transform="translate(360,300)">
              <motion.g style={{ scale: heroScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
                <g transform="scale(0.62)">
                  <Person phase={useMotionValue(0)} walking={false} smile />
                </g>
              </motion.g>
            </g>
          </g>
        </motion.g>
      </g>

      <g transform="translate(80,250)">
        <Badge
          label="5 merchants onboarded"
          w={310}
          scale={useNum(t, 10600, 10900, 0.82, 1, easeOutBack)}
          opacity={useRamp(t, 10600, 10850, easeOut)}
        />
      </g>
      <g transform="translate(80,340)">
        <Badge
          label="Territory active"
          w={310}
          scale={useNum(t, 10780, 11080, 0.82, 1, easeOutBack)}
          opacity={useRamp(t, 10780, 11030, easeOut)}
        />
      </g>
      <g transform="translate(80,430)">
        <Badge
          label="Commission recurring"
          w={310}
          scale={useNum(t, 10960, 11260, 0.82, 1, easeOutBack)}
          opacity={useRamp(t, 10960, 11210, easeOut)}
        />
      </g>

      <g transform="translate(1230,330)">
        <motion.g style={{ scale: graphScale, opacity: graphOp, transformOrigin: "0px 0px" } as Record<string, unknown>}>
          <rect x={6} y={10} width={290} height={250} rx={24} fill={C.ink} opacity={0.05} />
          <rect x={0} y={0} width={290} height={250} rx={24} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
          <text x={26} y={44} fontSize={15} fontWeight={700} fill={C.grey} letterSpacing="1.6">
            MONTHLY EARNINGS
          </text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={30 + i * 62} y={90} width={40} height={130} rx={10} fill={C.blueSoft} />
          ))}
          {[62, 90, 118, 146].map((h, i) => (
            <GrowBar key={i} t={t} x={30 + i * 62} h={h} at={11650 + i * 120} />
          ))}
          <motion.path
            d="M 44 200 L 106 172 L 168 140 L 230 92"
            fill="none"
            stroke={C.blue}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1"
            style={{ strokeDashoffset: graphDash } as Record<string, unknown>}
          />
          <motion.circle
            cx={230}
            cy={92}
            r={8}
            fill={C.blue}
            style={{ opacity: useRamp(t, 12350, 12600, easeOut) }}
          />
        </motion.g>
      </g>
    </motion.g>
  );
}

function MapPin({ t, x, y, at }: { t: MotionValue<number>; x: number; y: number; at: number }) {
  const s = useNum(t, at, at + 320, 0, 1, easeOutBack);
  const ring = useNum(t, at + 200, at + 900, 0.6, 1.9, easeOut);
  const ringOp = useFade(t, at + 200, at + 300, at + 500, at + 900);
  return (
    <g transform={`translate(${x},${y})`}>
      <motion.g style={{ scale: ring, opacity: ringOp, transformOrigin: "0px 0px" } as Record<string, unknown>}>
        <circle r={22} fill="none" stroke={C.blue} strokeWidth={3} />
      </motion.g>
      <motion.g style={{ scale: s, transformOrigin: "0px 0px" } as Record<string, unknown>}>
        <path d="M 0 8 c -14 -18 -20 -26 -20 -36 a 20 20 0 0 1 40 0 c 0 10 -6 18 -20 36 Z" fill={C.blue} />
        <circle cx={0} cy={-28} r={7} fill="#FFFFFF" />
      </motion.g>
    </g>
  );
}

function GrowBar({ t, x, h, at }: { t: MotionValue<number>; x: number; h: number; at: number }) {
  const sy = useNum(t, at, at + 420, 0, 1, easeOut);
  return (
    <g transform={`translate(${x},220)`}>
      <motion.g style={{ scaleY: sy, transformOrigin: "0px 0px" } as Record<string, unknown>}>
        <rect x={0} y={-h} width={40} height={h} rx={10} fill={C.blue} />
      </motion.g>
    </g>
  );
}

/* ═══════════════════════════ SCENE 6 — EVENING & EARNINGS ══════════════ */

function SceneEvening({ t }: { t: MotionValue<number> }) {
  const op = useFade(t, S6.a, S6.a + 320, 14060, 14420);

  const parkScale = useNum(t, 12980, 13320, 0.9, 1, easeOut);
  const sitOp = useRamp(t, 13100, 13400, easeOut);

  const phoneScale = useNum(t, 13450, 13780, 0.86, 1, easeOutBack);
  const phoneOp = useRamp(t, 13450, 13700, easeOut);
  const walletFill = useRamp(t, 13650, 14300, easeOut);

  const flip = useCycle(t, 340);

  return (
    <motion.g style={{ opacity: op }}>
      <line x1={0} y1={740} x2={1600} y2={740} stroke={C.line} strokeWidth={4} strokeLinecap="round" />

      <motion.g style={{ opacity: useRamp(t, 13000, 13500, easeOut) }}>
        <circle cx={1000} cy={300} r={280} fill="url(#cashloBloom)" />
        <rect x={994} y={60} width={12} height={110} rx={6} fill={C.line} />
        <path d="M 940 170 L 1060 170 L 1026 236 L 974 236 Z" fill={C.blueSoft} stroke={C.blue} strokeWidth={3} strokeLinejoin="round" />
      </motion.g>

      <g transform="translate(250,740)">
        <motion.g style={{ scale: parkScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
          <Shadow rx={104} ry={10} opacity={0.09} />
          <g transform="translate(-72,-36)">
            <circle r={36} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
          </g>
          <g transform="translate(72,-36)">
            <circle r={36} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
          </g>
          <path
            d="M -72 -36 L -22 -78 L 34 -78 L 72 -36 M -22 -78 L 6 -36 M 34 -78 L 62 -52"
            stroke={C.blue}
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M -34 -92 q 26 -14 54 -2 l 0 12 l -54 0 Z" fill={C.blueDeep} />
          <rect x={-64} y={-98} width={40} height={14} rx={7} fill={C.ink} />
          <g transform="translate(-96,-136)">
            <rect x={0} y={0} width={48} height={42} rx={10} fill={C.blue} />
            <g transform="translate(11,10)">
              <CashloMark size={26} color="#FFFFFF" />
            </g>
          </g>
          <path d="M 40 -84 L 58 -108 L 82 -104" stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" />
        </motion.g>
      </g>

      <motion.g style={{ opacity: sitOp }}>
        <g transform="translate(790,636)">
          <rect x={-58} y={-148} width={16} height={168} rx={8} fill={C.line} />
          <rect x={-54} y={16} width={10} height={90} rx={5} fill={C.line} />
          <rect x={-16} y={-16} width={104} height={20} rx={10} fill={C.ink2} />
          <rect x={68} y={-8} width={20} height={114} rx={10} fill={C.ink2} />
          <rect x={-26} y={-134} width={82} height={124} rx={28} fill={C.blue} />
          <rect x={30} y={-124} width={18} height={72} rx={9} fill={C.blueDeep} transform="rotate(-78 39 -124)" />
          <rect x={6} y={-152} width={14} height={24} rx={7} fill={C.skin} />
          <circle cx={13} cy={-170} r={20} fill={C.skin} />
          <path d="M -7 -173 a 20 20 0 0 1 40 0 l -7 -6 a 14 14 0 0 0 -26 0 Z" fill={C.hair} />
          <circle cx={6} cy={-172} r={2.1} fill={C.ink} />
          <circle cx={22} cy={-172} r={2.1} fill={C.ink} />
          <path d="M 6 -162 q 8 7 16 0" stroke={C.ink} strokeWidth={2.3} fill="none" strokeLinecap="round" />
        </g>
      </motion.g>

      <motion.g style={{ opacity: sitOp }}>
        <rect x={620} y={520} width={780} height={18} rx={9} fill={C.ink} opacity={0.9} />
        <rect x={680} y={538} width={16} height={202} rx={8} fill={C.line} />
        <rect x={1320} y={538} width={16} height={202} rx={8} fill={C.line} />
      </motion.g>

      <CashStack t={t} x={880} at={13400} />
      <CashStack t={t} x={968} at={13620} />
      <CashStack t={t} x={1056} at={13840} />

      <motion.g style={{ opacity: useRamp(t, 13450, 13700, easeOut) }}>
        <g transform="translate(900,494)">
          <motion.g
            style={
              {
                scaleX: useTransform(flip, (p) => Math.abs(Math.cos(p * Math.PI))),
                transformOrigin: "0px 0px",
              } as Record<string, unknown>
            }
          >
            <rect x={-34} y={-16} width={68} height={32} rx={5} fill={C.green} opacity={0.85} />
            <circle r={7} fill="#FFFFFF" opacity={0.55} />
          </motion.g>
        </g>
      </motion.g>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <RupeeParticle key={i} t={t} x={860 + (i % 3) * 90} at={13500 + i * 190} />
      ))}

      <motion.g style={{ opacity: phoneOp }}>
        <g transform="translate(1180,290)">
          <motion.g style={{ scale: phoneScale, transformOrigin: "0px 0px" } as Record<string, unknown>}>
            <rect x={6} y={12} width={230} height={230} rx={30} fill={C.ink} opacity={0.05} />
            <rect x={0} y={0} width={230} height={230} rx={30} fill="#FFFFFF" stroke={C.line} strokeWidth={3} />
            <circle cx={44} cy={52} r={20} fill={C.blueSoft} />
            <path d="M 36 52 l 6 7 l 12 -15" stroke={C.blue} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x={76} y={48} fontSize={16} fontWeight={700} fill={C.grey} letterSpacing="1.2">
              CASHLO
            </text>
            <text x={76} y={70} fontSize={17} fontWeight={650} fill={C.ink}>
              Commission credited
            </text>
            <RupeeCounter x={26} y={140} value={walletFill} to={3200} size={44} fill={C.green} />
            <text x={26} y={170} fontSize={16} fontWeight={600} fill={C.grey}>
              Today · 5 merchants
            </text>
            <rect x={26} y={190} width={178} height={10} rx={5} fill={C.blueSoft} />
            <g transform="translate(26,195)">
              <motion.g style={{ scaleX: walletFill, transformOrigin: "0px 0px" } as Record<string, unknown>}>
                <rect x={0} y={-5} width={178} height={10} rx={5} fill={C.blue} />
              </motion.g>
            </g>
          </motion.g>
        </g>
      </motion.g>
    </motion.g>
  );
}

function CashStack({ t, x, at }: { t: MotionValue<number>; x: number; at: number }) {
  const s = useNum(t, at, at + 420, 0, 1, easeOutBack);
  return (
    <g transform={`translate(${x},520)`}>
      <motion.g style={{ scaleY: s, transformOrigin: "0px 0px" } as Record<string, unknown>}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(0,${-10 - i * 15})`}>
            <rect x={-38} y={-13} width={76} height={15} rx={4} fill={C.green} opacity={0.9} />
            <rect x={-38} y={-13} width={76} height={15} rx={4} fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.5} />
          </g>
        ))}
      </motion.g>
    </g>
  );
}

function RupeeParticle({ t, x, at }: { t: MotionValue<number>; x: number; at: number }) {
  const y = useNum(t, at, at + 1100, 0, -190, easeOut);
  const o = useFade(t, at, at + 180, at + 600, at + 1100);
  return (
    <motion.g style={{ y, opacity: o }}>
      <text x={x} y={480} fontSize={26} fontWeight={800} fill={C.blue} opacity={0.65}>
        ₹
      </text>
    </motion.g>
  );
}

/* ═══════════════════════════════════════ LOGO SIGN-OFF & CAPTIONS ══════ */

function LogoSignOff({ t }: { t: MotionValue<number> }) {
  const op = useFade(t, 14260, 14560, 14760, 14970);
  const s = useNum(t, 14260, 14640, 0.92, 1, easeOut);
  return (
    <motion.g style={{ opacity: op }}>
      <g transform="translate(800,430)">
        <motion.g style={{ scale: s, transformOrigin: "0px 0px" } as Record<string, unknown>}>
          <g transform="translate(-166,-46)">
            <CashloMark size={92} color={C.blue} />
          </g>
          <text x={-52} y={22} fontSize={72} fontWeight={800} fill={C.ink} letterSpacing="-1">
            Cashlo
          </text>
          <text x={0} y={92} textAnchor="middle" fontSize={22} fontWeight={600} fill={C.grey} letterSpacing="3">
            YOUR AREA. YOUR NETWORK. YOUR INCOME.
          </text>
        </motion.g>
      </g>
    </motion.g>
  );
}

type CaptionItem = { text: string; a: number; b: number };

const CAPTIONS: CaptionItem[] = [
  { text: "Reserve your area's PIN Code", a: 180, b: 2500 },
  { text: "Ride out across your territory", a: 2700, b: 4400 },
  { text: "Turn a local shop into a Cashlo Merchant", a: 4600, b: 6400 },
  { text: "Onboard every business on your street", a: 6600, b: 10000 },
  { text: "Watch your merchant network earn for you", a: 10300, b: 12700 },
  { text: "Go home with the day's commission credited", a: 12950, b: 14050 },
];

function Caption({ t, item }: { t: MotionValue<number>; item: CaptionItem }) {
  const o = useFade(t, item.a, item.a + 260, item.b - 260, item.b);
  const y = useNum(t, item.a, item.a + 380, 14, 0, easeOut);
  return (
    <motion.g style={{ opacity: o, y }}>
      <text x={800} y={840} textAnchor="middle" fontSize={30} fontWeight={650} fill={C.ink}>
        {item.text}
      </text>
    </motion.g>
  );
}

function Progress({ t }: { t: MotionValue<number> }) {
  const sx = useTransform(t, (v) => v / DURATION);
  return (
    <g transform="translate(600,872)">
      <rect x={0} y={-3} width={400} height={6} rx={3} fill={C.line} />
      <motion.g style={{ scaleX: sx, transformOrigin: "0px 0px" } as Record<string, unknown>}>
        <rect x={0} y={-3} width={400} height={6} rx={3} fill={C.blue} />
      </motion.g>
    </g>
  );
}

/* ══════════════════════════════════════════════════════ ROOT COMPONENT ═══ */

export default function CashloDistributorStory({
  className = "",
  showCaptions = true,
}: {
  className?: string;
  showCaptions?: boolean;
}): ReactNode {
  const t = useMotionValue(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      t.set(POSTER_TIME);
      activeRef.current = false;
      return;
    }
    const el = hostRef.current;
    if (!el) return;

    let visible = !document.hidden;
    let onScreen = false;
    const sync = () => {
      activeRef.current = visible && onScreen;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );
    io.observe(el);

    const onVis = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, t]);

  useAnimationFrame((_, delta) => {
    if (!activeRef.current) return;
    t.set((t.get() + Math.min(delta, 64)) % DURATION);
  });

  return (
    <div ref={hostRef} className={className} style={{ width: "100%", background: "#FFFFFF" }}>
      <svg
        viewBox="0 0 1600 900"
        role="img"
        aria-label="A Cashlo distributor reserves a PIN code, rides through his territory, converts local shops into Cashlo Merchants, builds a merchant network, and returns home with commission credited."
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: "#FFFFFF",
          fontFamily: "inherit",
        }}
      >
        <defs>
          <radialGradient id="cashloSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.sun} stopOpacity="0.42" />
            <stop offset="55%" stopColor={C.sunDeep} stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cashloBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.22" />
            <stop offset="60%" stopColor={C.blue} stopOpacity="0.06" />
            <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={1600} height={900} fill="#FFFFFF" />

        <SceneMorning t={t} />
        <SceneJourney t={t} />
        <SceneFirstMerchant t={t} />
        <SceneNetwork t={t} />
        <SceneDashboard t={t} />
        <SceneEvening t={t} />
        <LogoSignOff t={t} />

        {showCaptions && (
          <g>
            {CAPTIONS.map((c) => (
              <Caption key={c.text} t={t} item={c} />
            ))}
            <Progress t={t} />
          </g>
        )}
      </svg>
    </div>
  );
}