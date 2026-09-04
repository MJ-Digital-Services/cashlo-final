import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Use | Cashlo",
  description:
    "The terms governing access to and use of the Cashlo website, application and merchant services.",
};

const EFFECTIVE_DATE = "4 September 2026";

export default function TermsOfUsePage() {
  return (
    <div className="bg-surface pb-24 pt-16 text-ink dark:bg-[#09090B]">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-brand">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Website &amp; Application Terms of Use
          </h1>
          <p className="mt-3 text-sm text-ink/60">
            Brand: Cashlo &nbsp;|&nbsp; Legal Entity: MJ Digital Services
            Private Limited
          </p>
          <p className="mt-1 text-sm text-ink/60">Effective Date: {EFFECTIVE_DATE}</p>

          <div className="prose prose-sm mt-10 max-w-none prose-headings:font-bold prose-headings:text-ink prose-p:text-ink/70 prose-p:leading-relaxed prose-li:text-ink/70 dark:prose-invert">
            <p>
              These Terms govern access to and use of the Cashlo
              website/application and related merchant services provided by
              MJ Digital Services Private Limited, subject to separate
              agreements and service-specific terms.
            </p>

            <h2>4.1 Eligibility &amp; Account</h2>
            <p>
              Users must provide accurate information, maintain account
              security and use the services only for lawful business and
              personal purposes permitted by the applicable service. Cashlo
              may require KYC/business verification and may suspend or
              restrict accounts where required for security, fraud
              prevention, compliance or breach of terms.
            </p>

            <h2>4.2 Merchant Responsibilities</h2>
            <p>
              Merchants are responsible for safeguarding credentials and
              devices; obtaining required customer permissions; entering
              accurate transaction/ledger information; maintaining
              appropriate business records; complying with applicable tax,
              consumer-protection, payment and other laws; and not using
              Cashlo to facilitate unlawful transactions.
            </p>

            <h2>4.3 No Guarantee of Service Availability</h2>
            <p>
              Services may occasionally be unavailable or delayed due to
              maintenance, network issues, bank/payment-provider outages,
              biller issues, device failures, force majeure or other
              circumstances beyond reasonable control.
            </p>

            <h2>4.4 Third-Party Services</h2>
            <p>
              Certain services may be provided or fulfilled through
              third-party banks, payment providers, billers, lending
              institutions, KYC vendors, technology providers or other
              partners. Their terms, privacy notices and eligibility
              requirements may also apply.
            </p>

            <h2>4.5 Intellectual Property</h2>
            <p>
              Cashlo branding, software, content, interfaces, logos and
              other materials are owned by or licensed to MJ Digital
              Services Private Limited or relevant licensors and may not be
              copied, modified or commercially exploited without
              authorization.
            </p>

            <h2>4.6 Prohibited Activities</h2>
            <p>
              Users must not attempt unauthorized access, reverse engineer
              or disrupt the platform, misuse payment systems, submit false
              information, conduct fraud, use another person&apos;s account,
              or use the services for prohibited/unlawful activities.
            </p>

            <h2>4.7 Limitation</h2>
            <p>
              To the extent permitted by applicable law, Cashlo&apos;s
              responsibility for third-party service failures is limited by
              the applicable contractual and legal framework. Nothing in
              these Terms excludes liability that cannot legally be
              excluded.
            </p>

            <h2>5. Consent &amp; Electronic Communications</h2>
            <p>
              By accessing or using Cashlo services, users acknowledge that
              electronic records, notifications, transaction confirmations,
              statements, service communications and policy notices may be
              provided electronically through the application, website, SMS,
              email, WhatsApp or other permitted channels, subject to
              applicable law and user preferences.
            </p>
            <p>
              Where a service requires specific consent, authorization, KYC,
              disclosure or acknowledgement, Cashlo may collect and retain
              the relevant consent record. Users should read
              service-specific terms before completing a transaction or
              application.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}