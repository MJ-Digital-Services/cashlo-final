import GoldLoanHero from "@/components/sections/gold-loan/GoldLoanHero";
import WhyChooseGoldLoan from "@/components/sections/gold-loan/WhyChooseGoldLoan";
import GoldLoanCalculator from "@/components/sections/gold-loan/GoldLoanCalculator";
import InterestRateBanner from "@/components/sections/gold-loan/InterestRateBanner";
import LoanBenefitsFeatures from "@/components/sections/gold-loan/LoanBenefitsFeatures";
import DocumentsRequired from "@/components/sections/gold-loan/DocumentsRequired";
import MoreAboutGoldLoan from "@/components/sections/gold-loan/MoreAboutGoldLoan";
import GoldLoanFAQs from "@/components/sections/gold-loan/GoldLoanFAQs";
import SupportedBy from "@/components/sections/SupportedBy";
import GoldLoanCTA from "@/components/sections/gold-loan/GoldLoanCTA";

export default function GoldLoanPage() {
  return (
    <main>
      <GoldLoanHero />
      <WhyChooseGoldLoan />
      <GoldLoanCalculator />
      <InterestRateBanner />
      <LoanBenefitsFeatures />
      <DocumentsRequired />
      <MoreAboutGoldLoan />
      <GoldLoanFAQs />
      <SupportedBy />
      <GoldLoanCTA />
    </main>
  );
}