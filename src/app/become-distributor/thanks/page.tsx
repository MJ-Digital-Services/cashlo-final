"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PartyPopper, Download, Mail } from "lucide-react";
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

const cardBaseClass =
  "rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_1px_rgba(16,24,40,0.02)]";
const primaryBtnClass =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-ink/85";
const secondaryBtnClass =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink/25 hover:bg-surface";

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
    <main className="min-h-screen bg-surface py-20 sm:py-28">
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-center print:hidden"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100"
          >
            <PartyPopper size={24} className="text-emerald-600" />
          </motion.span>
          <h1 className="mt-4 text-lg font-semibold text-ink">Congratulations!</h1>
          <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink/55">
            Your PIN code has been successfully reserved. This territory is now exclusively assigned to
            you — no other distributor can reserve it. Our team will contact you shortly for onboarding.
          </p>
        </motion.div>

        {receipt ? (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={
              cardBaseClass +
              " p-6 sm:p-9 print:rounded-none print:border-none print:p-0 print:shadow-none"
            }
          >
            {/* Receipt header */}
            <div className="flex items-start justify-between border-b border-border pb-6">
              <div>
                <img src="/logo/cashlo-logo.png" alt="Cashlo" className="h-7 w-auto" />
                <p className="mt-3 text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                  Payment Receipt
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-semibold text-ink">{receiptNumber}</p>
                <p className="mt-1 text-[11.5px] text-ink/45">
                  {new Date(receipt.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10.5px] font-semibold tracking-wide text-emerald-700">
                  PAID
                </span>
              </div>
            </div>

            {/* Billed to / territory */}
            <div className="grid gap-6 border-b border-border py-6 sm:grid-cols-2">
              <div>
                <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink/35">Billed to</p>
                <p className="mt-2 text-[14px] font-semibold text-ink">{receipt.name}</p>
                <p className="text-[13px] text-ink/55">{receipt.mobile}</p>
                <p className="text-[13px] text-ink/55">{receipt.email}</p>
              </div>
              <div>
                <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                  Reserved territory
                </p>
                <p className="mt-2 text-[14px] font-semibold text-ink">PIN code {receipt.pincode}</p>
                <p className="text-[13px] text-ink/55">
                  {receipt.district}, {receipt.state}
                </p>
              </div>
            </div>

            {/* Itemized amount */}
            <div className="py-6">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 text-ink/75">PIN code booking fee</td>
                    <td className="py-3 text-right font-mono text-ink/75">{formatMoney(receipt.baseAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-ink/75">GST (18%)</td>
                    <td className="py-3 text-right font-mono text-ink/75">{formatMoney(receipt.gstAmount)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-ink/10">
                    <td className="pt-4 text-[15px] font-semibold text-ink">Total paid</td>
                    <td className="pt-4 text-right font-mono text-[15px] font-semibold text-ink">
                      {formatMoney(receipt.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment metadata */}
            <div className="grid gap-2 border-t border-border pt-6 text-[11.5px] text-ink/45 sm:grid-cols-2">
              <p>
                Payment ID: <span className="font-mono text-ink/65">{receipt.paymentId}</span>
              </p>
              <p>
                Order ID: <span className="font-mono text-ink/65">{receipt.orderId}</span>
              </p>
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-border bg-surface/60 px-4 py-3.5">
              <Mail size={14} className="mt-0.5 shrink-0 text-ink/35" />
              <p className="text-[12px] leading-relaxed text-ink/55">
                A separate registration fee applies during onboarding — our team will share the details
                when they contact you.
              </p>
            </div>
            <p className="mt-4 text-center text-[11px] text-ink/35">
              This is a computer-generated receipt and does not require a signature. For any queries,
              contact support@cashlo.app.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cardBaseClass + " p-8 text-center"}
          >
            <p className="text-[13.5px] text-ink/50">
              Receipt details aren&apos;t available in this session. Please check your email for
              confirmation.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row print:hidden"
        >
          {receipt && (
            <button onClick={() => window.print()} className={primaryBtnClass}>
              <Download size={15} />
              Download receipt
            </button>
          )}
          <Link href="/" className={secondaryBtnClass}>
            Back to home
          </Link>
        </motion.div>
      </Container>
    </main>
  );
}