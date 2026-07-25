import RechargeHero from "@/components/sections/recharge-bills/RechargeHero";
import OperatorGrid from "@/components/sections/recharge-bills/OperatorGrid";
import WhyChooseCashlo from "@/components/sections/recharge-bills/WhyChooseCashlo";
import RechargeHowItWorks from "@/components/sections/recharge-bills/RechargeHowItWorks";
import RechargeFAQs from "@/components/sections/recharge-bills/RechargeFAQs";
import SupportedBy from "@/components/sections/SupportedBy";
import RechargeCTA from "@/components/sections/recharge-bills/RechargeCTA";

export default function RechargeBillsPage() {
  return (
    <main>
      <RechargeHero />
      <OperatorGrid />
      <WhyChooseCashlo />
      <RechargeHowItWorks />
      <RechargeFAQs />
      <SupportedBy />
      <RechargeCTA />
    </main>
  );
}