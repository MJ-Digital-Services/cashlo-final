"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems } from "./navData";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setExpanded(null);
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-ink backdrop-blur-md"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="text-lg font-bold text-ink">Menu</span>
          <button
            onClick={close}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          {navItems.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  onClick={close}
                  className="block rounded-xl px-4 py-3.5 text-base font-medium text-ink transition-colors hover:bg-brand/5"
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = expanded === item.label;
            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-ink transition-colors hover:bg-brand/5"
                >
                  {item.label}
                  <svg
                    width="18" height="18" viewBox="0 0 16 16" fill="none"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M8 8.94L4.53 5.47 3.47 6.53l3.12 3.12a2 2 0 0 0 2.82 0l3.12-3.12-1.06-1.06L8 8.94Z" fill="currentColor" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="space-y-1 py-1 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={close}
                        className="block rounded-lg px-4 py-2.5 text-sm text-ink/70 transition-colors hover:bg-brand/5 hover:text-brand"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* CTA pinned at bottom */}
        <div className="space-y-2 border-t border-border p-4">
          <Link
            href="/become-distributor"
            onClick={close}
            className="block rounded-full border border-border px-5 py-3.5 text-center text-base font-semibold text-ink transition-colors hover:bg-surface"
          >
            Become Distributor
          </Link>
          <Link
            href="/become-merchant"
            onClick={close}
            className="block rounded-full bg-brand px-5 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Become Merchant
          </Link>
        </div>
      </div>
    </div>
  );
}