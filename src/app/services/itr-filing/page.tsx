import ItrHero from "@/components/sections/itr-filing/ItrHero";
import ItrTypes from "@/components/sections/itr-filing/ItrTypes";
import DocumentsChecklist from "@/components/sections/itr-filing/DocumentsChecklist";
import WhyFileITR from "@/components/sections/itr-filing/WhyFileITR";
import ItrDeadlines from "@/components/sections/itr-filing/ItrDeadlines";
import ItrFAQs from "@/components/sections/itr-filing/ItrFAQs";
import { itrFaqs } from "@/lib/data/faqs/itr-filing";
import GstAccounting from "@/components/sections/GstAccounting";
import { breadcrumbSchema, serviceSchema, faqSchema, jsonLdScript, SITE_URL, SITE_NAME } from "@/lib/schema";
import type { Metadata } from "next";

const title = "ITR Filing | Cashlo";
const description = "File Income Tax Returns through Cashlo — guidance on ITR types, required documents, deadlines, and refund timelines.";
const url = `${SITE_URL}/services/itr-filing`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function ItrFilingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(serviceSchema({ name: "ITR Filing", description, url }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Services", url: `${SITE_URL}/services` },
            { name: "ITR Filing", url },
          ]),
        )}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(itrFaqs.map((f) => ({ q: f.q, a: f.a }))))} />
      <ItrHero />
      <ItrTypes />
      <GstAccounting />
      <DocumentsChecklist />
      <WhyFileITR />
      <ItrDeadlines />
      <ItrFAQs />
    </main>
  );
}