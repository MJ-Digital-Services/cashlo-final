const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

export const decodeEntities = (text: string) =>
  text.replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (m) => HTML_ENTITIES[m] ?? m);

// Plain-text rendering of an HTML fragment — strips tags and decodes
// entities. Used anywhere content needs to leave the DOM entirely (JSON-LD
// schema text, <meta> descriptions), where markup would render literally.
export const htmlToPlainText = (html: string) =>
  decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
