export type FaqItem = { q: string; a: string };
export type FaqGroup = { category: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    category: "General",
    items: [
      {
        q: "What is Cashlo?",
        a: "Cashlo is a fintech platform that turns local retail stores into digital banking points, starting with UPI CashPoint for cardless cash withdrawal.",
      },
      {
        q: "Is Cashlo available in my city?",
        a: "We're actively expanding across rural and semi-urban India. Check with your nearest participating retailer or contact us to find a Cashlo point near you.",
      },
      {
        q: "Do I need the Cashlo app to use these services?",
        a: "No — customers only need any UPI app to transact at a Cashlo merchant. Merchants use the Cashlo app to offer these services.",
      },
    ],
  },
  {
    category: "UPI CashPoint",
    items: [
      {
        q: "How do I withdraw cash using UPI CashPoint?",
        a: "Simply scan the merchant's QR code with any UPI app, enter the amount, and authorize the payment. The merchant hands you the cash instantly.",
      },
      {
        q: "Is there a withdrawal limit?",
        a: "Yes, daily withdrawal limits apply per RBI/NPCI guidelines. Exact limits are shown at the point of transaction.",
      },
      {
        q: "What if my transaction fails but money is deducted?",
        a: "Failed transactions are auto-reversed within standard banking timelines. Contact our support if the refund doesn't reflect within 24-48 hours.",
      },
    ],
  },
  {
    category: "QuickKhata",
    items: [
      {
        q: "What is QuickKhata?",
        a: "QuickKhata is a digital ledger that lets merchants record customer credit digitally, replacing traditional paper khata books.",
      },
      {
        q: "Can customers see their own khata balance?",
        a: "Yes, customers can view their outstanding balance and payment history shared by the merchant.",
      },
    ],
  },
  {
    category: "Becoming a Merchant",
    items: [
      {
        q: "How do I become a Cashlo merchant?",
        a: "Tap 'Become Merchant' on our website or app, complete a simple KYC process, and start offering services within days.",
      },
      {
        q: "What documents do I need to onboard?",
        a: "You'll need a valid ID proof, address proof, and your bank account details linked to UPI.",
      },
      {
        q: "Are there any charges to become a merchant?",
        a: "Onboarding is free. Merchants earn a commission on every transaction processed through their store.",
      },
    ],
  },
  {
    category: "Security & Support",
    items: [
      {
        q: "Is my money safe with Cashlo?",
        a: "All transactions run on secure, RBI-compliant UPI rails. Cashlo never holds customer funds directly.",
      },
      {
        q: "How do I reach support if I face an issue?",
        a: "You can reach our support team via the Contact page, in-app chat, or the helpline number listed in the app.",
      },
    ],
  },
];
