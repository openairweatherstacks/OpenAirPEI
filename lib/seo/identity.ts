// Canonical identifiers used across all schema.org JSON-LD on the site.
// The @id values are stable URIs Google uses to build a connected entity
// graph from your markup. Changing them after launch breaks the graph,
// so they're frozen here.

export const SITE_URL = "https://openairatlantic.com";

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

export const ORG_NAME = "OpenAir Atlantic";
export const ORG_DESCRIPTION =
  "Real-time outdoor conditions for Prince Edward Island. Live weather, air quality, tides, and UV — translated into plain-English verdicts for 16 PEI locations.";
export const ORG_LOGO = `${SITE_URL}/openair-icon.png`;
export const ORG_FOUNDING_DATE = "2026-01-01";
export const ORG_FOUNDING_LOCATION = "Charlottetown, Prince Edward Island, Canada";

export function locationId(slug: string): string {
  return `${SITE_URL}/location/${slug}#place`;
}

export function articleId(slug: string): string {
  return `${SITE_URL}/${slug}#article`;
}
