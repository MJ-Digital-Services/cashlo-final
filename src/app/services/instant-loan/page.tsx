import InstantLoanHero from "@/components/sections/instant-loan/InstantLoanHero";
import WhyChooseInstantLoan from "@/components/sections/instant-loan/WhyChooseInstantLoan";
import EligibilityCriteria from "@/components/sections/instant-loan/EligibilityCriteria";
import DocumentsRequired from "@/components/sections/instant-loan/DocumentsRequired";
import HowItWorks from "@/components/sections/instant-loan/HowItWorks";
import EmiCalculatorsPromo from "@/components/sections/instant-loan/EmiCalculatorsPromo";
import InstantLoanFAQs from "@/components/sections/instant-loan/InstantLoanFAQs";
import SupportedBy from "@/components/sections/SupportedBy";
import InstantLoanCTA from "@/components/sections/instant-loan/InstantLoanCTA";

export default function InstantLoanPage() {
  return (
    <main>
      <InstantLoanHero />
      <WhyChooseInstantLoan />
      <EligibilityCriteria />
      <DocumentsRequired />
      <HowItWorks />
      <EmiCalculatorsPromo />
      <InstantLoanFAQs />
      <SupportedBy />
      <InstantLoanCTA />
    </main>
  );
}