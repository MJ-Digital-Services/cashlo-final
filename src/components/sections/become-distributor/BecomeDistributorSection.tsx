"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import Script from "next/script";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Lock, ArrowRight, ShieldCheck, PartyPopper, QrCode, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  distributorApi,
  ApiError,
  type PincodeCheckResult,
  type Consents,
  type CreateOrderResult,
  type NearbyPincodeSuggestion,
} from "@/lib/api/distributor";
import { PaymentSuccessAnimation } from "./PaymentSuccessAnimation";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

type Step = "pincode" | "form" | "otp" | "payment" | "qr" | "success";

// ---- Stripe/Linear-flavoured shared styles ----
const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink/35 focus:border-brand focus:ring-[3px] focus:ring-brand/15";
const primaryBtnClass =
  "group inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-ink/85 disabled:opacity-50 disabled:hover:bg-ink";
const secondaryBtnClass =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink/25 hover:bg-surface";
const cardBaseClass =
  "rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_1px_rgba(16,24,40,0.02)] p-6 sm:p-9";

const CONSENT_ITEMS: { key: keyof Consents; label: string }[] = [
  {
    key: "nonRefundable",
    label: "I understand that the \u20b91,180 Booking Fee is non-refundable.",
  },
  { key: "kyc", label: "I agree to complete KYC whenever required." },
  { key: "genuineMerchants", label: "I agree to onboard only genuine merchants/business owners." },
  {
    key: "terms",
    label: "I agree to follow Cashlo's distributor policies and guidelines.",
  },
  {
    key: "policyViolation",
    label: "I understand that policy violations may result in suspension or termination.",
  },
];

// Drives the progress rail. Payment/QR/success all count as "step 4".
const RAIL_STEPS = ["Territory", "Details", "Verify", "Confirm"];
const RAIL_STEP: Record<Step, number> = {
  pincode: 1,
  form: 2,
  otp: 2,
  payment: 3,
  qr: 3,
  success: 4,
};

// Shared step-transition motion — quiet crossfade + tiny rise, Stripe/Linear-style
// (no bounce, no scale — just an ease-out fade so it reads as "settling in").
const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
};

