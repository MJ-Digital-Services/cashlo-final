"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/toc";

// Weight/size step down per heading level so h1 reads as clearly "more
// important" than h2, h2 more than h3, etc. — matches the indent step so
// depth is legible both by position and by type weight.
const LEVEL_STYLE: Record<number, string> = {
  1: "text-[13px] font-bold",
  2: "text-[13px] font-semibold",
  3: "text-xs font-medium",
  4: "text-xs font-normal",
};

export default function BlogTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    headingEls.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const minLevel = Math.min(...items.map((i) => i.level));

  return (
    <nav className="rounded-2xl border border-border bg-card p-5">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink/40">On This Page</span>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - minLevel) * 14}px` }}>
            <a
              href={`#${item.id}`}
              className={`block leading-snug transition-colors duration-150 ${LEVEL_STYLE[item.level] ?? LEVEL_STYLE[4]} ${
                activeId === item.id ? "text-brand" : "text-ink/60 hover:text-brand"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
