"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { faqGroups } from "@/lib/data/faqs/general";

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