"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import Script from "next/script";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  distributorApi,
  ApiError,
  type PincodeCheckResult,
  type Consents,
  type CreateOrderResult,
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

type Step = "pincode" | "form" | "otp" | "payment" | "success";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand";
const primaryBtnClass =
  "w-full rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60";
const secondaryBtnClass =
  "w-full rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand";

const CONSENT_ITEMS: { key: keyof Consents; label: string }[] = [
  {
    key: "nonRefundable",
    label: "I understand that the \u20b91,100 PIN Reservation Fee is non-refundable.",
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

  // --- Form step ---
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    asmCode: "",
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

  // --- Payment step ---
  const [paymentError, setPaymentError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"preparing" | "waiting" | "dismissed" | "verifying" | "success">(
    "preparing"
  );

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleCheckPincode(e: FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput)) {
      setPincodeError("Please enter a valid 6-digit pincode.");
      return;
    }
    setPincodeLoading(true);
    setPincodeError("");
    try {
      const result = await distributorApi.checkPincode(pincodeInput);
      setPincodeResult(result);
    } catch (err) {
      setPincodeError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setPincodeResult(null);
    } finally {
      setPincodeLoading(false);
    }
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
      await distributorApi.verifyOtp(bookingId, otpInput);
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
        description: "Distributor Pincode Reservation",
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
    if (step === "payment" && razorpayLoaded) {
      initiateOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, razorpayLoaded]);

  return (
    <section ref={scope} className="bg-surface py-20 sm:py-24">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <Container className="mx-auto max-w-xl">
        <div data-reveal className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Reserve Your Territory
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Become a Cashlo Distributor
          </h2>
          <p className="mt-4 text-ink/60">
            Only one distributor is allowed per PIN Code. Reserve yours before someone else does.
          </p>
        </div>

        <div data-reveal className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {step === "pincode" && (
            <div>
              <form onSubmit={handleCheckPincode} className="flex gap-3">
                <input
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter your area PIN code"
                  inputMode="numeric"
                  className={inputClass + " mt-0"}
                />
                <button
                  type="submit"
                  disabled={pincodeLoading}
                  className="shrink-0 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
                >
                  {pincodeLoading ? "Checking..." : "Find"}
                </button>
              </form>

              {pincodeError && <p className="mt-3 text-sm text-red-600">{pincodeError}</p>}

              {pincodeResult?.available && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">
                  <p className="font-semibold text-green-700">
                    🎉 Great News! Your selected PIN Code is available for reservation.
                  </p>
                  <p className="mt-1 text-sm text-green-700/80">
                    {pincodeResult.district}, {pincodeResult.state}
                  </p>
                  <p className="mt-2 text-sm text-ink/60">
                    You&apos;re one step closer to owning this exclusive territory. Reserve it now before
                    someone else books it.
                  </p>
                  <button
                    onClick={() => setStep("form")}
                    className="mt-4 w-full rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    Reserve This PIN Code
                  </button>
                </div>
              )}

              {pincodeResult && !pincodeResult.available && pincodeResult.reason === "already_allotted" && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">
                  <p className="font-semibold text-red-700">
                    😔 Oops! This PIN Code has already been assigned to another Cashlo Distributor.
                  </p>
                  <p className="mt-2 text-sm text-ink/60">
                    Please try another nearby PIN Code to continue.
                  </p>
                  <button onClick={resetToPincodeStep} className="mt-4 w-full rounded-full border border-border px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
                    Try Another PIN Code
                  </button>
                </div>
              )}

              {pincodeResult && !pincodeResult.available && pincodeResult.reason === "temporarily_reserved" && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <p className="font-semibold text-amber-700">
                    This PIN Code is currently being reserved by another user.
                  </p>
                  <p className="mt-2 text-sm text-ink/60">
                    Please try again in a few minutes, or choose a nearby PIN Code.
                  </p>
                  <button onClick={resetToPincodeStep} className="mt-4 w-full rounded-full border border-border px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
                    Try Another PIN Code
                  </button>
                </div>
              )}
            </div>
          )}

          {step === "form" && pincodeResult && (
            <form onSubmit={submitFormAndSendOtp}>
              <div className="mb-5 rounded-xl bg-bg px-4 py-3 text-sm text-ink/70">
                PIN Code <span className="font-semibold text-ink">{pincodeResult.pincode}</span> —{" "}
                {pincodeResult.district}, {pincodeResult.state}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-ink">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    className={inputClass}
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Email Address</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">ASM Code (Optional)</label>
                  <input
                    value={form.asmCode}
                    onChange={(e) => setForm((f) => ({ ...f, asmCode: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Referral Code (Optional)</label>
                  <input
                    value={form.referralCode}
                    onChange={(e) => setForm((f) => ({ ...f, referralCode: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {CONSENT_ITEMS.map(({ key, label }) => (
                  <label key={key} className="flex items-start gap-3 text-sm text-ink/70">
                    <input
                      type="checkbox"
                      checked={consents[key]}
                      onChange={(e) => setConsents((c) => ({ ...c, [key]: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}

              <SubmitButton type="submit" loading={formLoading} loadingText="Sending OTP..." className="mt-6">
                Verify Email & Continue
                </SubmitButton>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <p className="text-sm text-ink/70">
                We&apos;ve sent a 6-digit OTP to <span className="font-medium text-ink">{form.email}</span>.
                It&apos;s valid for 5 minutes.
              </p>
              <label className="mt-5 block text-sm font-medium text-ink">Enter OTP</label>
              <input
                required
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                className={inputClass + " tracking-[0.3em] text-center text-lg"}
                placeholder="------"
              />

              {otpError && <p className="mt-3 text-sm text-red-600">{otpError}</p>}

              <SubmitButton type="submit" loading={otpLoading} loadingText="Verifying..." className="mt-6">
                Verify OTP
                </SubmitButton>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="mt-3 w-full text-center text-sm text-brand disabled:text-ink/40"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </form>
          )}

            {step === "payment" && (
            <div className="text-center">
                {(paymentStatus === "preparing" || paymentStatus === "waiting") && (
                <p className="text-sm text-ink/60">
                    {paymentStatus === "preparing"
                    ? "🔍 Preparing your secure payment..."
                    : "Complete your payment in the window that opened."}
                </p>
                )}

                {(paymentStatus === "verifying" || paymentStatus === "success") && (
                <PaymentSuccessAnimation status={paymentStatus === "success" ? "success" : "processing"} />
                )}

                {paymentError && <p className="mt-3 text-sm text-red-600">{paymentError}</p>}

                {paymentStatus === "dismissed" && (
                <SubmitButton onClick={initiateOrder} className="mt-5">
                    Retry Payment
                </SubmitButton>
                )}
            </div>
            )}

          {step === "success" && (
            <div className="text-center">
              <p className="text-2xl">🎉</p>
              <h3 className="mt-3 text-xl font-bold text-ink">Congratulations!</h3>
              <p className="mt-2 text-sm text-ink/60">
                Your PIN Code has been successfully reserved. This territory is now exclusively assigned to
                you. Our team will contact you shortly for onboarding.
              </p>
              <a href="/" className={secondaryBtnClass + " mt-6 inline-block"}>
                Back to Home
              </a>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}