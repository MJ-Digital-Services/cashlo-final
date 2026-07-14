"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

type Receipt = {
  name: string;
  pincode: string;
  district: string;
  state: string;
  amount: number;
  paymentId: string;
  bookingId: string;
  date: string;
};

export default function BecomeDistributorThanksPage() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("cashlo_booking_receipt");
    if (raw) {
      try {
        setReceipt(JSON.parse(raw));
      } catch {
        setReceipt(null);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-surface py-20 sm:py-24">
      <Container className="mx-auto max-w-xl text-center">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 print:border-none print:shadow-none">
          <p className="text-2xl">🎉</p>
          <h1 className="mt-3 text-2xl font-bold text-ink">Congratulations!</h1>
          <p className="mt-2 text-sm text-ink/60">
            Your PIN Code has been successfully reserved. This territory is now exclusively assigned to
            you. Our team will contact you shortly for onboarding.
          </p>

          {receipt ? (
            <div className="mt-6 rounded-xl bg-bg p-5 text-left text-sm">
              <div className="flex justify-between py-1">
                <span className="text-ink/50">Name</span>
                <span className="font-medium text-ink">{receipt.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink/50">PIN Code</span>
                <span className="font-medium text-ink">{receipt.pincode}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink/50">Territory</span>
                <span className="font-medium text-ink">
                  {receipt.district}, {receipt.state}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink/50">Amount Paid</span>
                <span className="font-medium text-ink">
                  ₹{(receipt.amount / 100).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink/50">Payment ID</span>
                <span className="font-medium text-ink">{receipt.paymentId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-ink/50">Date</span>
                <span className="font-medium text-ink">
                  {new Date(receipt.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink/50">
              Receipt details aren&apos;t available in this session. Please check your email for
              confirmation.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row print:hidden">
            {receipt && (
              <button
                onClick={() => window.print()}
                className="w-full rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                Download Receipt
              </button>
            )}
            <Link
              href="/"
              className="w-full rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}