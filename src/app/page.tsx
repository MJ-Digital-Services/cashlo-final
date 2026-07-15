import HeroTrust from "@/components/sections/HeroTrust";
import Stats from "@/components/sections/Stats";
import WhyChoose from "@/components/sections/WhyChoose";
import HowItWorks from "@/components/sections/HowItWorks";
import WithdrawalLimits from "@/components/sections/WithdrawalLimits";
import ImportantRules from "@/components/sections/ImportantRules";
import SupportedBy from "@/components/sections/SupportedBy";
import DownloadCTA from "@/components/sections/DownloadCTA";
// import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <HeroTrust />
      <Stats />
      <WhyChoose />
      <HowItWorks />
      <WithdrawalLimits />
      <SupportedBy />
      <ImportantRules />
      <DownloadCTA />
      {/* <Footer /> */}
    </main>
  );
}