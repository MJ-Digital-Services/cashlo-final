import DistributorHero from "@/components/sections/become-distributor/DistributorHero";
import DistributorTrustHighlights from "@/components/sections/become-distributor/DistributorTrustHighlights";
import DistributorAbout from "@/components/sections/become-distributor/DistributorAbout";
import DistributorHowItWorks from "@/components/sections/become-distributor/DistributorHowItWorks";
import DistributorWhoCanApply from "@/components/sections/become-distributor/DistributorWhoCanApply";
import DistributorWhyReserveEarly from "@/components/sections/become-distributor/DistributorWhyReserveEarly";
import { breadcrumbSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

const title = "Become a Distributor | Cashlo";
const description = "Reserve your pincode and become a Cashlo distributor — build a UPI CashPoint network in your area and earn commission on every transaction.";
const url = `${SITE_URL}/become-distributor`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
};

export default function BecomeDistributorPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Become a Distributor", url }]))}
      />
      <DistributorHero />
      <DistributorTrustHighlights />
      <DistributorAbout />
      <DistributorHowItWorks />
      <DistributorWhoCanApply />
      {/* Closing CTA band — now the last thing before the footer, sending
          people to the dedicated /become-distributor/reserve checkout */}
      <DistributorWhyReserveEarly />
    </main>
  );
}