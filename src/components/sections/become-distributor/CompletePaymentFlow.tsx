"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, Lock, ShieldCheck, User, Wallet, QrCode, PartyPopper } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  distributorApi,
  ApiError,
  type ExistingBookingLookup,
  type ExistingBookingSummary,
} from "@/lib/api/distributor";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useRouter } from "next/navigation";

type Step = "pincode" | "otp" | "summary" | "utr" | "done";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink/35 focus:border-brand focus:ring-[3px] focus:ring-brand/15";
const cardBaseClass =
  "rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_1px_rgba(16,24,40,0.02)]";
const backLinkClass =
  "mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink/45 transition-colors duration-200 hover:text-ink";

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
};

function formatPaise(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

export default function CompletePaymentFlow() {
    const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [step, setStep] = useState<Step>("pincode");

  // --- Pincode lookup step ---
  const [pincodeInput, setPincodeInput] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [booking, setBooking] = useState<ExistingBookingLookup | null>(null);

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput)) {
      setLookupError("Please enter a valid 6-digit PIN code.");
      return;
    }
    setLookupLoading(true);
    setLookupError("");
    try {
      const result = await distributorApi.findExistingBooking(pincodeInput);
      if (result.status === "activated") {
        setLookupError("This PIN Code is already fully activated — no payment is pending.");
        setLookupLoading(false);
        return;
      }
      setBooking(result);
      setStep("otp");
    } catch (err) {
      setLookupError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLookupLoading(false);
    }
  }

  // --- OTP step ---
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [summary, setSummary] = useState<ExistingBookingSummary | null>(null);

    // --- Distributor details (collected on summary step) ---
    const [aadhaarAddress, setAadhaarAddress] = useState("");
    const [shopName, setShopName] = useState("");
    const [shopAddress, setShopAddress] = useState("");
    const [detailsError, setDetailsError] = useState("");
  
    function handleProceedToPay() {
      if (!aadhaarAddress.trim() || !shopName.trim() || !shopAddress.trim()) {
        setDetailsError("Please fill in all fields to continue.");
        return;
      }
      setDetailsError("");
      setStep("utr");
    }

  useEffect(() => {
    if (step !== "otp" || !booking || otpSent) return;
    setOtpSent(true);
    distributorApi
      .sendExistingBookingOtp(booking.bookingId)
      .then(() => setResendCooldown(45))
      .catch((err) => {
        setOtpError(err instanceof ApiError ? err.message : "Failed to send OTP.");
      });
  }, [step, booking, otpSent]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleResendOtp() {
    if (resendCooldown > 0 || !booking) return;
    setOtpError("");
    try {
      await distributorApi.sendExistingBookingOtp(booking.bookingId);
      setResendCooldown(45);
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Failed to resend OTP.");
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (!booking) return;
    setOtpLoading(true);
    setOtpError("");
    try {
      const result = await distributorApi.verifyExistingBookingOtp(booking.bookingId, otpInput);
      setSummary(result);
      setStep("summary");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  // --- UTR step ---
  const [utrInput, setUtrInput] = useState("");
  const [utrLoading, setUtrLoading] = useState(false);
  const [utrError, setUtrError] = useState("");

  async function handleSubmitUtr(e: FormEvent) {
    e.preventDefault();
    if (!booking) return;
    setUtrLoading(true);
    setUtrError("");
    try {
      await distributorApi.submitFinalUtr(booking.bookingId, utrInput, {
        aadhaarAddress,
        shopName,
        shopAddress,
      });
      setStep("done");
    } catch (err) {
      setUtrError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setUtrLoading(false);
    }
  }

  

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/become-distributor/choose"
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
        <div className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 sm:py-16">
          <div className={cardBaseClass + " p-6 sm:p-9"}>
            <AnimatePresence mode="wait">
              {step === "pincode" && (
                <motion.form key="pincode" {...stepMotion} onSubmit={handleLookup}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                      <Search size={16} strokeWidth={2} className="text-ink" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">
                        Complete Payment for Existing PIN
                      </p>
                      <p className="text-[13px] text-ink/50">
                        Enter your PIN Code to find your booking and complete the
                        pending payment.
                      </p>
                    </div>
                  </div>

                  <label className="text-[13px] font-medium text-ink/70">PIN Code</label>
                  <input
                    required
                    value={pincodeInput}
                    onChange={(e) =>
                      setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="6-digit PIN code"
                    inputMode="numeric"
                    autoFocus
                    className={inputClass + " font-mono tracking-wide"}
                  />

                  <AnimatePresence>
                    {lookupError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 text-[13px] text-red-600"
                      >
                        {lookupError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <SubmitButton
                    type="submit"
                    loading={lookupLoading}
                    loadingText="Searching…"
                    className="mt-6"
                  >
                    Find PIN Code
                  </SubmitButton>
                </motion.form>
              )}

              {step === "otp" && booking && (
                <motion.form key="otp" {...stepMotion} onSubmit={handleVerifyOtp}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                      <ShieldCheck size={16} strokeWidth={2} className="text-ink" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">Verify your identity</p>
                      <p className="text-[13px] text-ink/50">
                        Code sent to {booking.maskedEmail} · valid 5 minutes
                      </p>
                    </div>
                  </div>

                  <input
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    autoFocus
                    className={inputClass + " mt-0 text-center font-mono text-xl tracking-[0.5em]"}
                    placeholder="——————"
                  />

                  <AnimatePresence>
                    {otpError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 text-[13px] text-red-600"
                      >
                        {otpError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <SubmitButton type="submit" loading={otpLoading} loadingText="Verifying…" className="mt-6">
                    Verify and continue
                  </SubmitButton>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                    className="mt-3 w-full text-center text-[13px] font-medium text-ink/50 transition-colors hover:text-ink disabled:text-ink/25"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                  </button>
                </motion.form>
              )}

              {step === "summary" && summary && (
                <motion.div key="summary" {...stepMotion}>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                      <User size={16} strokeWidth={2} className="text-ink" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-ink">Booking found</p>
                      <p className="text-[13px] text-ink/50">
                        PIN {summary.pincode} · Booked{" "}
                        {new Date(summary.bookingDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-surface px-4 py-3.5 text-[13px]">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-ink/55">Distributor Name</span>
                      <span className="font-medium text-ink">{summary.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-ink/55">Registered Mobile</span>
                      <span className="font-medium text-ink">{summary.mobile}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-ink/55">Registered Email</span>
                      <span className="font-medium text-ink">{summary.email}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <Wallet size={15} className="text-ink/40" />
                    <p className="text-[13px] font-semibold text-ink">
                      Payment Summary — Current Amounts
                    </p>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-lg border border-border text-[13.5px]">
                    <div className="flex items-center justify-between border-b border-border bg-surface/60 px-4 py-2.5">
                      <span className="text-ink/65">Total PIN Code Fee</span>
                      <span className="font-mono font-medium text-ink">
                        {formatPaise(summary.totalFee)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                      <span className="text-ink/65">Already Paid</span>
                      <span className="font-mono font-medium text-ink">
                        {formatPaise(summary.amountPaid)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-surface px-4 py-3">
                      <span className="font-semibold text-ink">Balance / Amount to be Paid</span>
                      <span className="font-mono font-semibold text-ink">
                        {formatPaise(summary.pendingAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <User size={15} className="text-ink/40" />
                    <p className="text-[13px] font-semibold text-ink">
                      Distributor Details
                    </p>
                  </div>

                  <label className="mt-3 block text-[13px] font-medium text-ink/70">
                    Aadhaar Address
                  </label>
                  <textarea
                    required
                    value={aadhaarAddress}
                    onChange={(e) => setAadhaarAddress(e.target.value)}
                    rows={2}
                    placeholder="Address as per Aadhaar card"
                    className={inputClass + " resize-none"}
                  />

                  <label className="mt-3 block text-[13px] font-medium text-ink/70">
                    Shop Name
                  </label>
                  <input
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Sharma General Store"
                    className={inputClass}
                  />

                  <label className="mt-3 block text-[13px] font-medium text-ink/70">
                    Shop Address
                  </label>
                  <textarea
                    required
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    rows={2}
                    placeholder="Full shop address"
                    className={inputClass + " resize-none"}
                  />

                  <AnimatePresence>
                    {detailsError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 text-[13px] text-red-600"
                      >
                        {detailsError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <SubmitButton onClick={handleProceedToPay} className="mt-6">
                    Proceed to Pay {formatPaise(summary.pendingAmount)}
                  </SubmitButton>
                </motion.div>
              )}

              {step === "utr" && summary && (
                <motion.form key="utr" {...stepMotion} onSubmit={handleSubmitUtr}>
                  <div className="text-center">
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-ink/5">
                      <QrCode size={16} strokeWidth={2} className="text-ink" />
                    </span>
                    <p className="mt-3 text-[15px] font-semibold text-ink">
                      Scan &amp; pay {formatPaise(summary.pendingAmount)}
                    </p>
                    <p className="mt-1 text-[13px] text-ink/50">
                      Scan with any UPI app to complete your remaining balance
                    </p>

                    <div className="mx-auto mt-6 w-52 overflow-hidden rounded-xl border border-border shadow-sm">
                      <div className="relative bg-white p-4">
                        <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                          Pay {formatPaise(summary.pendingAmount)}
                        </span>
                        <div className="mt-6 flex items-center justify-center">
                          <QRCodeSVG
                            value={`upi://pay?pa=MAB.037215011487460@AXISBANK&pn=Cashlo&am=${summary.pendingAmount / 100}&cu=INR&tn=Cashlo Distributor Final Payment`}
                            size={176}
                            level="M"
                          />
                        </div>
                        <p className="mt-3 text-center text-[10.5px] font-medium text-ink/50">
                          Scan with any UPI app
                        </p>
                      </div>
                    </div>

                    <p className="mx-auto mt-5 max-w-sm text-[12.5px] leading-relaxed text-ink/45">
                      After paying, your UPI app will show a transaction reference number
                      (UTR / Ref No.) — enter it below to confirm.
                    </p>
                  </div>

                  <label className="mt-6 block text-[13px] font-medium text-ink/70">
                    UTR / transaction reference number
                  </label>
                  <input
                    required
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value.trim())}
                    className={inputClass}
                    placeholder="e.g. 302518293746"
                  />

                  <AnimatePresence>
                    {utrError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 text-[13px] text-red-600"
                      >
                        {utrError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <SubmitButton type="submit" loading={utrLoading} loadingText="Submitting…" className="mt-6">
                    Submit payment reference
                  </SubmitButton>

                  <p className="mt-4 text-center text-[12px] text-ink/40">
                    Our team will verify your payment and activate your PIN Code shortly.
                  </p>
                </motion.form>
              )}

              {step === "done" && (
                <motion.div key="done" {...stepMotion} className="py-2 text-center">
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100"
                  >
                    <PartyPopper size={24} className="text-emerald-600" />
                  </motion.span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">Payment reference submitted</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink/55">
                    We&apos;ve received your payment reference and it&apos;s pending verification.
                    Your PIN Code will be activated once approved.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-6 inline-flex w-auto items-center justify-center rounded-lg border border-border px-8 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink/25 hover:bg-surface"
                  >
                    Back to home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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