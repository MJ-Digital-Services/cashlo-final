import { buildUrlsetXml, getSiteUrl, xmlResponse, type SitemapUrlEntry } from "@/lib/sitemapXml";

// Static marketing/content routes worth indexing. Deliberately excludes
// mid-flow / transactional pages (become-distributor's reserve/choose/
// complete-payment/pending/thanks steps, become-merchant/success) — those
// aren't destinations anyone should land on from search, they're steps in
// an active session.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: SitemapUrlEntry["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/gold-loan", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/instant-loan", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/itr-filing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services/recharge-bills", priority: 0.6, changeFrequency: "monthly" },
  { path: "/become-merchant", priority: 0.8, changeFrequency: "weekly" },
  { path: "/become-distributor", priority: 0.8, changeFrequency: "weekly" },
  { path: "/upi-cashpoint", priority: 0.6, changeFrequency: "monthly" },
  { path: "/quickkhata", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms-of-use", priority: 0.2, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/grievance-redressal", priority: 0.2, changeFrequency: "yearly" },
];

export async function GET(request: Request) {
  const siteUrl = getSiteUrl(request);
  const entries: SitemapUrlEntry[] = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return xmlResponse(buildUrlsetXml(entries));
}
