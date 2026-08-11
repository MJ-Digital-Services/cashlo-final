"use client";

import { useState } from "react";
import Image from "next/image";

const CERTIFICATIONS = [
  { name: "Business Correspondent Federation of India", short: "BCFI", logo: "/certifications/bcfi1.webp" },
  { name: "D-U-N-S Registered", short: "D-U-N-S", logo: "/certifications/duns1.webp" },
  { name: "Internet and Mobile Association of India", short: "IAMAI", logo: "/certifications/iamai1.webp" },
  { name: "ISO 27001 Certified", short: "ISO 27001", logo: "/certifications/iso-270011.webp" },
  { name: "ISO 9001:2015 Certified", short: "ISO 9001", logo: "/certifications/iso-90011.webp" },
];

export default function FooterAssociations() {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink/40">
        Certifications &amp; Associations
      </p>

      <div className="mt-3 flex flex-nowrap items-center gap-3 overflow-x-auto pb-1">
        {CERTIFICATIONS.map((c) => (
          <div
            key={c.logo}
            title={c.name}
            className="flex h-11 w-11 shrink-0 items-center justify-center opacity-90 transition-all duration-200 hover:scale-110 hover:opacity-100"
          >
            {failed[c.logo] ? (
              <span className="whitespace-nowrap rounded-md border border-border px-2 py-1 text-[9px] font-bold tracking-wide text-ink/70">
                {c.short}
              </span>
            ) : (
              <Image
                src={c.logo}
                alt={c.name}
                width={44}
                height={44}
                className="h-full w-full object-contain"
                onError={() => setFailed((s) => ({ ...s, [c.logo]: true }))}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}