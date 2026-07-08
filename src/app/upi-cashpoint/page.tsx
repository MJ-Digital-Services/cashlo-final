import UpiHero from "@/components/sections/upi-cashpoint/UpiHero";
import UpiHowItWorks from "@/components/sections/upi-cashpoint/UpiHowItWorks";
import UpiLimitsRules from "@/components/sections/upi-cashpoint/UpiLimitsRules";
import SupportedBy from "@/components/sections/SupportedBy";
import UpiCTA from "@/components/sections/upi-cashpoint/UpiCTA";
import Footer from "@/components/layout/Footer";

export default function UpiCashPointPage() {
  return (
    <main>
      <UpiHero />
      <UpiHowItWorks />
      <UpiLimitsRules />
      <SupportedBy />
      <UpiCTA />
      <Footer />
    </main>
  );
}