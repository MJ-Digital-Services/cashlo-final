import dynamic from "next/dynamic";
import HeroTrust from "@/components/sections/HeroTrust";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import PaymentAppFeatures from "@/components/sections/PaymentAppFeatures";
import ImportantRules from "@/components/sections/ImportantRules";
import SupportedBy from "@/components/sections/SupportedBy";
import DownloadCTA from "@/components/sections/DownloadCTA";
import ServiceTeasers from "@/components/sections/ServiceTeasers";
// import RechargeBillPayments from "@/components/sections/RechargeBillPayments";
// import LoanServices from "@/components/sections/LoanServices";
// import GstAccounting from "@/components/sections/GstAccounting";
import WhoCanUse from "@/components/sections/WhoCanUse";
// import Footer from "@/components/layout/Footer";
import { organizationSchema, websiteSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/schema";
import type { Metadata } from "next";

// These three sit below the fold and each pull in gsap + ScrollTrigger for
// their own scroll animations. Statically importing them put that JS in the
// homepage's initial bundle, competing with the hero image and critical
// CSS/fonts for bandwidth on the first request — directly delaying LCP on
// throttled connections. `next/dynamic` keeps SSR on (content still renders
// server-side, so there's no layout shift or SEO loss) but splits each into
// its own chunk fetched after the initial critical path instead of blocking it.
const TrustGrid = dynamic(() => import("@/components/sections/TrustGrid"));
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"));
const ServiceStack = dynamic(() => import("@/components/sections/ServiceStack"));

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
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [SITE_OG_IMAGE],
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