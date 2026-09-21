// Blog data now lives in the Payload CMS (cashlo-cms / cms.cashlo.app),
// not cashlo-backend. See cashlo-cms/CLAUDE.md for why (separate deploy,
// separate DB, separate auth from the distributor-leads pipeline).
//
// `content`/`faqs[].answer` come back from this file as plain HTML strings
// (Payload's `contentHTML`/`answerHTML` virtual fields, converted
// server-side in cashlo-cms from Lexical JSON) — this repo intentionally
// never depends on @payloadcms/richtext-lexical or parses Lexical itself.

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3300";

export interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  coverImage?: string | null;
  tags: string[];
  readTime?: string | null;
  content?: string;
  faqs?: { question: string; answer: string }[];
  faqsTitle?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrlOverride?: string | null;
  robots?: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdBy?: { name: string };
  relatedPosts?: { slug: string; title: string; coverImage?: string | null }[];
  updatedAt?: string;
}

export interface GroupedBlogs {
  category: BlogCategory;
  blogs: Blog[];
}

// --- Payload's raw REST response shapes (only the fields we use) ---

interface PayloadMedia {
  url?: string;
}

interface PayloadCategory {
  id: string;
  name: string;
  slug: string;
}

interface PayloadPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: PayloadCategory | null;
  featuredImage?: PayloadMedia | null;
  tags?: { tag: string }[];
  readingTimeMinutes?: number | null;
  contentHTML?: string;
  faqsTitle?: string;
  faqs?: { question: string; answerHTML?: string }[];
  meta?: { title?: string; description?: string }; // from @payloadcms/plugin-seo
  canonicalUrlOverride?: string | null;
  robots?: string;
  robotsNoarchive?: boolean;
  _status?: "draft" | "published";
  publishedAt?: string | null;
  authorName?: string;
  relatedPosts?: Array<{ slug: string; title: string; featuredImage?: PayloadMedia | null }>;
  updatedAt?: string;
}

interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
}

const mapPost = (doc: PayloadPost): Blog => ({
  _id: doc.id,
  title: doc.title,
  slug: doc.slug,
  excerpt: doc.excerpt,
  category: doc.category
    ? { _id: doc.category.id, name: doc.category.name, slug: doc.category.slug }
    : { _id: "", name: "", slug: "" },
  coverImage: doc.featuredImage?.url ?? null,
  tags: (doc.tags ?? []).map((t) => t.tag),
  readTime: doc.readingTimeMinutes ? `${doc.readingTimeMinutes} min read` : null,
  content: doc.contentHTML ?? "",
  faqs: (doc.faqs ?? []).map((f) => ({ question: f.question, answer: f.answerHTML ?? "" })),
  faqsTitle: doc.faqsTitle,
  metaTitle: doc.meta?.title,
  metaDescription: doc.meta?.description,
  canonicalUrlOverride: doc.canonicalUrlOverride,
  robots: doc.robotsNoarchive ? `${doc.robots ?? "index,follow"},noarchive` : doc.robots,
  isPublished: doc._status === "published",
  publishedAt: doc.publishedAt ?? null,
  createdBy: { name: doc.authorName ?? "Cashlo Team" },
  relatedPosts: (doc.relatedPosts ?? []).map((p) => ({
    slug: p.slug,
    title: p.title,
    coverImage: p.featuredImage?.url ?? null,
  })),
  updatedAt: doc.updatedAt,
});

export async function getBlogs(params?: { limit?: string; category?: string }) {
  const query = new URLSearchParams({ depth: "2", sort: "-publishedAt" });
  if (params?.limit) query.set("limit", params.limit);
  if (params?.category) query.set("where[category.slug][equals]", params.category);

  const res = await fetch(`${CMS_URL}/api/posts?${query.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const data: PayloadListResponse<PayloadPost> = await res.json();
  return { blogs: data.docs.map(mapPost), pagination: { total: data.totalDocs, page: data.page, limit: data.limit, pages: data.totalPages } };
}

export async function getBlogsGrouped(): Promise<GroupedBlogs[]> {
  const res = await fetch(`${CMS_URL}/api/posts?depth=2&sort=-publishedAt&limit=1000`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch grouped blogs");
  const data: PayloadListResponse<PayloadPost> = await res.json();

  const groups = new Map<string, GroupedBlogs>();
  for (const doc of data.docs) {
    if (!doc.category) continue;
    const key = doc.category.id;
    if (!groups.has(key)) {
      groups.set(key, {
        category: { _id: doc.category.id, name: doc.category.name, slug: doc.category.slug },
        blogs: [],
      });
    }
    groups.get(key)!.blogs.push(mapPost(doc));
  }
  return Array.from(groups.values());
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const query = new URLSearchParams({ depth: "2", limit: "1", "where[slug][equals]": slug });
  const res = await fetch(`${CMS_URL}/api/posts?${query.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Blog not found");
  const data: PayloadListResponse<PayloadPost> = await res.json();
  if (!data.docs[0]) throw new Error("Blog not found");
  return mapPost(data.docs[0]);
}

// Only called when getBlogBySlug already failed — cashlo-cms records an
// old->new slug mapping whenever a published post's slug changes (see
// cashlo-cms's Posts collection afterChange hook). Checking here, instead
// of on every request via middleware, keeps the common case (slug that
// was never renamed) at zero extra cost.
export async function getRedirectTarget(slug: string): Promise<string | null> {
  const query = new URLSearchParams({ limit: "1", depth: "0", "where[from][equals]": `/blog/${slug}` });
  const res = await fetch(`${CMS_URL}/api/redirects?${query.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data: PayloadListResponse<{ to?: { url?: string } }> = await res.json();
  return data.docs[0]?.to?.url ?? null;
}

export async function getCategories(): Promise<BlogCategory[]> {
  const res = await fetch(`${CMS_URL}/api/categories?limit=100&sort=name`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data: PayloadListResponse<PayloadCategory> = await res.json();
  return data.docs.map((c) => ({ _id: c.id, name: c.name, slug: c.slug }));
}
