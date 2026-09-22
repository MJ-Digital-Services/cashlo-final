import GoldLoanHero from "@/components/sections/gold-loan/GoldLoanHero";
import WhyChooseGoldLoan from "@/components/sections/gold-loan/WhyChooseGoldLoan";
import GoldLoanCalculator from "@/components/sections/gold-loan/GoldLoanCalculator";
import InterestRateBanner from "@/components/sections/gold-loan/InterestRateBanner";
import LoanBenefitsFeatures from "@/components/sections/gold-loan/LoanBenefitsFeatures";
import DocumentsRequired from "@/components/sections/gold-loan/DocumentsRequired";
import MoreAboutGoldLoan from "@/components/sections/gold-loan/MoreAboutGoldLoan";
import GoldLoanFAQs from "@/components/sections/gold-loan/GoldLoanFAQs";
import { goldLoanFaqs } from "@/lib/data/faqs/gold-loan";
import SupportedBy from "@/components/sections/SupportedBy";
import GoldLoanCTA from "@/components/sections/gold-loan/GoldLoanCTA";
import { breadcrumbSchema, serviceSchema, faqSchema, jsonLdScript, SITE_URL, SITE_NAME } from "@/lib/schema";
import type { Metadata } from "next";

const title = "Gold Loan | Cashlo";
const description = "Apply for a gold loan through Cashlo — quick approval, minimal documentation, and flexible repayment against your gold jewellery.";
const url = `${SITE_URL}/services/gold-loan`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function GoldLoanPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(serviceSchema({ name: "Gold Loan", description, url }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Services", url: `${SITE_URL}/services` },
            { name: "Gold Loan", url },
          ]),
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(goldLoanFaqs.map((f) => ({ q: f.q, a: f.a }))))} />
      <GoldLoanHero />
      <WhyChooseGoldLoan />
      <GoldLoanCalculator />
      <InterestRateBanner />
      <LoanBenefitsFeatures />
      <DocumentsRequired />
      <MoreAboutGoldLoan />
      <GoldLoanFAQs />
      <SupportedBy />
      <GoldLoanCTA />
    </main>
  );
}