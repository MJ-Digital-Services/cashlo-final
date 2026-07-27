import Link from 'next/link';
import { CheckCircle2, Download, Headset, PhoneCall } from 'lucide-react';
import { GlassCard } from '@/components/sections/become-merchant/shared/GlassCard';
import { Button } from '@/components/sections/become-merchant/shared/Button';

export const metadata = {
  title: 'Registration received — Cashlo',
  description: 'Your Cashlo merchant registration has been received.',
};

export default function BecomeMerchantSuccessPage() {
  return (
    <main className="relative flex min-h-[80vh] items-center bg-white px-5 py-16 sm:px-8 dark:bg-[#0B1020]">
      <div className="mx-auto w-full max-w-xl">
        <GlassCard hover={false} className="p-8 text-center sm:p-12">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#12B76A]/12 text-[#12B76A]">
            <CheckCircle2 className="h-9 w-9" strokeWidth={2.2} aria-hidden />
          </span>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl dark:text-white">
            You&apos;re on the list!
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Thanks for registering your shop with Cashlo. Our team will call you within 48 hours
            to complete your KYC and get your merchant account activated.
          </p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 dark:border-white/10 dark:bg-white/[0.04]">
              <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-[#3F5EF7]" aria-hidden />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Keep your phone reachable — our team calls from a verified Cashlo number.
              </span>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 dark:border-white/10 dark:bg-white/[0.04]">
              <Headset className="mt-0.5 h-4 w-4 shrink-0 text-[#3F5EF7]" aria-hidden />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Have your Aadhaar, PAN and a shop photo ready for a faster KYC.
              </span>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://play.google.com/store"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B1020] px-6 text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download the app
            </a>
            <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-[15px] font-semibold text-[#0B1020] transition-colors duration-200 hover:border-[#3F5EF7]/40 hover:text-[#3F5EF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5EF7] focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
            >
            Back to home
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            Questions in the meantime? Call{' '}
            <a href="tel:1800000000" className="font-semibold text-[#3F5EF7] hover:underline">
              1800-000-000
            </a>
            .
          </p>
        </GlassCard>
      </div>
    </main>
  );
}