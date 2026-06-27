"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import type { NavItem } from "./navData";

export default function NavDropdown({ item, scrolled }: { item: NavItem; scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // small delay on leave so the dropdown doesn't vanish if the cursor
  // briefly leaves the gap between label and panel
  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 120);
  };

  // Plain link, no dropdown
  if (!item.children) {
    return (
      <Link
        href={item.href ?? "#"}
        className="px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
      >
        {item.label}
      </Link>
    );
  }

  // Dropdown item
  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
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

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 top-full pt-2 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="min-w-[230px] rounded-2xl border border-black/5 bg-white p-2 shadow-xl shadow-black/5">
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.href}
              className="block rounded-xl px-4 py-2.5 text-sm text-ink/70 transition-colors hover:bg-brand/5 hover:text-brand"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}