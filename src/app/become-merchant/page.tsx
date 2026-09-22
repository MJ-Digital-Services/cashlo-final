import BecomeMerchantClient from '@/components/sections/become-merchant/BecomeMerchantClient';
import { becomeMerchantFaqs } from '@/lib/data/faqs/become-merchant';
import { breadcrumbSchema, faqSchema, jsonLdScript, SITE_URL, SITE_NAME, SITE_OG_IMAGE } from '@/lib/schema';
import type { Metadata } from 'next';

const title = 'Become a Merchant | Cashlo';
const description = 'Turn your shop into a Cashlo merchant — accept UPI payments, offer banking services, and earn commission on every transaction.';
const url = `${SITE_URL}/become-merchant`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: 'index,follow',
  openGraph: { title, description, url, siteName: SITE_NAME, type: 'website', images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] },
  twitter: { card: 'summary_large_image', title, description, images: [SITE_OG_IMAGE] },
};

export default function BecomeMerchantPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema([{ name: 'Home', url: SITE_URL }, { name: 'Become a Merchant', url }]))}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(faqSchema(becomeMerchantFaqs))} />
      <BecomeMerchantClient />
    </>
  );
}
