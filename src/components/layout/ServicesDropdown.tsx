"use client";

/**
 * ServicesDropdown.tsx
 * ---------------------------------------------------------------------------
 * Cashlo — Services navigation dropdown.
 *
 * Standalone, uses next/link for client-side navigation. Drop into the navbar
 * in place of the current Services NavDropdown item.
 *
 * All styling is scoped under .csd-* and injected by the component.
 * ---------------------------------------------------------------------------
 */

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import NextLink from "next/link";

type Service = {
  id: string;
  name: string;
  desc: string;
  href: string;
  Icon: ComponentType;
};

/* Hrefs matched to your actual routes (navData.ts), not the placeholder
   paths from the original hand-off. */
const SERVICES: Service[] = [
  { id: "upi", name: "UPI Cash Point", desc: "Instant UPI cash withdrawal for merchants", href: "/upi-cashpoint", Icon: IconUpi },
  { id: "khata", name: "Quick Khata", desc: "Smart digital ledger & collection", href: "/quickkhata", Icon: IconKhata },
  { id: "loan", name: "Instant Loan", desc: "Approve loans & earn commission", href: "/services/instant-loan", Icon: IconLoan },
  { id: "recharge", name: "Recharge & Bill Payment", desc: "Recharge & utility services", href: "/services/recharge-bills", Icon: IconRecharge },
  { id: "gold", name: "Gold Loan & Digital Gold", desc: "Invest in digital gold or get a gold loan", href: "/services/gold-loan", Icon: IconGold },
  { id: "itr", name: "ITR Filing", desc: "File income tax returns easily", href: "/services/itr-filing", Icon: IconItr },
];

const EXIT_MS = 180;

