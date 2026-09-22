import ServicesHero from "@/components/sections/services/ServicesHero";
import ServicesGrid from "@/components/sections/services/ServicesGrid";
import SupportedBy from "@/components/sections/SupportedBy";
import { breadcrumbSchema, itemListSchema, jsonLdScript, SITE_URL, SITE_NAME } from "@/lib/schema";
import type { Metadata } from "next";

const title = "Services | Cashlo";
const description = "Explore Cashlo's full range of merchant services — UPI CashPoint, QuickKhata, gold loans, instant loans, ITR filing, and recharge & bill payments.";
const url = `${SITE_URL}/services`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const SERVICES = [
  { name: "UPI CashPoint", path: "/upi-cashpoint" },
  { name: "QuickKhata", path: "/quickkhata" },
  { name: "Gold Loan", path: "/services/gold-loan" },
  { name: "Instant Loan", path: "/services/instant-loan" },
  { name: "ITR Filing", path: "/services/itr-filing" },
  { name: "Recharge & Bill Payments", path: "/services/recharge-bills" },
];

export default function ServicesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          itemListSchema(SERVICES.map((s) => ({ name: s.name, url: `${SITE_URL}${s.path}` }))),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Services", url },
          ]),
        )}
      />
      <ServicesHero />
      <ServicesGrid />
      <SupportedBy />
    </main>
  );
}
