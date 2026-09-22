import { getBlogs } from "@/lib/blogApi";
import { buildUrlsetXml, getSiteUrl, xmlResponse, type SitemapUrlEntry } from "@/lib/sitemapXml";

export async function GET(request: Request) {
  const siteUrl = getSiteUrl(request);
  const entries: SitemapUrlEntry[] = await getBlogs({ limit: "1000" })
    .then(({ blogs }) =>
      blogs
        .filter((b) => b.isPublished)
        .map(
          (b): SitemapUrlEntry => ({
            url: `${siteUrl}/blog/${b.slug}`,
            lastModified: b.updatedAt ?? b.publishedAt ?? undefined,
            changeFrequency: "weekly",
            priority: 0.6,
          }),
        ),
    )
    .catch(() => []);

  return xmlResponse(buildUrlsetXml(entries));
}
