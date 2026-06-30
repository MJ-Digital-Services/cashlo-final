"use client";

import Marquee from "react-fast-marquee";
import Container from "@/components/ui/Container";
import { useState } from "react";

type Brand = { name: string; logo?: string };

const apps: Brand[] = [
  { name: "Paytm", logo: "/logos/paytm.svg" },
  { name: "Google Pay", logo: "/logos/gpay.svg" },
  { name: "BHIM", logo: "/logos/bhim.svg" },
  { name: "Navi", logo: "/logos/navi.svg" },
  { name: "WhatsApp Pay", logo: "/logos/whatsapp.svg" },
  { name: "CRED", logo: "/logos/cred.svg" },
  { name: "SBI YONO", logo: "/logos/yono.svg" },
  { name: "Axis Mobile", logo: "/logos/axis-mobile.svg" },
  { name: "PayZapp", logo: "/logos/payzapp.svg" },
  { name: "Kotak 811", logo: "/logos/kotak-811.svg" },
  { name: "Jio Finance", logo: "/logos/jio.svg" },
  { name: "Samsung Pay", logo: "/logos/samsung-pay.svg" },
];

const banks: Brand[] = [
  { name: "State Bank of India", logo: "/logos/sbi.svg" },
  { name: "HDFC Bank", logo: "/logos/hdfc.svg" },
  { name: "ICICI Bank", logo: "/logos/icici.svg" },
  { name: "Axis Bank", logo: "/logos/axis.svg" },
  { name: "Bank of Baroda", logo: "/logos/bob.svg" },
  { name: "Punjab National Bank", logo: "/logos/pnb.svg" },
  { name: "Union Bank", logo: "/logos/union.svg" },
  { name: "Kotak Mahindra", logo: "/logos/kotak.svg" },
  { name: "IDFC FIRST", logo: "/logos/idfc.svg" },
  { name: "YES BANK", logo: "/logos/yes.svg" },
  { name: "Federal Bank", logo: "/logos/federal.svg" },
  { name: "NSDL Payments Bank", logo: "/logos/nsdl.svg" },
];

function Logo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="px-2">
      <span className="grid h-14 place-items-center rounded-full border border-border bg-card px-5">
        {brand.logo && !failed ? (
          <img
            src={brand.logo}
            alt={brand.name}
            className="h-6 w-auto max-w-[120px] object-contain"
            draggable={false}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="whitespace-nowrap text-sm font-medium text-ink/70">
            {brand.name}
          </span>
        )}
      </span>
    </div>
  );
}

export default function SupportedBy() {
  return (
    <section className="overflow-hidden bg-surface py-24">
      <Container className="text-center">
        <p data-reveal className="text-sm font-semibold uppercase tracking-wider text-brand">
          Works Everywhere
        </p>
        <h2 data-reveal className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Supported Apps &amp; Banks
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-2xl text-lg text-ink/60">
          Customers can pay using any major UPI app, backed by a wide network of
          partner banks across India.
        </p>
      </Container>

      <div className="mt-14 flex flex-col gap-4">
        <Marquee pauseOnHover speed={40} gradient gradientColor="var(--surface)" gradientWidth={120}>
          {[...apps].map((b, i) => (
            <Logo key={`${b.name}-${i}`} brand={b} />
          ))}
        </Marquee>

        <Marquee pauseOnHover direction="right" speed={40} gradient gradientColor="var(--surface)" gradientWidth={120}>
          {[...banks].map((b, i) => (
            <Logo key={`${b.name}-${i}`} brand={b} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}