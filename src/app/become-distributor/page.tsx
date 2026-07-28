import DistributorHero from "@/components/sections/become-distributor/DistributorHero";
import DistributorTrustHighlights from "@/components/sections/become-distributor/DistributorTrustHighlights";
import DistributorAbout from "@/components/sections/become-distributor/DistributorAbout";
import DistributorHowItWorks from "@/components/sections/become-distributor/DistributorHowItWorks";
import DistributorWhyReserveEarly from "@/components/sections/become-distributor/DistributorWhyReserveEarly";
import DistributorWhoCanApply from "@/components/sections/become-distributor/DistributorWhoCanApply";
import BecomeDistributorSection from "@/components/sections/become-distributor/BecomeDistributorSection";
import CashloDistributorStory from "@/components/sections/become-distributor/CashloDistributorStory";

export default function BecomeDistributorPage() {
  return (
    <main>
      <div className="pt-24 sm:pt-28">
        <CashloDistributorStory className="w-full" />
      </div>
      <DistributorHero />
      <DistributorTrustHighlights />
      <DistributorAbout />
      <DistributorHowItWorks />
      <DistributorWhyReserveEarly />
      <DistributorWhoCanApply />
      <BecomeDistributorSection />
    </main>
  );
}