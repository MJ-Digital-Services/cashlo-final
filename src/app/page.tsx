import HeroTrust from "@/components/sections/HeroTrust";
import Stats from "@/components/sections/Stats";
import WhyChoose from "@/components/sections/WhyChoose";
import HowItWorks from "@/components/sections/HowItWorks";
import ImportantRules from "@/components/sections/ImportantRules";
import SupportedBy from "@/components/sections/SupportedBy";
import DownloadCTA from "@/components/sections/DownloadCTA";
import ServiceTeasers from "@/components/sections/ServiceTeasers";
// import RechargeBillPayments from "@/components/sections/RechargeBillPayments";
// import LoanServices from "@/components/sections/LoanServices";
import ServiceStack from "@/components/sections/ServiceStack";
import GstAccounting from "@/components/sections/GstAccounting";
import WhoCanUse from "@/components/sections/WhoCanUse";
// import Footer from "@/components/layout/Footer";
import TrustGrid from "@/components/sections/TrustGrid";

export default function Home() {
  return (
    <main>
      <HeroTrust />
      <TrustGrid />
      <Stats />
      <SupportedBy />
      <WhyChoose />
      <HowItWorks />
      <ServiceStack />
      <GstAccounting />
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