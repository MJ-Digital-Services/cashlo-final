"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

type PendingBooking = {
  name: string;
  pincode: string;
  district: string;
  state: string;
  bookingId: string;
};

export default function BecomeDistributorPendingPage() {
  const [booking, setBooking] = useState<PendingBooking | null>(null);

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

  return (
    <main className="min-h-screen bg-surface py-20 sm:py-24">
      <Container className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-2xl">📞</p>
          <h1 className="mt-3 text-2xl font-bold text-ink">Thanks{booking ? `, ${booking.name}` : ""}!</h1>
          <p className="mt-2 text-sm text-ink/60">
            {booking ? (
              <>
                We&apos;ve received your request for PIN Code{" "}
                <span className="font-semibold text-ink">{booking.pincode}</span> ({booking.district},{" "}
                {booking.state}).
              </>
            ) : (
              "We've received your PIN Code reservation request."
            )}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-sm text-ink/70">
          Our sales team will call you shortly to complete the ₹1,180 Booking Fee payment and confirm your
          territory. Please keep your phone reachable.
        </p>
        <p className="mt-3 text-xs text-ink/50">
          A separate Registration Fee applies later, during onboarding.
        </p>
          {booking && (
            <p className="mt-4 text-xs text-ink/40">
              Reference ID: <span className="font-medium text-ink/60">{booking.bookingId}</span>
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-center print:hidden">
          <Link
            href="/"
            className="w-full max-w-xs rounded-full border border-border px-7 py-3.5 text-center text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand sm:w-auto"
          >
            Back to Home
          </Link>
        </div>
      </Container>
    </main>
  );
}