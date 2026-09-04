import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Grievance Redressal | Cashlo",
  description:
    "How to raise a complaint with Cashlo and how grievances are acknowledged, escalated and resolved.",
};

const EFFECTIVE_DATE = "4 September 2026";

// TODO: replace placeholders with the company's actual monitored contact
// details before this page goes live.
const GRIEVANCE_EMAIL = "[INSERT OFFICIAL GRIEVANCE EMAIL]";
const GRIEVANCE_PHONE = "[INSERT OFFICIAL SUPPORT/GRIEVANCE NUMBER]";
const GRIEVANCE_OFFICER = "[INSERT NAME/DESIGNATION BEFORE PUBLICATION]";

export default function GrievanceRedressalPage() {
  return (
    <div className="bg-surface pb-24 pt-16 text-ink dark:bg-[#09090B]">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-brand">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Grievance Redressal &amp; Customer Support Policy
          </h1>
          <p className="mt-3 text-sm text-ink/60">
            Brand: Cashlo &nbsp;|&nbsp; Legal Entity: MJ Digital Services
            Private Limited
          </p>
          <p className="mt-1 text-sm text-ink/60">Effective Date: {EFFECTIVE_DATE}</p>

          <div className="prose prose-sm mt-10 max-w-none prose-headings:font-bold prose-headings:text-ink prose-p:text-ink/70 prose-p:leading-relaxed prose-li:text-ink/70 dark:prose-invert">
            <p>
              Cashlo is committed to providing a structured mechanism for
              customers and merchants to raise complaints regarding
              services, transactions, privacy, payments, wallet funding,
              assisted cash transactions, device services, Quick Khata and
              other matters.
            </p>

            <h2>3.1 What Can Be Raised</h2>
            <p>
              Complaints may include failed or disputed transactions,
              wallet-credit issues, payment gateway issues, unauthorized
              activity, service errors, merchant-account issues,
              device/sound-speaker issues, data/privacy concerns, incorrect
              charges, loan-service facilitation concerns and other
              service-related complaints.
            </p>

            <h2>3.2 Complaint Submission</h2>
            <p>
              Users should submit a complaint through the customer-support/
              grievance contact details displayed on the Cashlo
              website/application. The complaint should contain the
              user&apos;s name, registered mobile number,
              transaction/reference ID where applicable, date/time, amount,
              service, issue description and supporting evidence.
            </p>

            <h2>3.3 Grievance Officer / Nodal Contact</h2>
            <div className="not-prose rounded-2xl border border-border bg-card p-5 text-sm text-ink/70">
              <p>
                <strong className="text-ink">Entity:</strong> MJ Digital
                Services Private Limited
              </p>
              <p className="mt-1.5">
                <strong className="text-ink">Brand:</strong> Cashlo
              </p>
              <p className="mt-1.5">
                <strong className="text-ink">Address:</strong> D-19, First
                Floor, Abul Fazal Enclave, New Delhi, Delhi 110025
              </p>
              <p className="mt-1.5">
                <strong className="text-ink">Email:</strong> {GRIEVANCE_EMAIL}
              </p>
              <p className="mt-1.5">
                <strong className="text-ink">Phone:</strong> {GRIEVANCE_PHONE}
              </p>
              <p className="mt-1.5">
                <strong className="text-ink">Grievance Officer:</strong>{" "}
                {GRIEVANCE_OFFICER}
              </p>
            </div>
            <p className="mt-4 text-xs italic text-ink/50">
              The above placeholders should be replaced with the
              company&apos;s actual monitored email address, phone number and
              designated officer before publication. Do not publish a
              personal email/number unless the company intends to monitor it
              for formal grievances.
            </p>

            <h2>3.4 Acknowledgement &amp; Resolution</h2>
            <p>
              Complaints will be logged and investigated based on the
              information available. The company will endeavor to
              acknowledge and resolve complaints within applicable legal,
              regulatory, partner and internal service timelines. Where
              resolution depends on a bank, payment provider, biller,
              lending partner or other third party, the user may be informed
              that the matter is under partner investigation.
            </p>

            <h2>3.5 Escalation</h2>
            <p>
              If a complaint is not resolved satisfactorily through
              first-level support, the user may escalate it through the
              grievance contact designated by Cashlo. For regulated
              payment/banking/lending services, the applicable partner&apos;s
              escalation and regulatory complaint mechanisms may also apply.
            </p>

            <h2>3.6 Fraud &amp; Security Complaints</h2>
            <p>
              Urgent suspected fraud or unauthorized transactions should be
              reported immediately through the available Cashlo support
              channel and, where relevant, to the user&apos;s bank/payment
              provider and appropriate authorities. Users should never share
              OTPs, PINs, passwords or confidential authentication
              credentials with support personnel.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}