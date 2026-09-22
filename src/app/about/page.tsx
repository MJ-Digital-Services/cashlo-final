import AboutHero from "@/components/sections/about/AboutHero";
import AboutStory from "@/components/sections/about/AboutStory";
import AboutValues from "@/components/sections/about/AboutValues";
import AboutJourney from "@/components/sections/about/AboutJourney";
import AboutStats from "@/components/sections/about/AboutStats";
import AboutCTA from "@/components/sections/about/AboutCTA";
import Footer from "@/components/layout/Footer";
import WhyMerchantLovesCashlo from "@/components/sections/about/WhyMerchantLovesCashlo";
import { breadcrumbSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

const title = "About Us | Cashlo";
const description = "Learn about Cashlo's mission to turn local retail shops across India into UPI CashPoints and digital banking access points.";
const url = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: "index,follow",
  openGraph: { title, description, url, siteName: SITE_NAME, type: "website", images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: [SITE_OG_IMAGE] },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "About", url }]))}
      />
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <WhyMerchantLovesCashlo />
      <AboutJourney />
      <AboutStats />
      <AboutCTA />
      {/* <Footer /> */}
    </>
  );
}