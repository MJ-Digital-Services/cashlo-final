"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Wallet, Lock } from "lucide-react";

const cardBaseClass =
  "rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_1px_rgba(16,24,40,0.02)]";

export default function DistributorChooseFlow() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/become-distributor"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink/55 transition-colors duration-200 hover:text-ink"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/logo/cashlo-logo.png"
              alt="Cashlo"
              width={120}
              height={34}
              priority
              className="h-7 w-auto object-contain dark:hidden"
            />
            <Image
              src="/logo/cashlo-logo-white1.png"
              alt="Cashlo"
              width={120}
              height={34}
              priority
              className="hidden h-7 w-auto object-contain dark:block"
            />
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink/45">
            <Lock size={13} />
            Secure
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-brand">
              Become a Distributor
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              How would you like to proceed?
            </h1>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Link
              href="/become-distributor/reserve"
              className={cardBaseClass + " group block p-7 transition-all duration-200 hover:border-brand/40 hover:shadow-md"}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
                <MapPin size={20} strokeWidth={2} className="text-brand" />
              </span>
              <p className="mt-5 text-[16px] font-semibold text-ink">
                Book a New PIN Code
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">
                For new distributors. Check availability and reserve your territory.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand">
                Get started
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </Link>

            <Link
              href="/become-distributor/complete-payment"
              className={cardBaseClass + " group block p-7 transition-all duration-200 hover:border-brand/40 hover:shadow-md"}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
                <Wallet size={20} strokeWidth={2} className="text-brand" />
              </span>
              <p className="mt-5 text-[16px] font-semibold text-ink">
                Complete Payment for Existing PIN
              </p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/55">
                Already booked your PIN Code? Complete your pending payment and
                activate it.
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand">
                Continue
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-bg py-5">
        <p className="text-center text-[11.5px] text-ink/40">
          © {new Date().getFullYear()} Cashlo · Need help?{" "}
          <a href="mailto:support@cashlo.app" className="font-medium text-ink/55 transition-colors hover:text-ink">
            support@cashlo.app
          </a>
        </p>
      </footer>
    </div>
  );
}