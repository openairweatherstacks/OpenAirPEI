import { ORG_ID, ORG_LOGO, ORG_NAME, SITE_URL, articleId } from "@/lib/seo/identity";

interface Props {
  slug: string;            // e.g. "best-time-to-visit-pei"
  headline: string;
  description: string;
  datePublished: string;   // ISO date
  dateModified?: string;   // ISO date — defaults to today
  image?: string;          // absolute URL
  keywords?: string[];
  articleSection?: string; // e.g. "Travel guides"
}

// Article rich result schema. Triggers article carousels in SERP and
// strengthens E-E-A-T signals for content pages.
export function ArticleJsonLd({
  slug,
  headline,
  description,
  datePublished,
  dateModified,
  image,
  keywords = [],
  articleSection,
}: Props) {
  const url = `${SITE_URL}/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleId(slug),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? new Date().toISOString().split("T")[0],
    author: {
      "@type": "Organization",
      name: ORG_NAME,
      "@id": ORG_ID,
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      "@id": ORG_ID,
      logo: {
        "@type": "ImageObject",
        url: ORG_LOGO,
        width: 512,
        height: 512,
      },
    },
    ...(image ? { image: image.startsWith("http") ? image : `${SITE_URL}${image}` } : {}),
    ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
    ...(articleSection ? { articleSection } : {}),
    inLanguage: "en-CA",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
