import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "UPI CashPoint", href: "/upi-cashpoint" },
  // { label: "Services", href: "/services" },
  { label: "Become Merchant", href: "/become-merchant" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const social = [
  { label: "Facebook", href: null },
  { label: "Instagram", href: "https://www.instagram.com/cashlo.app/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cashlo/about/" },
  { label: "YouTube", href: null },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface pt-16">
      <Container>
        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* color logo in light, white logo in dark */}
            <Image
              src="/logo/cashlo-logo.png"
              alt="Cashlo"
              width={140}
              height={40}
              className="h-9 w-auto object-contain dark:hidden"
            />
            <Image
              src="/logo/cashlo-logo-white.png"
              alt="Cashlo"
              width={140}
              height={40}
              className="hidden h-9 w-auto object-contain dark:block"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
              India&apos;s trusted UPI CashPoint network — helping local
              merchants turn their shops into cash points for Tier 2 &amp; Tier 3
              India.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Quick Links</h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink/60 transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-ink">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/60">
              <li>support@cashlo.in</li>
              <li>sales@cashlo.in</li>
              <li>+91-XXXXXXXXXX</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              {social.map((s) =>
                s.href ? (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink/60 transition-colors hover:text-brand"
                  >
                    {s.label}
                  </Link>
                ) : (
                  <span
                    key={s.label}
                    aria-disabled="true"
                    className="cursor-not-allowed text-sm text-ink/30"
                  >
                    {s.label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <p className="text-xs leading-relaxed text-ink/45">
            Copyright © {new Date().getFullYear()} Cashlo. All Rights Reserved.
            Transaction availability, limits and eligibility are subject to
            banking partner policies and applicable regulations.
          </p>
        </div>
      </Container>
    </footer>
  );
}