export default function BecomeDistributorSection() {
  const scope = useScrollReveal();
  const router = useRouter();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [step, setStep] = useState<Step>("pincode");

  // --- Pincode step ---
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeResult, setPincodeResult] = useState<PincodeCheckResult | null>(null);
  const pincodeInputRef = useRef<HTMLInputElement>(null);
  const pincodeConfettiRef = useRef<HTMLDivElement>(null);
  const pinIconRef = useRef<SVGSVGElement>(null);
  const lockIconRef = useRef<SVGSVGElement>(null);

  // --- Form step ---
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    referralCode: "",
  });
  const [consents, setConsents] = useState<Consents>({
    nonRefundable: false,
    terms: false,
    kyc: false,
    genuineMerchants: false,
    policyViolation: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // --- OTP step ---
  const [bookingId, setBookingId] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // --- Nearby Pincode ---
  const [nearbySuggestions, setNearbySuggestions] = useState<NearbyPincodeSuggestion[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  // --- Payment step ---
  const [paymentError, setPaymentError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"preparing" | "waiting" | "dismissed" | "verifying" | "success">(
    "preparing"
  );

  // --- QR self-payment step ---
  const [utrInput, setUtrInput] = useState("");
  const [utrLoading, setUtrLoading] = useState(false);
  const [utrError, setUtrError] = useState("");

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const input = pincodeInputRef.current;

      if (pincodeLoading) {
        if (prefersReducedMotion) return;
        if (pinIconRef.current) {
          gsap.to(pinIconRef.current, {
            y: -6,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        }
        gsap.to(".loading-dot", {
          y: -4,
          opacity: 0.4,
          duration: 0.4,
          repeat: -1,
          yoyo: true,
          stagger: 0.15,
          ease: "power1.inOut",
        });
        return;
      }

      if (!input) return;

      if (!pincodeResult) {
        gsap.set(input, { clearProps: "borderColor,boxShadow,x" });
        return;
      }

      if (pincodeResult.available) {
        gsap.to(input, {
          borderColor: "#22c55e",
          boxShadow: "0 0 0 4px rgba(34,197,94,0.14)",
          duration: 0.45,
          ease: "power2.out",
        });
        if (!prefersReducedMotion) fireLightConfetti();
      } else if (pincodeResult.reason === "already_allotted") {
        gsap.to(input, {
          borderColor: "#ef4444",
          boxShadow: "0 0 0 4px rgba(239,68,68,0.14)",
          duration: 0.3,
        });
        if (!prefersReducedMotion) {
          gsap.fromTo(
            input,
            { x: 0 },
            { x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: "power1.inOut", clearProps: "x" }
          );
          if (lockIconRef.current) {
            gsap.fromTo(
              lockIconRef.current,
              { scale: 0, rotate: -15 },
              { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(3)" }
            );
          }
        }
      } else if (pincodeResult.reason === "temporarily_reserved") {
        gsap.to(input, {
          borderColor: "#f59e0b",
          boxShadow: "0 0 0 4px rgba(245,158,11,0.14)",
          duration: 0.3,
        });
      }

      function fireLightConfetti() {
        const container = pincodeConfettiRef.current;
        if (!container) return;
        const colors = ["#445df0", "#22c55e", "#ffb020", "#8b9cf7"];
        for (let i = 0; i < 14; i++) {
          const particle = document.createElement("div");
          const size = gsap.utils.random(4, 7);
          particle.style.position = "absolute";
          particle.style.left = `${gsap.utils.random(10, 90)}%`;
          particle.style.top = "-6px";
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.borderRadius = i % 2 === 0 ? "9999px" : "1px";
          particle.style.backgroundColor = colors[i % colors.length];
          container.appendChild(particle);

          gsap.fromTo(
            particle,
            { y: -10, opacity: 1, rotation: 0 },
            {
              y: gsap.utils.random(70, 130),
              x: gsap.utils.random(-25, 25),
              rotation: gsap.utils.random(-180, 180),
              opacity: 0,
              duration: gsap.utils.random(0.8, 1.2),
              ease: "power1.in",
              onComplete: () => particle.remove(),
            }
          );
        }
      }
    },
    { dependencies: [pincodeResult, pincodeLoading], scope }
  );

  async function runPincodeCheck(value: string) {
    if (!/^\d{6}$/.test(value)) {
      setPincodeError("Please enter a valid 6-digit pincode.");
      return;
    }
    setPincodeLoading(true);
    setPincodeError("");
    setNearbySuggestions([]);
    try {
      const result = await distributorApi.checkPincode(value);
      setPincodeResult(result);
      if (result.reason === "already_allotted") {
        fetchNearbySuggestions(value);
      }
    } catch (err) {
      setPincodeError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setPincodeResult(null);
    } finally {
      setPincodeLoading(false);
    }
  }

  async function handleCheckPincode(e: FormEvent) {
    e.preventDefault();
    await runPincodeCheck(pincodeInput);
  }

  async function fetchNearbySuggestions(pincode: string) {
    setNearbyLoading(true);
    try {
      const suggestions = await distributorApi.getNearbyPincodes(pincode);
      setNearbySuggestions(suggestions);
    } catch {
      setNearbySuggestions([]);
    } finally {
      setNearbyLoading(false);
    }
  }

  async function selectSuggestedPincode(pincode: string) {
    setPincodeInput(pincode);
    await runPincodeCheck(pincode);
  }

  function resetToPincodeStep() {
    setPincodeResult(null);
    setPincodeInput("");
    setPincodeError("");
    setStep("pincode");
  }

  async function submitFormAndSendOtp(e?: FormEvent) {
    e?.preventDefault();
    if (!pincodeResult) return;

    const allConsentsGiven = CONSENT_ITEMS.every(({ key }) => consents[key]);
    if (!allConsentsGiven) {
      setFormError("Please accept all the declarations above to continue.");
      return;
    }

    setFormLoading(true);
    setFormError("");
    try {
      const { bookingId: newBookingId } = await distributorApi.sendOtp({
        ...form,
        pincode: pincodeResult.pincode,
        consents,
      });
      setBookingId(newBookingId);
      setStep("otp");
      setResendCooldown(45);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return;
    setOtpError("");
    try {
      const { bookingId: newBookingId } = await distributorApi.sendOtp({
        ...form,
        pincode: pincodeResult!.pincode,
        consents,
      });
      setBookingId(newBookingId);
      setResendCooldown(45);
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Failed to resend OTP.");
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError("");
    try {
      const { paymentMode } = await distributorApi.verifyOtp(bookingId, otpInput);

      if (paymentMode === "manual") {
        sessionStorage.setItem(
          "cashlo_pending_booking",
          JSON.stringify({
            name: form.name,
            pincode: pincodeResult?.pincode,
            district: pincodeResult?.district,
            state: pincodeResult?.state,
            bookingId,
            paymentMode: "manual",
          })
        );
        router.push("/become-distributor/pending");
        return;
      }

      if (paymentMode === "qr_self") {
        setStep("qr");
        return;
      }

      setStep("payment");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  const startPayment = useCallback(
    async (order: CreateOrderResult) => {
      if (!window.Razorpay) {
        setPaymentError("Payment system is still loading. Please try again in a moment.");
        return;
      }

      setPaymentStatus("waiting");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Cashlo",
        description: "Distributor Booking Fee",
        order_id: order.orderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        theme: { color: "#445df0" },
        handler: async (response) => {
            setPaymentStatus("verifying");
            try {
              await distributorApi.verifyPayment({
                bookingId: order.bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
          
              setPaymentStatus("success");
          
              sessionStorage.setItem(
                "cashlo_booking_receipt",
                JSON.stringify({
                  name: form.name,
                  mobile: form.mobile,
                  email: form.email,
                  pincode: pincodeResult?.pincode,
                  district: pincodeResult?.district,
                  state: pincodeResult?.state,
                  baseAmount: order.gst.baseAmount,
                  gstAmount: order.gst.gstAmount,
                  totalAmount: order.gst.totalAmount,
                  paymentId: response.razorpay_payment_id,
                  orderId: order.orderId,
                  bookingId: order.bookingId,
                  date: new Date().toISOString(),
                })
              );
          
              // Let the checkmark + confetti animation actually play before leaving the page
              setTimeout(() => {
                router.push("/become-distributor/thanks");
              }, 1800);
            } catch (err) {
              setPaymentError(
                err instanceof ApiError
                  ? err.message
                  : "Payment succeeded but we couldn't confirm it. Please contact support with your payment ID: " +
                      response.razorpay_payment_id
              );
            }
        },
        modal: {
          ondismiss: () => setPaymentStatus("dismissed"),
        },
      });

      rzp.on("payment.failed", () => {
        setPaymentError("Payment failed. You can try again below.");
        setPaymentStatus("dismissed");
      });

      rzp.open();
    },
    [form.name, form.email, form.mobile]
  );

  async function handleSubmitUtr(e: FormEvent) {
    e.preventDefault();
    setUtrLoading(true);
    setUtrError("");
    try {
      await distributorApi.submitUtr(bookingId, utrInput);

      sessionStorage.setItem(
        "cashlo_pending_booking",
        JSON.stringify({
          name: form.name,
          pincode: pincodeResult?.pincode,
          district: pincodeResult?.district,
          state: pincodeResult?.state,
          bookingId,
          paymentMode: "qr_self",
        })
      );
      router.push("/become-distributor/pending");
    } catch (err) {
      setUtrError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setUtrLoading(false);
    }
  }

  const initiateOrder = useCallback(async () => {
    setPaymentError("");
    setPaymentStatus("preparing");
    try {
      const order = await distributorApi.createOrder(bookingId);
      await startPayment(order);
    } catch (err) {
      setPaymentError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setPaymentStatus("dismissed");
    }
  }, [bookingId, startPayment]);

  useEffect(() => {
    if (step !== "payment") return;

    if (razorpayLoaded) {
      initiateOrder();
      return;
    }

    // If the script genuinely hasn't loaded within 8s (blocked, slow network,
    // etc.), don't leave the user staring at "Preparing..." forever.
    const timeout = setTimeout(() => {
      if (!window.Razorpay) {
        setPaymentError(
          "Payment system is taking longer than expected. Please check your connection or disable any ad-blocker, then retry."
        );
        setPaymentStatus("dismissed");
      }
    }, 8000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, razorpayLoaded]);

  const railStep = RAIL_STEP[step];

  return (
    <section id="reserve" ref={scope} className="scroll-mt-24 bg-surface py-20 sm:py-28">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() =>
          setPaymentError("Failed to load the payment system. Please check your connection and refresh the page.")
        }
      />
      <Container className="mx-auto max-w-lg">
        {/* ---- Progress rail: thin track + labels, Linear-style ---- */}
        <div data-reveal className="mb-10">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[3px] flex-1 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full bg-ink"
                  initial={false}
                  animate={{ width: n <= railStep ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex justify-between">
            {RAIL_STEPS.map((label, i) => (
              <span
                key={label}
                className={`text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                  i + 1 <= railStep ? "text-ink" : "text-ink/35"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div data-reveal className={cardBaseClass}>
          <AnimatePresence mode="wait">
            {step === "pincode" && (
              <motion.div key="pincode" {...stepMotion}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                    <MapPin size={16} strokeWidth={2} className="text-ink" />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">Reserve your territory</p>
                    <p className="text-[13px] text-ink/50">Enter your area PIN code to check availability</p>
                  </div>
                </div>

                <form onSubmit={handleCheckPincode} className="flex gap-2.5">
                  <div className="relative flex-1">
                    <div
                      ref={pincodeConfettiRef}
                      className="pointer-events-none absolute inset-x-0 -top-2 h-0 overflow-visible"
                      aria-hidden="true"
                    />
                    <input
                      ref={pincodeInputRef}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Area PIN code"
                      inputMode="numeric"
                      className={inputClass + " mt-0 font-mono tracking-wide"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={pincodeLoading}
                    className="shrink-0 rounded-lg bg-ink px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-ink/85 disabled:opacity-50"
                  >
                    Find
                  </button>
                </form>

                <AnimatePresence>
                  {pincodeError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 text-[13px] text-red-600"
                    >
                      {pincodeError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {pincodeLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 flex flex-col items-center gap-2.5 py-6"
                    >
                      <MapPin ref={pinIconRef} className="h-5 w-5 text-ink/40" strokeWidth={1.75} />
                      <p className="text-[13px] font-medium text-ink/70">Checking availability</p>
                      <div className="flex gap-1">
                        <span className="loading-dot h-1 w-1 rounded-full bg-ink/40" />
                        <span className="loading-dot h-1 w-1 rounded-full bg-ink/40" />
                        <span className="loading-dot h-1 w-1 rounded-full bg-ink/40" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {pincodeResult?.available && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5"
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-[14px] font-semibold text-emerald-900">
                            This territory is available
                          </p>
                          <p className="mt-0.5 text-[13px] text-emerald-800/70">
                            {pincodeResult.district}, {pincodeResult.state}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
                        Reserve it now before someone else books it. A ₹1,180 booking fee holds this
                        PIN code exclusively for you — a separate registration fee applies later, during
                        onboarding.
                      </p>
                      <button
                        onClick={() => setStep("form")}
                        className={primaryBtnClass + " mt-4"}
                      >
                        Reserve this PIN code
                        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {pincodeResult && !pincodeResult.available && pincodeResult.reason === "already_allotted" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 rounded-xl border border-red-200 bg-red-50/60 p-5"
                    >
                      <div className="flex items-start gap-2.5">
                        <Lock ref={lockIconRef} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-600" />
                        <p className="text-[14px] font-semibold text-red-900">
                          This PIN code is already taken
                        </p>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
                        It's already assigned to another Cashlo distributor. Try a nearby PIN code instead.
                      </p>

                      {nearbyLoading && (
                        <p className="mt-3 text-[12px] text-ink/40">Finding nearby pincodes…</p>
                      )}

                      {!nearbyLoading && nearbySuggestions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-ink/35">
                            Available nearby
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {nearbySuggestions.map((s) => (
                              <button
                                key={s.pincode}
                                onClick={() => selectSuggestedPincode(s.pincode)}
                                className="rounded-full border border-border bg-bg px-3.5 py-1.5 text-[12px] font-medium text-ink transition-all duration-200 hover:border-ink/30 hover:bg-surface"
                              >
                                {s.pincode}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!nearbyLoading && nearbySuggestions.length === 0 && (
                        <p className="mt-3 text-[12px] text-ink/35">
                          No nearby PIN codes available right now — try a different area.
                        </p>
                      )}

                      <button onClick={resetToPincodeStep} className={secondaryBtnClass + " mt-4"}>
                        Try another PIN code
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {pincodeResult && !pincodeResult.available && pincodeResult.reason === "temporarily_reserved" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-5"
                    >
                      <p className="text-[14px] font-semibold text-amber-900">
                        Currently being reserved by someone else
                      </p>
                      <p className="mt-1.5 text-[13px] text-ink/60">
                        Try again in a few minutes, or choose a nearby PIN code.
                      </p>
                      <button onClick={resetToPincodeStep} className={secondaryBtnClass + " mt-4"}>
                        Try another PIN code
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === "form" && pincodeResult && (
              <motion.form key="form" {...stepMotion} onSubmit={submitFormAndSendOtp}>
                <div className="mb-6 flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                  <span className="text-[13px] text-ink/60">Reserving</span>
                  <span className="text-[13px] font-semibold text-ink">
                    {pincodeResult.pincode} · {pincodeResult.district}, {pincodeResult.state}
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-[13px] font-medium text-ink/70">Full name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={inputClass}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-ink/70">Mobile number</label>
                    <input
                      required
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      className={inputClass}
                      placeholder="10-digit number"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-ink/70">Email address</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[13px] font-medium text-ink/70">Referral code (optional)</label>
                    <input
                      value={form.referralCode}
                      onChange={(e) => setForm((f) => ({ ...f, referralCode: e.target.value }))}
                      className={inputClass}
                      placeholder="Employee RT, DT, or MD code"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-border bg-surface/60 px-4 py-3.5 text-[12.5px] leading-relaxed text-ink/60">
                  <span className="font-medium text-ink">Two-step payment.</span> The{" "}
                  <span className="font-medium text-ink">₹1,180 booking fee</span> below reserves this PIN
                  code exclusively for you. A separate registration fee applies after your booking is
                  confirmed, payable during onboarding.
                </div>

                <div className="mt-6 space-y-1">
                  {CONSENT_ITEMS.map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-[13px] text-ink/65 transition-colors duration-150 hover:bg-surface"
                    >
                      <input
                        type="checkbox"
                        checked={consents[key]}
                        onChange={(e) => setConsents((c) => ({ ...c, [key]: e.target.checked }))}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-ink"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <AnimatePresence>
                  {formError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-[13px] text-red-600"
                    >
                      {formError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <SubmitButton type="submit" loading={formLoading} loadingText="Sending code…" className="mt-7">
                  Continue
                </SubmitButton>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form key="otp" {...stepMotion} onSubmit={handleVerifyOtp}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                    <ShieldCheck size={16} strokeWidth={2} className="text-ink" />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">Verify your email</p>
                    <p className="text-[13px] text-ink/50">
                      Code sent to <span className="text-ink/70">{form.email}</span> · valid 5 minutes
                    </p>
                  </div>
                </div>

                <input
                  required
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoFocus
                  className={inputClass + " mt-0 text-center text-xl font-mono tracking-[0.5em]"}
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
                  Verify code
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

            {step === "qr" && (
              <motion.form key="qr" {...stepMotion} onSubmit={handleSubmitUtr}>
                <div className="text-center">
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-ink/5">
                    <QrCode size={16} strokeWidth={2} className="text-ink" />
                  </span>
                  <p className="mt-3 text-[15px] font-semibold text-ink">Scan &amp; pay ₹1,180</p>
                  <p className="mt-1 text-[13px] text-ink/50">
                    Scan with any UPI app to complete your booking payment
                  </p>

                  <div className="mx-auto mt-6 w-52 overflow-hidden rounded-xl border border-border shadow-sm">
                    <img
                      src="/payment/distributor-booking-qr.png"
                      alt="Scan to pay the ₹1,180 Cashlo distributor booking fee"
                      className="h-auto w-full"
                    />
                  </div>

                  <p className="mx-auto mt-5 max-w-sm text-[12.5px] leading-relaxed text-ink/45">
                    After paying, your UPI app will show a transaction reference number (UTR / Ref No.) —
                    enter it below to confirm.
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
                  Our team will verify your payment and confirm your reservation shortly. Keep your
                  payment screenshot handy in case we need it.
                </p>
              </motion.form>
            )}

            {step === "payment" && (
              <motion.div key="payment" {...stepMotion} className="py-4 text-center">
                {(paymentStatus === "preparing" || paymentStatus === "waiting") && (
                  <p className="text-[14px] text-ink/60">
                    {paymentStatus === "preparing"
                      ? "Preparing your secure payment…"
                      : "Complete your payment in the window that opened."}
                  </p>
                )}

                {(paymentStatus === "verifying" || paymentStatus === "success") && (
                  <PaymentSuccessAnimation status={paymentStatus === "success" ? "success" : "processing"} />
                )}

                <AnimatePresence>
                  {paymentError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 text-[13px] text-red-600"
                    >
                      {paymentError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {paymentStatus === "dismissed" && (
                  <SubmitButton onClick={initiateOrder} className="mt-5">
                    Retry payment
                  </SubmitButton>
                )}
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" {...stepMotion} className="py-2 text-center">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100"
                >
                  <PartyPopper size={24} className="text-emerald-600" />
                </motion.span>
                <h3 className="mt-4 text-lg font-semibold text-ink">You're all set</h3>
                <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink/55">
                  Your PIN code has been reserved and is now exclusively assigned to you. Our team will
                  reach out shortly for onboarding.
                </p>
                <a href="/" className={secondaryBtnClass + " mt-6 inline-flex"}>
                  Back to home
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}