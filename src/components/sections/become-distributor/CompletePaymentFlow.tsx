"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Search, Lock, ShieldCheck, User, Wallet, QrCode, PartyPopper, Upload, X } from "lucide-react";
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

// Must match the backend's uploadImage multer limit (src/middlewares/upload.js)
const MAX_AADHAAR_IMAGE_BYTES = 5 * 1024 * 1024;

// Mirrors ReserveCheckout's cashlo_reserve_progress pattern (see that file)
// so a refresh mid-flow resumes instead of dropping back to square one.
const STORAGE_KEY = "cashlo_complete_payment_progress";

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
    const [panCard, setPanCard] = useState("");
    const [aadhaarAddress, setAadhaarAddress] = useState("");
    const [shopName, setShopName] = useState("");
    const [shopAddress, setShopAddress] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [detailsError, setDetailsError] = useState("");

    // --- Aadhaar front/back upload (collected on summary step) ---
    const [aadhaarFrontUrl, setAadhaarFrontUrl] = useState("");
    const [aadhaarBackUrl, setAadhaarBackUrl] = useState("");
    const [aadhaarFrontUploading, setAadhaarFrontUploading] = useState(false);
    const [aadhaarBackUploading, setAadhaarBackUploading] = useState(false);
    const [aadhaarError, setAadhaarError] = useState("");
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    async function handleAadhaarUpload(side: "front" | "back", file: File | null) {
      if (!file || !booking) return;
      setAadhaarError("");
      if (file.size > MAX_AADHAAR_IMAGE_BYTES) {
        setAadhaarError(
          `Aadhaar ${side} image is too large (max ${MAX_AADHAAR_IMAGE_BYTES / (1024 * 1024)}MB). Please choose a smaller file.`
        );
        return;
      }
      const setUploading = side === "front" ? setAadhaarFrontUploading : setAadhaarBackUploading;
      const setUrl = side === "front" ? setAadhaarFrontUrl : setAadhaarBackUrl;
      setUploading(true);
      try {
        const result = await distributorApi.uploadAadhaarImage(booking.bookingId, side, file);
        setUrl(result.url);
      } catch (err) {
        setAadhaarError(
          err instanceof ApiError ? err.message : `Failed to upload Aadhaar ${side} image.`
        );
      } finally {
        setUploading(false);
      }
    }

    function handleProceedToPay() {
      if (!panCard.trim() || !aadhaarAddress.trim() || !shopName.trim() || !shopAddress.trim()) {
        setDetailsError("Please fill in all fields to continue.");
        return;
      }
      const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!PAN_REGEX.test(panCard.trim())) {
        setDetailsError("Please enter a valid PAN card number (e.g. ABCDE1234F).");
        return;
      }
      if (!aadhaarFrontUrl || !aadhaarBackUrl) {
        setDetailsError("Please upload both the front and back images of your Aadhaar card.");
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
        panCard,
        aadhaarAddress,
        shopName,
        shopAddress,
        referralCode,
      });
      clearProgress();
      setStep("done");
    } catch (err) {
      setUtrError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setUtrLoading(false);
    }
  }

  /* ---------------- persistence & resume-on-refresh ---------------- */

  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as {
          step?: Step;
          booking?: ExistingBookingLookup | null;
          summary?: ExistingBookingSummary | null;
          panCard?: string;
          aadhaarAddress?: string;
          shopName?: string;
          shopAddress?: string;
          referralCode?: string;
          aadhaarFrontUrl?: string;
          aadhaarBackUrl?: string;
        };
        if (s.booking) setBooking(s.booking);
        if (s.summary) setSummary(s.summary);
        if (s.panCard) setPanCard(s.panCard);
        if (s.aadhaarAddress) setAadhaarAddress(s.aadhaarAddress);
        if (s.shopName) setShopName(s.shopName);
        if (s.shopAddress) setShopAddress(s.shopAddress);
        if (s.referralCode) setReferralCode(s.referralCode);
        if (s.aadhaarFrontUrl) setAadhaarFrontUrl(s.aadhaarFrontUrl);
        if (s.aadhaarBackUrl) setAadhaarBackUrl(s.aadhaarBackUrl);
        // "done" is a one-time confirmation screen, not a resumable state —
        // land back on summary/utr instead so nothing looks half-submitted.
        if (s.step && s.step !== "done") setStep(s.step);
      }
    } catch {
      /* corrupted state — start fresh */
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || step === "done") return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          booking,
          summary,
          panCard,
          aadhaarAddress,
          shopName,
          shopAddress,
          referralCode,
          aadhaarFrontUrl,
          aadhaarBackUrl,
        })
      );
    } catch {
      /* storage unavailable — flow still works, just won't survive refresh */
    }
  }, [
    step,
    booking,
    summary,
    panCard,
    aadhaarAddress,
    shopName,
    shopAddress,
    referralCode,
    aadhaarFrontUrl,
    aadhaarBackUrl,
  ]);

  const clearProgress = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);


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
                    PAN Card Number
                  </label>
                  <input
                    required
                    value={panCard}
                    onChange={(e) => setPanCard(e.target.value.toUpperCase().slice(0, 10))}
                    placeholder="e.g. ABCDE1234F"
                    className={inputClass + " font-mono tracking-wide uppercase"}
                  />

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

                  <label className="mt-3 block text-[13px] font-medium text-ink/70">
                    Aadhaar Card Images
                  </label>
                  <div className="mt-1.5 grid grid-cols-2 gap-3">
                    {(["front", "back"] as const).map((side) => {
                      const url = side === "front" ? aadhaarFrontUrl : aadhaarBackUrl;
                      const uploading = side === "front" ? aadhaarFrontUploading : aadhaarBackUploading;
                      return (
                        <div key={side}>
                          <input
                            id={`aadhaar-${side}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleAadhaarUpload(side, e.target.files?.[0] ?? null)}
                          />
                          {url ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImageUrl(url)}
                              className="group relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-border"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={url}
                                alt={`Aadhaar ${side}`}
                                className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                              />
                              <label
                                htmlFor={`aadhaar-${side}`}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-2 py-1 text-[10.5px] font-medium text-white backdrop-blur-sm hover:bg-black/75"
                              >
                                Replace
                              </label>
                            </button>
                          ) : (
                            <label
                              htmlFor={`aadhaar-${side}`}
                              className="flex aspect-[16/10] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-surface/60 text-ink/45 transition-colors hover:border-brand/40 hover:text-ink/65"
                            >
                              {uploading ? (
                                <span className="text-[12px]">Uploading…</span>
                              ) : (
                                <>
                                  <Upload size={16} strokeWidth={2} />
                                  <span className="text-[12px] font-medium capitalize">
                                    {side} side
                                  </span>
                                </>
                              )}
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {aadhaarError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 text-[13px] text-red-600"
                      >
                        {aadhaarError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <label className="mt-3 block text-[13px] font-medium text-ink/70">
                    Referral Code <span className="text-ink/35 font-normal">(optional)</span>
                  </label>
                  <input
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="If someone referred you"
                    className={inputClass}
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

      <AnimatePresence>
        {previewImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setPreviewImageUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[85vh] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImageUrl}
                alt="Aadhaar preview"
                className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}