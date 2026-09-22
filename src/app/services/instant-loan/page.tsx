import InstantLoanHero from "@/components/sections/instant-loan/InstantLoanHero";
import WhyChooseInstantLoan from "@/components/sections/instant-loan/WhyChooseInstantLoan";
import EligibilityCriteria from "@/components/sections/instant-loan/EligibilityCriteria";
import DocumentsRequired from "@/components/sections/instant-loan/DocumentsRequired";
import HowItWorks from "@/components/sections/instant-loan/HowItWorks";
import EmiCalculatorsPromo from "@/components/sections/instant-loan/EmiCalculatorsPromo";
import InstantLoanFAQs from "@/components/sections/instant-loan/InstantLoanFAQs";
import { instantLoanFaqs } from "@/lib/data/faqs/instant-loan";
import SupportedBy from "@/components/sections/SupportedBy";
import InstantLoanCTA from "@/components/sections/instant-loan/InstantLoanCTA";
import { breadcrumbSchema, serviceSchema, faqSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

const title = "Instant Loan | Cashlo";
const description = "Offer instant personal loans through Cashlo — fast approval, transparent EMI calculators, and commission on every successful disbursal.";
const url = `${SITE_URL}/services/instant-loan`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
};

export default function InstantLoanPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(serviceSchema({ name: "Instant Loan", description, url }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Services", url: `${SITE_URL}/services` },
            { name: "Instant Loan", url },
          ]),
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(instantLoanFaqs.map((f) => ({ q: f.q, a: f.a }))))} />
      <InstantLoanHero />
      <WhyChooseInstantLoan />
      <EligibilityCriteria />
      <DocumentsRequired />
      <HowItWorks />
      <EmiCalculatorsPromo />
      <InstantLoanFAQs />
      <SupportedBy />
      <InstantLoanCTA />
    </main>
  );
}