export interface TocItem {
  id: string;
  text: string;
  level: number;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const HEADING_RE = /<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/gi;

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

const decodeEntities = (text: string) =>
  text.replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (m) => HTML_ENTITIES[m] ?? m);

// Injects a stable `id` onto every h1-h4 in the (already-sanitized) content
// HTML and returns the matching flat outline — done in one pass so the ids
// used for anchor links and the ids listed in the TOC can never drift apart.
export function withHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const transformed = html.replace(HEADING_RE, (match, levelStr, attrs, inner) => {
    const text = decodeEntities(inner.replace(/<[^>]+>/g, "").trim());
    if (!text) return match;

    let id = slugify(text) || "section";
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    toc.push({ id, text, level: Number(levelStr) });

    const hasId = /\sid=["']/.test(attrs);
    const newAttrs = hasId ? attrs : `${attrs} id="${id}"`;
    return `<h${levelStr}${newAttrs}>${inner}</h${levelStr}>`;
  });

  return { html: transformed, toc };
}
