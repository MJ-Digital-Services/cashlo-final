import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import BlogCategorySidebar from "@/components/blog/BlogCategorySidebar";
import { getBlogs, getCategoriesWithCounts } from "@/lib/blogApi";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategoriesWithCounts().catch(() => []);
  const category = categories.find((c) => c.slug === slug);
  const title = category ? `${category.name} | Cashlo Blog` : "Blog | Cashlo";
  const description = `Blog posts about ${category?.name ?? slug} from the Cashlo team.`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.cashlo.app/blog/category/${slug}` },
    openGraph: { title, description, url: `https://www.cashlo.app/blog/category/${slug}`, siteName: "Cashlo", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [{ blogs }, categories] = await Promise.all([
    getBlogs({ category: slug }).catch(() => ({ blogs: [] })),
    getCategoriesWithCounts().catch(() => []),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <>
      <section className="bg-bg pb-10 pt-40 sm:pt-44">
        <Container>
          <div className="relative">
            <div
              className="absolute -inset-x-4 -inset-y-6 -z-10 rounded-[32px] bg-brand/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-brand to-brand-dark px-8 py-10 sm:px-12 sm:py-12">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-white/10" />
                <div className="absolute -bottom-24 right-32 h-72 w-72 rounded-full bg-white/5" />
              </div>
              <div className="relative">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                  Insights &amp; Updates
                </p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <span className="text-white/70">Cashlo Blog —</span> {category.name}
                </h1>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-bg pb-20 sm:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              {blogs.length === 0 ? (
                <p className="text-ink/50">No blog posts found in this category yet.</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>
              )}
            </div>

            <BlogCategorySidebar categories={categories} activeSlug={slug} />
          </div>
        </Container>
      </section>
    </>
  );
}
