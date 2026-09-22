interface Author {
  name: string;
  jobTitle?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  avatarUrl?: string | null;
}

export default function BlogAuthorCard({ author }: { author: Author }) {
  if (!author.jobTitle && !author.bio && !author.linkedinUrl) return null;

  return (
    <section className="mt-14 border-t border-border pt-8">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink/40">Written by</span>

      <div className="mt-4 flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-surface">
          {author.avatarUrl ? (
            <img src={author.avatarUrl} alt={author.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-ink/30">
              {author.name.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-bold text-ink">{author.name}</h3>
          {author.jobTitle && <p className="mt-0.5 text-sm text-ink/55">{author.jobTitle}</p>}
          {author.bio && <p className="mt-2.5 text-sm leading-relaxed text-ink/65">{author.bio}</p>}
          {author.linkedinUrl && (
            <a
              href={author.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
