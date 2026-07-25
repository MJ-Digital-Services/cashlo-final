"use client";

import Container from "@/components/ui/Container";
import { useEffect, useRef, useState } from "react";

type Brand = { name: string; logo?: string };

const apps: Brand[] = [
  { name: "Paytm", logo: "/logos/paytm.svg" },
  { name: "Google Pay", logo: "/logos/gpay.svg" },
  { name: "BHIM", logo: "/logos/bhim.svg" },
  { name: "Navi", logo: "/logos/navi.svg" },
  { name: "WhatsApp Pay", logo: "/logos/whatsapp.svg" },
  { name: "CRED", logo: "/logos/cred.svg" },
  { name: "SBI YONO", logo: "/logos/yono.svg" },
  { name: "Axis Mobile", logo: "/logos/axis.svg" },
  { name: "PayZapp", logo: "/logos/payzapp.svg" },
  { name: "Kotak 811", logo: "/logos/kotak-811.svg" },
  { name: "Jio Finance", logo: "/logos/jio.svg" },
  { name: "Samsung Pay", logo: "/logos/samsung-pay.svg" },
];

const banks: Brand[] = [
  { name: "State Bank of India", logo: "/logos/sbi.svg" },
  { name: "HDFC Bank", logo: "/logos/hdfc.svg" },
  { name: "ICICI Bank", logo: "/logos/icici.svg" },
  { name: "Axis Bank", logo: "/logos/axis.svg" },
  { name: "Bank of Baroda", logo: "/logos/bob.svg" },
  { name: "Punjab National Bank", logo: "/logos/pnb.svg" },
  { name: "Union Bank", logo: "/logos/union.svg" },
  { name: "Kotak Mahindra", logo: "/logos/kotak.svg" },
  { name: "IDFC FIRST", logo: "/logos/idfc.svg" },
  { name: "YES BANK", logo: "/logos/yes.svg" },
  { name: "Federal Bank", logo: "/logos/federal.svg" },
  { name: "NSDL Payments Bank", logo: "/logos/nsdl.png" },
];

/* what makes two brands "the same icon" on screen: the logo file if
   there is one (Axis Mobile and Axis Bank share /logos/axis.svg!),
   otherwise the fallback text, i.e. the name */
const brandKey = (b: Brand) => b.logo ?? b.name;

/* one combined pool, apps and banks interleaved deterministically
   (no Math.random at initial-state level — keeps SSR hydration stable) */
const pool: Brand[] = (() => {
  const out: Brand[] = [];
  const max = Math.max(apps.length, banks.length);
  for (let i = 0; i < max; i++) {
    if (apps[i]) out.push(apps[i]);
    if (banks[i]) out.push(banks[i]);
  }
  return out;
})();

/* wall shows 12 at a time; the other 12 wait on the bench */
const VISIBLE = 12;
/* exactly one swap per second */
const TICK_MS = 2000;
/* a freshly benched brand sits out at least this many ticks */
const COOLDOWN = 2;

type Slot = {
  brand: Brand;
  prev: Brand | null;
  /* bumped on every swap — React key for the faces, so they REMOUNT
     and the CSS animation is guaranteed to restart */
  swapId: number;
};

const initialSlots: Slot[] = pool
  .slice(0, VISIBLE)
  .map((brand) => ({ brand, prev: null, swapId: 0 }));

/* ---- one brand face (logo with graceful text fallback) ---- */
function BrandFace({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);

  return brand.logo && !failed ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logo}
      alt={brand.name}
      className="h-7 w-auto max-w-[130px] object-contain opacity-70 grayscale transition duration-300 group-hover/slot:opacity-100 group-hover/slot:grayscale-0"
      draggable={false}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-ink/60 transition duration-300 group-hover/slot:text-ink">
      {brand.name}
    </span>
  );
}

/* ---- a slot window: exiting face slides up and out, entering face
   slides up from below; both keyed by swapId ---- */
function LogoSlot({ slot }: { slot: Slot }) {
  const { brand, prev, swapId } = slot;
  return (
    <div className="logo-slot group/slot" title={brand.name}>
      {prev && (
        <span
          key={`out-${swapId}`}
          className="logo-slot__face logo-slot__face--exit"
          aria-hidden
        >
          <BrandFace brand={prev} />
        </span>
      )}
      <span
        key={`in-${swapId}`}
        className={`logo-slot__face ${prev ? "logo-slot__face--enter" : ""}`}
      >
        <BrandFace brand={brand} />
      </span>
    </div>
  );
}

export default function SupportedBy() {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);

  /* ALL rotation state lives in refs, and every mutation happens inside
     the interval callback — never inside a setState updater. React 18
     StrictMode double-invokes updater functions in dev, so a bench
     mutation in there runs twice per tick and slowly corrupts the pool
     (which is what made the rotation die after a few swaps). setSlots
     only ever receives a fully precomputed value. */
  const slotsRef = useRef<Slot[]>(initialSlots);
  const bench = useRef<Brand[]>(pool.slice(VISIBLE));
  const lastSlot = useRef(-1);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (paused.current || document.hidden) return;

      const cur = slotsRef.current;
      const b = bench.current;
      if (b.length <= COOLDOWN) return;

      /* exactly ONE slot per tick; never the same slot twice in a row */
      let i = Math.floor(Math.random() * cur.length);
      if (i === lastSlot.current) i = (i + 1) % cur.length;

      /* every icon identity currently on the wall — including slot i's
         outgoing brand, which stays visible while it animates out
         (covers shared-logo brands like the two Axis entries) */
      const onWall = new Set(cur.map((s) => brandKey(s.brand)));

      /* eligible = outside the cooldown tail AND not already visible.
         (bench is a queue: picks come from the front region, outgoing
         brands are appended to the back) */
      const eligible: number[] = [];
      for (let k = 0; k < b.length - COOLDOWN; k++) {
        if (!onWall.has(brandKey(b[k]))) eligible.push(k);
      }
      if (!eligible.length) return; // skip this tick

      lastSlot.current = i;
      const pick = eligible[Math.floor(Math.random() * eligible.length)];
      const incoming = b[pick];
      const outgoing = cur[i].brand;
      b.splice(pick, 1);
      b.push(outgoing);

      const next = [...cur];
      next[i] = { brand: incoming, prev: outgoing, swapId: cur[i].swapId + 1 };
      slotsRef.current = next;
      setSlots(next);
    }, TICK_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <section aria-labelledby="supported-apps-heading" className="overflow-hidden bg-surface py-24">
      <Container className="text-center">
        <p
          data-reveal
          className="text-sm font-semibold uppercase tracking-wider text-brand"
        >
          Works Everywhere
        </p>
        <h2
          id="supported-apps-heading"
          data-reveal
          className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl"
        >
          Supported Apps &amp; Banks
        </h2>
        <p
          data-reveal
          className="mx-auto mt-4 max-w-2xl text-lg text-ink/60"
        >
          Customers can pay using any major UPI app, backed by a wide network
          of partner banks across India.
        </p>
      </Container>

      <Container className="mt-16">
        <ul
          role="list"
          aria-label="Supported payment apps and partner banks"
          className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          {slots.map((s, i) => (
            <li key={i}>
              <LogoSlot slot={s} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}