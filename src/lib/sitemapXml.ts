export interface SitemapUrlEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function buildUrlsetXml(entries: SitemapUrlEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [`<loc>${escapeXml(entry.url)}</loc>`];
      if (entry.lastModified) parts.push(`<lastmod>${entry.lastModified}</lastmod>`);
      if (entry.changeFrequency) parts.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
      if (entry.priority !== undefined) parts.push(`<priority>${entry.priority}</priority>`);
      return `  <url>\n    ${parts.join("\n    ")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}

// Derives the site's own origin from the incoming request rather than a
// hardcoded constant, so these URLs are correct wherever this is actually
// running — localhost:3000 in dev, a Vercel preview URL, or production —
// with zero per-environment config.
export function getSiteUrl(request: Request): string {
  return new URL(request.url).origin;
}
