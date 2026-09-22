import { getSiteUrl } from "@/lib/sitemapXml";

// A genuine <sitemapindex> at the conventional /sitemap.xml location,
// pointing at the three content-type sub-sitemaps (sibling route.ts files
// under sitemap-static.xml/, sitemap-blog.xml/, sitemap-calculators.xml/).
//
// These are plain Route Handlers, not Next's special `sitemap.ts` metadata
// file convention — that convention reserves the literal /sitemap.xml URL
// for itself even when you use its own generateSitemaps() multi-file
// support (which remaps to /sitemap/<id>.xml instead), so it's impossible
// to have Next.js *also* serve a combining index at /sitemap.xml through
// that mechanism. Route Handlers avoid the conflict entirely and give full
// control over this exact shape: index at /sitemap.xml, as most tools and
// people expect by convention.
const SUB_SITEMAPS = ["sitemap-static.xml", "sitemap-blog.xml", "sitemap-calculators.xml"];

export async function GET(request: Request) {
  const siteUrl = getSiteUrl(request);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SUB_SITEMAPS.map((path) => `  <sitemap>\n    <loc>${siteUrl}/${path}</loc>\n  </sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}
