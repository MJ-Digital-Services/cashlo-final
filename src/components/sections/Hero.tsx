import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  ShieldCheck,
  IndianRupee,
  Zap,
  Headphones,
} from "lucide-react";

const trustFeatures = [
  { icon: ShieldCheck, title: "Secure", subtitle: "& Reliable" },
  { icon: IndianRupee, title: "Higher", subtitle: "Commission" },
  { icon: Zap, title: "Instant", subtitle: "Settlements" },
  { icon: Headphones, title: "24x7", subtitle: "Support" },
];

// Swap the image path / initials for your real customer avatars.
const avatars: {
  id: string;
  label?: string;
  image?: string;
  className?: string;
}[] = [
  { id: "ak", label: "AK", className: "bg-orange-400" },
  { id: "photo-1", image: "/avatars/avatar-1.png" },
  { id: "photo-2", image: "/avatars/avatar-3.png" },
  { id: "pv", label: "PV", className: "bg-emerald-500" },
  { id: "mg", label: "MG", className: "bg-rose-300" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#F9F4F4]">
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-6 py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:px-8">
        {/* Left column */}
        <div className="relative z-10">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-xs font-semibold tracking-wider text-brand">
              INDIA&apos;S TRUSTED SHOP INCOME PLATFORM
            </span>
          </div>

          <h1 className="mb-8 text-[44px] font-extrabold leading-[1.1] text-ink sm:text-5xl lg:text-[52px]">
            Grow Your Shop.
            <br />
            Earn <span className="text-brand">More</span>. Every Day.
          </h1>

          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink/60">
            Cashlo helps shopkeepers accept digital payments, offer essential
            services, and earn higher commissions – 
            <br />
            all in one simple app.
          </p>

          {/* Trust features */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {trustFeatures.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon className="h-7 w-7 text-brand" strokeWidth={1.8} />
                <div className="text-sm leading-tight text-ink/80">
                  <div className="font-semibold text-ink">{title}</div>
                  <div className="text-ink/50">{subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-[14px] bg-brand px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#download"
              className="inline-flex items-center gap-2 rounded-[14px] border border-brand px-7 py-3.5 text-[15px] font-semibold text-brand transition-colors hover:bg-brand/5"
            >
              <Download className="h-4 w-4" />
              Download App
            </a>
          </div>

          {/* Avatars + trust line */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-3">
              {avatars.map((avatar) =>
                avatar.image ? (
                  <div
                    key={avatar.id}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#F9F4F4] bg-slate-200"
                  >
                    <Image
                      src={avatar.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    key={avatar.id}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F9F4F4] text-[11px] font-bold text-white ${avatar.className}`}
                  >
                    {avatar.label}
                  </div>
                )
              )}
            </div>
            <span className="text-sm text-ink/70">
              <strong className="font-semibold text-ink">50,000+</strong>{" "}
              shopkeepers trust Cashlo
            </span>
          </div>
        </div>

        {/* Right column – phone mockup with the blurred purple glow behind it */}
        <div className="relative flex items-center justify-center lg:-ml-6 lg:justify-center">
          <div
            className="absolute right-1/2 top-1/2 h-[560px] w-[560px] -translate-y-1/2 translate-x-1/2 rounded-full lg:right-[30%]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(126,116,219,0.5) 0%, rgba(196,191,242,0.32) 55%, rgba(249,244,244,0) 75%)",
              filter: "blur(30px)",
            }}
          />
          <div className="relative h-[640px] w-[400px] sm:h-[700px] sm:w-[440px] lg:h-[760px] lg:w-[470px]">
            <Image
              src="/phone-mockup.png"
              alt="Cashlo app shown on a phone next to a shop payment QR stand"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}