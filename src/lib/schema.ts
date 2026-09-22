// Shared schema.org JSON-LD builders. Keeping these in one place instead of
// inlining literals on every page means the org's name/logo/sameAs — and the
// exact shape schema.org expects — only needs to be right once.

export const SITE_URL = "https://www.cashlo.app";
export const SITE_NAME = "Cashlo";
// public/cashlo-logo.png is a real, existing asset (unlike /og-image.png,
// which the blog's Article schema already references but which doesn't
// exist in public/ - a pre-existing gap, not introduced here).
export const SITE_LOGO = `${SITE_URL}/cashlo-logo.png`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    sameAs: [
      "https://www.facebook.com/share/1SopJkAMwQ/?mibextid=wwXIfr",
      "https://www.instagram.com/cashlo.app/",
      "https://www.linkedin.com/company/cashlo/about/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@cashlo.app",
      telephone: "+91-9220448607",
      contactType: "customer support",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: "IN",
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// Renders one or more JSON-LD objects as <script> tags. Pass the return
// value directly into JSX (server components only - relies on
// dangerouslySetInnerHTML with build-time/fetched data, never raw user input).
export function jsonLdScript(schema: object) {
  return { __html: JSON.stringify(schema) };
}
