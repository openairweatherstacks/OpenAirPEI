import { SITE_URL } from "@/lib/seo/identity";

interface Crumb {
  name: string;
  url: string;
}

interface Props {
  items: Crumb[];
}

// BreadcrumbList rich results trigger the path display under your SERP
// listing (Home › Explore › Cavendish Beach). High CTR impact, ~zero cost.
export function BreadcrumbJsonLd({ items }: Props) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
