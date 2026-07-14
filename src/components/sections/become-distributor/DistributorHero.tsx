import Container from "@/components/ui/Container";

export default function DistributorHero() {
  return (
    <section className="bg-bg pt-32 pb-16 sm:pt-40 sm:pb-20">
      <Container className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">
          Exclusive Opportunity
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Become a Cashlo Distributor
        </h1>
        <p className="mt-5 text-lg font-medium text-ink/80">
          Reserve your area&apos;s PIN Code today and build your own merchant network with recurring
          monthly income.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-ink/60">
          Cashlo is offering an exclusive opportunity to become an authorized distributor in your
          locality. By reserving your area&apos;s PIN Code, you get the first right to onboard merchants
          in that territory and earn commissions from their business. Only one distributor is allowed per
          PIN Code.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#reserve"
            className="w-full rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark sm:w-auto"
          >
            Reserve My PIN Code
          </a>
          <a
            href="#how-it-works"
            className="w-full rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand sm:w-auto"
          >
            Know How It Works
          </a>
        </div>
      </Container>
    </section>
  );
}