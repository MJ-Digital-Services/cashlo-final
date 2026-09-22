import UpiHero from "@/components/sections/upi-cashpoint/UpiHero";
import UpiHowItWorks from "@/components/sections/upi-cashpoint/UpiHowItWorks";
import UpiLimitsRules from "@/components/sections/upi-cashpoint/UpiLimitsRules";
import SupportedBy from "@/components/sections/SupportedBy";
import UpiCTA from "@/components/sections/upi-cashpoint/UpiCTA";
import Footer from "@/components/layout/Footer";
import { breadcrumbSchema, serviceSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

const title = "UPI CashPoint | Cashlo";
const description = "Turn your shop into a UPI CashPoint — let customers withdraw cash using any UPI app and earn commission on every transaction.";
const url = `${SITE_URL}/upi-cashpoint`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
};

export default function UpiCashPointPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(serviceSchema({ name: "UPI CashPoint", description, url }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "UPI CashPoint", url }]))}
      />
      <UpiHero />
      <UpiHowItWorks />
      <UpiLimitsRules />
      <SupportedBy />
      <UpiCTA />
      {/* <Footer /> */}
    </main>
  );
}