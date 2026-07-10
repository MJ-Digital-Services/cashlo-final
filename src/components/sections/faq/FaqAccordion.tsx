"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type FaqItem = { q: string; a: string };
type FaqGroup = { category: string; items: FaqItem[] };

const faqGroups: FaqGroup[] = [
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

export default function FaqAccordion() {
  const scope = useScrollReveal();
  const [openId, setOpenId] = useState<string | null>("General-0");

  return (
    <section ref={scope} className="bg-bg py-20 sm:py-24">
      <Container className="max-w-3xl">
        <div data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">
            Got Questions?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div data-reveal className="mt-12 space-y-10">
          {faqGroups.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink/40">
                {group.category}
              </h3>
              <div className="mt-4 divide-y divide-border border-t border-border">
                {group.items.map((item, i) => {
                  const id = `${group.category}-${i}`;
                  const isOpen = openId === id;
                  return (
                    <div key={id}>
                      <button
                        onClick={() => setOpenId(isOpen ? null : id)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-base font-medium text-ink">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p className="pb-4 text-sm leading-relaxed text-ink/60">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}