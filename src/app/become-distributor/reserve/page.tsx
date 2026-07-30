import type { Metadata } from "next";
import ReserveCheckout from "@/components/sections/become-distributor/ReserveCheckout";

export const metadata: Metadata = {
  title: "Reserve Your PIN Code — Cashlo Distributor",
  description:
    "Check your area's PIN code availability and reserve it as your exclusive Cashlo distributor territory. One distributor per PIN code.",
  robots: { index: false }, // checkout pages shouldn't rank in search
};

export default function ReservePincodePage() {
  return <ReserveCheckout />;
}