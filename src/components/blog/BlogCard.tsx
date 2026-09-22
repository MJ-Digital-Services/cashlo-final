import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { Blog } from "@/lib/blogApi";

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-surface">
        {blog.coverImage ? (
          <picture>
            {blog.coverImageCardAvif && <source srcSet={blog.coverImageCardAvif} type="image/avif" />}
            <img
              src={blog.coverImageCard ?? blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </picture>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink/30">
            No cover
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-ink/45">
          {blog.category?.name && (
            <span className="rounded-full bg-brand/10 px-2.5 py-1 font-medium text-brand">
              {blog.category.name}
            </span>
          )}
          {blog.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {blog.readTime}
            </span>
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 text-base font-semibold text-ink">{blog.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/55">{blog.excerpt}</p>
        {blog.publishedAt && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-ink/40">
            <Calendar className="h-3 w-3" />
            {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>
    </Link>
  );
}