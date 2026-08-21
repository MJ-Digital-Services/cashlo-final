import type { Metadata } from "next";
import CompletePaymentFlow from "@/components/sections/become-distributor/CompletePaymentFlow";

export const metadata: Metadata = {
  title: "Complete Payment — Cashlo Distributor",
  description:
    "Find your existing PIN Code booking and complete the pending payment to activate it.",
  robots: { index: false },
};

export default function CompletePaymentPage() {
  return <CompletePaymentFlow />;
}