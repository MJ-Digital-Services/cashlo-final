"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navItems } from "./navData";
import NavDropdown from "./NavDropdown";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // color logo only when the bar is solid-white (scrolled + light); else white logo
  const useColorLogo = scrolled && theme === "light";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={
              useColorLogo
                ? "/logo/cashlo-logo.png"
                : "/logo/cashlo-logo-white.png"
            }
            alt="Cashlo"
            width={140}
            height={40}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Center nav */}
        <div
          className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 shadow-sm backdrop-blur-md transition-colors lg:flex ${
            scrolled
              ? "border-border bg-bg/70"
              : "border-white/20 bg-white/10"
          }`}
        >
          {navItems.map((item) => (
            <NavDropdown key={item.label} item={item} scrolled={scrolled} />
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeToggle onHero={!scrolled} />
          <Link
            href="/become-distributor"
            className={`hidden rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors lg:block ${
              scrolled
                ? "border-border text-ink hover:bg-surface"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
          >
            Become Distributor
          </Link>
          <Link
            href="/become-merchant"
            className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark lg:block"
          >
            Become Merchant
          </Link>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}