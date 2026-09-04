import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Cashlo",
  description:
    "How Cashlo (MJ Digital Services Private Limited) collects, uses, shares and protects your information.",
};

const EFFECTIVE_DATE = "4 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-surface pb-24 pt-16 text-ink dark:bg-[#09090B]">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-brand">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-ink/60">
            Brand: Cashlo &nbsp;|&nbsp; Legal Entity: MJ Digital Services
            Private Limited
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Registered/Business Address: D-19, First Floor, Abul Fazal
            Enclave, New Delhi, Delhi 110025
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Effective Date: {EFFECTIVE_DATE}
          </p>

          <div className="prose prose-sm mt-10 max-w-none prose-headings:font-bold prose-headings:text-ink prose-p:text-ink/70 prose-p:leading-relaxed prose-li:text-ink/70 dark:prose-invert">
            <p>
              Cashlo respects the privacy of merchants, customers, visitors,
              applicants, agents and other users of its website, mobile
              application and related services. This Privacy Policy explains
              what information may be collected, why it is collected, how it
              is used, with whom it may be shared, how it is protected, and
              the choices available to users.
            </p>
            <p>
              For policy administration, Cashlo is used as the
              consumer-facing brand and MJ Digital Services Private Limited
              is the legal entity responsible for the website/application and
              applicable services, subject to the terms of agreements with
              banks, payment processors, lending partners and other service
              providers.
            </p>

            <h2>1.1 Scope</h2>
            <p>
              This policy applies to the Cashlo website, mobile application,
              merchant dashboard, digital/assisted service interfaces,
              customer-support channels and other digital services operated
              or made available by MJ Digital Services Private Limited under
              the Cashlo brand.
            </p>

            <h2>1.2 Information We May Collect</h2>
            <p>
              Depending on the service used, we may collect: name, mobile
              number, email address, business/shop details, address,
              PAN/GST or other business identifiers, KYC information, bank
              account/payment details, transaction and settlement
              information, wallet/ledger information, device and application
              information, IP address, approximate location where enabled,
              login credentials or authentication information, support
              communications, consent records, and information required to
              process a loan/application or connect a user with a
              lending/financial partner.
            </p>

            <h2>1.3 Service-Specific Information</h2>
            <p>
              <strong>BBPS and bill-payment services:</strong>{" "}
              biller/customer reference information, transaction amount,
              biller category, transaction status and related service
              records.
            </p>
            <p>
              <strong>UPI Cash Point / cash-assisted services:</strong>{" "}
              merchant and transaction information necessary to process a
              customer payment and corresponding cash disbursement/assisted
              transaction, including applicable identifiers and audit
              records.
            </p>
            <p>
              <strong>Wallet / balance funding:</strong> payment, funding,
              wallet ID, amount, transaction reference, settlement and
              reconciliation information.
            </p>
            <p>
              <strong>Payment gateway:</strong> payment method, transaction
              reference, amount, status, risk/fraud signals and information
              provided by the gateway or banking partner.
            </p>
            <p>
              <strong>Sound speaker/device services:</strong> device
              identifier, activation/configuration details and transaction
              notification information necessary to deliver alerts.
            </p>
            <p>
              <strong>Quick Khata:</strong> entries relating to customers,
              suppliers, amounts, notes, dues and ledger activity entered by
              the merchant. Merchants are responsible for having appropriate
              authority/consent to enter third-party information where
              required.
            </p>
            <p>
              <strong>Loan marketplace/distribution:</strong> information
              needed to facilitate eligibility checks, application
              processing, verification and communication with the relevant
              lending/financial partner. Cashlo/MJ Digital Services Private
              Limited does not represent that it is itself the lender unless
              expressly stated for a particular product.
            </p>

            <h2>1.4 How We Use Information</h2>
            <p>
              We may use information to provide and operate services;
              authenticate users; process payments, wallet funding and
              transactions; maintain merchant ledgers; facilitate BBPS and
              assisted cash services; deliver device notifications; process
              commissions and settlements; facilitate loan applications with
              partners; prevent fraud and misuse; comply with legal and
              regulatory obligations; provide customer support; communicate
              service updates; improve products; maintain records and audit
              trails; and enforce agreements.
            </p>

            <h2>1.5 Sharing & Disclosure</h2>
            <p>
              Information may be shared, where necessary and lawful, with
              banks, payment aggregators/gateways, BBPS/biller ecosystem
              participants, UPI/cash-service partners, lending/financial
              institutions, KYC/verification providers, technology and cloud
              providers, communication providers, auditors, professional
              advisers, regulators, law-enforcement authorities and other
              vendors acting on our instructions or as required for a
              transaction/service.
            </p>
            <p>
              We do not sell personal information merely for advertising
              purposes. Where third-party service providers process
              information, access is limited to the purposes for which they
              are engaged and subject to applicable contractual, security
              and legal requirements.
            </p>

            <h2>1.6 Cookies & Similar Technologies</h2>
            <p>
              The website/app may use cookies, SDKs, logs and similar
              technologies for authentication, security, analytics,
              preferences, performance and service improvement. Users may
              control certain browser/device settings, although disabling
              essential technologies may affect functionality.
            </p>

            <h2>1.7 Data Security</h2>
            <p>
              We use reasonable technical, administrative and organizational
              safeguards appropriate to the nature of the information and
              services, including access controls, authentication,
              monitoring, encryption or secure transmission where
              appropriate, logging and vendor controls. No internet-based
              system can be guaranteed completely secure.
            </p>

            <h2>1.8 Data Retention</h2>
            <p>
              Information is retained for as long as reasonably necessary for
              the purposes described above, contractual obligations, dispute
              resolution, fraud prevention, audit, accounting,
              legal/regulatory requirements and legitimate business purposes.
              Different categories may be retained for different periods.
            </p>

            <h2>1.9 User Rights & Requests</h2>
            <p>
              Subject to applicable law and verification requirements, users
              may request access, correction, update or deletion of personal
              information where such action is legally available. Certain
              records may need to be retained or cannot be deleted where
              required by law, regulation, financial records, fraud
              prevention or contractual obligations.
            </p>

            <h2>1.10 Children</h2>
            <p>
              Cashlo&apos;s merchant services are intended for eligible
              adults/business users. We do not knowingly seek to collect
              personal information directly from children for independent
              use of merchant services.
            </p>

            <h2>1.11 Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. The
              revised version will be posted on the website/application with
              an updated effective date. Continued use after an update may
              constitute acceptance where permitted by law.
            </p>

            <h2>1.12 Privacy Contact</h2>
            <p>
              For privacy-related requests, users may contact Cashlo/MJ
              Digital Services Private Limited through the grievance/contact
              channel published on the website. The company may request
              reasonable information to verify identity before acting on a
              request.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}