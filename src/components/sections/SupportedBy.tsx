"use client";

import Container from "@/components/ui/Container";

const apps = [
  "Paytm", "Google Pay", "BHIM", "Navi", "WhatsApp Pay", "CRED",
  "SBI YONO", "Axis Mobile", "PayZapp", "Kotak 811", "Jio Finance", "Samsung Pay",
];

const banks = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Bank of Baroda", "Punjab National Bank", "Union Bank", "Kotak Mahindra",
  "IDFC FIRST", "YES BANK", "Federal Bank", "NSDL Payments Bank",
];

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // duplicate the list so the -50% translate loops seamlessly
  const loop = [...items, ...items];
  return (
    <div className="marquee" data-reverse={reverse ? "" : undefined}>
      <div className="marquee__track">
        {loop.map((x, i) => (
          <span key={`${x}-${i}`} className="marquee__pill" aria-hidden={i >= items.length}>
            {x}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SupportedBy() {
  return (
    <section className="overflow-hidden bg-surface py-24">
      <Container className="text-center">
        <p
          data-reveal
          className="text-sm font-semibold uppercase tracking-wider text-brand"
        >
          Works Everywhere
        </p>
        <h2
          data-reveal
          className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl"
        >
          Supported Apps &amp; Banks
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-2xl text-lg text-ink/60">
          Customers can pay using any major UPI app, backed by a wide network of
          partner banks across India.
        </p>
      </Container>

      <div className="mt-14 flex flex-col gap-4">
        <Row items={apps} />
        <Row items={banks} reverse />
      </div>
    </section>
  );
}