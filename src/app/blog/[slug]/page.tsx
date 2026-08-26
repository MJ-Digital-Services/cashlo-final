import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import BlogPostContent from "@/components/blog/BlogPostContent";
import BlogFAQs from "@/components/blog/BlogFAQs";
import { getBlogBySlug, getBlogs } from "@/lib/blogApi";
import Link from "next/link";
import { User, Calendar, Clock, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  try {
    const data = await getBlogs({ limit: "1000" });
    const blogs = data?.blogs ?? data ?? [];
    return blogs.map((blog: { slug: string }) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);
    const title = blog.metaTitle || `${blog.title} | Cashlo`;
    const description = blog.metaDescription || blog.excerpt;
    const canonical = `https://www.cashlo.app/blog/${slug}`;
    const ogImage = blog.coverImage || "https://www.cashlo.app/og-image.png";

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "Cashlo",
        type: "article",
        publishedTime: blog.publishedAt ?? undefined,
        images: [{ url: ogImage, width: 1200, height: 630, alt: blog.title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let blog: any;

  try {
    blog = await getBlogBySlug(slug);
  } catch {
    notFound();
  }

  const categoryName = blog.category?.name;
  const categorySlug = blog.category?.slug;

  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  let relatedPosts = (blog.relatedPosts || []).slice(0, 3);
  if (relatedPosts.length === 0) {
    try {
      const recent = await getBlogs({ limit: "4", category: categorySlug });
      relatedPosts = recent.blogs
        .filter((p: any) => p.slug !== slug)
        .slice(0, 3)
        .map((p: any) => ({ slug: p.slug, title: p.title, coverImage: p.coverImage }));
    } catch {}
  }

  const faqs = blog.faqs ?? [];
  const faqsTitle = blog.faqsTitle || "Frequently Asked Questions";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ?? "https://www.cashlo.app/og-image.png",
    author: { "@type": "Person", name: blog.createdBy?.name ?? "Cashlo Team" },
    publisher: {
      "@type": "Organization",
      name: "Cashlo",
      logo: { "@type": "ImageObject", url: "https://www.cashlo.app/og-image.png" },
    },
    datePublished: blog.publishedAt ?? undefined,
    dateModified: blog.updatedAt ?? blog.publishedAt ?? undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.cashlo.app/blog/${blog.slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.cashlo.app" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.cashlo.app/blog" },
      { "@type": "ListItem", position: 3, name: blog.title, item: `https://www.cashlo.app/blog/${blog.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="bg-bg pb-24 pt-28 sm:pt-32">
        <Container className="max-w-[1440px]">
          <nav className="flex items-center gap-1.5 text-xs text-ink/45">
            <Link href="/blog" className="hover:text-brand">Blog</Link>
            {categoryName && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link href={`/blog?category=${categorySlug}`} className="hover:text-brand">
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink/70">
              {blog.title.length > 50 ? blog.title.slice(0, 50) + "…" : blog.title}
            </span>
          </nav>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {blog.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/50">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {blog.createdBy?.name ?? "Cashlo Team"}
            </span>
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {publishedDate}
              </span>
            )}
            {blog.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {blog.readTime}
              </span>
            )}
            {categoryName && (
              <Link
                href={`/blog?category=${categorySlug}`}
                className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand"
              >
                {categoryName}
              </Link>
            )}
            {blog.tags?.map((tag: string) => (
              <span key={tag} className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink/60">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div className="min-w-0">
              <BlogPostContent content={blog.content ?? ""} />

              {faqs.length > 0 && <BlogFAQs faqs={faqs} title={faqsTitle} />}

              <Link
                href="/blog"
                className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-brand"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Blog
              </Link>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h2 className="text-sm font-semibold text-ink">Related Posts</h2>
                  <div className="mt-3 space-y-3">
                    {relatedPosts.map((post: any) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-3 rounded-xl transition-colors hover:bg-surface"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-ink/30">
                              CASHLO
                            </div>
                          )}
                        </div>
                        <span className="line-clamp-2 text-sm text-ink/75">{post.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-brand/20 bg-brand/[0.06] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand">Cashlo</span>
                <h3 className="mt-1.5 text-sm font-semibold text-ink">Run a shop?</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/55">
                  Accept UPI payments and offer banking services to your customers with Cashlo.
                </p>
                <Link
                  href="/become-merchant"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand/80"
                >
                  Become a merchant
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}