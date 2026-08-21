import type { Metadata } from "next";
import DistributorChooseFlow from "@/components/sections/become-distributor/DistributorChooseFlow";

export const metadata: Metadata = {
  title: "Become a Distributor — Cashlo",
  description:
    "Book a new PIN Code as a Cashlo distributor, or complete a pending payment for a PIN Code you've already reserved.",
  robots: { index: false },
};

export default function ChooseDistributorPathPage() {
  return <DistributorChooseFlow />;
}