export default function ServicesDropdown({
services = SERVICES,
label = "Services",
onHero = false,
}: {
services?: Service[];
label?: string;
onHero?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hot, setHot] = useState<string | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
    clearTimeout(exitTimer.current);
  };

  const open = useCallback(() => {
    clearTimers();
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setVisible(false);
    setHot(null);
    exitTimer.current = setTimeout(() => setMounted(false), EXIT_MS);
  }, []);

  const openSoon = (d = 40) => {
    clearTimers();
    openTimer.current = setTimeout(open, d);
  };
  const closeSoon = (d = 140) => {
    clearTimers();
    closeTimer.current = setTimeout(close, d);
  };

  useEffect(() => () => clearTimers(), []);

  /* Close on outside click */
  useEffect(() => {
    if (!mounted) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [mounted, close]);

  /* Keep the sheet anchored under the nav on mobile */
  useEffect(() => {
    if (!mounted) return;
    const place = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (r) wrapRef.current?.style.setProperty("--csd-anchor", `${r.bottom + 10}px`);
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place);
    };
  }, [mounted]);

  /* Keyboard */
  const focusItem = (i: number) => {
    const list = itemRefs.current.filter(Boolean);
    if (!list.length) return;
    const n = (i + list.length) % list.length;
    list[n]?.focus();
    setHot(services[n]?.id ?? null);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
      setTimeout(() => focusItem(0), 30);
    } else if (e.key === "Escape") {
      close();
    }
  };

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const list = itemRefs.current.filter(Boolean);
    const i = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(list.length - 1);
    } else if (e.key === "Tab") {
      close();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      className="csd-root"
      ref={wrapRef}
      onMouseEnter={() => openSoon()}
      onMouseLeave={() => closeSoon()}
    >
      <style>{CSS_TEXT}</style>

      <button
        ref={triggerRef}
        type="button"
        className={`csd-trigger${visible ? " is-open" : ""}`}
        style={{ color: onHero ? "#070b1e" : undefined }}
        aria-expanded={visible}
        aria-haspopup="true"
        aria-controls="csd-services-panel"
        onKeyDown={onTriggerKeyDown}
        onClick={() => (visible ? close() : open())}
        >
        <span>{label}</span>
        <svg className="csd-chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 6L8 10.5 12.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted && (
        <div className="csd-layer">
          <div
            id="csd-services-panel"
            role="menu"
            aria-label="Services"
            className={`csd-panel${visible ? " is-in" : ""}`}
            onKeyDown={onPanelKeyDown}
          >
            {services.map((s, i) => (
              <div
                key={s.id}
                className="csd-rowwrap"
                style={{ transitionDelay: visible ? `${40 + i * 25}ms` : "0ms" }}
              >
                <NextLink
                  href={s.href}
                  role="menuitem"
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="csd-row"
                  data-hot={hot === s.id ? "true" : "false"}
                  onMouseEnter={() => setHot(s.id)}
                  onMouseLeave={() => setHot((h) => (h === s.id ? null : h))}
                  onFocus={() => setHot(s.id)}
                  onBlur={() => setHot((h) => (h === s.id ? null : h))}
                >
                  <span className="csd-rail" aria-hidden="true" />
                  <span className="csd-iconwrap">
                    <s.Icon />
                  </span>
                  <span className="csd-copy">
                    <span className="csd-name">{s.name}</span>
                    <span className="csd-desc">{s.desc}</span>
                  </span>
                  <svg className="csd-arrow" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 10h9M10 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </NextLink>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Icons — flat blue line art on a light circular field.
   ═══════════════════════════════════════════════════════════════════════════ */

const BLUE = "#3B5BFF";

function IconShell({ children }: { children: React.ReactNode }) {
  return (
    <svg className="csd-icon" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true">
      <circle className="csd-icon-bg" cx="22" cy="22" r="21" />
      <g className="csd-art">{children}</g>
    </svg>
  );
}

/* UPI Cash Point — QR pulses, scan line sweeps */
function IconUpi() {
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7.5" height="7.5" rx="2.2" fill="none" stroke={BLUE} strokeWidth="1.6" />
      <rect x={x + 2.6} y={y + 2.6} width="2.3" height="2.3" rx="0.6" fill={BLUE} />
    </g>
  );
  return (
    <IconShell>
      <g className="u-qr">
        {finder(12, 12)}
        {finder(24.5, 12)}
        {finder(12, 24.5)}
        <rect x="24.5" y="24.5" width="2.8" height="2.8" rx="0.7" fill={BLUE} />
        <rect x="29.2" y="24.5" width="2.8" height="2.8" rx="0.7" fill={BLUE} opacity=".45" />
        <rect x="24.5" y="29.2" width="2.8" height="2.8" rx="0.7" fill={BLUE} opacity=".45" />
        <rect x="29.2" y="29.2" width="2.8" height="2.8" rx="0.7" fill={BLUE} />
      </g>
      <rect className="u-scan" x="10.5" y="11" width="23" height="1.4" rx="0.7" fill={BLUE} />
    </IconShell>
  );
}

/* Quick Khata — a page turns, ₹ settles, tick draws */
function IconKhata() {
  return (
    <IconShell>
      <rect x="12" y="13" width="20" height="18" rx="2.6" fill="none" stroke={BLUE} strokeWidth="1.6" />
      <rect className="k-page" x="13.6" y="14.6" width="7.6" height="14.8" rx="1" fill={BLUE} opacity=".14" />
      <rect x="21.3" y="13" width="1.4" height="18" fill={BLUE} opacity=".45" />
      <g className="k-roll">
        <text x="27" y="23.6" textAnchor="middle" fontSize="8" fontWeight="700" fill={BLUE}>₹</text>
      </g>
      <rect x="14.5" y="18.5" width="5.5" height="1.4" rx="0.7" fill={BLUE} opacity=".35" />
      <rect x="14.5" y="22.5" width="5.5" height="1.4" rx="0.7" fill={BLUE} opacity=".35" />
      <path className="k-tick" d="M24.6 27.4l1.9 1.9 3.7-4" fill="none" stroke="#16A34A" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </IconShell>
  );
}

/* Instant Loan — ₹ lifts off the document, approval tick appears */
function IconLoan() {
  return (
    <IconShell>
      <path d="M14 12h9l6 6v14a1.8 1.8 0 01-1.8 1.8H14A1.8 1.8 0 0112.2 32V13.8A1.8 1.8 0 0114 12z" fill="none" stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M23 12v6h6" fill="none" stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="15.5" y="26" width="8" height="1.4" rx="0.7" fill={BLUE} opacity=".35" />
      <rect x="15.5" y="29.5" width="5.5" height="1.4" rx="0.7" fill={BLUE} opacity=".35" />
      <text className="l-rupee" x="19.5" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={BLUE}>₹</text>
      <g className="l-check">
        <circle cx="30" cy="30.5" r="5.6" fill="#16A34A" />
        <path d="M27.5 30.6l1.8 1.8 3.3-3.6" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </IconShell>
  );
}

/* Recharge & Bill Payment — screen glows, one signal wave, gentle bolt */
function IconRecharge() {
  return (
    <IconShell>
      <rect x="14" y="11" width="13" height="22" rx="3" fill="none" stroke={BLUE} strokeWidth="1.6" />
      <rect className="r-screen" x="16" y="14" width="9" height="14" rx="1.4" fill={BLUE} opacity=".14" />
      <rect x="18.5" y="30" width="4" height="1.2" rx="0.6" fill={BLUE} opacity=".45" />
      <path className="r-wave r-wave1" d="M29.5 18.5a5 5 0 010 7" fill="none" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
      <path className="r-wave r-wave2" d="M32.4 16a9 9 0 010 12" fill="none" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
      <path className="r-bolt" d="M21.8 16.5l-2.8 5h2.4l-.8 4.4 3.4-5.3h-2.5z" fill="#F5A524" />
    </IconShell>
  );
}

/* Gold Loan & Digital Gold — coin turns, single sparkle, growth line */
function IconGold() {
  return (
    <IconShell>
      <g className="g-coin">
        <circle cx="18" cy="27" r="7" fill="#F5C451" />
        <circle cx="18" cy="27" r="4.8" fill="none" stroke="#D19A26" strokeWidth="1.1" />
        <text x="18" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fill="#9A6C12">₹</text>
      </g>
      <path className="g-arrow" d="M24 24l4.2-4.6 2.6 2.6 3.6-4.4" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path className="g-arrow" d="M31.4 17.6h3.4V21" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <g className="g-spark">
        <path d="M28.4 27.6l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" fill="#F5C451" />
      </g>
    </IconShell>
  );
}

/* ITR Filing — form settles, verified stamp lands */
function IconItr() {
  return (
    <IconShell>
      <g className="i-doc">
        <rect x="13" y="11" width="18" height="22" rx="2.6" fill="none" stroke={BLUE} strokeWidth="1.6" />
        <text x="17" y="20" fontSize="5.6" fontWeight="800" fill={BLUE} letterSpacing="0.3">ITR</text>
        <rect x="16.5" y="23.5" width="11" height="1.4" rx="0.7" fill={BLUE} opacity=".3" />
        <rect x="16.5" y="27" width="8" height="1.4" rx="0.7" fill={BLUE} opacity=".3" />
      </g>
      <g className="i-stamp">
        <circle cx="29.5" cy="29.5" r="6.2" fill="#fff" />
        <circle cx="29.5" cy="29.5" r="6.2" fill="none" stroke="#16A34A" strokeWidth="1.4" />
        <path className="i-tick" d="M26.8 29.7l2 2 3.7-4.1" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </IconShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════════════════════════════════ */

const CSS_TEXT = `
.csd-root{
  --csd-blue:var(--brand);
  --csd-hover:var(--surface);
  --csd-border:var(--border);
  --csd-title:var(--ink);
  --csd-muted:color-mix(in srgb, var(--ink) 58%, transparent);
  position:relative;display:inline-block;
  font-family:inherit;
}

/* Trigger — matches the other nav items' size/weight (text-sm font-medium) */
.csd-trigger{
  display:inline-flex;align-items:center;gap:6px;
  padding:10px 2px;margin:0;
  background:none;border:0;cursor:pointer;
  font-family:inherit;font-size:14px;font-weight:500;line-height:1.25rem;
  color:var(--csd-title);
  transition:color .25s ease;
}
.csd-trigger:hover,.csd-trigger.is-open{color:var(--csd-blue);}
.csd-trigger:focus-visible{outline:2px solid var(--csd-blue);outline-offset:4px;border-radius:6px;}
.csd-chevron{width:14px;height:14px;transition:transform .25s ease;}
.csd-trigger.is-open .csd-chevron{transform:rotate(180deg);}

/* Panel */
.csd-layer{position:absolute;top:calc(100% + 10px);left:-14px;z-index:80;}
.csd-panel{
  width:348px;max-width:calc(100vw - 32px);
  padding:8px;
  background:var(--card);
  border:1px solid var(--csd-border);
  border-radius:16px;
  box-shadow:0 8px 24px rgba(17,24,39,.08),0 2px 6px rgba(17,24,39,.04);
  transform-origin:top left;
  opacity:0;transform:translateY(-8px) scale(.98);pointer-events:none;
  transition:opacity .25s ease-out,transform .25s cubic-bezier(.16,1,.3,1);
}
.csd-panel.is-in{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}

.csd-rowwrap{
  opacity:0;transform:translateY(4px);
  transition:opacity .25s ease,transform .25s cubic-bezier(.16,1,.3,1);
}
.csd-panel.is-in .csd-rowwrap{opacity:1;transform:none;}

/* Row */
.csd-row{
  position:relative;
  display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;
  padding:10px 12px;
  border-radius:10px;
  background:transparent;text-decoration:none;
  transition:background-color .25s ease;
}
.csd-row:focus{outline:none;}
.csd-row:focus-visible{outline:2px solid var(--csd-blue);outline-offset:-2px;}
.csd-row[data-hot="true"]{background:var(--csd-hover);}

/* Thin left indicator */
.csd-rail{
  position:absolute;left:0;top:10px;width:2px;height:0;border-radius:2px;
  background:var(--csd-blue);
  transition:height .25s ease;
}
.csd-row[data-hot="true"] .csd-rail{height:calc(100% - 20px);}

.csd-iconwrap{
  display:grid;place-items:center;width:40px;height:40px;
  transition:transform .25s ease;
}
.csd-row[data-hot="true"] .csd-iconwrap{transform:scale(1.05);}
.csd-icon{display:block;}
.csd-icon-bg{fill:color-mix(in srgb, var(--brand) 10%, var(--card));transition:fill .25s ease;}
.csd-row[data-hot="true"] .csd-icon-bg{fill:color-mix(in srgb, var(--brand) 18%, var(--card));}

.csd-copy{display:flex;flex-direction:column;gap:2px;min-width:0;}
.csd-name{
  font-size:14.5px;font-weight:600;line-height:1.3;letter-spacing:-0.01em;
  color:var(--ink);transition:color .25s ease;
}
.csd-row[data-hot="true"] .csd-name{color:var(--brand);}
.csd-desc{font-size:12.5px;line-height:1.35;color:var(--csd-muted);}

.csd-arrow{
  width:18px;height:18px;color:#9CA3AF;opacity:0;
  transition:transform .25s ease,opacity .25s ease,color .25s ease;
}
.csd-row[data-hot="true"] .csd-arrow{transform:translateX(6px);opacity:1;color:var(--csd-blue);}

/* ── Icon micro-animations — only while the row is active ──────────────── */
@media (prefers-reduced-motion:no-preference){
  @keyframes uPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.04);}}
  @keyframes uScan{0%{transform:translateY(0);opacity:0;}20%{opacity:.45;}80%{opacity:.45;}100%{transform:translateY(21px);opacity:0;}}
  .u-qr{transform-origin:22px 22px;}
  .u-scan{opacity:0;}
  .csd-row[data-hot="true"] .u-qr{animation:uPulse 2.4s ease-in-out infinite;}
  .csd-row[data-hot="true"] .u-scan{animation:uScan 2.4s ease-in-out infinite;}

  @keyframes kFlip{0%,10%{transform:scaleX(1);}50%{transform:scaleX(.08);}90%,100%{transform:scaleX(1);}}
  @keyframes kRise{0%{transform:translateY(4px);opacity:0;}40%,100%{transform:translateY(0);opacity:1;}}
  @keyframes kDraw{to{stroke-dashoffset:0;}}
  .k-page{transform-origin:22px 22px;}
  .k-tick{stroke-dasharray:10;stroke-dashoffset:10;}
  .csd-row[data-hot="true"] .k-page{animation:kFlip 2.8s ease-in-out infinite;}
  .csd-row[data-hot="true"] .k-roll{animation:kRise .5s ease-out;}
  .csd-row[data-hot="true"] .k-tick{animation:kDraw .4s .3s ease-out forwards;}

  @keyframes lRise{0%{transform:translateY(3px);opacity:0;}30%{opacity:1;}100%{transform:translateY(-3px);opacity:0;}}
  @keyframes lPop{0%{transform:scale(.6);opacity:0;}100%{transform:scale(1);opacity:1;}}
  .l-check{transform-origin:30px 30.5px;transform:scale(.6);opacity:0;}
  .csd-row[data-hot="true"] .l-rupee{animation:lRise 2.4s ease-out infinite;}
  .csd-row[data-hot="true"] .l-check{animation:lPop .3s .2s ease-out forwards;}

  @keyframes rFlash{0%,100%{opacity:.12;}50%{opacity:.28;}}
  @keyframes rWave{0%{opacity:0;}35%{opacity:1;}100%{opacity:0;}}
  @keyframes rBolt{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}
  .r-wave{opacity:0;}
  .r-bolt{transform-origin:21px 21.5px;}
  .csd-row[data-hot="true"] .r-screen{animation:rFlash 2.2s ease-in-out infinite;}
  .csd-row[data-hot="true"] .r-wave1{animation:rWave 2.2s ease-out infinite;}
  .csd-row[data-hot="true"] .r-wave2{animation:rWave 2.2s .3s ease-out infinite;}
  .csd-row[data-hot="true"] .r-bolt{animation:rBolt 2.2s ease-in-out infinite;}

  @keyframes gTurn{0%{transform:rotateY(0);}100%{transform:rotateY(360deg);}}
  @keyframes gSparkle{0%,100%{opacity:0;transform:scale(.6);}45%{opacity:1;transform:scale(1);}}
  @keyframes gDraw{0%{opacity:.3;transform:translate(1px,2px);}100%{opacity:1;transform:none;}}
  .g-coin{transform-origin:center;transform-box:fill-box;}
  .g-spark{opacity:0;transform-origin:center;transform-box:fill-box;}
  .csd-row[data-hot="true"] .g-coin{animation:gTurn 3.4s cubic-bezier(.5,0,.5,1) infinite;}
  .csd-row[data-hot="true"] .g-spark{animation:gSparkle 2.4s ease-in-out infinite;}
  .csd-row[data-hot="true"] .g-arrow{animation:gDraw .4s ease-out forwards;}

  @keyframes iSlide{0%{transform:translateY(3px);opacity:.7;}100%{transform:translateY(0);opacity:1;}}
  @keyframes iStamp{0%{transform:scale(1.3);opacity:0;}100%{transform:scale(1);opacity:1;}}
  @keyframes iDraw{to{stroke-dashoffset:0;}}
  .i-stamp{transform-origin:center;transform-box:fill-box;opacity:0;}
  .i-tick{stroke-dasharray:11;stroke-dashoffset:11;}
  .csd-row[data-hot="true"] .i-doc{animation:iSlide .35s ease-out forwards;}
  .csd-row[data-hot="true"] .i-stamp{animation:iStamp .3s .12s ease-out forwards;}
  .csd-row[data-hot="true"] .i-tick{animation:iDraw .35s .3s ease-out forwards;}
}

/* Mobile — full-width sheet under the navbar */
@media (max-width:600px){
  .csd-layer{position:fixed;top:var(--csd-anchor,64px);left:12px;right:12px;}
  .csd-panel{width:100%;max-width:none;max-height:70vh;overflow-y:auto;}
}

/* Reduced motion */
@media (prefers-reduced-motion:reduce){
  .csd-panel{transform:none;transition:opacity .12s linear;}
  .csd-panel.is-in{transform:none;}
  .csd-rowwrap{transform:none;}
  .csd-row,.csd-rail,.csd-arrow,.csd-iconwrap,.csd-icon-bg,.csd-chevron{transition-duration:.01ms !important;}
}
`;