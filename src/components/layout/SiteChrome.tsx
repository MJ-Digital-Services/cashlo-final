"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Wraps globally-rendered chrome (Navbar / Footer) and hides it on
 * "focus mode" routes like the payment checkout, Stripe-style.
 * Add any future chromeless routes to this list.
 */
const CHROMELESS_PREFIXES = ["/become-distributor/reserve"];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hidden = CHROMELESS_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (hidden) return null;
  return <>{children}</>;
}