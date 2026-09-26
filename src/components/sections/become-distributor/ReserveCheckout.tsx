"use client";

import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  MapPin,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  QrCode,
  TrendingUp,
  Layers,
  CheckCircle2,
  ChevronDown,
  LifeBuoy,
  User,
} from "lucide-react";
import {
  distributorApi,
  ApiError,
  type PincodeCheckResult,
  type Consents,
  type NearbyPincodeSuggestion,
  type DistributorPlan,
  type DistributorPlans,
  DEFAULT_PLANS,
  formatRupees,
} from "@/lib/api/distributor";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { DistributorKycFields, EMPTY_KYC, kycError, type KycValues } from "./DistributorKycFields";

// plan: pick booking (₹1,180 now + ₹5,900 later) vs full (₹6,490 once).
// kyc: full plan only — PAN/Aadhaar/shop details before paying.
// qr: scan + pay the chosen plan's amount, submit UTR → /pending.
type Step = "pincode" | "form" | "otp" | "plan" | "kyc" | "qr";
const STEPS: Step[] = ["pincode", "form", "otp", "plan", "kyc", "qr"];

/* ---------------- constants ---------------- */

// In-progress checkout state survives an accidental refresh (never the OTP itself).
const STORAGE_KEY = "cashlo_reserve_progress";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-ink/35 focus:border-brand focus:ring-[3px] focus:ring-brand/15";
const primaryBtnClass =
  "group inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-ink/85 disabled:opacity-50 disabled:hover:bg-ink";
const secondaryBtnClass =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink/25 hover:bg-surface";
const cardBaseClass =
  "rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_1px_rgba(16,24,40,0.02)]";
const backLinkClass =
  "mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink/45 transition-colors duration-200 hover:text-ink";

