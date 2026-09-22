import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Derived from the actual incoming request's host rather than hardcoded,
  // so this points at localhost:3000 in dev and the real domain in
  // production/previews with zero per-environment config — same reasoning
  // as getSiteUrl() in lib/sitemapXml.ts, used by the sitemap routes below.
  const headerList = await headers();
  const host = headerList.get("host") ?? "www.cashlo.app";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Mid-flow / transactional steps — nothing a search result should
        // ever land a visitor on directly.
        disallow: [
          "/become-distributor/reserve",
          "/become-distributor/choose",
          "/become-distributor/complete-payment",
          "/become-distributor/pending",
          "/become-distributor/thanks",
          "/become-merchant/success",
          "/api/",
        ],
      },
    ],
    // /sitemap.xml is a proper <sitemapindex> (see app/sitemap.xml/route.ts)
    // listing the three content-type sub-sitemaps itself — just the one
    // entry needed here.
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
