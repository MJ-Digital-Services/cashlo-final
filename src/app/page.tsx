import Hero from "@/components/sections/Hero";
import Trust from "@/components/sections/Trust";
import Stats from "@/components/sections/Stats";
import WhyChoose from "@/components/sections/WhyChoose";
import HowItWorks from "@/components/sections/HowItWorks";
import WithdrawalLimits from "@/components/sections/WithdrawalLimits";
import ImportantRules from "@/components/sections/ImportantRules";
// import LimitsRules from "@/components/sections/LimitsRules";
import SupportedBy from "@/components/sections/SupportedBy";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Trust />
      <Stats />
      <WhyChoose />
      <HowItWorks />
      <WithdrawalLimits />
      {/* <LimitsRules /> */}
      <SupportedBy />
      <ImportantRules />
      <DownloadCTA />
      {/* <Footer /> */}
    </main>
  );
}
