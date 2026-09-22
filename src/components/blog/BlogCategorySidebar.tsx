import Link from "next/link";
import type { CategoryWithCount } from "@/lib/blogApi";

export default function BlogCategorySidebar({
  categories,
  activeSlug,
}: {
  categories: CategoryWithCount[];
  activeSlug?: string;
}) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-sm font-bold text-ink">Categories</h3>
      <ul className="mt-4 space-y-1">
        <li>
          <Link
            href="/blog"
            className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
              !activeSlug
                ? "bg-brand/10 text-brand"
                : "text-ink/60 hover:bg-brand/5 hover:text-brand"
            }`}
          >
            All
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat._id}>
            <Link
              href={`/blog/category/${cat.slug}`}
              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                activeSlug === cat.slug
                  ? "bg-brand/10 text-brand"
                  : "text-ink/60 hover:bg-brand/5 hover:text-brand"
              }`}
            >
              <span>{cat.name}</span>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                {cat.postCount}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
