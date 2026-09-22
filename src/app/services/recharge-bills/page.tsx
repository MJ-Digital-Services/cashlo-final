import RechargeHero from "@/components/sections/recharge-bills/RechargeHero";
import OperatorGrid from "@/components/sections/recharge-bills/OperatorGrid";
import WhyChooseCashlo from "@/components/sections/recharge-bills/WhyChooseCashlo";
import RechargeHowItWorks from "@/components/sections/recharge-bills/RechargeHowItWorks";
import RechargeFAQs from "@/components/sections/recharge-bills/RechargeFAQs";
import { rechargeFaqs } from "@/lib/data/faqs/recharge-bills";
import SupportedBy from "@/components/sections/SupportedBy";
import RechargeCTA from "@/components/sections/recharge-bills/RechargeCTA";
import { breadcrumbSchema, serviceSchema, faqSchema, jsonLdScript, SITE_URL, SITE_NAME } from "@/lib/schema";
import type { Metadata } from "next";

const title = "Recharge & Bill Payments | Cashlo";
const description = "Offer mobile recharge and utility bill payment services through Cashlo — all major operators and 80+ BBPS-enabled billers, with instant commission.";
const url = `${SITE_URL}/services/recharge-bills`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RechargeBillsPage() {
  return (
    <main id="main-content" aria-label="Recharge and Bill Payment Services">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(serviceSchema({ name: "Recharge & Bill Payments", description, url }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Services", url: `${SITE_URL}/services` },
            { name: "Recharge & Bill Payments", url },
          ]),
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(rechargeFaqs.map((f) => ({ q: f.q, a: f.a }))))} />
      <RechargeHero />
      <OperatorGrid />
      <WhyChooseCashlo />
      <RechargeHowItWorks />
      <RechargeFAQs />
      <SupportedBy />
      <RechargeCTA />
    </main>
  );
}
