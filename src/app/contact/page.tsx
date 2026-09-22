import ContactHero from "@/components/sections/contact/ContactHero";
import ContactSection from "@/components/sections/contact/ContactSection";
import { breadcrumbSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

const title = "Contact Us | Cashlo";
const description = "Get in touch with the Cashlo team for support, partnership enquiries, or questions about becoming a merchant or distributor.";
const url = `${SITE_URL}/contact`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Contact", url }]))}
      />
      <ContactHero />
      <ContactSection />
    </>
  );
}