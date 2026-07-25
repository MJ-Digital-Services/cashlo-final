"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { IdCard, MapPin, CheckCircle2 } from "lucide-react";

const identityProof = [
  "Valid Passport",
  "Valid Driving Licence",
  "Voters' ID Card",
  "Aadhaar Card issued by UIDAI",
  "PAN Card or Form 60",
];

const addressProof = [
  "Valid Passport",
  "Valid Driving Licence",
  "Voters' ID Card",
  "Aadhaar Card issued by UIDAI",
  "Recent Utility Bill",
];

export default function DocumentsRequired() {
  const scope = useScrollReveal();

  return (
    <section ref={scope} className="bg-surface py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
            Get Started
          </p>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Documents Required
          </h2>
          <p data-reveal className="mt-4 text-lg text-ink/60">
            Any one of the following is enough for identity and address verification.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div data-reveal className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand">
                <IdCard className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <h3 className="font-semibold text-ink">Identity Proof</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {identityProof.map((doc) => (
                <li key={doc} className="flex items-center gap-2.5 text-sm text-ink/70">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-brand">
                <MapPin className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <h3 className="font-semibold text-ink">Address Proof</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {addressProof.map((doc) => (
                <li key={doc} className="flex items-center gap-2.5 text-sm text-ink/70">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}