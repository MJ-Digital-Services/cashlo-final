import QuickKhataHero from "@/components/sections/quickkhata/QuickKhataHero";
import QuickKhataFeatures from "@/components/sections/quickkhata/QuickKhataFeatures";
import QuickKhataHowItWorks from "@/components/sections/quickkhata/QuickKhataHowItWorks";
import QuickKhataCTA from "@/components/sections/quickkhata/QuickKhataCTA";
import Footer from "@/components/layout/Footer";
import { breadcrumbSchema, serviceSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

const title = "QuickKhata | Cashlo";
const description = "Track customer and supplier credit digitally with QuickKhata — replace paper bahi-khatas with a digital ledger and WhatsApp payment reminders.";
const url = `${SITE_URL}/quickkhata`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
};

export default function QuickKhataPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(serviceSchema({ name: "QuickKhata", description, url }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "QuickKhata", url }]))}
      />
      <QuickKhataHero />
      <QuickKhataFeatures />
      <QuickKhataHowItWorks />
      <QuickKhataCTA />
      {/* <Footer /> */}
    </main>
  );
}