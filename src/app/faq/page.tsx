import FaqHero from "@/components/sections/faq/FaqHero";
import FaqAccordion, { faqGroups } from "@/components/sections/faq/FaqAccordion";
import FaqCTA from "@/components/sections/faq/FaqCTA";
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL, SITE_NAME } from "@/lib/schema";
import type { Metadata } from "next";

const title = "FAQ | Cashlo";
const description = "Answers to common questions about UPI CashPoint, QuickKhata, becoming a Cashlo merchant, and account security.";
const url = `${SITE_URL}/faq`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const allFaqs = faqGroups.flatMap((group) => group.items);

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(allFaqs))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url },
          ]),
        )}
      />
      <FaqHero />
      <FaqAccordion />
      <FaqCTA />
    </>
  );
}