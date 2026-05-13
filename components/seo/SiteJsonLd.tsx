import {
  ORG_DESCRIPTION,
  ORG_FOUNDING_DATE,
  ORG_FOUNDING_LOCATION,
  ORG_ID,
  ORG_LOGO,
  ORG_NAME,
  SITE_ID,
  SITE_URL,
} from "@/lib/seo/identity";

// Global schema.org JSON-LD for Organization and WebSite entities.
// Mount this once in the root layout. Triggers:
//   - Knowledge panel eligibility (Organization)
//   - Sitelinks search box in SERP (WebSite.potentialAction)
//   - Canonical entity graph that every other schema on the site references.
export function SiteJsonLd() {
  const organization = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    alternateName: "OpenAir PEI",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: ORG_LOGO,
      width: 512,
      height: 512,
    },
    description: ORG_DESCRIPTION,
    foundingDate: ORG_FOUNDING_DATE,
    foundingLocation: {
      "@type": "Place",
      name: ORG_FOUNDING_LOCATION,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Prince Edward Island",
    },
    knowsAbout: [
      "Prince Edward Island weather",
      "Atlantic Canadian weather",
      "Outdoor recreation conditions",
      "Air quality monitoring",
      "Confederation Bridge wind",
      "Marine and coastal conditions",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
      availableLanguage: ["English", "French"],
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: ORG_NAME,
    description: ORG_DESCRIPTION,
    publisher: { "@id": ORG_ID },
    inLanguage: ["en-CA"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/explore?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
