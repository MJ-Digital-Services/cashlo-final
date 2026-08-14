'use client';

import * as React from 'react';
import { ToastProvider } from '@/components/sections/become-merchant/shared/Toast';
import Hero from '@/components/sections/become-merchant/Hero';
import QuickActions from '@/components/sections/become-merchant/QuickActions';
import LeadSection from '@/components/sections/become-merchant/LeadSection';
import WhyJoin from '@/components/sections/become-merchant/WhyJoin';
import EarningsCalculator from '@/components/sections/become-merchant/EarningsCalculator';
import Benefits from '@/components/sections/become-merchant/Benefits';
import WhoCanJoin from '@/components/sections/become-merchant/WhoCanJoin';
import HowItWorks from '@/components/sections/become-merchant/HowItWorks';
import DashboardShowcase from '@/components/sections/become-merchant/DashboardShowcase';
import WhyMerchantsLove from '@/components/sections/become-merchant/WhyMerchantsLove';
import Testimonials from '@/components/sections/become-merchant/Testimonials';
import Faq from '@/components/sections/become-merchant/Faq';
import FinalCta from '@/components/sections/become-merchant/FinalCta';
import RegistrationForm from '@/components/sections/become-merchant/RegistrationForm';
import StickyMobileCta from '@/components/sections/become-merchant/StickyMobileCta';
import LeadModal from '@/components/sections/become-merchant/LeadModal';

export default function BecomeMerchantPage() {
  const [modal, setModal] = React.useState<'sales' | 'distributor' | null>(null);

  const scrollToRegister = React.useCallback(() => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  const openSales = React.useCallback(() => setModal('sales'), []);
  const openDistributor = React.useCallback(() => setModal('distributor'), []);

  return (
    <ToastProvider>
      <main className="relative bg-white pb-24 lg:pb-0 dark:bg-[#0B1020]">
        <Hero onBecomeMerchant={scrollToRegister} />
        <QuickActions onContactSales={openSales} onContactDistributor={openDistributor} />
        <LeadSection />
        <WhyJoin onBecomeMerchant={scrollToRegister} />
        <EarningsCalculator onBecomeMerchant={scrollToRegister} />
        <Benefits />
        <WhoCanJoin />
        <HowItWorks />
        <DashboardShowcase />
        <WhyMerchantsLove onBecomeMerchant={scrollToRegister} />
        <Testimonials />
        <Faq />
        <FinalCta onContactSales={openSales} />
        <RegistrationForm />

        <StickyMobileCta onBecomeMerchant={scrollToRegister} />
        <LeadModal open={modal !== null} kind={modal ?? 'sales'} onClose={() => setModal(null)} />
      </main>
    </ToastProvider>
  );
}