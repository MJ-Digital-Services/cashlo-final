"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

/**
 * Hero: 1:1 port of the reference page's engines —
 *  - .rv reveal + .cnt counters via IntersectionObserver
 *  - the QR loop (grid assembles cell-by-cell -> scanline sweep ->
 *    payment success overlay -> flying notes -> earnings tick up)
 *  - magnetic buttons
 *
 * The scroll-pinned trust handoff has been removed; the hero is now a
 * plain section that scrolls away normally.
 */
export function useHeroTrust() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const q = gsap.utils.selector(section);

      const cleanups: (() => void)[] = [];

      /* ================================================================
         1) Reveal observer + counters (ported from initReveal/runCounter)
         ================================================================ */
      const runCounter = (el: HTMLElement) => {
        if (el.dataset.done) return;
        el.dataset.done = "1";
        const to = parseFloat(el.dataset.to || "0");
        const t0 = performance.now();
        const dur = 1600;
        const step = (n: number) => {
          const p = Math.min((n - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 4);
          el.textContent = String(Math.round(to * e));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("in");
            e.target
              .querySelectorAll<HTMLElement>(".cnt")
              .forEach(runCounter);
            if (e.target.classList.contains("cnt"))
              runCounter(e.target as HTMLElement);
            io.unobserve(e.target);
          }),
        { threshold: 0.12 }
      );
      section
        .querySelectorAll(".cx-hero .cnt, .cx-hero .pill")
        .forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());

      // The hero is above the fold, so reveal .rv elements directly on
      // mount instead of relying on the observer. Double rAF so the
      // initial hidden state is committed first and the CSS transition
      // actually animates.

      /* ================================================================
         2) QR loop (ported 1:1 from qrLoop/spawnNotes, same timings)
         ================================================================ */
      const grid = q("[data-qr-grid]")[0] as HTMLElement | undefined;
      let qrTimer: ReturnType<typeof setTimeout> | null = null;
      let phTimers: ReturnType<typeof setTimeout>[] = [];

      if (grid) {
        const N = 17;
        const seedBase = Date.now();
        grid.querySelectorAll("i").forEach((i) => i.remove());
        const cells: HTMLElement[] = [];
        for (let y = 0; y < N; y++)
          for (let x = 0; x < N; x++) {
            const i = document.createElement("i");
            const eye =
              (x < 5 && y < 5) || (x > N - 6 && y < 5) || (x < 5 && y > N - 6);
            if (eye) {
              const border =
                x === 0 || y === 0 || x === 4 || y === 4 ||
                x === N - 1 || y === N - 1 || x === N - 5 || y === N - 5;
              const inner =
                (x >= 1 && x <= 3 && y >= 1 && y <= 3) ||
                (x >= N - 4 && x <= N - 2 && y >= 1 && y <= 3) ||
                (x >= 1 && x <= 3 && y >= N - 4 && y <= N - 2);
              if (!(border || inner)) i.style.visibility = "hidden";
              else i.classList.add("eye");
            }
            cells.push(i);
            grid.appendChild(i);
          }

        const scan = q("[data-scanline]")[0] as HTMLElement | undefined;
        if (scan) grid.appendChild(scan); // scanline stays on top of cells
        const status = q("[data-qr-status]")[0] as HTMLElement | undefined;
        const earnEl = q("[data-ph-earn]")[0] as HTMLElement | undefined;
        const commEl = q("[data-ph-comm]")[0] as HTMLElement | undefined;
        const succ = q("[data-ph-success]")[0] as HTMLElement | undefined;
        const succAmt = q("[data-succ-amt]")[0] as HTMLElement | undefined;
        const stage = q("[data-phone-stage]")[0] as HTMLElement | undefined;

        let earn = 1240;
        let seq = 0;
        const AMTS = [2000, 500, 1000, 5000, 1500];
        const APPSX = ["Google Pay", "Paytm", "BHIM", "CRED", "Kotak 811"];

        const spawnNotes = () => {
          if (!stage) return;
          ["💵", "🪙", "💵", "✨"].forEach((n, i) => {
            const s = document.createElement("span");
            s.className = "note";
            s.textContent = n;
            s.style.left = 38 + Math.random() * 24 + "%";
            s.style.bottom = "16%";
            s.style.animation = `cxNoteFly ${1.4 + Math.random() * 0.8}s ease-out ${i * 0.12}s forwards`;
            stage.appendChild(s);
            setTimeout(() => s.remove(), 2600);
          });
        };

        const cycle = () => {
          const seed = seedBase + seq;
          const amt = AMTS[seq % AMTS.length];
          seq++;
          // reset
          cells.forEach((c) => c.classList.remove("on"));
          succ?.classList.remove("show");
          if (scan) scan.style.opacity = "0";
          if (status) status.textContent = "GENERATING DYNAMIC QR…";
          // assemble QR cell by cell
          const order = cells
            .map((_, i) => i)
            .sort(() => Math.sin(seed * 9301 + Math.random() * 7) - 0.5);
          order.forEach((idx, k) => {
            const c = cells[idx];
            phTimers.push(
              setTimeout(() => {
                const rnd = Math.abs(Math.sin(seed * (idx + 13) * 0.7));
                if (c.classList.contains("eye") || rnd > 0.52)
                  c.classList.add("on");
              }, 400 + k * 4)
            );
          });
          phTimers.push(
            setTimeout(() => {
              if (status) status.textContent = "WAITING FOR SCAN…";
              if (scan) {
                scan.style.opacity = "1";
                scan.animate(
                  [{ top: "4%" }, { top: "92%" }, { top: "4%" }],
                  { duration: 1800, iterations: 1, easing: "ease-in-out" }
                );
              }
            }, 1800)
          );
          phTimers.push(
            setTimeout(() => {
              if (status) status.textContent = "PAYMENT VERIFIED ✓";
              if (scan) scan.style.opacity = "0";
              if (succ) {
                if (succAmt)
                  succAmt.textContent =
                    inr(amt) + " · via " + APPSX[(seq - 1) % APPSX.length];
                succ.classList.add("show");
              }
              const comm = Math.max(5, amt * 0.007);
              earn += comm;
              if (earnEl) earnEl.textContent = inr(earn);
              if (commEl) commEl.textContent = "₹" + comm.toFixed(2);
              spawnNotes();
            }, 3900)
          );
          qrTimer = setTimeout(cycle, 6400);
        };
        cycle();

        cleanups.push(() => {
          if (qrTimer) clearTimeout(qrTimer);
          phTimers.forEach((t) => clearTimeout(t));
          phTimers = [];
        });
      }

      /* ================================================================
         3) Magnetic buttons (ported from initMagnetic)
         ================================================================ */
      if (!window.matchMedia("(pointer: coarse)").matches) {
        const handlers: [HTMLElement, (e: MouseEvent) => void, () => void][] = [];
        section.querySelectorAll<HTMLElement>(".magnetic").forEach((b) => {
          const move = (e: MouseEvent) => {
            const r = b.getBoundingClientRect();
            b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
          };
          const leave = () => (b.style.transform = "");
          b.addEventListener("mousemove", move);
          b.addEventListener("mouseleave", leave);
          handlers.push([b, move, leave]);
        });
        cleanups.push(() =>
          handlers.forEach(([b, move, leave]) => {
            b.removeEventListener("mousemove", move);
            b.removeEventListener("mouseleave", leave);
          })
        );
      }

      return () => cleanups.forEach((fn) => fn());
    },
    { scope }
  );

  return { scope };
}