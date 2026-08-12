"use client";

import Image from "next/image";
import {
  QrCode,
  Smartphone,
  FileSpreadsheet,
  BookOpenText,
  CreditCard,
  Landmark,
} from "lucide-react";

interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  accent: string;
  accentSoft: string;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    id: "upi-cash-point",
    title: "UPI Cash Point",
    description:
      "Let customers withdraw cash at your counter and earn a commission on every eligible transaction.",
    image: "/services/feature-upicashpoint.png",
    Icon: QrCode,
    accent: "#3B5BFF",
    accentSoft: "#EEF1FF",
  },
  {
    id: "recharge-bill-payments",
    title: "Recharge & Bill Payments",
    description:
      "Offer mobile, DTH, electricity, water, gas and FASTag payments — earn on every transaction you process.",
    image: "/services/feature-recharge.png",
    Icon: Smartphone,
    accent: "#6366F1",
    accentSoft: "#EEF0FE",
  },
  {
    id: "gst-accounting",
    title: "GST & Accounting",
    description:
      "Handle GST registration, filings and ITR from one dashboard — no paperwork, no back-and-forth.",
    image: "/services/feature-gst.png",
    Icon: FileSpreadsheet,
    accent: "#16A34A",
    accentSoft: "#E9FBF0",
  },
  {
    id: "quick-khata",
    title: "Quick Khata",
    description:
      "Track customer and supplier credit digitally, and finally retire the paper register.",
    image: "/services/feature-quickkhata.png",
    Icon: BookOpenText,
    accent: "#D97F06",
    accentSoft: "#FEF3E2",
  },
  {
    id: "digital-payments",
    title: "Digital Payments",
    description:
      "Accept payments from any UPI app with a dynamic QR code and instant settlement to your account.",
    image: "/services/feature-digital-payment.png",
    Icon: CreditCard,
    accent: "#3B5BFF",
    accentSoft: "#EEF1FF",
  },
  {
    id: "loan-services",
    title: "Loan Services",
    description:
      "Help customers access personal and business loans in minutes, and earn commission on every approval.",
    image: "/services/feature-loan.png",
    Icon: Landmark,
    accent: "#16A34A",
    accentSoft: "#E9FBF0",
  },
];

function FeatureCard({ card }: { card: FeatureCardData }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={card.image}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ backgroundColor: card.accentSoft }}
          >
            <card.Icon className="h-5 w-5" style={{ color: card.accent }} strokeWidth={1.8} />
          </span>
          <h3 className="text-lg font-semibold leading-tight text-ink">{card.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-ink/60">{card.description}</p>
      </div>
    </div>
  );
}

const PaymentAppFeatures: React.FC = () => {
  return (
    <section className="w-full bg-bg py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="text-xs font-bold tracking-[0.12em] text-brand">
            HAR DUKAAN KI EXTRA INCOME
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            More Than Just a Payment App
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink/60 sm:text-lg">
            Most payment apps help you accept money.
            <br className="hidden sm:block" /> Cashlo helps you earn money from every transaction.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaymentAppFeatures;