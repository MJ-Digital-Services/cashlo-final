const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api/v1";

export type CalculatorType = {
  _id: string;
  name: string;
  key: "emi" | "sip" | "swp" | "fd" | "rd";
  slug: string;
  icon: string;
  shortDescription: string;
};

export type Faq = { question: string; answer: string };

export type CalculatorDefaults = {
  amount: number;
  rate: number;
  minRate: number;
  maxRate: number;
  years: number;
  minYears: number;
  maxYears: number;
};

export type CalculatorVariantSummary = {
  slug: string;
  title: string;
  bankName?: string;
};

export type CalculatorPage = {
  _id: string;
  calculatorType: CalculatorType;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  isBankVariant: boolean;
  bankName?: string;
  logo?: string;
  defaults: CalculatorDefaults;
  blurb?: string;
  articleContent?: string;
  faqs: Faq[];
};

async function apiFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  const json = await res.json();
  return json.data as T;
}

export async function getCalculatorBySlug(slug: string) {
  return apiFetch<{ calculator: CalculatorPage; variants: CalculatorVariantSummary[] }>(
    `/calculators/${slug}`
  );
}

export async function getAllCalculatorSlugs() {
  return apiFetch<string[]>(`/calculators/slugs`);
}

export type CalculatorSitemapEntry = { slug: string; updatedAt: string };

export async function getAllCalculatorsForSitemap() {
  return apiFetch<CalculatorSitemapEntry[]>(`/calculators/sitemap`);
}

export async function getFeaturedCalculators() {
  return apiFetch<CalculatorVariantSummary[]>(`/calculators/featured`);
}