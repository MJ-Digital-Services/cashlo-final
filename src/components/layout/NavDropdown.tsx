"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import type { NavItem } from "./navData";

export default function NavDropdown({
  item,
  onHero,
}: {
  item: NavItem;
  onHero: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 120);
  };

  const label = onHero
    ? "text-[#070b1e]/75 hover:text-[#070b1e]"
    : "text-ink/80 hover:text-ink";

  if (!item.children) {
    return (
      <Link
        href={item.href ?? "#"}
        className={`px-4 py-2 text-sm font-medium transition-colors ${label}`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${label}`}
        aria-expanded={open}
      >
        {item.label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M8 8.94L4.53 5.47 3.47 6.53l3.12 3.12a2 2 0 0 0 2.82 0l3.12-3.12-1.06-1.06L8 8.94Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div
        className={`absolute left-0 top-full pt-2 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="min-w-[340px] rounded-2xl border border-border bg-card p-3 shadow-xl shadow-black/5">
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-base text-ink/70 transition-colors hover:bg-brand/5 hover:text-brand"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full">
                <Image
                  src={child.icon}
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </span>
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}