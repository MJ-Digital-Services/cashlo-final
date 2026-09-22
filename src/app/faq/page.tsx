import FaqHero from "@/components/sections/faq/FaqHero";
import FaqAccordion from "@/components/sections/faq/FaqAccordion";
import { faqGroups } from "@/lib/data/faqs/general";
import FaqCTA from "@/components/sections/faq/FaqCTA";
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

const title = "FAQ | Cashlo";
const description = "Answers to common questions about UPI CashPoint, QuickKhata, becoming a Cashlo merchant, and account security.";
const url = `${SITE_URL}/faq`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
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