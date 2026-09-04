import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import FooterAssociations from "@/components/footer/FooterAssociations";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "UPI CashPoint", href: "/upi-cashpoint" },
  { label: "Become Merchant", href: "/become-merchant" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Refund & Dispute Policy", href: "/refund-policy" },
  { label: "Grievance Redressal", href: "/grievance-redressal" },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
      <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

const social = [
  { label: "Facebook", href: "https://www.facebook.com/share/1SopJkAMwQ/?mibextid=wwXIfr" },
  { label: "Instagram", href: "https://www.instagram.com/cashlo.app/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cashlo/about/" },
  { label: "YouTube", href: null as string | null },
];

export default function Footer() {
  return (
    <footer className="footer-dot-grid relative overflow-hidden border-t border-border bg-surface pt-16 text-ink dark:bg-[#09090B]">
      {/* Top hairline glow — brand-colored, echoes MJ's red glowline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-brand) 50%, transparent 100%)",
          boxShadow: "0 0 16px color-mix(in srgb, var(--color-brand) 55%, transparent)",
        }}
      />

      <Container>
        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
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
            <p className="mt-2 text-base font-bold text-ink/80">
              MJ Digital Services
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/60">
              India&apos;s trusted UPI CashPoint network — helping local
              merchants turn their shops into cash points for Tier 2 &amp; Tier 3
              India.
            </p>

            {/* Certifications & Associations */}
            <div className="mt-6">
              <FooterAssociations />
            </div>

            <div className="mt-6 flex gap-2.5">
              {social.map((s) =>
                s.href ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card
                               text-ink/50 transition-all duration-200 hover:border-brand hover:bg-brand/10 hover:text-brand hover:-translate-y-0.5"
                  >
                    {SOCIAL_ICONS[s.label]}
                  </a>
                ) : (
                  <span
                    key={s.label}
                    aria-disabled="true"
                    title={`${s.label} — coming soon`}
                    className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl border border-border bg-card text-ink/20"
                  >
                    {SOCIAL_ICONS[s.label]}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink/70">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="footer-nav-link inline-block text-sm text-ink/60 transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink/70">
              Legal
            </h4>
            <ul className="mt-5 space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="footer-nav-link inline-block text-sm text-ink/60 transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink/70">
              Contact
            </h4>
            <ul className="mt-5 space-y-2.5 text-sm text-ink/60">
              <li>support@cashlo.app</li>
              <li>sales@cashlo.app</li>
              <li>+91-9220448607</li>
            </ul>
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

      {/* Giant wordmark strip */}
      <div className="relative h-20 overflow-hidden sm:h-28 md:h-36" aria-hidden="true">
        <p className="absolute inset-x-0 top-0 select-none text-center text-[18vw] font-extrabold leading-none tracking-tight text-brand/8 sm:text-[15vw]">
          CASHLO
        </p>
      </div>
    </footer>
  );
}