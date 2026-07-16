"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

/**
 * useHangingDocs — cards hanging from strings pinned to the top of the section.
 *
 * Physics per card:
 *  - Damped pendulum for the swing angle  (grab & fling → it swings and settles)
 *  - Damped spring for the string stretch (pull down → string stretches, snaps back)
 *  - Gentle ambient sway while idle
 *
 * Markup contract (see HangingDocs.tsx):
 *  <div ref={scope}>
 *    <div data-hang-item>            ← pivot is the TOP CENTER of this element
 *      <div data-hang-swing>         ← rotated (transform-origin: top center)
 *        <div data-hang-string />    ← scaleY'd when stretched
 *        <div data-hang-card>…</div> ← translated down when stretched
 *      </div>
 *    </div>
 *  </div>
 */

const GRAVITY = 2600; // px/s² — higher = faster swing
const AIR = 1.6;      // angular damping
const K = 90;         // string spring stiffness
const S_DAMP = 9;     // string spring damping
const MAX_STRETCH = 90;
const MIN_STRETCH = -14;
const RAD2DEG = 180 / Math.PI;

type ItemState = {
  item: HTMLElement;
  swing: HTMLElement;
  string: HTMLElement;
  card: HTMLElement;
  L: number;          // pivot → card-grab rest distance (px)
  angle: number;      // radians
  vel: number;        // rad/s
  stretch: number;    // px
  sVel: number;       // px/s
  dragging: boolean;
  active: boolean;    // needs physics ticks
  ambient?: gsap.core.Tween;
  lastAngle: number;
  lastT: number;
};

export function useHangingDocs() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const items: ItemState[] = gsap.utils
        .toArray<HTMLElement>("[data-hang-item]", root)
        .map((item) => {
          const swing = item.querySelector<HTMLElement>("[data-hang-swing]")!;
          const string = item.querySelector<HTMLElement>("[data-hang-string]")!;
          const card = item.querySelector<HTMLElement>("[data-hang-card]")!;
          return {
            item,
            swing,
            string,
            card,
            L: string.offsetHeight + card.offsetHeight * 0.5,
            angle: 0,
            vel: 0,
            stretch: 0,
            sVel: 0,
            dragging: false,
            active: false,
            lastAngle: 0,
            lastT: 0,
          };
        });

      if (!items.length) return;

      /* ---------- ambient idle sway ---------- */
      const startAmbient = (s: ItemState) => {
        if (reduced) return;
        s.ambient?.kill();
        s.ambient = gsap.fromTo(
          s.swing,
          { rotation: gsap.utils.random(-1.8, -0.8) },
          {
            rotation: gsap.utils.random(0.8, 1.8),
            duration: gsap.utils.random(2.2, 3.4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: gsap.utils.random(0, 1.2),
          }
        );
      };
      items.forEach(startAmbient);

      /* ---------- physics tick ---------- */
      const tick = (_t: number, deltaMS: number) => {
        const dt = Math.min(deltaMS / 1000, 1 / 30);
        for (const s of items) {
          if (!s.active || s.dragging) continue;

          // damped pendulum
          const aAcc = (-GRAVITY / s.L) * Math.sin(s.angle) - AIR * s.vel;
          s.vel += aAcc * dt;
          s.angle += s.vel * dt;

          // damped stretch spring
          const sAcc = -K * s.stretch - S_DAMP * s.sVel;
          s.sVel += sAcc * dt;
          s.stretch += s.sVel * dt;

          render(s);

          // settled? → hand back to ambient sway
          if (
            Math.abs(s.angle) < 0.004 &&
            Math.abs(s.vel) < 0.02 &&
            Math.abs(s.stretch) < 0.4 &&
            Math.abs(s.sVel) < 2
          ) {
            s.active = false;
            s.angle = s.vel = s.stretch = s.sVel = 0;
            render(s);
            startAmbient(s);
          }
        }
      };
      gsap.ticker.add(tick);

      const render = (s: ItemState) => {
        gsap.set(s.swing, { rotation: s.angle * RAD2DEG });
        gsap.set(s.string, { scaleY: (s.L + s.stretch) / s.L });
        gsap.set(s.card, { y: s.stretch });
      };

      /* ---------- dragging ---------- */
      const getPivot = (s: ItemState) => {
        const r = s.item.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top };
      };

      const onDown = (s: ItemState) => (e: PointerEvent) => {
        e.preventDefault();
        s.card.setPointerCapture(e.pointerId);
        s.ambient?.kill();
        // read whatever rotation the ambient tween left behind
        s.angle = (Number(gsap.getProperty(s.swing, "rotation")) || 0) / RAD2DEG;
        s.vel = 0;
        s.sVel = 0;
        s.dragging = true;
        s.active = true;
        s.lastAngle = s.angle;
        s.lastT = performance.now();
        s.card.classList.add("is-grabbed");
      };

      const onMove = (s: ItemState) => (e: PointerEvent) => {
        if (!s.dragging) return;
        const p = getPivot(s);
        const dx = e.clientX - p.x;
        const dy = Math.max(e.clientY - p.y, 12); // never above the pin
        // CSS rotation is clockwise, and a point hanging below the pivot
        // moves LEFT for a positive rotation — so the pointer angle must
        // be negated on x to make the card follow the cursor.
        s.angle = Math.atan2(-dx, dy);

        // stretch with resistance, clamped
        const dist = Math.hypot(dx, dy);
        s.stretch = gsap.utils.clamp(
          MIN_STRETCH,
          MAX_STRETCH,
          (dist - s.L) * 0.55
        );

        // angular velocity estimate → fling on release
        const now = performance.now();
        const dt = Math.max(now - s.lastT, 1) / 1000;
        s.vel = gsap.utils.clamp(-9, 9, (s.angle - s.lastAngle) / dt);
        s.lastAngle = s.angle;
        s.lastT = now;

        render(s);
      };

      const onUp = (s: ItemState) => () => {
        if (!s.dragging) return;
        s.dragging = false; // physics loop takes over with current angle + vel
        s.card.classList.remove("is-grabbed");
      };

      const cleanups = items.map((s) => {
        const down = onDown(s);
        const move = onMove(s);
        const up = onUp(s);
        s.card.addEventListener("pointerdown", down);
        s.card.addEventListener("pointermove", move);
        s.card.addEventListener("pointerup", up);
        s.card.addEventListener("pointercancel", up);
        return () => {
          s.card.removeEventListener("pointerdown", down);
          s.card.removeEventListener("pointermove", move);
          s.card.removeEventListener("pointerup", up);
          s.card.removeEventListener("pointercancel", up);
          s.ambient?.kill();
        };
      });

      return () => {
        gsap.ticker.remove(tick);
        cleanups.forEach((fn) => fn());
      };
    },
    { scope }
  );

  return scope;
}