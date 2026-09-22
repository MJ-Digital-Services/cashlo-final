import { getAllCalculatorSlugs } from "@/lib/api/calculators";
import { buildUrlsetXml, getSiteUrl, xmlResponse, type SitemapUrlEntry } from "@/lib/sitemapXml";

export async function GET(request: Request) {
  const siteUrl = getSiteUrl(request);
  const entries: SitemapUrlEntry[] = await getAllCalculatorSlugs()
    .then((slugs) =>
      slugs.map(
        (slug): SitemapUrlEntry => ({
          url: `${siteUrl}/calculators/${slug}`,
          changeFrequency: "monthly",
          priority: 0.5,
        }),
      ),
    )
    .catch(() => []);

  return xmlResponse(buildUrlsetXml(entries));
}