const CONSENT_ITEMS: { key: keyof Consents; label: string }[] = [
  {
    key: "nonRefundable",
    label: "I understand that the fee I pay to reserve my PIN code is non-refundable.",
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

const RAIL_STEPS = ["Territory", "Details", "Verify", "Pay"];
const RAIL_STEP: Record<Step, number> = {
  pincode: 1,
  form: 2,
  otp: 3,
  plan: 4,
  kyc: 4,
  qr: 4,
};

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
};

/* ---------------- component ---------------- */

export default function ReserveCheckout() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [step, setStep] = useState<Step>("pincode");
  const [summaryOpen, setSummaryOpen] = useState(false);

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

  // --- Plan + KYC steps ---
  // plans come from verifyOtp (the backend's live amounts); DEFAULT_PLANS
  // only fills in before that. plan stays null until the customer picks one.
  const [plans, setPlans] = useState<DistributorPlans>(DEFAULT_PLANS);
  const [plan, setPlan] = useState<DistributorPlan | null>(null);
  const [kyc, setKyc] = useState<KycValues>(EMPTY_KYC);
  const [kycFormError, setKycFormError] = useState("");

  // --- QR self-payment step ---
  const [utrInput, setUtrInput] = useState("");
  const [utrLoading, setUtrLoading] = useState(false);
  const [utrError, setUtrError] = useState("");

  /* ---------------- persistence & prefill ---------------- */

  const hydratedRef = useRef(false);

  useEffect(() => {
    // 1) Restore an in-progress checkout after an accidental refresh
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as {
          step?: Step;
          pincodeInput?: string;
          pincodeResult?: PincodeCheckResult | null;
          form?: typeof form;
          consents?: Consents;
          bookingId?: string;
          plans?: DistributorPlans;
          plan?: DistributorPlan | null;
          kyc?: Partial<KycValues>;
        };
        if (s.pincodeInput) setPincodeInput(s.pincodeInput);
        if (s.pincodeResult) setPincodeResult(s.pincodeResult);
        if (s.form) setForm(s.form);
        if (s.consents) setConsents(s.consents);
        if (s.bookingId) setBookingId(s.bookingId);
        if (s.plans) setPlans(s.plans);
        if (s.plan) setPlan(s.plan);
        if (s.kyc) setKyc({ ...EMPTY_KYC, ...s.kyc });
        // Sessions saved before the Razorpay removal may hold a step that no
        // longer exists ("payment"/"success") — only restore known steps.
        if (s.step && STEPS.includes(s.step)) setStep(s.step);
        hydratedRef.current = true;
        return;
      }
    } catch {
      /* corrupted state — start fresh */
    }

    // 2) Fresh visit: support ?pincode=110044 deep links (ads, WhatsApp, etc.)
    const pin = new URLSearchParams(window.location.search).get("pincode");
    if (pin && /^\d{6}$/.test(pin)) {
      setPincodeInput(pin);
      runPincodeCheck(pin);
    }
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step, pincodeInput, pincodeResult, form, consents, bookingId, plans, plan, kyc })
      );
    } catch {
      /* storage unavailable — flow still works, just won't survive refresh */
    }
  }, [step, pincodeInput, pincodeResult, form, consents, bookingId, plans, plan, kyc]);

  const clearProgress = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  /* ---------------- misc effects ---------------- */

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
    { dependencies: [pincodeResult, pincodeLoading], scope: rootRef }
  );

  /* ---------------- pincode ---------------- */

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

  // sendOtp reuses the same lead while it's pre-verification, so the id only
  // changes when this is genuinely a different lead (new email/pincode, or
  // the old one was cancelled/refunded). A plan or Aadhaar images picked for
  // the old lead don't apply to the new one — the images live on the old
  // lead server-side — so drop them instead of restoring stale choices.
  function adoptBookingId(newBookingId: string) {
    if (newBookingId !== bookingId) {
      setPlan(null);
      setKyc(EMPTY_KYC);
    }
    setBookingId(newBookingId);
  }

  function resetToPincodeStep() {
    setPincodeResult(null);
    setPincodeInput("");
    setPincodeError("");
    setStep("pincode");
  }

  /* ---------------- form + otp ---------------- */

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
      adoptBookingId(newBookingId);
      setOtpInput("");
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
      adoptBookingId(newBookingId);
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
      const { plans: livePlans } = await distributorApi.verifyOtp(bookingId, otpInput);
      if (livePlans) setPlans(livePlans);
      setStep("plan");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  /* ---------------- plan + kyc ---------------- */

  function handleChoosePlan() {
    if (!plan) return;
    setUtrError("");
    setStep(plan === "full" ? "kyc" : "qr");
  }

  function handleKycContinue() {
    const error = kycError(kyc);
    setKycFormError(error ?? "");
    if (!error) setStep("qr");
  }

  /* ---------------- payment (QR + UTR) ---------------- */

  async function handleSubmitUtr(e: FormEvent) {
    e.preventDefault();
    setUtrLoading(true);
    setUtrError("");
    try {
      if (!plan) return;
      await distributorApi.submitUtr(bookingId, utrInput, plan, {
        panCard: kyc.panCard,
        aadhaarAddress: kyc.aadhaarAddress,
        shopName: kyc.shopName,
        shopAddress: kyc.shopAddress,
        referralCode: kyc.referralCode,
      });

      sessionStorage.setItem(
        "cashlo_pending_booking",
        JSON.stringify({
          name: form.name,
          pincode: pincodeResult?.pincode,
          district: pincodeResult?.district,
          state: pincodeResult?.state,
          bookingId,
          plan,
        })
      );
      clearProgress();
      router.push("/become-distributor/pending");
    } catch (err) {
      setUtrError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setUtrLoading(false);
    }
  }

  /* ---------------- render ---------------- */

  const railStep = RAIL_STEP[step];
  const territorySelected = Boolean(pincodeResult?.available);
  const detailsLocked = step === "plan" || step === "kyc" || step === "qr";
  // Sidebar + QR show the selected plan; before a choice, the booking plan
  // (the smaller "due today") is what's displayed.
  // Only after OTP does the customer actually pick a plan; before that (incl.
  // going back to edit details) the sidebar shows both options instead of a
  // plan remembered from an earlier pass.
  const planChosen = plan !== null && (step === "plan" || step === "kyc" || step === "qr");
  const activePlan = plans[planChosen ? plan : "booking"];
  const fullSavings = plans.booking.total - plans.full.total;

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col bg-surface">
      {/* ---- Checkout header: back / logo / secure ---- */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/become-distributor"
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
            Secure checkout
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
            {/* ================= ORDER SUMMARY (left / collapsible on mobile) ================= */}
            <aside className="lg:sticky lg:top-24">
              {/* Mobile: collapsed bar */}
              <button
                type="button"
                onClick={() => setSummaryOpen((o) => !o)}
                aria-expanded={summaryOpen}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left lg:hidden"
              >
                <span className="text-[13px] font-medium text-ink/60">
                  {summaryOpen ? "Hide" : "Show"} order summary
                </span>
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink">
                  {planChosen ? formatRupees(activePlan.totalAmount, true) : `From ${formatRupees(plans.booking.totalAmount)}`}
                  <ChevronDown
                    size={15}
                    className={`text-ink/40 transition-transform duration-300 ${summaryOpen ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              <div className={`${summaryOpen ? "mt-3 block" : "hidden"} lg:mt-0 lg:block`}>
                <div className={cardBaseClass + " p-6"}>
                  <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                    Reserving territory
                  </p>

                  <AnimatePresence mode="wait">
                    {territorySelected ? (
                      <motion.div
                        key={pincodeResult!.pincode}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-2"
                      >
                        <p className="text-[22px] font-bold tracking-tight text-ink">
                          PIN {pincodeResult!.pincode}
                        </p>
                        <p className="text-[13px] text-ink/55">
                          {pincodeResult!.district}, {pincodeResult!.state}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 text-[14px] leading-relaxed text-ink/45"
                      >
                        Search your area&apos;s PIN code to check availability. One distributor per
                        PIN code.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {planChosen ? (
                    <>
                      {/* Chosen plan: price breakdown */}
                      <div className="mt-5 border-t border-border pt-4 text-[13px]">
                        <div className="flex items-center justify-between py-1 text-ink/60">
                          <span>{plan === "full" ? "Distributor fee (full payment)" : "PIN code booking fee"}</span>
                          <span className="font-mono">{formatRupees(activePlan.baseAmount, true)}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 text-ink/60">
                          <span>GST (18%)</span>
                          <span className="font-mono">{formatRupees(activePlan.gstAmount, true)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                          <span className="text-[14px] font-semibold text-ink">Total due today</span>
                          <span className="font-mono text-[15px] font-semibold text-ink">
                            {formatRupees(activePlan.totalAmount, true)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-[11.5px] leading-relaxed text-ink/40">
                        {plan === "full"
                          ? "One payment — nothing more to pay later."
                          : `The remaining ${formatRupees(
                              plans.booking.finalAmount ?? plans.booking.total - plans.booking.totalAmount
                            )} is paid later, during onboarding (${formatRupees(plans.booking.total)} in total).`}
                      </p>
                    </>
                  ) : (
                    /* No plan yet: compare the two ways to pay */
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                        Two ways to pay
                      </p>
                      <div className="mt-3 space-y-2.5">
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3.5 py-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[13.5px] font-semibold text-ink">Pay in full</span>
                            <span className="font-mono text-[14px] font-semibold text-ink">
                              {formatRupees(plans.full.total)}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-ink/55">
                            One payment, activated on approval.{" "}
                            <span className="font-medium text-emerald-700 dark:text-emerald-400">
                              Save {formatRupees(fullSavings)}
                            </span>
                          </p>
                        </div>
                        <div className="rounded-lg border border-border px-3.5 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[13.5px] font-semibold text-ink">Reserve now</span>
                            <span className="font-mono text-[14px] font-semibold text-ink">
                              {formatRupees(plans.booking.totalAmount)}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-ink/55">
                            {formatRupees(
                              plans.booking.finalAmount ?? plans.booking.total - plans.booking.totalAmount
                            )}{" "}
                            later during onboarding · {formatRupees(plans.booking.total)} total
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11.5px] leading-relaxed text-ink/40">
                        You&apos;ll choose after verifying your email. All prices include 18% GST.
                      </p>
                    </div>
                  )}

                  {/* What the distributor gets — claims mirror the /become-distributor
                      page (DistributorAbout / DistributorHero); no specific commission
                      rate is published anywhere, so none is stated here. */}
                  <p className="mt-5 border-t border-border pt-4 text-[10.5px] font-medium uppercase tracking-wider text-ink/35">
                    What you get
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    <li className="flex items-start gap-2.5 text-[12.5px] text-ink/55">
                      <Lock size={14} className="mt-0.5 shrink-0 text-ink/35" />
                      An exclusive territory — one distributor per PIN code
                    </li>
                    <li className="flex items-start gap-2.5 text-[12.5px] text-ink/55">
                      <TrendingUp size={14} className="mt-0.5 shrink-0 text-ink/35" />
                      Recurring commission on every transaction your merchants make
                    </li>
                    <li className="flex items-start gap-2.5 text-[12.5px] text-ink/55">
                      <Layers size={14} className="mt-0.5 shrink-0 text-ink/35" />
                      More income as you onboard more merchants across Cashlo services
                    </li>
                    <li className="flex items-start gap-2.5 text-[12.5px] text-ink/55">
                      <ShieldCheck size={14} className="mt-0.5 shrink-0 text-ink/35" />
                      Pay with any UPI app · GST invoice with every payment
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* ================= STEP FLOW (right) ================= */}
            <section>
              {/* Progress rail */}
              <div className="mb-8">
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

              <div className={cardBaseClass + " p-6 sm:p-9"}>
                <AnimatePresence mode="wait">
                  {step === "pincode" && (
                    <motion.div key="pincode" {...stepMotion}>
                      <div className="mb-6 flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                          <MapPin size={16} strokeWidth={2} className="text-ink" />
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-ink">Choose your territory</p>
                          <p className="text-[13px] text-ink/50">
                            Enter your area PIN code to check availability
                          </p>
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
                            onChange={(e) =>
                              setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            placeholder="Area PIN code"
                            inputMode="numeric"
                            autoFocus
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
                            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                          >
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                              <div>
                                <p className="text-[14px] font-semibold text-emerald-900 dark:text-emerald-200">
                                  This territory is available
                                </p>
                                <p className="mt-0.5 text-[13px] text-emerald-800/70 dark:text-emerald-300/70">
                                  {pincodeResult.district}, {pincodeResult.state}
                                </p>
                              </div>
                            </div>
                            <p className="mt-3 text-[13px] leading-relaxed text-ink/60">
                              Reserve it now before someone else books it — from{" "}
                              {formatRupees(plans.booking.totalAmount)}, or {formatRupees(plans.full.total)} paid
                              in full.
                            </p>
                            <button onClick={() => setStep("form")} className={primaryBtnClass + " mt-4"}>
                              Reserve this PIN code
                              <ArrowRight
                                size={15}
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                              />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {pincodeResult &&
                          !pincodeResult.available &&
                          pincodeResult.reason === "already_allotted" && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="mt-6 rounded-xl border border-red-200 bg-red-50/60 p-5 dark:border-red-900/50 dark:bg-red-950/30"
                            >
                              <div className="flex items-start gap-2.5">
                                <Lock
                                  ref={lockIconRef}
                                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-600"
                                />
                                <p className="text-[14px] font-semibold text-red-900 dark:text-red-200">
                                  This PIN code is already taken
                                </p>
                              </div>
                              <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
                                It&apos;s already assigned to another Cashlo distributor. Try a
                                nearby PIN code instead.
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
                        {pincodeResult &&
                          !pincodeResult.available &&
                          pincodeResult.reason === "temporarily_reserved" && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/50 dark:bg-amber-950/30"
                            >
                              <p className="text-[14px] font-semibold text-amber-900 dark:text-amber-200">
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
                      <button type="button" onClick={() => setStep("pincode")} className={backLinkClass}>
                        <ArrowLeft size={13} />
                        Change PIN code
                      </button>

                      {/* Compact context bar — the desktop summary already shows this,
                          so it only renders on mobile where the summary is collapsed */}
                      <div className="mb-6 flex items-center justify-between rounded-lg bg-surface px-4 py-3 lg:hidden">
                        <span className="text-[13px] text-ink/60">Reserving</span>
                        <span className="text-[13px] font-semibold text-ink">
                          {pincodeResult.pincode} · {pincodeResult.district}
                        </span>
                      </div>

                      <p className="mb-5 text-[15px] font-semibold text-ink">Your details</p>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="text-[13px] font-medium text-ink/70">Full name</label>
                          <input
                            required
                            value={form.name}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                name: e.target.value.replace(/[^A-Za-z\s.'-]/g, ""),
                              }))
                            }
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
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                              }))
                            }
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
                          <label className="text-[13px] font-medium text-ink/70">
                            Referral code (optional)
                          </label>
                          <input
                            value={form.referralCode}
                            onChange={(e) => setForm((f) => ({ ...f, referralCode: e.target.value }))}
                            className={inputClass}
                            placeholder="Employee RT, DT, or MD code"
                          />
                        </div>
                      </div>

                      <div className="mt-6 rounded-lg border border-border bg-surface/60 px-4 py-3.5 text-[12.5px] leading-relaxed text-ink/60">
                        <span className="font-medium text-ink">Two ways to pay.</span> After
                        verification, reserve this PIN code for{" "}
                        <span className="font-medium text-ink">{formatRupees(plans.booking.totalAmount)}</span>{" "}
                        and pay the rest during onboarding, or pay{" "}
                        <span className="font-medium text-ink">{formatRupees(plans.full.total)}</span> once and
                        save {formatRupees(fullSavings)}.
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
                              onChange={(e) =>
                                setConsents((c) => ({ ...c, [key]: e.target.checked }))
                              }
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

                      <SubmitButton
                        type="submit"
                        loading={formLoading}
                        loadingText="Sending code…"
                        className="mt-7"
                      >
                        Continue to verification
                      </SubmitButton>
                    </motion.form>
                  )}

                  {step === "otp" && (
                    <motion.form key="otp" {...stepMotion} onSubmit={handleVerifyOtp}>
                      <button type="button" onClick={() => setStep("form")} className={backLinkClass}>
                        <ArrowLeft size={13} />
                        Edit details
                      </button>

                      <div className="mb-6 flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                          <ShieldCheck size={16} strokeWidth={2} className="text-ink" />
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-ink">Verify your email</p>
                          <p className="text-[13px] text-ink/50">
                            Code sent to <span className="text-ink/70">{form.email}</span> · valid 5
                            minutes
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

                      <p className="mt-4 text-center text-[11.5px] text-ink/35">
                        Changed your email? Go back to edit details — we&apos;ll send a fresh code.
                      </p>
                    </motion.form>
                  )}

                  {step === "plan" && (
                    <motion.div key="plan" {...stepMotion}>
                      <div className="mb-6">
                        <p className="text-[15px] font-semibold text-ink">Choose how to pay</p>
                        <p className="mt-1 text-[13px] text-ink/50">
                          Both options reserve PIN {pincodeResult?.pincode} exclusively for you.
                        </p>
                      </div>

                      <div className="space-y-3" role="radiogroup" aria-label="Payment plan">
                        {(
                          [
                            {
                              key: "full",
                              title: `Pay in full — ${formatRupees(plans.full.total)}`,
                              badge: `Save ${formatRupees(fullSavings)}`,
                              detail:
                                "One payment, nothing due later. Add your KYC details now and your PIN code is activated once we verify the payment.",
                            },
                            {
                              key: "booking",
                              title: `Reserve now — ${formatRupees(plans.booking.totalAmount)}`,
                              badge: null,
                              detail: `Pay ${formatRupees(
                                plans.booking.finalAmount ?? plans.booking.total - plans.booking.totalAmount
                              )} later during onboarding (${formatRupees(plans.booking.total)} in total).`,
                            },
                          ] as const
                        ).map((option) => {
                          const selected = plan === option.key;
                          return (
                            <button
                              key={option.key}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              aria-label={option.title}
                              onClick={() => setPlan(option.key)}
                              className={`w-full rounded-xl border px-4 py-4 text-left transition-all duration-200 ${
                                selected
                                  ? "border-ink bg-surface ring-[3px] ring-ink/10"
                                  : "border-border hover:border-ink/25"
                              }`}
                            >
                              <span className="flex items-start gap-3">
                                <span
                                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                    selected ? "border-ink" : "border-ink/30"
                                  }`}
                                >
                                  {selected && <span className="h-2 w-2 rounded-full bg-ink" />}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex flex-wrap items-center gap-2">
                                    <span className="text-[14.5px] font-semibold text-ink">{option.title}</span>
                                    {option.badge && (
                                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                        {option.badge}
                                      </span>
                                    )}
                                  </span>
                                  <span className="mt-1 block text-[12.5px] leading-relaxed text-ink/55">
                                    {option.detail}
                                  </span>
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <SubmitButton onClick={handleChoosePlan} disabled={!plan} className="mt-6">
                        Continue
                      </SubmitButton>
                    </motion.div>
                  )}

                  {step === "kyc" && (
                    <motion.div key="kyc" {...stepMotion}>
                      <button type="button" onClick={() => setStep("plan")} className={backLinkClass}>
                        <ArrowLeft size={13} />
                        Change plan
                      </button>

                      <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5">
                          <User size={16} strokeWidth={2} className="text-ink" />
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold text-ink">Distributor details</p>
                          <p className="text-[13px] text-ink/50">Needed to activate your PIN code</p>
                        </div>
                      </div>

                      <DistributorKycFields bookingId={bookingId} values={kyc} onChange={setKyc} showReferral={false} />

                      <AnimatePresence>
                        {kycFormError && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2.5 text-[13px] text-red-600"
                          >
                            {kycFormError}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <SubmitButton onClick={handleKycContinue} className="mt-6">
                        Proceed to pay {formatRupees(plans.full.total)}
                      </SubmitButton>
                    </motion.div>
                  )}

                  {step === "qr" && (
                    <motion.form key="qr" {...stepMotion} onSubmit={handleSubmitUtr}>
                      <button
                        type="button"
                        onClick={() => setStep(plan === "full" ? "kyc" : "plan")}
                        className={backLinkClass}
                      >
                        <ArrowLeft size={13} />
                        {plan === "full" ? "Edit details" : "Change plan"}
                      </button>

                      <div className="text-center">
                        <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-ink/5">
                          <QrCode size={16} strokeWidth={2} className="text-ink" />
                        </span>
                        <p className="mt-3 text-[15px] font-semibold text-ink">
                          Scan &amp; pay {formatRupees(activePlan.totalAmount)}
                        </p>
                        <p className="mt-1 text-[13px] text-ink/50">
                          {plan === "full"
                            ? "Scan with any UPI app to pay your distributor fee in full"
                            : "Scan with any UPI app to complete your booking payment"}
                        </p>

                        <div className="mx-auto mt-6 w-52 overflow-hidden rounded-xl border border-border shadow-sm">
                          <div className="relative bg-white p-4">
                            <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                              Pay {formatRupees(activePlan.totalAmount)}
                            </span>
                            <div className="mt-6 flex items-center justify-center">
                              <QRCodeSVG
                                value={`upi://pay?pa=MAB.037215011487460@AXISBANK&pn=Cashlo&am=${activePlan.totalAmount / 100}&cu=INR&tn=${
                                  plan === "full" ? "Cashlo Distributor Fee (Full)" : "Cashlo Distributor Booking Fee"
                                }`}
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
                          After paying, your UPI app will show a transaction reference number (UTR /
                          Ref No.) — enter it below to confirm.
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
                        Our team will verify your payment and{" "}
                        {plan === "full" ? "activate your PIN code" : "confirm your reservation"} shortly.
                        Keep your payment screenshot handy in case we need it.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* After OTP verification the details are locked — no back button,
                  so give people a support path instead */}
              {detailsLocked && (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-ink/40">
                  <LifeBuoy size={13} />
                  Spotted a mistake in your details? Don&apos;t pay twice — email{" "}
                  <a href="mailto:support@cashlo.app" className="font-medium text-ink/60 hover:text-ink">
                    support@cashlo.app
                  </a>
                </p>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* ---- Minimal checkout footer ---- */}
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