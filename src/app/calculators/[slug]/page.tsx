import { notFound } from "next/navigation";
import Image from "next/image";
import { getCalculatorBySlug, getAllCalculatorSlugs } from "@/lib/api/calculators";
import { getBankBySlug } from "@/lib/data/banks";
import EmiCalculatorWidget from "@/components/sections/calculators/EmiCalculatorWidget";
import CalculatorSidebar from "@/components/sections/calculators/CalculatorSidebar";
import CalculatorFaq from "@/components/sections/calculators/CalculatorFaq";


export async function generateStaticParams() {
  try {
    const slugs = await getAllCalculatorSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    // If the backend is unreachable/slow at build time, don't fail the
    // whole deployment — just skip static pre-rendering for calculators.
    // Pages still work; they'll render on-demand at request time instead
    // (App Router defaults to dynamicParams: true).
    console.error("[calculators] Failed to fetch slugs for generateStaticParams:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { calculator } = await getCalculatorBySlug(slug);
    return {
      title: calculator.metaTitle || calculator.title,
      description: calculator.metaDescription,
    };
  } catch {
    return {
      title: "EMI Calculator | Cashlo",
    };
  }
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCalculatorBySlug(slug).catch(() => null);
  if (!data) notFound();

  const { calculator, variants } = data;
  const bank = calculator.isBankVariant ? getBankBySlug(calculator.slug) : undefined;

  return (
    <section className="bg-bg pb-24 pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <header className="max-w-2xl">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
            <span className="h-px w-6 bg-brand" />
            {calculator.isBankVariant ? calculator.bankName : "Calculator"}
          </p>
          <div className="mt-3 flex items-center gap-4">
            {bank && (
              <span className="flex h-10 w-auto max-w-[120px] shrink-0 items-center">
                <Image
                  src={bank.logo}
                  alt={`${bank.name} logo`}
                  width={120}
                  height={40}
                  className="h-full w-auto object-contain"
                />
              </span>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-[2.5rem] sm:leading-[1.15]">
              {calculator.title}
            </h1>
          </div>
          {calculator.blurb && (
            <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
              {calculator.blurb}
            </p>
          )}
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <EmiCalculatorWidget defaults={calculator.defaults} />

            {calculator.articleContent && (
              <div
                className="prose prose-sm mt-14 max-w-none text-ink/70 prose-headings:text-ink prose-a:text-brand"
                dangerouslySetInnerHTML={{ __html: calculator.articleContent }}
              />
            )}

            <CalculatorFaq faqs={calculator.faqs} />
          </div>

          <CalculatorSidebar variants={variants} currentSlug={calculator.slug} />
        </div>
      </div>
    </section>
  );
}