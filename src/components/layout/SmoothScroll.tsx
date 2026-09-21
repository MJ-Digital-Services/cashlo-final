"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Must live *inside* <ReactLenis root>, driven by useLenis() rather than a
// ref: ReactLenis creates its Lenis instance inside its own effect and only
// exposes it via a state update on a later render, so reading
// ref.current?.lenis synchronously in a sibling effect (as this used to do)
// captures `undefined` on the very first run and the Lenis->ScrollTrigger
// scroll sync below silently never attaches. useLenis() re-fires once the
// instance is actually ready, so this can't race.
function LenisScrollTriggerBridge() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    // Drive Lenis from GSAP's ticker so scroll + animations share one clock
    function update(time: number) {
      lenis!.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with Lenis scrolling
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;

    // Re-measure on every route change, not just the first page load.
    // SmoothScroll is mounted once in the root layout and never remounts
    // across client-side navigations, so without this, every page after the
    // first keeps whatever pin/scrub start-end positions ScrollTrigger
    // computed at first mount — stale as soon as that page's own images
    // (several sections use next/image `fill`) finish loading late and
    // shift layout. That staleness is what makes a pinned/scrubbed section
    // (ServiceStack, HowItWorks) stop making visual progress partway
    // through — it reads as "scroll stuck," and only a hard refresh forces
    // a clean re-measure.
    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(refresh);
    const t = setTimeout(refresh, 500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [lenis, pathname]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1, smoothWheel: true }}>
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
