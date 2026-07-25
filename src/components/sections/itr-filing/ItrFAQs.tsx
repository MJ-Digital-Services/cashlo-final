"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Who needs to file an ITR?",
    a: "Anyone whose total income exceeds the basic exemption limit, or who meets certain other conditions (like foreign travel expenses, high electricity bills, or foreign assets), is required to file an ITR — even if their tax liability is nil.",
  },
  {
    q: "What's the difference between a belated and a revised return?",
    a: "A belated return is filed after missing the original deadline. A revised return is filed to correct an error or omission in a return that was already submitted on time. They serve different purposes and follow different rules.",
  },
  {
    q: "What happens if I file the wrong ITR form?",
    a: "Filing the wrong form can result in a defective return notice from the Income Tax Department, requiring you to refile with the correct form — which can delay processing and any refund.",
  },
  {
    q: "Can I file ITR without Form 16?",
    a: "Yes. Form 16 makes it easier, but salary and TDS details can also be pulled from your salary slips, Form 26AS, and the Annual Information Statement (AIS).",
  },
  {
    q: "How long does it take to get a refund after filing?",
    a: "Refund timelines vary, but filing early and ensuring your bank details, PAN, and Aadhaar are correctly linked helps avoid delays in processing.",
  },
];

export default function ItrFAQs() {
  const scope = useScrollReveal();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            FAQs
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-5xl divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-reveal>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-ink">{f.q}</span>
                  <span className="shrink-0 text-brand">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-ink/60">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p data-reveal className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink/40">
          This page is for general information only and isn't tax advice.
          For your specific situation, consult a tax professional or the
          official Income Tax e-filing portal.
        </p>
      </Container>
    </section>
  );
}