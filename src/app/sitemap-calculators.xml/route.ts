import { getAllCalculatorsForSitemap } from "@/lib/api/calculators";
import { buildUrlsetXml, getSiteUrl, xmlResponse, type SitemapUrlEntry } from "@/lib/sitemapXml";

export async function GET(request: Request) {
  const siteUrl = getSiteUrl(request);
  const entries: SitemapUrlEntry[] = await getAllCalculatorsForSitemap()
    .then((items) =>
      items.map(
        (item): SitemapUrlEntry => ({
          url: `${siteUrl}/calculators/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "monthly",
          priority: 0.5,
        }),
      ),
    )
    .catch(() => []);

  return xmlResponse(buildUrlsetXml(entries));
}
