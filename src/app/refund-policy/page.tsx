import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Refund & Dispute Policy | Cashlo",
  description:
    "How Cashlo handles refunds, reversals, cancellations and transaction disputes across its services.",
};

const EFFECTIVE_DATE = "4 September 2026";

export default function RefundPolicyPage() {
  return (
    <div className="bg-surface pb-24 pt-16 text-ink dark:bg-[#09090B]">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.09em] text-brand">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Refund, Cancellation &amp; Transaction Dispute Policy
          </h1>
          <p className="mt-3 text-sm text-ink/60">
            Brand: Cashlo &nbsp;|&nbsp; Legal Entity: MJ Digital Services
            Private Limited
          </p>
          <p className="mt-1 text-sm text-ink/60">Effective Date: {EFFECTIVE_DATE}</p>

          <div className="prose prose-sm mt-10 max-w-none prose-headings:font-bold prose-headings:text-ink prose-p:text-ink/70 prose-p:leading-relaxed prose-li:text-ink/70 dark:prose-invert">
            <p>
              This policy describes how Cashlo handles refunds, reversals,
              cancellations and transaction disputes for services available
              through its website/application. Because Cashlo operates
              multiple financial and assisted-payment services, the actual
              refund mechanism may depend on the service, transaction
              status, bank/payment gateway, biller, partner or regulatory
              framework applicable to that transaction.
            </p>

            <h2>2.1 General Principle</h2>
            <p>
              A successful transaction that has already resulted in a
              completed service, bill payment, cash payout, wallet credit or
              settlement is generally not cancellable merely because the
              user changes their mind. Refunds are considered where a
              transaction is failed, duplicated, reversed, incorrectly
              charged, or otherwise eligible under the applicable
              service/partner rules.
            </p>

            <h2>2.2 Wallet Funding</h2>
            <p>
              If a payment gateway shows a successful debit but the Cashlo
              wallet is not credited, the transaction will be subject to
              reconciliation. Where a refund is approved, it will normally be
              routed through the original payment method or the mechanism
              prescribed by the payment provider/partner. Cash withdrawal of
              wallet funds is not automatically available unless expressly
              supported by the applicable service.
            </p>

            <h2>2.3 BBPS / Bill Payments</h2>
            <p>
              For bill-payment transactions, refunds/reversals are subject to
              the transaction status and the applicable biller/BBPS
              ecosystem rules. A transaction shown as successful may not be
              refundable merely because the user later disputes the bill
              amount or service. Failed/duplicate transactions will be
              investigated and handled according to applicable partner
              rules.
            </p>

            <h2>2.4 UPI Cash Point / Assisted Cash Services</h2>
            <p>
              Where a customer payment is received through the
              merchant&apos;s QR/UPI flow and the merchant provides cash
              against the transaction, disputes must be supported by
              transaction details. Cash handed over by the merchant cannot
              automatically be recovered through a refund request. Any
              reversal, dispute or chargeback is subject to the underlying
              UPI/payment-partner process and applicable rules.
            </p>

            <h2>2.5 Payment Gateway Transactions</h2>
            <p>
              Gateway-related refunds, chargebacks and reversals are subject
              to the gateway/acquirer/bank process and transaction status.
              Cashlo may require the merchant to provide transaction ID,
              date, amount, payer details where legally permissible,
              screenshots and other evidence needed for investigation.
            </p>

            <h2>2.6 Quick Khata</h2>
            <p>
              Quick Khata is a record/ledger utility. Entries created by
              merchants are not, by themselves, payment transactions. Cashlo
              is not responsible for a commercial dispute between a merchant
              and the merchant&apos;s customer/supplier merely because the
              parties&apos; information was recorded in Quick Khata.
            </p>

            <h2>2.7 Loan Applications</h2>
            <p>
              Loan applications, processing, approval, disbursal, rejection,
              interest, fees and cancellation are governed by the relevant
              lender/financial partner&apos;s terms. Any refund of a
              lender/partner fee, where applicable, is determined by that
              partner and applicable law. Cashlo does not guarantee loan
              approval or disbursal.
            </p>

            <h2>2.8 How to Raise a Refund/Dispute</h2>
            <p>
              A user should raise the issue through Cashlo support/grievance
              channels as soon as possible, providing the registered mobile
              number, transaction ID/reference, date, amount, service used,
              description of the issue and supporting documents/screenshots.
              We may seek additional information to investigate.
            </p>

            <h2>2.9 Processing Time</h2>
            <p>
              Resolution and credit timelines vary by transaction type and
              partner. Where a refund is approved, the actual time for funds
              to appear may depend on the bank, card issuer, UPI/payment
              provider or other financial institution. Users should not
              treat a support acknowledgement as confirmation that a refund
              has been approved.
            </p>

            <h2>2.10 Fraudulent or Unauthorized Transactions</h2>
            <p>
              Users should report suspected unauthorized transactions
              immediately. Cashlo may investigate, restrict access, request
              verification and coordinate with relevant payment/banking
              partners. Users should also contact their bank/payment
              provider promptly where appropriate.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}