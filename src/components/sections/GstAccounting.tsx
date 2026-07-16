"use client";

import Container from "@/components/ui/Container";
import { useHangingDocs } from "@/hooks/useHangingDocs";
import {
  FileCheck,
  FileText,
  Receipt,
  Calculator,
  BarChart3,
  FolderOpen,
} from "lucide-react";

const services = [
  {
    icon: FileCheck,
    label: "GST Registration",
    desc: "Get your business GST registered quickly.",
  },
  {
    icon: FileText,
    label: "GST Filing",
    desc: "File your GST returns on time, every time.",
  },
  {
    icon: Receipt,
    label: "ITR Filing",
    desc: "Simple income tax return filing support.",
  },
  {
    icon: Calculator,
    label: "Accounting Support",
    desc: "Professional bookkeeping for your shop.",
  },
  {
    icon: BarChart3,
    label: "Business Reports",
    desc: "Track your business performance clearly.",
  },
  {
    icon: FolderOpen,
    label: "Financial Documentation",
    desc: "Keep all your financial records organized.",
  },
];

/* horizontal position (% of the stage) and string length (px) per card —
   varied lengths make the row feel hand-hung rather than templated */
const layout = [
  { left: "4%", string: 96 },
  { left: "21%", string: 168 },
  { left: "38%", string: 64 },
  { left: "55%", string: 190 },
  { left: "72%", string: 110 },
  { left: "89%", string: 150 },
];

export default function GstAccounting() {
  const scope = useHangingDocs();

  return (
    <section className="bg-surface pb-24">
      <Container>
        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* Hanging documents — strings pinned to the very top of the section,
              i.e. the seam with the previous section */}
          <div ref={scope} className="hang-stage relative h-[480px] sm:h-[520px]">
            {services.map((s, i) => (
              <div
                key={s.label}
                data-hang-item
                className="hang-item"
                style={{ left: layout[i].left }}
              >
                <div data-hang-swing className="hang-swing">
                  <div
                    data-hang-string
                    className="hang-string"
                    style={{ height: layout[i].string }}
                  />
                  <span className="hang-pin" aria-hidden="true" />
                  <div data-hang-card className="hang-card">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 text-brand">
                      <s.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink">
                        {s.label}
                      </h3>
                      <p className="mt-1.5 text-xs leading-snug text-ink/55">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* <p className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 text-sm font-medium text-ink/40">
              Grab a card · give it a swing
            </p> */}
          </div>

          {/* Copy */}
          <div className="pt-24">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              Complete Business Compliance
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              GST &amp; Accounting, Handled
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/60">
              Manage your business paperwork without hassle. Everything your
              business needs&mdash;under one roof.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}