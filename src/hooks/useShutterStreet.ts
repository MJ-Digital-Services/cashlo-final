"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

/**
 * useShutterStreet — a street of mini storefronts with rolling metal shutters.
 *
 * Interaction per shop:
 *  - Hover (fine pointers) or tap (touch) → shutter rolls up into its housing
 *    with a small mechanical rattle, interior "lights on": icon + Cashlo QR
 *    sticker pop in.
 *  - Leave / tap again → timeline reverses, shutter rolls back down.
 *  - Ambient: every few seconds one random closed shop opens by itself for a
 *    moment, so the street always feels alive. Skipped for reduced motion.
 *
 * Markup contract (see WhoCanUse.tsx):
 *  <div ref={scope}>
 *    <div data-shop>                 ← one storefront
 *      <div data-doorway>            ← overflow hidden
 *        <div data-interior>…</div>  ← icon + QR sticker (revealed)
 *        <div data-shutter />        ← slatted shutter (rolls up)
 *      </div>
 *    </div>
 *  </div>
 */

const AMBIENT_EVERY = 3800; // ms between ambient auto-opens
const AMBIENT_HOLD = 2000;  // ms an ambient shop stays open

type ShopState = {
  shop: HTMLElement;
  tl: gsap.core.Timeline;
  open: boolean;
  ambient: boolean; // opened by the ambient loop, not the user
};

export function useShutterStreet() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;

      const shops: ShopState[] = gsap.utils
        .toArray<HTMLElement>("[data-shop]", root)
        .map((shop) => {
          const shutter = shop.querySelector<HTMLElement>("[data-shutter]")!;
          const interior = shop.querySelector<HTMLElement>("[data-interior]")!;

          gsap.set(interior, { autoAlpha: 0, scale: 0.92 });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.inOut" },
          });

          // roll up into the housing (a sliver stays visible under it)
          tl.to(shutter, { yPercent: -94, duration: 0.6 });
          // mechanical rattle as it locks open
          tl.to(shutter, {
            y: "+=3",
            duration: 0.05,
            repeat: 3,
            yoyo: true,
            ease: "power1.inOut",
          });
          // lights on: interior pops in while the shutter is still rising
          tl.fromTo(
            interior,
            { autoAlpha: 0, scale: 0.92, y: 6 },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.45,
              ease: "back.out(1.7)",
            },
            "-=0.4"
          );

          return { shop, tl, open: false, ambient: false };
        });

      if (!shops.length) return;

      const open = (s: ShopState, ambient = false) => {
        s.open = true;
        s.ambient = ambient;
        s.shop.classList.add("is-open");
        s.tl.timeScale(1).play();
      };
      const close = (s: ShopState) => {
        s.open = false;
        s.ambient = false;
        s.shop.classList.remove("is-open");
        s.tl.timeScale(1.35).reverse(); // closing is a touch quicker
      };

      /* ---------- user interaction ---------- */
      const cleanups = shops.map((s) => {
        const enter = () => {
          if (!s.open || s.ambient) open(s); // hover steals from ambient
        };
        const leave = () => {
          if (s.open) close(s);
        };
        const toggle = () => (s.open && !s.ambient ? close(s) : open(s));

        if (canHover) {
          s.shop.addEventListener("mouseenter", enter);
          s.shop.addEventListener("mouseleave", leave);
        } else {
          s.shop.addEventListener("click", toggle);
        }
        s.shop.addEventListener("focus", enter);
        s.shop.addEventListener("blur", leave);

        return () => {
          s.shop.removeEventListener("mouseenter", enter);
          s.shop.removeEventListener("mouseleave", leave);
          s.shop.removeEventListener("click", toggle);
          s.shop.removeEventListener("focus", enter);
          s.shop.removeEventListener("blur", leave);
        };
      });

      /* ---------- ambient street life ---------- */
      let ambientId: ReturnType<typeof setInterval> | undefined;
      if (!reduced) {
        ambientId = setInterval(() => {
          const closed = shops.filter((s) => !s.open);
          if (!closed.length) return;
          const pick = gsap.utils.random(closed) as ShopState;
          open(pick, true);
          gsap.delayedCall(AMBIENT_HOLD / 1000, () => {
            if (pick.open && pick.ambient) close(pick); // user may have taken over
          });
        }, AMBIENT_EVERY);
      }

      return () => {
        if (ambientId) clearInterval(ambientId);
        cleanups.forEach((fn) => fn());
        shops.forEach((s) => s.tl.kill());
      };
    },
    { scope }
  );

  return scope;
}