"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Check,
  Copy,
  PhoneCall,
  MailCheck,
  ShieldCheck,
  MapPin,
  LifeBuoy,
} from "lucide-react";
import Container from "@/components/ui/Container";

type PendingBooking = {
  name: string;
  pincode: string;
  district: string;
  state: string;
  bookingId: string;
  paymentMode?: "manual" | "qr_self";
};

const cardBaseClass =
  "rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_1px_rgba(16,24,40,0.02)]";
const secondaryBtnClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink/25 hover:bg-surface";

const ease = [0.16, 1, 0.3, 1] as const;

function titleCase(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/* ---- What-happens-next timeline ---- */

type TimelineItem = {
  title: string;
  detail: string;
  state: "done" | "active" | "upcoming";
};

function buildTimeline(mode?: "manual" | "qr_self"): TimelineItem[] {
  if (mode === "qr_self") {
    return [
      {
        title: "Payment reference received",
        detail: "Your UTR has been submitted successfully.",
        state: "done",
      },
      {
        title: "Our team verifies your payment",
        detail: "We match your UTR against our bank records — usually done within a few hours.",
        state: "active",
      },
      {
        title: "Reservation confirmed by email",
        detail: "You'll get a confirmation email, then our team contacts you for onboarding.",
        state: "upcoming",
      },
    ];
  }
  return [
    {
      title: "Reservation request received",
      detail: "Your details and territory choice are with our sales team.",
      state: "done",
    },
    {
      title: "Our team calls you",
      detail: "We'll call shortly to complete the ₹1,180 booking fee — keep your phone reachable.",
      state: "active",
    },
    {
      title: "Territory confirmed",
      detail: "Once paid, the PIN code is locked to you and onboarding begins.",
      state: "upcoming",
    },
  ];
}

function TimelineRow({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
  return (
    <div className="relative flex gap-4 pb-7 last:pb-0">
      {/* connecting line */}
      {!isLast && (
        <span
          className="absolute left-[13px] top-8 bottom-0 w-px bg-border"
          aria-hidden="true"
        />
      )}

      {/* node */}
      <span className="relative z-10 mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center">
        {item.state === "done" && (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={14} strokeWidth={3.5} />
          </span>
        )}
        {item.state === "active" && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-amber-400/40"
              animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              aria-hidden="true"
            />
            <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/40">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </span>
          </>
        )}
        {item.state === "upcoming" && (
          <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-border bg-bg">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
          </span>
        )}
      </span>

      <div className="min-w-0 pt-0.5">
        <p
          className={`text-[14px] font-semibold ${
            item.state === "upcoming" ? "text-ink/40" : "text-ink"
          }`}
        >
          {item.title}
        </p>
        <p
          className={`mt-0.5 text-[13px] leading-relaxed ${
            item.state === "upcoming" ? "text-ink/30" : "text-ink/55"
          }`}
        >
          {item.detail}
        </p>
        {item.state === "active" && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            <Clock size={11} />
            In progress
          </span>
        )}
      </div>
    </div>
  );
}

/* ---- Page ---- */

export default function BecomeDistributorPendingPage() {
  const [booking, setBooking] = useState<PendingBooking | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("cashlo_pending_booking");
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch {
        setBooking(null);
      }
    }
  }, []);

  async function copyReference() {
    if (!booking) return;
    try {
      await navigator.clipboard.writeText(booking.bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the ID is still visible to select manually */
    }
  }

  const isQr = booking?.paymentMode === "qr_self";
  const timeline = buildTimeline(booking?.paymentMode);

  return (
    <main className="min-h-screen bg-surface pt-32 pb-20 sm:pt-36 sm:pb-24">
      <Container className="mx-auto max-w-2xl">
        {/* ---- Hero: animated status ---- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="text-center"
        >
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full bg-amber-400/30"
              animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              aria-hidden="true"
            />
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50"
            >
              {isQr ? (
                <ShieldCheck size={26} className="text-amber-600 dark:text-amber-400" />
              ) : (
                <PhoneCall size={26} className="text-amber-600 dark:text-amber-400" />
              )}
            </motion.span>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {booking ? `Almost there, ${titleCase(booking.name)}!` : "Almost there!"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink/55">
            {isQr
              ? "Your payment reference is in — we're verifying it now. Nothing else to do on your side."
              : "Your reservation request is in. Our team will call you shortly to complete it."}
          </p>
        </motion.div>

        {/* ---- Booking summary ---- */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease }}
          className={cardBaseClass + " mt-8 p-6 sm:p-7"}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                <MapPin size={11} />
                Requested territory
              </p>
              {booking ? (
                <>
                  <p className="mt-1.5 text-[20px] font-bold tracking-tight text-ink">
                    PIN {booking.pincode}
                  </p>
                  <p className="text-[13px] text-ink/55">
                    {booking.district}, {booking.state}
                  </p>
                </>
              ) : (
                <p className="mt-1.5 text-[13.5px] text-ink/50">
                  Details aren&apos;t available in this session — check your email for confirmation.
                </p>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              <Clock size={11} />
              {isQr ? "VERIFYING PAYMENT" : "AWAITING OUR CALL"}
            </span>
          </div>

          {booking && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface/60 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                  Reference ID
                </p>
                <p className="truncate font-mono text-[13px] text-ink/70">{booking.bookingId}</p>
              </div>
              <button
                type="button"
                onClick={copyReference}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-2 text-[12px] font-medium text-ink/70 transition-all duration-200 hover:border-ink/25 hover:text-ink"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>

        {/* ---- What happens next ---- */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22, ease }}
          className={cardBaseClass + " mt-4 p-6 sm:p-7"}
        >
          <p className="mb-6 text-[15px] font-semibold text-ink">What happens next</p>
          {timeline.map((item, i) => (
            <TimelineRow key={item.title} item={item} isLast={i === timeline.length - 1} />
          ))}

          <div className="mt-7 flex items-start gap-2.5 rounded-lg border border-border bg-surface/60 px-4 py-3.5">
            <MailCheck size={14} className="mt-0.5 shrink-0 text-ink/35" />
            <p className="text-[12px] leading-relaxed text-ink/55">
              {isQr
                ? "Keep your payment screenshot handy in case our team needs it. "
                : "The call will come from our official Cashlo team. "}
              A separate registration fee applies later, during onboarding — we&apos;ll share the
              details then.
            </p>
          </div>
        </motion.div>

        {/* ---- Actions + support ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-8 text-center"
        >
          <Link href="/" className={secondaryBtnClass + " w-full sm:w-auto sm:px-10"}>
            Back to home
          </Link>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-ink/40">
            <LifeBuoy size={13} />
            Questions about your booking? Email{" "}
            <a
              href="mailto:support@cashlo.app"
              className="font-medium text-ink/60 transition-colors hover:text-ink"
            >
              support@cashlo.app
            </a>
          </p>
        </motion.div>
      </Container>
    </main>
  );
}