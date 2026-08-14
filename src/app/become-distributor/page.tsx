import DistributorHero from "@/components/sections/become-distributor/DistributorHero";
import DistributorTrustHighlights from "@/components/sections/become-distributor/DistributorTrustHighlights";
import DistributorAbout from "@/components/sections/become-distributor/DistributorAbout";
import DistributorHowItWorks from "@/components/sections/become-distributor/DistributorHowItWorks";
import DistributorWhoCanApply from "@/components/sections/become-distributor/DistributorWhoCanApply";
import DistributorWhyReserveEarly from "@/components/sections/become-distributor/DistributorWhyReserveEarly";

export default function BecomeDistributorPage() {
  return (
    <main>
      <DistributorHero />
      <DistributorTrustHighlights />
      <DistributorAbout />
      <DistributorHowItWorks />
      <DistributorWhoCanApply />
      {/* Closing CTA band — now the last thing before the footer, sending
          people to the dedicated /become-distributor/reserve checkout */}
      <DistributorWhyReserveEarly />
    </main>
  );
}