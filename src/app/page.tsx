import HeroTrust from "@/components/sections/HeroTrust";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import PaymentAppFeatures from "@/components/sections/PaymentAppFeatures";
import HowItWorks from "@/components/sections/HowItWorks";
import ImportantRules from "@/components/sections/ImportantRules";
import SupportedBy from "@/components/sections/SupportedBy";
import DownloadCTA from "@/components/sections/DownloadCTA";
import ServiceTeasers from "@/components/sections/ServiceTeasers";
// import RechargeBillPayments from "@/components/sections/RechargeBillPayments";
// import LoanServices from "@/components/sections/LoanServices";
import ServiceStack from "@/components/sections/ServiceStack";
// import GstAccounting from "@/components/sections/GstAccounting";
import WhoCanUse from "@/components/sections/WhoCanUse";
// import Footer from "@/components/layout/Footer";
import TrustGrid from "@/components/sections/TrustGrid";
import { organizationSchema, websiteSchema, jsonLdScript, SITE_URL, SITE_NAME } from "@/lib/schema";
import type { Metadata } from "next";

const title = "Cashlo — India's Trusted UPI CashPoint Network";
const description = "Turn your shop into a UPI CashPoint and earn every day. Cash withdrawal, money transfer, bill payments, and merchant banking services for retailers.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: SITE_URL },
  robots: "index,follow",
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: `${SITE_URL}/cashlo-logo.png`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/cashlo-logo.png`],
  },
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organizationSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(websiteSchema())} />
      {/* <HeroTrust /> */}
      <Hero />
      <TrustGrid />
      <Stats />
      <SupportedBy />
      <PaymentAppFeatures />
      <HowItWorks />
      <ServiceStack />
      {/* <GstAccounting /> */}
      <WhoCanUse />
      {/* <RechargeBillPayments /> */}
      {/* <LoanServices /> */}
      <ServiceTeasers />
      <ImportantRules />
      <DownloadCTA />
      {/* <Footer /> */}
    </main>
  );
}