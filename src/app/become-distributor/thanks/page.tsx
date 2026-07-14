"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

type Receipt = {
  name: string;
  mobile: string;
  email: string;
  pincode: string;
  district: string;
  state: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  paymentId: string;
  orderId: string;
  bookingId: string;
  date: string;
};

function formatMoney(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

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

  const receiptNumber = receipt ? `CSH-${receipt.bookingId.slice(-8).toUpperCase()}` : "";

  return (
    <main className="min-h-screen bg-surface py-20 sm:py-24">
      {/* Hides the site's fixed navbar/footer (rendered globally in the root
          layout, outside this page's control) specifically when printing —
          without this, the print/PDF output included the whole site chrome. */}
      <style>{`
        @media print {
          header, footer, nav { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      <Container className="mx-auto max-w-2xl">
        {/* Confirmation banner — screen only */}
        <div className="mb-8 text-center print:hidden">
          <p className="text-2xl">🎉</p>
          <h1 className="mt-3 text-2xl font-bold text-ink">Congratulations!</h1>
          <p className="mt-2 text-sm text-ink/60">
            Your PIN Code has been successfully reserved. Our team will contact you shortly for
            onboarding.
          </p>
        </div>

        {receipt ? (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 print:rounded-none print:border-none print:p-0 print:shadow-none">
            {/* Receipt header */}
            <div className="flex items-start justify-between border-b border-border pb-6">
              <div>
                <img src="/logo/cashlo-logo.png" alt="Cashlo" className="h-8 w-auto" />
                <p className="mt-3 text-xs uppercase tracking-wider text-ink/40">Payment Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{receiptNumber}</p>
                <p className="mt-1 text-xs text-ink/50">
                  {new Date(receipt.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <span className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  PAID
                </span>
              </div>
            </div>

            {/* Billed to / territory */}
            <div className="grid gap-6 border-b border-border py-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/40">Billed To</p>
                <p className="mt-2 text-sm font-semibold text-ink">{receipt.name}</p>
                <p className="text-sm text-ink/60">{receipt.mobile}</p>
                <p className="text-sm text-ink/60">{receipt.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/40">Reserved Territory</p>
                <p className="mt-2 text-sm font-semibold text-ink">PIN Code {receipt.pincode}</p>
                <p className="text-sm text-ink/60">
                  {receipt.district}, {receipt.state}
                </p>
              </div>
            </div>

            {/* Itemized amount */}
            <div className="py-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink/40">
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 text-ink/80">PIN Code Reservation Fee</td>
                    <td className="py-3 text-right text-ink/80">{formatMoney(receipt.baseAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-ink/80">GST (18%)</td>
                    <td className="py-3 text-right text-ink/80">{formatMoney(receipt.gstAmount)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-ink/10">
                    <td className="pt-4 text-base font-bold text-ink">Total Paid</td>
                    <td className="pt-4 text-right text-base font-bold text-ink">
                      {formatMoney(receipt.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment metadata */}
            <div className="grid gap-3 border-t border-border pt-6 text-xs text-ink/50 sm:grid-cols-2">
              <p>
                Payment ID: <span className="font-medium text-ink/70">{receipt.paymentId}</span>
              </p>
              <p>
                Order ID: <span className="font-medium text-ink/70">{receipt.orderId}</span>
              </p>
            </div>

            <p className="mt-6 border-t border-border pt-6 text-center text-xs text-ink/40">
              This is a computer-generated receipt and does not require a signature. For any queries,
              contact support@cashlo.in.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-ink/50">
            Receipt details aren&apos;t available in this session. Please check your email for
            confirmation.
          </div>
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
            className="w-full rounded-full border border-border px-7 py-3.5 text-center text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Back to Home
          </Link>
        </div>
      </Container>
    </main>
  );
}