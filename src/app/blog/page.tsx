import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getBlogsGrouped } from "@/lib/blogApi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Cashlo",
  description: "Insights on UPI, digital payments, merchant banking, and fintech from the Cashlo team.",
  alternates: { canonical: "https://www.cashlo.in/blog" },
  openGraph: {
    title: "Blog | Cashlo",
    description: "Insights on UPI, digital payments, merchant banking, and fintech from the Cashlo team.",
    url: "https://www.cashlo.in/blog",
    siteName: "Cashlo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Cashlo",
    description: "Insights on UPI, digital payments, merchant banking, and fintech from the Cashlo team.",
  },
};

export default async function BlogPage() {
  const grouped = await getBlogsGrouped().catch(() => []);

  return (
    <>
      <section className="bg-bg pb-10 pt-40 sm:pt-44">
        <Container>
          <div className="relative">
            {/* Soft ambient glow behind the card */}
            <div
              className="absolute -inset-x-4 -inset-y-6 -z-10 rounded-[32px] bg-brand/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-brand to-brand-dark px-8 py-10 sm:px-12 sm:py-12">
              {/* Decorative overlapping circles, bottom-right */}
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
                  <span className="text-white/70">Cashlo</span> Blog
                </h1>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-bg pb-20 sm:pb-24">
        <Container>
          {grouped.length === 0 ? (
            <p className="text-ink/50">No blogs published yet</p>
          ) : (
            <div className="space-y-14">
              {grouped.map((group) => (
                <div key={group.category._id}>
                  <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                    {group.category.name}
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.blogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}